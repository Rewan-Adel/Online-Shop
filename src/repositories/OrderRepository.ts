import OrderType from '../types/OrderType';

interface OrderRepository {
    createOrder(userId: string, shippingAddress:{
        address: string,
        city: string,
        country: string
    },phone:string, paymentMethod?: string): Promise<OrderType | null>
    updateOrder(orderID: string, paymentStatus?: string, orderStatus?:string): Promise<OrderType | null>
    getOrders(userId: string, order_status?:string): Promise<OrderType[] | null>
    getOrder(orderID: string): Promise<OrderType | null>
    allUsersOrders(order_status?:string): Promise<OrderType[] | null>
};

export default OrderRepository;