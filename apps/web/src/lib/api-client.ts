import createClient, { type Client } from "@healthlogs/api-client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3333";

const apiClient: Client = createClient(API_BASE);

export default apiClient;
