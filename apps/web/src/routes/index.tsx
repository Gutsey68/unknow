import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import apiClient from "../lib/api-client";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await apiClient.health.$get();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  });

  return (
    <div className="p-2 space-y-2">
      <h3>Welcome Home!</h3>
      {isLoading && <p>Loading health...</p>}
      {isError && (
        <p className="text-red-600">Error: {(error as Error).message}</p>
      )}
      {data && (
        <pre className="text-sm bg-neutral-800 p-2 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
