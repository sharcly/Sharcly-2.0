"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const prisma_1 = require("../../common/lib/prisma");
class BlogService {
    static async getBlogs() {
        return await prisma_1.prisma.blog.findMany({
            include: { author: { select: { name: true } } },
            orderBy: { createdAt: "desc" }
        });
    }
    static async getBlogBySlug(slug) {
        return await prisma_1.prisma.blog.findUnique({
            where: { slug },
            include: { author: { select: { name: true } } }
        });
    }
    static async createBlog(userId, blogData) {
        const { title, slug, content, metaTitle, metaDesc } = blogData;
        return await prisma_1.prisma.blog.create({
            data: {
                title,
                slug,
                content,
                metaTitle,
                metaDesc,
                authorId: userId
            }
        });
    }
    static async updateBlog(id, updateData) {
        return await prisma_1.prisma.blog.update({
            where: { id },
            data: updateData
        });
    }
    static async deleteBlog(id) {
        return await prisma_1.prisma.blog.delete({ where: { id } });
    }
}
exports.BlogService = BlogService;
