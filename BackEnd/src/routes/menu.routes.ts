import express from "express"
import upload from "../middlewares/multer";
import { isAuthencated } from "../middlewares/isAuthencated";
import { addMenu, editMenu } from "../controller/menu.controller";

const router = express.Router();

router.route("/").post(isAuthencated, upload.single("image"), addMenu);
router.route("/:id").put(isAuthencated, upload.single("image"), editMenu);

export default router;


