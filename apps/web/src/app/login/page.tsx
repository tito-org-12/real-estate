"use client";

import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
	const [showSignIn, setShowSignIn] = useState(true);

	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/10 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md rounded-lg border bg-background p-8 shadow-sm">
				{showSignIn ? (
					<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
				) : (
					<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
				)}
			</div>
		</div>
	);
}
