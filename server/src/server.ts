import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import gatewayRouter from "./gateway/gateway.router";

const port = process.env.PORT || 3000;

const app = express();

//  Razorpay Webhook Route (RAW BODY REQUIRED)
//  This MUST come before express.json()

app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  gatewayRouter
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;