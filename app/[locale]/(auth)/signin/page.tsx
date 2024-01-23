import { Metadata } from 'next';
import { LuChevronLeft, LuCommand } from 'react-icons/lu';

import { cn } from '@/lib/utils';
import { Link } from '@/components/link';
import { SignInWith } from '@/components/signin-with';
import { SignInForm } from './_components/form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        scroll={false}
        variant="ghost"
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <LuChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[320px]">
        <div className="flex flex-col space-y-2 text-center">
          <LuCommand className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <div className="grid gap-6">
          <SignInForm />
          <SignInWith />
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/signup"
            className={cn(
              'hover:text-brand underline underline-offset-4',
              'font-normal whitespace-normal'
            )}
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
