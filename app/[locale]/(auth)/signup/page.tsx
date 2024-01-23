import { Metadata } from 'next';
import { LuCommand } from 'react-icons/lu';

import { cn } from '@/lib/utils';
import { Link } from '@/components/link';
import { SignInWith } from '@/components/signin-with';
import { SignUpForm } from './_components/form';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/signin"
        variant="ghost"
        className="absolute right-4 top-4 md:right-8 md:top-8"
      >
        Login
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[320px]">
        <div className="flex flex-col space-y-2 text-center">
          <LuCommand className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <SignUpForm />
          <SignInWith />
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link
            href="/terms"
            className={cn(
              'hover:text-brand underline underline-offset-4 p-0',
              'font-normal'
            )}
          >
            Terms of Service
          </Link>
          &nbsp;and&nbsp;
          <Link
            href="/privacy"
            className={cn(
              'hover:text-brand underline underline-offset-4 p-0',
              'font-normal'
            )}
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
