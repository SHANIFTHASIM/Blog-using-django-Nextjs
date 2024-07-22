"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import React, { FormEvent } from 'react';

const Searchbar: React.FC = () => {
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (name) {
      router.push(`/search?query=${name}`);
    }
  };

  return (
    <form className="flex justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1" onSubmit={handleSearch}>
      <input type="text" name="name" placeholder="Search" className="flex-1 bg-transparent outline-none"/>
      <button type="submit" className="cursor-pointer">
        <Image src="/search.png" alt="search" width={16} height={16}/>
      </button>
    </form>
  );
};

export default Searchbar;

