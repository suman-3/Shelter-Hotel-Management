"use client";

import * as React from "react";
import { BookOpenCheck, ChevronsUpDown, Hotel, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function NavMenu() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer flex items-center"
          onClick={() => {
            router.push("/hotel/new");
          }}
        >
          <Plus size={15} /> &nbsp;<span>Add Hotel</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center"
          onClick={() => {
            router.push("/my-hotels");
          }}
        >
          <Hotel size={15} />
          &nbsp;
          <span>My Hotels</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center"
          onClick={() => {
            router.push("/my-bookings");
          }}
        >
          <BookOpenCheck size={15} />
          &nbsp;
          <span>My Bookings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
