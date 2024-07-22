"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdNotifications,
  MdOutlineChat,
  MdPublic,
  MdSearch,
} from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();
  const currentPath = pathname ? pathname.split("/").pop() : "";

  return (
    <div className="p-5 rounded-lg bg-gray-800 flex items-center justify-between">
      <div className="text-white font-bold capitalize">
        {currentPath}
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
          <MdSearch />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none text-white"
          />
        </div>
        <div className="flex gap-5 text-white">
          <MdOutlineChat size={20} />
          <MdNotifications size={20} />
          <Link href="/"><MdPublic size={20} /></Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

  