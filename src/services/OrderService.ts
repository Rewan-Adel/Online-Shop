import OrderRepository from "../repositories/OrderRepository";
import OrderType from "../types/OrderType";

class OrderService{
    private orderRepository: OrderRepository;

    constructor(orderRepository: OrderRepository){
        this.orderRepository = orderRepository;
    }

    async createOrder(value: object): Promise<OrderType | null>{
        return await this.orderRepository.createOrder(value);
    }

    async updateOrder(orderID: string, data: object): Promise<OrderType | null>{
        return await this.orderRepository.updateOrder(orderID, data);
    }

    async deleteOrder(orderID: string): Promise<boolean | null>{
        return await this.orderRepository.deleteOrder(orderID);
    }

    async getOrders(): Promise<OrderType[]>{
        return await this.orderRepository.getOrders();
    }

    async getOrder(orderID: string): Promise<OrderType | null>{
        return await this.orderRepository.getOrder(orderID);
    }
};

export default OrderService;