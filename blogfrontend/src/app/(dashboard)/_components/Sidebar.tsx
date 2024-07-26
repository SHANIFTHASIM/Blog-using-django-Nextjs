"use client";

import React from "react";
import Image from "next/image";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdWork,
  MdAnalytics,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
import MenuLink from "./Menulink";



const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Profile",
        path: "/Profile",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Posts",
        path: "/Posts",
        icon: <MdShoppingBag />,
      },
      {
        title: "Comments",
        path: "/Comments",
        icon: <MdAnalytics />,
      },
    ],
  },
  {
    title: "Analytics",
    list: [
      {
        title: "BookMarks",
        path: "/Bookmark",
        icon: <MdWork />,
      },
  
    ],
  },
  {
    title: "Seller",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
      },
      {
        title: "Help",
        path: "/dashboard/help",
        icon: <MdHelpCenter />,
      },
    ],
  },
];

const Sidebar = () => {
  return (
    <div className="sticky top-10 w-[200px]">
      <div className="flex items-center gap-5 mb-5">
        {/* <Image
          className="rounded-full object-cover"
          src="/profile.webp"
          alt=""
          width={50}
          height={50}
        /> */}
        <div className="flex flex-col">
          <span className="font-medium text-white">Hello :username</span>
        </div>
      </div>
      <ul className="list-none text-white">
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className="text-gray-500 font-bold text-xs my-2">
              {cat.title}
            </span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <button
        className="p-5 my-1 flex items-center gap-2 cursor-pointer rounded-lg bg-none border-none text-white w-full hover:bg-gray-700"
      >
        <MdLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
