"use client";

import { SignIn, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import React from "react";
import Container from "../Container";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import SearchInput from "../SearchInput";

const NavBar = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const { userId } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="sticky top-0 border border-b-primary/10 bg-secondary">
      <Container className="flex justify-between">
        <Link href="/" className="flex gap-1 items-center cursor-pointer">
          <Image src="/Logo/logo.svg" alt="logo" width={40} height={40} />
          <h1 className="font-bold text-2xl poppins">Stay Savvy</h1>
        </Link>
<SearchInput/>
        {userId ? (
          isLoading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full bg-slate-300/40" />
            </div>
          ) : (
            <div className="h-12 w-12">
              <UserButton afterSignOutUrl="/" />
            </div>
          )
        ) : (
          <div className="flex gap-5 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push("/sign-in");
              }}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => {
                router.push("/sign-up");
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default NavBar;
