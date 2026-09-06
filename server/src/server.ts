import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import express from 'express';
import morgon from 'morgan';
import gatewayRouter from "./gateway/gateway.router";
import { handleRazorpayWebhook } from './gateway/controllers/razorpayWebhook.controller';
import { errorMiddleware } from './gateway/middleware/error.middleware';

const port = process.env.PORT || 3000;

// CLIENT_LINK can be a comma-separated list so local dev (localhost:5173)
// and the deployed Vercel domain both work without touching this file again.
const allowedOrigins = (process.env.CLIENT_LINK || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // origin is undefined for same-origin/non-browser requests (curl, Postman) -- allow those.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const app = express();

app.use(morgon('dev'));

// Single CORS middleware, applied once, before anything else -- there used
// to be a second `cors({ origin: 'http://localhost:5173' })` registered
// before this one, which handled (and ended) every OPTIONS preflight with
// that hardcoded origin and silently broke CORS for any non-localhost
// frontend (e.g. the deployed Vercel URL). Removed; this is now the only one.
app.use(cors(corsOptions));

//  Razorpay Webhook Route (RAW BODY REQUIRED)
//  This MUST come before express.json()
app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  handleRazorpayWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// ---- Health Check ----
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api-gateway",
  });
});

// ---- Gateway Entry Point ----
app.use("/api", gatewayRouter);

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;