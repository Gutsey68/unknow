import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth")({
  /*   beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  }, */
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
