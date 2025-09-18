import { SquareClient, SquareEnvironment } from "square";

export const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN as string,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});
