"use client";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useDebounceSearchValue } from "@/hooks/useDebounceSearchValue";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const [value, setValue] = useState(title || " ");
  const pathname = usePathname();
  const router = useRouter();
  const debounceValue = useDebounceSearchValue<string>(value, 400);
  useEffect(() => {
    const query = {
      title: debounceValue,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.replace(url);
  }, [debounceValue, router]);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  if (pathname !== "/") return null;
  return (
    <div className="relative sm:block hidden ">
      <Search className="absolute h-4 w-4 top-3 left-3 text-muted-foreground" />
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search Rooms"
        className="pl-10 bg-primary/10"
      />
    </div>
  );
};

export default SearchInput;
