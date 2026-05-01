import { prisma } from "../../common/lib/prisma";
// Removed unused uuid import

export class MarketingService {
  /**
   * Fetch all active marketing offers
   */
  async getOffers() {
    return await prisma.marketingOffer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Fetch all marketing offers (Admin)
   */
  async getAllOffers() {
    return await prisma.marketingOffer.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Create a new marketing offer
   */
  async createOffer(data: any) {
    return await prisma.marketingOffer.create({
      data: {
        title: data.title,
        description: data.description,
        codePrefix: data.codePrefix,
        imageUrl: data.imageUrl,
        discountType: data.discountType,
        discountValue: data.discountValue,
        isActive: data.isActive ?? true,
      },
    });
  }

  /**
   * Update an existing marketing offer
   */
  async updateOffer(id: string, data: any) {
    return await prisma.marketingOffer.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a marketing offer
   */
  async deleteOffer(id: string) {
    return await prisma.marketingOffer.delete({
      where: { id },
    });
  }

  /**
   * Handle user subscription to an offer
   */
  async subscribe(email: string, offerId: string, extra: { phone?: string; firstName?: string; lastName?: string }) {
    // 1. Verify offer
    const offer = await prisma.marketingOffer.findUnique({
      where: { id: offerId },
    });

    if (!offer || !offer.isActive) {
      throw new Error("Offer not found or inactive");
    }

    // 2. Check if already subscribed to this offer
    const existing = await prisma.marketingSubscriber.findFirst({
      where: { email, offerId },
    });

    if (existing) {
      throw new Error("You have already claimed this offer!");
    }

    // 3. Generate unique promo code
    const uniqueCode = this.generatePromoCode(offer.codePrefix);

    // 4. Save subscriber
    const subscriber = await prisma.marketingSubscriber.create({
      data: {
        email,
        phone: extra.phone,
        firstName: extra.firstName,
        lastName: extra.lastName,
        offerId: offer.id,
        promoCode: uniqueCode,
      },
    });

    // Note: In a real scenario, you'd also create a real coupon/promotion in the DB here
    // For now, we'll assume the system validates these generated codes against the subscriber table
    // or we can create a Coupon record if needed.
    
    // Create a corresponding Coupon record so it can be used at checkout
    await prisma.coupon.create({
      data: {
        code: uniqueCode,
        discount: offer.discountValue,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        usageLimit: 1,
      }
    });

    return { subscriber, promoCode: uniqueCode };
  }

  /**
   * Generate a unique promo code with a random suffix
   */
  private generatePromoCode(prefix: string): string {
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix.toUpperCase()}-${suffix}`;
  }

  /**
   * Get global marketing config
   */
  async getConfig() {
    try {
      let config = await prisma.marketingConfig.findFirst();
      if (!config) {
        config = await prisma.marketingConfig.create({
          data: {
            isEnabled: true,
            displayMode: "multiple",
            showFrequency: "every_visit",
          },
        });
      }
      return config;
    } catch (error) {
      console.error("[MarketingService] Error in getConfig:", error);
      throw error;
    }
  }

  /**
   * Update global marketing config
   */
  async updateConfig(data: any) {
    const config = await this.getConfig();
    return await prisma.marketingConfig.update({
      where: { id: config.id },
      data,
    });
  }

  /**
   * Get all subscribers (Admin)
   */
  async getSubscribers() {
    return await prisma.marketingSubscriber.findMany({
      include: { offer: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const marketingService = new MarketingService();
