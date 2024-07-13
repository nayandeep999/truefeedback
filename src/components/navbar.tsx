"use client";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Icons } from "./icons";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import ModeToggle from "./mode-toggle";
import { Button, buttonVariants } from "./ui/button";

const Navbar = () => {
  const session = useSession();
  return (
    <header
      className="z-10 sticky top-0 w-full border-b border-border bg-background/95 backdrop-blur 
      supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            {session.status === "authenticated" ? (
              <Button
                onClick={() => signOut()}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }), // Add your desired variant
                  "hidden sm:inline-flex text-muted-foreground mr-1"
                )}
              >
                Signout
              </Button>
            ) : (
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }), // Add your desired variant
                  "hidden sm:inline-flex text-muted-foreground mr-1"
                )}
              >
                Signin
              </Link>
            )}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-10 px-0 hidden sm:inline-flex"
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ModeToggle />
            <MobileNav />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
