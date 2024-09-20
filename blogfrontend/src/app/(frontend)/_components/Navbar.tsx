"use client";

import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useRouter } from 'next/navigation';
import { useAuth } from './authcontext';
import { useState } from 'react';
import { FaCircleUser } from "react-icons/fa6";
import Searchbar from './Searchbar';


const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-between h-24 px-4">
      {/* <div className="hidden lg:flex gap-2 flex-1"> */}
      <div className="flex-1 text-center font-bold text-4xl md:text-2xl lg:text-left xl:text-3xl font-serif">
        Dazzle
      </div>
      {/* </div> */}



      <div className="flex gap-2 flex-1 justify-end text-xl">

  
       

      <Searchbar/>


        <div className="hidden sm:flex sm:gap-4 mt-2">
          <Link href="/">Home</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/about">About</Link>
        </div>

        {isLoggedIn ? (
          <>

           <FaCircleUser 
           
           className="cursor-pointer mt-3 ml-1 mr-2 font-normal"
           onClick={handleProfile}
           />

            {isProfileOpen && (
              <div className="absolute p-4 rounded-md top-20 right-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 mr-1">
                <div><Link href="/AddBlog">Write</Link></div>
                <div><Link href="/Dashboard">Dashboard</Link></div>
                <button onClick={handleLogout} className="cursor-pointer">
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link href="/Login" className=' ml-1 mr-1 mt-2'>Login</Link>
        )}
      </div>
      <ThemeToggle/>
    </div>
  );
};

export default Navbar;











