import { Router }      from "express";
import OrderController from "../controllers/OrderController";
import OrderService    from "../services/OrderService";
import authMiddleware  from "../middlewares/AuthMiddleware";
import CartServices    from "../services/CartService";

const orderRouter     = Router();
const auth            = new authMiddleware();
const cartService     = new CartServices();
const orderService    = new OrderService(cartService);
const orderController = new OrderController(orderService);

orderRouter.use(auth.authenticated);

orderRouter.post("/", orderController.createOrder);
orderRouter.get("/", orderController.getOrders);
orderRouter.get("/", orderController.getOrder);

orderRouter.use(auth.isAdmin);

orderRouter.put("/", orderController.updateOrder);
orderRouter.get("/all", orderController.getAllOrdersForAdmin);

export default orderRouter;