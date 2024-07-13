"use client";

import { buttonVariants } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const MotionButton = motion(Link);
const words = ["honest", "better", "anonymous"];

export default function HomePage() {
  return (
    <div
      className="relative grid min-h-screen place-content-center overflow-hidden bg-background px-4 py-24
        dark:bg-grid-white/[0.1] bg-grid-black/[0.1]"
    >
      <Spotlight
        className="left-0 top-12 sm:left-50 sm:-top-30 md:left-30 md:-top-20 lg:left-44 lg:-top-16"
        fill="white"
      />
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10 flex flex-col justify-center items-center">
        <div
          className="max-w-5xl bg-clip-text text-center montserrat-title text-neutral-600 dark:text-neutral-300 mb-2
          text-3xl font-normal leading-tight sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight text-balance"
        >
          Get{" "}
          <span className="inline-flex flex-col h-[calc(theme(fontSize.3xl)*theme(lineHeight.tight))] sm:h-[calc(theme(fontSize.5xl)*theme(lineHeight.tight))] md:h-[calc(theme(fontSize.6xl)*theme(lineHeight.tight))] overflow-hidden">
            <ul className="block animate-text-slide-3 text-left leading-tight [&_li]:block text-gray-950 dark:text-gray-100">
              <li>anonymous</li>
              <li>better</li>
              <li>honest</li>
              <li aria-hidden="true">anonymous</li>
            </ul>
          </span>
          <br />
          feedbacks from users
        </div>
        <p className="mb-4 max-w-md font-medium text-center text-balance text-sm leading-normal text-muted-foreground md:text-lg md:leading-relaxed underline">
          Understand what your users really think and improve your products.
        </p>
        <MotionButton
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          href="/signup"
          className={cn(
            buttonVariants({ size: "sm" }),
            "group relative w-fit text-md font-bold rounded-xl text-center font- flex items-center justify-center bg-foreground/90"
          )}
        >
          Get Started
          <MoveRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12 ml-1" />
        </MotionButton>
      </div>
    </div>
  );
}
