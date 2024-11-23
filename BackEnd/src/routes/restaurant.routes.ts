import express from "express"
import { createRestaurant, getRestaurant, getRestaurantOrder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controller/restaurant.controller";
import upload from "../middlewares/multer";
import {isAuthencated} from "../middlewares/isAuthencated";

const router = express.Router();

router.route("/").post(isAuthencated, upload.single("imageFile"), createRestaurant);
router.route("/").get(isAuthencated, getRestaurant);
router.route("/").put(isAuthencated, upload.single("imageFile"), updateRestaurant);
router.route("/order").get(isAuthencated,  getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthencated, updateOrderStatus);
router.route("/search/:searchText").get(isAuthencated, searchRestaurant);
router.route("/:id").get(isAuthencated, getSingleRestaurant);

export default router;


