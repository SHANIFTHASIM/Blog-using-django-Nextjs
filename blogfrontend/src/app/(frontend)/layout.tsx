import { ReactNode } from 'react';
import Navbar from './_components/Navbar';
import Footer from './_components/Footer';
import { AuthProvider } from './_components/authcontext';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthProvider>
      <div className="p-0 m-0 box-border ml-auto mr-auto max-w-[100vw] min-h-[100vh] overflow-x-hidden sm:max-w-[475px] md:max-w-[640px] lg:max-w-[768px] pl-[40px] pr-[40px] xl:max-w-[1200px] 2xl:max-w-[1366px] relative">
        <Navbar />
        <div>{children}</div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Layout;
