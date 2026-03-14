import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { trackPhase0Event } from "@/lib/analytics";

import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orpc } from "@/utils/orpc";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const router = useRouter();
  const { isPending } = authClient.useSession();
  const setRoleMutation = useMutation(orpc.profile.setRole.mutationOptions());

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "renter" as "renter" | "landlord",
    },
    onSubmit: async ({ value }) => {
      trackPhase0Event("sign_up_started", {
        role: value.role,
      });

      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: async () => {
            try {
              await setRoleMutation.mutateAsync({ role: value.role });
            } catch {
              toast.error(
                "Account created, but we couldn't save your role preference.",
              );
            }

            router.push("/dashboard");
            trackPhase0Event("sign_up_succeeded", {
              role: value.role,
            });
            toast.success("Account created successfully");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        role: z.enum(["renter", "landlord"]),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className='mx-auto w-full max-w-sm'>
      <div className='mb-10 text-center'>
        <h1 className='mb-2 font-serif text-4xl text-foreground'>
          Create Account
        </h1>
        <p className='text-muted-foreground text-sm uppercase tracking-wide'>
          Join our exclusive community
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className='space-y-6'
      >
        <div>
          <form.Field name='name'>
            {(field) => (
              <div className='space-y-2'>
                <Label
                  htmlFor={field.name}
                  className='text-muted-foreground text-xs uppercase tracking-wider'
                >
                  Name
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  className='h-11 border-muted bg-muted/30 transition-colors focus:border-primary/50'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p
                    key={error?.message}
                    className='mt-1 text-destructive text-xs'
                  >
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name='role'>
            {(field) => (
              <div className='space-y-2'>
                <Label
                  htmlFor={field.name}
                  className='text-muted-foreground text-xs uppercase tracking-wider'
                >
                  I am joining as
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "renter" | "landlord")
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className='h-11 border-muted bg-muted/30 transition-colors focus:border-primary/50'
                  >
                    <SelectValue placeholder='Choose your role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='renter'>Renter</SelectItem>
                    <SelectItem value='landlord'>Landlord</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors.map((error) => (
                  <p
                    key={error?.message}
                    className='mt-1 text-destructive text-xs'
                  >
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name='email'>
            {(field) => (
              <div className='space-y-2'>
                <Label
                  htmlFor={field.name}
                  className='text-muted-foreground text-xs uppercase tracking-wider'
                >
                  Email
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type='email'
                  className='h-11 border-muted bg-muted/30 transition-colors focus:border-primary/50'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p
                    key={error?.message}
                    className='mt-1 text-destructive text-xs'
                  >
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name='password'>
            {(field) => (
              <div className='space-y-2'>
                <Label
                  htmlFor={field.name}
                  className='text-muted-foreground text-xs uppercase tracking-wider'
                >
                  Password
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type='password'
                  className='h-11 border-muted bg-muted/30 transition-colors focus:border-primary/50'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p
                    key={error?.message}
                    className='mt-1 text-destructive text-xs'
                  >
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type='submit'
              className='h-11 w-full font-semibold text-xs uppercase tracking-widest'
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Creating..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className='mt-8 text-center'>
        <p className='text-muted-foreground text-sm'>
          Already have an account?{" "}
          <Button
            variant='link'
            onClick={onSwitchToSignIn}
            className='h-auto p-0 font-medium text-primary hover:text-primary/80'
          >
            Sign In
          </Button>
        </p>
      </div>
    </div>
  );
}
