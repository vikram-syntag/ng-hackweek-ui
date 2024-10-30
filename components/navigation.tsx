"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MapIcon, HistoryIcon } from "lucide-react";

const navigation = [
  {
    name: "Mission Runner",
    href: "/",
    icon: MapIcon,
  },
  {
    name: "Previous Runs",
    href: "/previous-runs",
    icon: HistoryIcon,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col w-16 bg-background border-r">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center h-16 w-16 border-b transition-colors hover:bg-muted",
              pathname === item.href && "bg-muted"
            )}
            title={item.name}
          >
            <Icon className="h-6 w-6" />
          </Link>
        );
      })}
    </nav>
  );
}