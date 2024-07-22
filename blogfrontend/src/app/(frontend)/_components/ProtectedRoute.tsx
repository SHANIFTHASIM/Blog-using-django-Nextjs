// ProtectedRoute.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const isLoggedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;

