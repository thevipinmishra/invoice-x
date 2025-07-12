import { createTV, type ClassValue, type VariantProps } from "tailwind-variants";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const tv = createTV({
  twMerge: true,
});

export const cn = (...inputs: ClassValue[]) => {
  return clsx(twMerge(...inputs));
};

export type { VariantProps };