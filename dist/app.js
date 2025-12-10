"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./utils/db");
const chalk_1 = __importDefault(require("chalk"));
const auth_routes_1 = require("./routes/auth.routes");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const document_route_1 = require("./routes/document.route");
const swagger_1 = require("./utils/swagger");
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./utils/env");
const payment_route_1 = require("./routes/payment.route");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const folders_route_1 = require("./routes/folders.route");
const dashboard_route_1 = require("./routes/dashboard.route");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set('trust proxy', 1);
const PORT = 5000;
(0, db_1.connectDb)();
(0, swagger_1.setupSwagger)(app);
const corsConfig = {
    origin: env_1.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
console.log(env_1.FRONTEND_URL);
app.use((0, cors_1.default)(corsConfig));
// ROUTES
app.use('/api/auth', auth_routes_1.userRouter);
app.use('/api/document', document_route_1.documentRouter);
app.use('/api/folders', folders_route_1.folderRouter);
app.use('/api/dashboard', dashboard_route_1.dashboardRouter);
app.use('/api/payments', payment_route_1.paymentRouter);
app.get('/', async (req, res) => {
    try {
        res.send(`welcome to the best pdf extractor !!`);
    }
    catch (error) {
        console.error("error", error);
        res.status(500).send('server error');
    }
});
app.get('/health', async (req, res) => {
    try {
        const ping = await mongoose_1.default.connection.db?.admin().ping();
        if (!ping)
            return;
        res.status(200).json({
            status: "ok",
            database: ping.ok === 1 ? "Connected" : "down",
            uptime: process.uptime(),
            timestamp: Date.now()
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'error',
            database: 'down',
            error: err
        });
    }
});
app.use(errorMiddleware_1.globalErrorHandler);
app.listen(PORT, () => {
    console.log(chalk_1.default.blue(`app running on  localhost:${PORT}`));
});
