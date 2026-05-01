import { Router } from "express";
import { MarketingController } from "./marketing.controller";
import { authenticate, authorize } from "../../common/middlewares/auth.middleware";

const router = Router();

// Public / Storefront routes
router.get("/offers", MarketingController.getOffers);
router.get("/config", MarketingController.getConfig);
router.post("/subscribe", MarketingController.subscribe);

// Admin routes
router.get("/admin/offers", authenticate, MarketingController.getAllOffers);
router.post("/admin/offers", authenticate, MarketingController.createOffer);
router.patch("/admin/offers/:id", authenticate, MarketingController.updateOffer);
router.delete("/admin/offers/:id", authenticate, MarketingController.deleteOffer);
router.patch("/admin/config", authenticate, MarketingController.updateConfig);
router.get("/admin/subscribers", authenticate, MarketingController.getSubscribers);

export default router;
