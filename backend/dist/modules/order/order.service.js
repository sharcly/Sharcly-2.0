"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const prisma_1 = require("../../common/lib/prisma");
const client_1 = require("@prisma/client");
const email_service_1 = require("../auth/email.service");
class OrderService {
    static async createOrder(userId, email, orderData) {
        const { items, address, couponCode } = orderData;
        // Calculate total and validate stock
        let totalAmount = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await prisma_1.prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
            const price = Number(product.price);
            totalAmount += price * item.quantity;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: price
            });
        }
        // Handle coupon
        let couponId = undefined;
        if (couponCode) {
            const coupon = await prisma_1.prisma.coupon.findUnique({ where: { code: couponCode } });
            if (coupon && coupon.expiryDate > new Date() && coupon.usedCount < coupon.usageLimit) {
                const discountAmount = Number(coupon.discount);
                totalAmount = Math.max(0, totalAmount - discountAmount);
                couponId = coupon.id;
                // Update coupon usage
                await prisma_1.prisma.coupon.update({
                    where: { id: coupon.id },
                    data: { usedCount: { increment: 1 } }
                });
            }
        }
        // Create order and update stock in a transaction
        const order = await prisma_1.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    address,
                    status: client_1.OrderStatus.PENDING,
                    couponId,
                    items: {
                        create: orderItems
                    }
                },
                include: { items: true }
            });
            // Update stock
            for (const item of orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
            return newOrder;
        });
        // Send confirmation email
        try {
            await (0, email_service_1.sendOrderConfirmation)(email, order);
        }
        catch (error) {
            console.error("Order confirmation email failed:", error);
        }
        return order;
    }
    static async getMyOrders(userId) {
        return await prisma_1.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" }
        });
    }
    static async getAllOrders() {
        return await prisma_1.prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } }
            },
            orderBy: { createdAt: "desc" }
        });
    }
    static async getOrderById(id) {
        return await prisma_1.prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } },
                coupon: true
            }
        });
    }
    static async updateOrderStatus(id, updateData) {
        const { status, trackingNumber, carrier, estimatedDelivery, notes } = updateData;
        return await prisma_1.prisma.order.update({
            where: { id },
            data: {
                status: status,
                trackingNumber: trackingNumber || undefined,
                carrier: carrier || undefined,
                estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
                notes: notes || undefined
            }
        });
    }
}
exports.OrderService = OrderService;
