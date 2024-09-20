"use client"

import Cardlist from "./_components/Cardlist";
import CategoryList from "./_components/CategoryList";
import Featured from "./_components/Featured";
import Menu from "./_components/Menu";
import RecentPosts from "./_components/RecentPosts";



export default function Home() {
  return (
    <main >
    
     <div className=" min-h-[100vh]">

      <Featured/>
      <CategoryList/>
      <div className=" flex gap-[50px]">
         
         <RecentPosts/>
         <Menu/>

      </div>

     </div>

    </main>
  );
}
