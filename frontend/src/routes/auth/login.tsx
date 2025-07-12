import {
  createFileRoute,
  useNavigate,
  useSearch,
  redirect,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useAuthStore, isAuthenticated } from "../../store/auth";
import { toast } from "sonner";
import { TextField } from "@/components/ui/textfield";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field-error";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async () => {
    if (isAuthenticated()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function RouteComponent() {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/login" });
  const loginMutation = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api
        .post("auth/login", {
          json: payload,
        })
        .json(),
    onSuccess: (data) => {
      setToken((data as { token: string }).token);
      navigate({
        to: search.redirect || "/",
      });
    },
    onError: (error, vars, context) => {
      console.log(error, vars, context);
      toast.error(error?.message || "Login failed. Please try again.");
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  return (
    <main className="container flex-1 flex items-center justify-center">
      <Card className=" w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <form.Field
              name="email"
              children={(field) => (
                <TextField
                  isInvalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                >
                  <Label>Email</Label>
                  <Input />
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </TextField>
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <TextField
                  isInvalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                >
                  <Label>Password</Label>
                  <Input type="password" />
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </TextField>
              )}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <>
                  <Button
                    className="w-full"
                    type="submit"
                    isPending={isSubmitting}
                    isDisabled={!canSubmit}
                  >
                    {isSubmitting ? "..." : "Proceed"}
                  </Button>
                </>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
