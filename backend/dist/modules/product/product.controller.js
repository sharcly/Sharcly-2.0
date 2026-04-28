"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createType = exports.getTypes = exports.createTag = exports.getTags = exports.deleteCollection = exports.updateCollection = exports.createCollection = exports.getCollectionBySlug = exports.getCollections = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProducts = void 0;
const product_service_1 = require("./product.service");
const getProducts = async (req, res) => {
    try {
        const result = await product_service_1.ProductService.getProducts(req.query);
        res.status(200).json({
            success: true,
            products: result.products,
            pagination: {
                total: result.total,
                page: result.pageNum,
                pages: Math.ceil(result.total / result.limitNum)
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error });
    }
};
exports.getProducts = getProducts;
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await product_service_1.ProductService.getProductBySlug(slug);
        if (!result)
            return res.status(404).json({ message: "Product not found" });
        res.status(200).json({
            success: true,
            product: result.product,
            relatedProducts: result.relatedProducts
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch product" });
    }
};
exports.getProductBySlug = getProductBySlug;
const createProduct = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }
        const product = await product_service_1.ProductService.createProduct(req.body, files);
        res.status(201).json({ success: true, product });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create product", error });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await product_service_1.ProductService.updateProduct(id, req.body);
        res.status(200).json({ success: true, product });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update product" });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await product_service_1.ProductService.deleteProduct(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete product" });
    }
};
exports.deleteProduct = deleteProduct;
const getCategories = async (req, res) => {
    try {
        const categories = await product_service_1.ProductService.getCategories();
        res.status(200).json({ success: true, categories });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const category = await product_service_1.ProductService.createCategory(req.body);
        res.status(201).json({ success: true, category });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create category" });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await product_service_1.ProductService.updateCategory(id, req.body);
        res.status(200).json({ success: true, category });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update category" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await product_service_1.ProductService.deleteCategory(id);
        res.status(200).json({ success: true, message: "Category deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete category" });
    }
};
exports.deleteCategory = deleteCategory;
const getCollections = async (req, res) => {
    try {
        const collections = await product_service_1.ProductService.getCollections();
        res.status(200).json({ success: true, collections });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch collections" });
    }
};
exports.getCollections = getCollections;
const getCollectionBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const collection = await product_service_1.ProductService.getCollectionBySlug(slug);
        if (!collection)
            return res.status(404).json({ message: "Collection not found" });
        res.status(200).json({ success: true, collection });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch collection" });
    }
};
exports.getCollectionBySlug = getCollectionBySlug;
const createCollection = async (req, res) => {
    try {
        const collection = await product_service_1.ProductService.createCollection(req.body);
        res.status(201).json({ success: true, collection });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create collection" });
    }
};
exports.createCollection = createCollection;
const updateCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const collection = await product_service_1.ProductService.updateCollection(id, req.body);
        res.status(200).json({ success: true, collection });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update collection" });
    }
};
exports.updateCollection = updateCollection;
const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params;
        await product_service_1.ProductService.deleteCollection(id);
        res.status(200).json({ success: true, message: "Collection deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete collection" });
    }
};
exports.deleteCollection = deleteCollection;
const getTags = async (req, res) => {
    try {
        const tags = await product_service_1.ProductService.getTags();
        res.status(200).json({ success: true, tags });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch tags" });
    }
};
exports.getTags = getTags;
const createTag = async (req, res) => {
    try {
        const tag = await product_service_1.ProductService.createTag(req.body);
        res.status(201).json({ success: true, tag });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create tag" });
    }
};
exports.createTag = createTag;
const getTypes = async (req, res) => {
    try {
        const types = await product_service_1.ProductService.getTypes();
        res.status(200).json({ success: true, types });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch types" });
    }
};
exports.getTypes = getTypes;
const createType = async (req, res) => {
    try {
        const type = await product_service_1.ProductService.createType(req.body);
        res.status(201).json({ success: true, type });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create type" });
    }
};
exports.createType = createType;
