import NotFound from "@/components/errors/not-found";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  notFoundComponent: () => {
    return <NotFound />;
  },
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>
        <Link to="/register" className="[&.active]:font-bold">
          Register
        </Link>
        <ModeToggle />
      </div>
      <hr />
      <Outlet />
    </>
  ),
});
