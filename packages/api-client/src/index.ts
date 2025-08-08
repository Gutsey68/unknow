import type { router } from "@healthlogs/api/routes";
import { hc } from "hono/client";

export type TypedClient = ReturnType<typeof hc<router>>;

const makeClient = (...args: Parameters<typeof hc>): TypedClient =>
  hc<router>(...args);
export const client: TypedClient = makeClient("");
export type Client = TypedClient;

export default makeClient;

export type ErrorSchema = {
  error: {
    issues: {
      code: string;
      path: (string | number)[];
      message?: string | undefined;
    }[];
    name: string;
  };
  success: boolean;
};
