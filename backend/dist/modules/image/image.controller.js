"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductImage = void 0;
const image_service_1 = require("./image.service");
const getProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await image_service_1.ImageService.getProductImage(id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        // Set cache control for performance
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Content-Type", image.mimeType);
        return res.end(image.data);
    }
    catch (error) {
        console.error("Failed to serve image:", error);
        res.status(500).json({ message: "Failed to load image" });
    }
};
exports.getProductImage = getProductImage;
