"use client";

import React, {
  ButtonHTMLAttributes,
  FC,
  HtmlHTMLAttributes,
  useState,
} from "react";
import Button from "./UI/Button";
import { toast } from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  return (
    <Button
      {...props}
      variant="ghost"
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error("There was a problem signing out");
        } finally {
          setIsSigningOut(false);
        }
      }}
    >
      {isSigningOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="W-4 H-4 cursor-pointer" />
      )}
    </Button>
  );
};

export default SignOutButton;
