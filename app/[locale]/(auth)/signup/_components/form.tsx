'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { auth as firebaseAuth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { schema } from './schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { LuLoader2 } from 'react-icons/lu';

type FormData = z.infer<typeof schema>;

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const disabled = isLoading || isSubmitting;

  function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(firebaseAuth, data.email, data.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        toast({
          title: 'Check your email',
          description:
            'We sent you a login link. Be sure to check your spam too.',
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        toast({
          title: 'Something went wrong.',
          description: 'Your sign in request failed. Please try again.',
          variant: 'destructive',
        });
      });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={disabled}
              {...register('email')}
            />
          </label>
          {errors?.email && (
            <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-1">
          <label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={disabled}
              {...register('password')}
            />
          </label>
          {errors?.password && (
            <p className="px-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button disabled={disabled}>
          {disabled && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up
        </Button>
      </div>
    </form>
  );
}
