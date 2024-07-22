
import { ReactNode } from 'react';
import Navbar from '../(dashboard)/_components/Navbar';
import Sidebar from '../(dashboard)/_components/Sidebar';





type LayoutProps = {
    children: ReactNode;
  };


  const WriterLayout = ({ children }: LayoutProps) => {
 

  return (
    <div className=" flex">
      <div className="flex-2 bg-gray-800 p-5 min-h-screen">
        <Sidebar/>
      </div>
      <div className="flex-1 p-5">
        <Navbar/>
        {children}
      
      </div>
    </div>
  )
}

export default WriterLayout