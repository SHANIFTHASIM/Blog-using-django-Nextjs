import Image from "next/image"
import Link from "next/link"
import PopularPosts from "./PopularPosts"
import TrendingPosts from "./TrendingPosts"



const Menu = () => {
  return (
    <div className=" flex-[1] mt-16">

        <PopularPosts/>

{/* Trending  */}
    
    <TrendingPosts/>
    
      </div>
  )
}

export default Menu