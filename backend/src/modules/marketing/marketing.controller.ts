import { Request, Response } from "express";
import { marketingService } from "./marketing.service";

export class MarketingController {
  // Storefront: Get active offers
  static async getOffers(req: Request, res: Response) {
    try {
      const offers = await marketingService.getOffers();
      res.json({ success: true, offers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Storefront: Get config
  static async getConfig(req: Request, res: Response) {
    try {
      const config = await marketingService.getConfig();
      res.json({ success: true, config });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Storefront: Subscribe
  static async subscribe(req: Request, res: Response) {
    try {
      const { email, offerId, phone, firstName, lastName } = req.body;
      const result = await marketingService.subscribe(email, offerId, { phone, firstName, lastName });
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Admin: Get all offers
  static async getAllOffers(req: Request, res: Response) {
    try {
      const offers = await marketingService.getAllOffers();
      res.json({ success: true, offers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Admin: Create offer
  static async createOffer(req: Request, res: Response) {
    try {
      const offer = await marketingService.createOffer(req.body);
      res.json({ success: true, offer });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Admin: Update offer
  static async updateOffer(req: Request, res: Response) {
    try {
      const offer = await marketingService.updateOffer(req.params.id, req.body);
      res.json({ success: true, offer });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Admin: Delete offer
  static async deleteOffer(req: Request, res: Response) {
    try {
      await marketingService.deleteOffer(req.params.id);
      res.json({ success: true, message: "Offer deleted" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Admin: Update config
  static async updateConfig(req: Request, res: Response) {
    try {
      const config = await marketingService.updateConfig(req.body);
      res.json({ success: true, config });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Admin: Get subscribers
  static async getSubscribers(req: Request, res: Response) {
    try {
      const subscribers = await marketingService.getSubscribers();
      res.json({ success: true, subscribers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
