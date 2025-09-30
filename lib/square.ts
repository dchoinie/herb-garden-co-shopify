import { SquareClient, SquareEnvironment } from "square";

export const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN as string,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

export function isSquareConfigured(): boolean {
  return !!(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID);
}

export function getCatalogApi() {
  return client.catalogApi;
}
