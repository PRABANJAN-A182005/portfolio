import { Router } from "express";
import { getPortfolio, upsertPortfolio } from "../controllers/portfolioController.js";

const router = Router();

router.get("/", getPortfolio);
router.put("/", upsertPortfolio);

export default router;

