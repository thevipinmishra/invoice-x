import { Link, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuTrigger,
} from "@/components/ui/menu";
import { useAuthStore } from "../../../store/auth";
import { useMeta } from "../../../hooks/useMeta";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Laptop, LogOut, Moon, ReceiptText, Sun, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const Nav = () => {
  const { clearToken } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();

  const { isLoading, data } = useMeta();

  const handleLogout = () => {
    clearToken();
    queryClient.removeQueries({
      queryKey: ["meta"],
      exact: true,
      type: "active",
    });
    navigate({ to: "/auth/login" });
  };

  const getAvatarCharacters = (firstName?: string, lastName?: string) => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  return (
    <nav className="bg-background py-2 border-b shadow-xs">
      <div className="container flex justify-between items-center gap-6">
        <Link to="/" className="font-semibold tracking-tight">
          Invoice X
        </Link>
        <div className="flex gap-2">
          <TooltipTrigger>
            <Button
              onPress={toggleTheme}
              size="icon"
              variant="outline"
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Moon />
              ) : theme === "system" ? (
                <Laptop />
              ) : (
                <Sun />
              )}
            </Button>
            <TooltipContent>
              {theme === "dark"
                ? "Switch to system mode"
                : theme === "system"
                ? "Switch to light theme"
                : "Switch to dark mode"}
            </TooltipContent>
          </TooltipTrigger>
          {isLoading ? (
            <Skeleton className="size-9 shrink-0 rounded-full" />
          ) : (
            <MenuTrigger>
              <Button size="icon" variant="outline" className="rounded-full">
                <div>
                  {getAvatarCharacters(
                    data?.data?.user.firstName,
                    data?.data?.user.lastName
                  )}
                </div>
              </Button>
              <Menu>
                <MenuItem href="/clients">
                  <Users />
                  <MenuItemLabel>Clients</MenuItemLabel>
                </MenuItem>
                 <MenuItem href="/invoices">
                  <ReceiptText />
                  <MenuItemLabel>Invoices</MenuItemLabel>
                </MenuItem>
                <MenuItem onAction={handleLogout}>
                  <LogOut />
                  <MenuItemLabel>Logout</MenuItemLabel>
                </MenuItem>
              </Menu>
            </MenuTrigger>
          )}
        </div>
      </div>
    </nav>
  );
};
