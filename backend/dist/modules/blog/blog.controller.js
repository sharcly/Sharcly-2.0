"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogBySlug = exports.getBlogs = void 0;
const blog_service_1 = require("./blog.service");
const getBlogs = async (req, res) => {
    try {
        const blogs = await blog_service_1.BlogService.getBlogs();
        res.status(200).json({ success: true, blogs });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch blogs" });
    }
};
exports.getBlogs = getBlogs;
const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await blog_service_1.BlogService.getBlogBySlug(slug);
        if (!blog)
            return res.status(404).json({ message: "Blog not found" });
        res.status(200).json({ success: true, blog });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch blog" });
    }
};
exports.getBlogBySlug = getBlogBySlug;
const createBlog = async (req, res) => {
    try {
        const blog = await blog_service_1.BlogService.createBlog(req.user.id, req.body);
        res.status(201).json({ success: true, blog });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create blog", error });
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blog_service_1.BlogService.updateBlog(id, req.body);
        res.status(200).json({ success: true, blog });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update blog" });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        await blog_service_1.BlogService.deleteBlog(id);
        res.status(200).json({ success: true, message: "Blog deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete blog" });
    }
};
exports.deleteBlog = deleteBlog;
