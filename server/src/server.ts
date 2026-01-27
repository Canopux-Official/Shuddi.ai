import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import express from 'express';
import gatewayRouter from "./gateway/gateway.router";
import { handleRazorpayWebhook } from './gateway/controllers/razorpayWebhook.controller';

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: `${process.env.CLIENT_LINK}`,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const app = express();

//  Razorpay Webhook Route (RAW BODY REQUIRED)
//  This MUST come before express.json()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  handleRazorpayWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;