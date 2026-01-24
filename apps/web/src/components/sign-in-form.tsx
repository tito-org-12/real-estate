import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success("Welcome back.");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="mx-auto w-full max-w-sm">
			<div className="mb-10 text-center">
				<h1 className="mb-2 font-serif text-4xl text-foreground">
					Welcome Back
				</h1>
				<p className="text-muted-foreground text-sm uppercase tracking-wide">
					Sign in to your account
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				<div>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<Label
									htmlFor={field.name}
									className="text-muted-foreground text-xs uppercase tracking-wider"
								>
									Email
								</Label>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									placeholder="name@example.com"
									className="h-11 border-muted bg-muted/30 transition-colors focus:border-primary/50"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p
										key={error?.message}
										className="mt-1 text-destructive text-xs"
									>
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="password">
						{(field) => (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label
										htmlFor={field.name}
										className="text-muted-foreground text-xs uppercase tracking-wider"
									>
										Password
									</Label>
									<Button
										variant="link"
										size="xs"
										className="h-auto px-0 font-normal text-muted-foreground hover:text-primary"
									>
										Forgot password?
									</Button>
								</div>
								<Input
									id={field.name}
									name={field.name}
									type="password"
									className="h-11 border-muted bg-muted/30 transition-colors focus:border-primary/50"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p
										key={error?.message}
										className="mt-1 text-destructive text-xs"
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
							type="submit"
							className="h-11 w-full font-semibold text-xs uppercase tracking-widest"
							disabled={!state.canSubmit || state.isSubmitting}
						>
							{state.isSubmitting ? "Authenticating..." : "Sign In"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-8 text-center">
				<p className="text-muted-foreground text-sm">
					Don&apos;t have an account?{" "}
					<Button
						variant="link"
						onClick={onSwitchToSignUp}
						className="h-auto p-0 font-medium text-primary hover:text-primary/80"
					>
						Create one
					</Button>
				</p>
			</div>
		</div>
	);
}
