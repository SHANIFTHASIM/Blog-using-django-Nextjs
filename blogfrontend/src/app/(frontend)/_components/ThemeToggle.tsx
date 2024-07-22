import Image from "next/image"


const ThemeToggle = () => {
  return (
    <div className=" w-10 h-5 rounded-[50px] cursor-pointer flex bg-black items-center justify-between relative">
      
       <Image src="/moon.webp" alt="moon" width={14} height={14}/>
     
        <div className=" w-4 h-4 rounded-[50px] bg-white absolute left-[1px]"></div>

       <Image src="/sun.png" alt="sun" width={14} height={14}/>


    </div>
  )
}

export default ThemeToggle