'use client';

import { signInAction } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Signing In...' : 'Sign in'}
    </Button>
  );
}

export default function Login() {
  // Define the initial state with the correct type
  const initialState: { error?: string } = {};
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Sign in</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Don't have an account?{' '}
          <Link
            className="text-primary font-medium underline hover:text-primary/90"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-muted-foreground hover:text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
        </div>
        <div className="pt-2">
          <SubmitButton />
        </div>
        {state?.error && (
          <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4 py-2">
            {state.error}
          </div>
        )}
      </div>
    </form>
  );
}
