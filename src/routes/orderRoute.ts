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

orderRouter.post("/", (req, res) => orderController.createOrder(req, res));
orderRouter.get("/",  (req, res) => orderController.getOrders(req, res));
orderRouter.get("/one/:id",  (req, res) => orderController.getOrder(req, res));

orderRouter.use(auth.isAdmin);

orderRouter.get("/all", (req, res) => orderController.getAllOrdersForAdmin(req, res));
orderRouter.put("/update/:id",    (req, res) => orderController.updateOrder(req, res));

export default orderRouter;