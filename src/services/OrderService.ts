import OrderRepository from "../repositories/OrderRepository";
import OrderType       from "../types/OrderType";
import Order           from "../models/Order.model";
import CartServices    from "./CartService";
import Cart            from "../models/Cart.model";
import Logger          from "../utils/Logger";
import {OrderStatus, PaymentStatus, PaymentMethod} from "../utils/Enums";
import { Types } from "mongoose";
class OrderService implements OrderRepository {
    private cartService: CartServices;

    constructor(cartService: CartServices) {
        this.cartService = cartService;
    }

    private async generateUniqueOrderNumber(): Promise<string> {
        while (true) {
            const orderNumber = `ORD-${Math.floor(Math.random() * 1000)}`;
            const exists = await Order.findOne({ order_number: orderNumber });
            if (!exists) return orderNumber;
        }
    };

    async createOrder(userId: string, shippingAddress:{
        address: string,
        city: string,
        country: string
    },phone:string, paymentMethod?: string): Promise<OrderType | null>{
        try {
            // Get cart of user
            const cart = await Cart.findOne({ userId: userId });
            if(!cart) return null;
            if(cart.products.length === 0) return null;

            // Create order
            const order = new Order({
                user: userId,
                phone,
                order_number: await this.generateUniqueOrderNumber(),
                order_items: cart.products.map(({ product, quantity }) => ({ product, quantity })),
                items_price: cart.total_price,
                total_quantity: cart.total_quantity,
                shipping_address: shippingAddress,
                payment_method: paymentMethod || PaymentMethod.CASH,
                payment_status: PaymentStatus.PENDING,
            });

            // Calculate shipping price
            order.total_price = order.items_price + order.shipping_price + order.tax_price;
            await order.save();

            // Remove all products from cart after creating order
            await this.cartService.removeAllProductsFromCart(userId);                                            
            return await Order.findById(order._id) as OrderType;
        }catch(error){
            Logger.error(`Error creating order for user ${userId}: ${error}`);
            return null;
        }
    };

    async updateOrder(orderID: string, paymentStatus?: string, orderStatus?:string): Promise<OrderType | null>{
        try{
            if(!Types.ObjectId.isValid(orderID)) return null;
            const order = await Order.findById(orderID);
            if(!order) return null;

            // Update payment status
            if(paymentStatus && paymentStatus === PaymentStatus.PAID){
                order.payment_status = PaymentStatus.PAID;
                order.paid_at = new Date();
            }else if(orderStatus && orderStatus === OrderStatus.DELIVERED){
                order.order_status = OrderStatus.DELIVERED;
                order.delivered_at = new Date();
            }else{
                await Order.findByIdAndUpdate(orderID, {
                    payment_status: paymentStatus? paymentStatus: order.payment_status,
                    order_status: orderStatus? orderStatus: order.order_status
                });
            }
            await order.save();

            return await Order.findById(order._id) as  OrderType;
        }catch(error){
            Logger.error(`Error updating order ${orderID}: ${error}`);
            return null;
        }
    };

    async getOrders(userId: string, order_status?:string): Promise<OrderType[] | null>{
        try{
            let orders = await Order.find({ user: userId });
            if(order_status) 
                orders = await Order.find({ user: userId, order_status });

            return orders as unknown as OrderType[];
        }catch(error){
            Logger.error(`Error getting orders: ${error}`);
            return null;
        }
    }

    async getOrder(orderID: string): Promise<OrderType | null>{
        try{
            if (!Types.ObjectId.isValid(orderID)) return null;
            const order = await Order.findById(orderID);
            if(!order) return null; 
            return order as unknown as OrderType;
        }catch(error){
            Logger.error(`Error getting orders: ${error}`);
            return null;
        }    
    };

    async allUsersOrders(order_status?:string): Promise<OrderType[] | null>{
        try{
            let orders = await Order.find({});
            if(order_status) 
                orders = await Order.find({ order_status });

            return orders as unknown as OrderType[];
        }catch(error){
            Logger.error(`Error getting all orders: ${error}`);
            return null;
        }
    }
};

export default OrderService;