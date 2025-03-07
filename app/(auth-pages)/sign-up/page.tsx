'use client';

import { signUpAction } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Signing up...' : 'Sign up'}
    </Button>
  );
}

export default function Signup() {
  const [state, setState] = useState<{ success?: string; error?: string }>({});

  // Client-side form submission handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const result = await signUpAction({} as any, formData);
      setState(result);
    } catch (err) {
      setState({ error: 'An unexpected error occurred' });
    }
  };

  // If we have a success message, show it
  if (state.success) {
    return (
      <div className="w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Sign up</h1>
        <div className="text-foreground border-l-2 border-foreground p-4 mx-auto text-left max-w-md">
          {state.success}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Sign up</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Already have an account?{' '}
          <Link
            className="text-primary font-medium underline hover:text-primary/90"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
        </div>
        <div className="pt-2">
          <SubmitButton />
        </div>
        {state.error && (
          <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4 py-2">
            {state.error}
          </div>
        )}
      </div>
    </form>
  );
}
