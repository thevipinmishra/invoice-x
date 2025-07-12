import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMeta } from "../../hooks/useMeta";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { RiAddLine } from "@remixicon/react";
import AddClient from "@/modules/clients/components/add-client";

export const Route = createFileRoute("/_dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoading, data } = useMeta();
  const navigate = useNavigate({
    from: "/",
  });
  return (
    <main>
      <div className="container py-6">
        {isLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <p className="text-muted-foreground font-medium tracking-tight">
            Welcome, {data?.data?.user.firstName}!
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <Button
            onPress={() =>
              navigate({
                to: "/create",
              })
            }
          >
            New invoice <RiAddLine />
          </Button>
          <AddClient />
        </div>
      </div>
    </main>
  );
}
