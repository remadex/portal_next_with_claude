import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

// Mock next/link
vi.mock("next/link", () => {
  return {
    __esModule: true,
    default: function Link({
      href,
      children,
      className,
    }: {
      href: string;
      children: React.ReactNode;
      className?: string;
    }) {
      return React.createElement("a", { href, className }, children);
    },
  };
});
