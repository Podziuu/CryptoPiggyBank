import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: `0x${string}` | undefined, startLength = 4, endLength = 4) {
  if (!address) return "";
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}