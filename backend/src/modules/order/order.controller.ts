import { Request, Response } from "express";
import { OrderService } from "./order.service";

export const createOrder = async (req: any, res: Response) => {
  try {
    const orderData = req.body;
    const userId = req.user?.id || undefined;
    const email = req.body.email || req.user?.email || "guest@sharcly.com";

    const order = await OrderService.createOrder(userId, email, orderData);

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Order placement failed" });
  }
};

export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await OrderService.getMyOrders(req.user.id);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id as string);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderService.updateOrderStatus(id as string, req.body);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
