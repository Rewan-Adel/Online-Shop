import OrderType from '../types/OrderType';

interface OrderRepository {
    createOrder(value: object): Promise<OrderType | null>;
    updateOrder(orderID: string, data: object): Promise<OrderType | null>;
    deleteOrder(orderID: string): Promise<boolean | null>;
    getOrders(): Promise<OrderType[]>; // with filter
    getOrder(orderID: string): Promise<OrderType | null>;
};

export default OrderRepository;