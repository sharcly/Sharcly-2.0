import { Router } from "express";
import { BlogController } from "./blog.controller";
import { authenticate, authorize } from "../../common/middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", BlogController.getBlogs);
router.get("/:slug", BlogController.getBlogBySlug);

// Protected Admin routes
// Using authorize('blog.manage') or similar, but the middleware has an internal admin check.
router.post("/", authenticate, authorize(), BlogController.createBlog);
router.patch("/:id", authenticate, authorize(), BlogController.updateBlog);
router.delete("/:id", authenticate, authorize(), BlogController.deleteBlog);

export default router;
