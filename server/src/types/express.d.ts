import { UserContext } from "../gateway/gateway.utils";

declare global {
  namespace Express {
    interface Request {
      user?: UserContext;
    }
  }
}