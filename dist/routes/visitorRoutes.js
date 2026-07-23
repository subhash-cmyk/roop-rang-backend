"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visitorController_1 = require("../controllers/visitorController");
const router = (0, express_1.Router)();
router.post("/", visitorController_1.addVisitor);
router.get("/", visitorController_1.getVisitors);
exports.default = router;
