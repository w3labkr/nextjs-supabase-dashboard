'use client';

import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

export function SignInWith() {
  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(firebaseAuth, provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error.code);
      });
  };

  const handleSignOut = () => {
    signOut(firebaseAuth)
      .then(() => {
        // Sign-out successful.
        console.log('signout');
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid gap-2">
        <Button variant="outline" onClick={() => handleSignIn()}>
          <FcGoogle className="mr-2 h-4 w-4" /> Sign in with Google
        </Button>
        {/* <Button onClick={() => handleSignOut()}>Sign out</Button> */}
      </div>
    </>
  );
}
