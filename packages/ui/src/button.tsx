"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  appName: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]; // 'button' | 'submit' | 'reset'
};

export function Button({
  children,
  className,
  appName,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={className}
      onClick={() => console.log(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
}
