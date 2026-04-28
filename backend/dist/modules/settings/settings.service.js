"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const prisma_1 = require("../../common/lib/prisma");
class SettingsService {
    static async getStoreSettings() {
        let settings = await prisma_1.prisma.storeSettings.findFirst();
        if (!settings) {
            settings = await prisma_1.prisma.storeSettings.create({
                data: { storeName: "Scarly 2.0", currency: "USD" }
            });
        }
        return settings;
    }
    static async updateStoreSettings(settingsData) {
        const { storeName, supportEmail, currency, logoUrl } = settingsData;
        let settings = await prisma_1.prisma.storeSettings.findFirst();
        if (settings) {
            return await prisma_1.prisma.storeSettings.update({
                where: { id: settings.id },
                data: { storeName, supportEmail, currency, logoUrl }
            });
        }
        else {
            return await prisma_1.prisma.storeSettings.create({
                data: { storeName, supportEmail, currency, logoUrl }
            });
        }
    }
    static async getRegions() {
        return await prisma_1.prisma.region.findMany();
    }
    static async createRegion(regionData) {
        const { name, currencyCode, taxRate, countries } = regionData;
        return await prisma_1.prisma.region.create({
            data: { name, currencyCode, taxRate, countries }
        });
    }
    static async getReturnReasons() {
        return await prisma_1.prisma.returnReason.findMany();
    }
    static async getRefundReasons() {
        return await prisma_1.prisma.refundReason.findMany();
    }
}
exports.SettingsService = SettingsService;
