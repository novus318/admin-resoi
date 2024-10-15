'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [ok, setOk] = useState<boolean | null>(null);
    const searchParams = useSearchParams(); // Get search parameters from the URL

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.log('No token found. Redirecting to login.');
          setOk(false);
          return;
        }

        try {
          const response = await axios.post(`${apiUrl}/api/auth/verify`, { token });

          if (response.data.success) {
            setOk(true);
          } else {
            setOk(false);
          }
        } catch (error) {
          setOk(false);
        }
      };

      checkAuth();
    }, [router]);

    if (ok === null) {
      return <Spinner />;
    }

    if (ok === false) {
      // Get the current path and append it to the redirect URL
      const currentPath = window.location.pathname; // Get the current pathname
      const redirectPath = searchParams.get('redirect') || `/login?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectPath);
      return null;
    }

    return <Component {...props} />;
  };
}
