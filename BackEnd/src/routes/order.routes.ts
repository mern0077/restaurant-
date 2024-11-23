import express from "express"
import {isAuthencated} from "../middlewares/isAuthencated";
import { createCheckoutSession, getOrders, stripeWebhook } from "../controller/order.controller";
const router = express.Router();

router.route("/").get(isAuthencated, getOrders);
router.route("/checkout/create-checkout-session").post(isAuthencated, createCheckoutSession);
router.route("/webhook").post(express.raw({type: 'application/json'}), stripeWebhook);

export default router;