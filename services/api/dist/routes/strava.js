"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const stravaController_1 = require("../controllers/stravaController");
const router = (0, express_1.Router)();
router.get('/start', auth_1.authenticateToken, stravaController_1.startStravaAuth);
router.get('/callback', stravaController_1.stravaCallback);
exports.default = router;
