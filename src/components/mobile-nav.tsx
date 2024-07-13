"use client";
import React from "react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "./icons";
import { siteConfig } from "@/config/site";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const session = useSession();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-10 px-0 sm:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <MobileLink
          onOpenChange={setOpen}
          href="/"
          className="flex items-center"
        >
          <Icons.logo className="mr-2 h-6 w-6" />
          <span className="truncate font-bold">{siteConfig.name}</span>
        </MobileLink>
        <div className="flex flex-col gap-3 mt-5">
          <MobileLink onOpenChange={setOpen} href="/dashboard">
            Dashboard
          </MobileLink>
          <Link target="_blank" href={siteConfig.links.github}>
            GitHub
          </Link>
          {session.status === "authenticated" ? (
            <MobileButton
              onOpenChange={setOpen}
              onClick={() => signOut()}
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }), // Add your desired variant
                "inline-flex text-muted-foreground max-w-fit px-0 py-0 mt-0"
              )}
            >
              Signout
              <ChevronRight className="h-5 w-5 inline-flex text-muted-foreground" />
            </MobileButton>
          ) : (
            <MobileLink
              onOpenChange={setOpen}
              href="/signin"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }), // Add your desired variant
                "inline-flex text-muted-foreground max-w-fit px-0 py-0 mt-0"
              )}
            >
              Signin
              <ChevronRight className="h-5 w-5 inline-flex text-muted-foreground" />
            </MobileLink>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  children,
  className,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}

interface MobileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function MobileButton({
  onOpenChange,
  onClick,
  children,
  className,
  ...props
}: MobileButtonProps) {
  return (
    <button
      onClick={(e) => {
        onOpenChange?.(false);
        onClick?.(e);
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
