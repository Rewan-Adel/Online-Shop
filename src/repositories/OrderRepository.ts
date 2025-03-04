import OrderType from '../types/OrderType';
import {Status} from "../utils/Enums";

interface OrderRepository {
    createOrder(userId: string, shippingAddress:{
        address: string,
        city: string,
        country: string
    },phone:String, paymentMethod?: String): Promise<OrderType | null>
    updateOrder(orderID: string, paymentStatus?: string, orderStatus?:String): Promise<OrderType | null>
    getOrders(userId: string, order_status?:string): Promise<OrderType[] | null>
    getOrder(orderID: string): Promise<OrderType | null>
    allUsersOrders(order_status?:string): Promise<OrderType[] | null>
};

export default OrderRepository;