import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Nav } from "../../modules/dashboard/components/nav";
import { isAuthenticated } from "../../store/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      toast.error("Session expired. Please log in again.");
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}
