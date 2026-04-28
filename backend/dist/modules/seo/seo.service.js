"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoService = void 0;
const prisma_1 = require("../../common/lib/prisma");
class SeoService {
    static async getSeoBySlug(slug) {
        return await prisma_1.prisma.seoMeta.findUnique({
            where: { pageSlug: slug }
        });
    }
    static async getAllSeo() {
        return await prisma_1.prisma.seoMeta.findMany({
            orderBy: { pageSlug: "asc" }
        });
    }
    static async getSeoById(id) {
        return await prisma_1.prisma.seoMeta.findUnique({
            where: { id }
        });
    }
    static async upsertSeo(seoData) {
        const { pageSlug, title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl, robots, structuredData } = seoData;
        return await prisma_1.prisma.seoMeta.upsert({
            where: { pageSlug: pageSlug },
            update: {
                title,
                description,
                keywords,
                ogTitle,
                ogDescription,
                ogImage,
                canonicalUrl,
                robots,
                structuredData
            },
            create: {
                pageSlug,
                title,
                description,
                keywords,
                ogTitle,
                ogDescription,
                ogImage,
                canonicalUrl,
                robots: robots || "index, follow",
                structuredData
            }
        });
    }
    static async deleteSeo(id) {
        return await prisma_1.prisma.seoMeta.delete({
            where: { id }
        });
    }
    static async bulkUpsertSeo(entries) {
        return await prisma_1.prisma.$transaction(entries.map((entry) => prisma_1.prisma.seoMeta.upsert({
            where: { pageSlug: entry.pageSlug },
            update: {
                title: entry.title,
                description: entry.description,
                keywords: entry.keywords,
                ogTitle: entry.ogTitle,
                ogDescription: entry.ogDescription,
                ogImage: entry.ogImage,
                canonicalUrl: entry.canonicalUrl,
                robots: entry.robots,
                structuredData: entry.structuredData
            },
            create: {
                pageSlug: entry.pageSlug,
                title: entry.title,
                description: entry.description,
                keywords: entry.keywords,
                ogTitle: entry.ogTitle,
                ogDescription: entry.ogDescription,
                ogImage: entry.ogImage,
                canonicalUrl: entry.canonicalUrl,
                robots: entry.robots || "index, follow",
                structuredData: entry.structuredData
            }
        })));
    }
}
exports.SeoService = SeoService;
