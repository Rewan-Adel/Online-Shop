import { Request, Response } from "express";
import { successResponse, failedResponse, handleError } from "../middlewares/responseHandler";
import OrderRepository from "../repositories/OrderRepository";

class OrderController{
    private orderRepository: OrderRepository;
    constructor(orderRepository: OrderRepository){
        this.orderRepository = orderRepository;
    };

    async createOrder(req: Request, res: Response): Promise<void>{
        try {
            const { shippingAddress, phone, paymentMethod } = req.body;
            if(!shippingAddress) return failedResponse(res, 400, "Missing required shipping address");
            else if(!phone) return failedResponse(res, 400, "Missing required phone number");
            
            const response = await this.orderRepository.createOrder(req.user.userID, shippingAddress, phone, paymentMethod);
            if(!response) return failedResponse(res, 400, "Error creating order");
            return successResponse(res, 201, "Order created", {order: response});
        } catch (error) {
            handleError(error, res);
        }
    };
    
    async updateOrder(req: Request, res: Response): Promise<void>{
        try {
            const { orderID } = req.params;
            const { paymentStatus, orderStatus } = req.body;
            if(!orderID) return failedResponse(res, 400, "Missing required order ID");
            
            const response = await this.orderRepository.updateOrder(orderID, paymentStatus, orderStatus);
            if(!response) return failedResponse(res, 404, "Order not found");
            return successResponse(res, 200, "Order updated", {order: response});
        } catch (error) {
            handleError(error, res);
        }
    };

    async getOrders(req: Request, res: Response): Promise<void>{
        try {
            const { order_status } = req.query;
            const response = await this.orderRepository.getOrders(req.user.userID, order_status as string);
            if(!response) return successResponse(res, 200, "No orders yet", {orders: []});
            return successResponse(res, 200, "Orders retrieved", {orders: response});
        } catch (error) {
            handleError(error, res);
        }
    };

    async getOrder(req: Request, res: Response): Promise<void>{
        try {
            const { orderID } = req.params;
            if(!orderID) return failedResponse(res, 400, "Missing required order ID");
            
            const response = await this.orderRepository.getOrder(orderID);
            if(!response) return failedResponse(res, 404, "Order not found");
            return successResponse(res, 200, "Order retrieved", {order: response});
        } catch (error) {
            handleError(error, res);
        }
    };

    async getAllOrdersForAdmin(req: Request, res: Response): Promise<void>{
        try {
            const { order_status } = req.query;
            const response = await this.orderRepository.allUsersOrders(order_status as string);
            if(!response) return successResponse(res, 200, "No orders yet", {orders: []});
            return successResponse(res, 200, "Orders retrieved", {orders: response});
        } catch (error) {
            handleError(error, res);
        }
    }
};

export default OrderController;

