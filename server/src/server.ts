import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import gatewayRouter from "./gateway/gateway.router";

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: `${process.env.CLIENT_LINK}`,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const app = express();
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