import { Request, Response } from "express";
import { successResponse, failedResponse, handleError } from "../middlewares/responseHandler";
import OrderRepository from "../repositories/OrderRepository";
import { OrderStatus, PaymentStatus, PaymentMethod } from "../utils/Enums";
class OrderController{
    private orderService: OrderRepository;
    constructor(orderService: OrderRepository){
        this.orderService = orderService;
    };

    async createOrder(req: Request, res: Response): Promise<void>{
        try {
            const { shippingAddress, phone, paymentMethod } = req.body;
            if(!shippingAddress) return failedResponse(res, 400, "Missing required shipping address");
            else if(!phone) return failedResponse(res, 400, "Missing required phone number");
            
            if(!Object.values(PaymentMethod).includes(paymentMethod as PaymentMethod)){
                return failedResponse(res, 400, "Invalid payment method")
            };
            const response = await this.orderService.createOrder(req.user.userID, shippingAddress, phone, paymentMethod);
            if(!response) return failedResponse(res, 400, "Cart is empty");
            return successResponse(res, 201, "Order created", {order: response});
        } catch (error) {
            console.log(error);
            handleError(error, res);
        }
    };
    
    async updateOrder(req: Request, res: Response): Promise<void>{
        try {
            const { id } = req.params;
            const { paymentStatus, orderStatus } = req.query;
            if(!id || id == ':id') return failedResponse(res, 400, "Missing required order ID");
            if(!paymentStatus && !orderStatus ){
                return failedResponse(res, 400, "Please, provide the update data ")
            }
            if(paymentStatus && !Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)){
                return failedResponse(res, 400, "Invalid payment status. Must be one of: Pending, Paid or Cancelled");
            }else if(OrderStatus &&  !Object.values(OrderStatus).includes(orderStatus as OrderStatus)){
                return failedResponse(res, 400, "Invalid order status. Must be one of: Pending, Shipped, Delivered or Cancelled");
            };

            const response = await this.orderService.updateOrder(id, paymentStatus as string, orderStatus as string);
            if(!response) return failedResponse(res, 404, "Order not found");
            return successResponse(res, 200, "Order updated", {order: response});
        } catch (error) {
            handleError(error, res);
        }
    };

    async getOrders(req: Request, res: Response): Promise<void>{
        try {
            const { order_status } = req.query;
            const response = await this.orderService.getOrders(req.user.userID, order_status as string);
            if(!response) return successResponse(res, 200, "No orders yet", {orders: []});
            return successResponse(res, 200, "Orders retrieved", {orders: response});
        } catch (error) {
            handleError(error, res);
        }
    };

    async getOrder(req: Request, res: Response): Promise<void>{
        try {
            const { id } = req.params;
            if(!id || id == ':id' ) return failedResponse(res, 400, "Missing required order ID");
            
            const response = await this.orderService.getOrder(id);
            if(!response) return failedResponse(res, 404, "Order not found");
            return successResponse(res, 200, "Order retrieved", {order: response});
        } catch (error) {
            handleError(error, res);
        }
    };

    async getAllOrdersForAdmin(req: Request, res: Response): Promise<void>{
        try {
            const { order_status } = req.query;
            const response = await this.orderService.allUsersOrders(order_status as string);
            if(!response) return successResponse(res, 200, "No orders yet", {orders: []});
            return successResponse(res, 200, "Orders retrieved", {orders: response});
        } catch (error) {
            handleError(error, res);
        }
    }
};

export default OrderController;

