import { prisma } from "../../common/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { sendOrderConfirmation } from "../auth/email.service";
import { KlaviyoService } from "../marketing/klaviyo.service";
import { SeoService } from "../seo/seo.service";

export class OrderService {
  static async createOrder(userId: string | undefined, email: string, orderData: any) {
    const { items, address, couponCode } = orderData;

    // Secure user identification
    let finalUserId = userId;
    if (!finalUserId) {
      let guestUser = await prisma.user.findUnique({ where: { email } });
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
             email,
             password: `guest_${Math.random().toString(36).slice(-8)}`,
             name: "Guest Shopper"
          }
        });
      }
      finalUserId = guestUser.id;
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    const orderItems: { productId: string; variantId?: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      let product = await prisma.product.findUnique({ where: { id: item.productId } });
      let variant = null;

      if (!product) {
        variant = await prisma.productVariant.findUnique({ 
          where: { id: item.productId }, 
          include: { product: true } 
        });
        if (variant) {
           product = variant.product;
        } else {
           throw new Error(`Product mapping failed. ID ${item.productId} not found within products or variants.`);
        }
      }

      const targetStock = variant ? variant.inventoryQuantity : product.stock;
      if (targetStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const price = variant ? Number(variant.price) : Number(product.price);
      totalAmount += price * item.quantity;
      orderItems.push({
        productId: product.id,
        variantId: variant ? variant.id : undefined,
        quantity: item.quantity,
        price: price
      });
    }

    // Handle coupon
    let couponId = undefined;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode as string } });
      if (coupon && coupon.expiryDate > new Date() && coupon.usedCount < coupon.usageLimit) {
        const discountAmount = Number(coupon.discount);
        totalAmount = Math.max(0, totalAmount - discountAmount);
        couponId = coupon.id;
        
        // Update coupon usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } }
        });
      }
    }

    // Create order and update stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: finalUserId as string,
          totalAmount,
          address,
          status: OrderStatus.PENDING,
          couponId,
          items: {
            create: orderItems.map(oi => ({
               productId: oi.productId,
               quantity: oi.quantity,
               price: oi.price
            }))
          }
        },
        include: { items: true }
      });

      // Update stock securely
      for (const item of orderItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { inventoryQuantity: { decrement: item.quantity } }
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      return newOrder;
    });

    // Klaviyo Tracking
    try {
      const seoSettings = await SeoService.getGlobalSettings();
      if (seoSettings?.klaviyoPrivateKey) {
        KlaviyoService.init(seoSettings.klaviyoPrivateKey);
        await KlaviyoService.trackEvent(email, "Placed Order", {
          "$value": Number(order.totalAmount),
          "OrderID": order.id,
          "ItemNames": order.items.map((i: any) => i.productId), // ideally fetch names
          "Address": order.address
        });
      }
    } catch (kErr) {
      console.warn("Klaviyo Order Tracking Failed:", kErr);
    }

    return order;
  }

  static async getMyOrders(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
  }

  static async getAllOrders() {
    return await prisma.order.findMany({
      include: { 
        user: { select: { name: true, email: true } }, 
        items: { include: { product: true } } 
      },
      orderBy: { createdAt: "desc" }
    });
  }

  static async getOrderById(id: string) {
    return await prisma.order.findUnique({
      where: { id },
      include: { 
        user: { select: { name: true, email: true } }, 
        items: { include: { product: true } },
        coupon: true
      }
    });
  }

  static async updateOrderStatus(id: string, updateData: any) {
    const { status, trackingNumber, carrier, estimatedDelivery, notes } = updateData;

    return await prisma.order.update({
      where: { id },
      data: { 
        status: status as OrderStatus,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
        notes: notes || undefined
      }
    });
  }
}
