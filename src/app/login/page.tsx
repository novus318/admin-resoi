'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import CryptoJS from 'crypto-js'
import Authorised from '@/components/Middleware/Authorised';

const Login = () => {
  const encryptionKey:any = process.env.NEXT_PUBLIC_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect'); 
  const [ok, setOk] = useState<boolean | null>(null);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.post(`${apiUrl}/api/auth/verify`, { token });
        setOk(response.data.success);
      } catch {
        setOk(false);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    if(!username){
      toast({
        title: 'Error',
        description: 'Username is required',
        variant: 'destructive',
      });
      return;
    }
    if(!password){
      toast({
        title: 'Error',
        description: 'Password is required',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/auth/admin-user/login`, {
        username,
        password,
      });

      const { token,user } = response.data;

      // Store the token in local storage
      localStorage.setItem('authToken', token);
      const userRole = user.role

// Encrypt the user role
const encryptedRole = CryptoJS.AES.encrypt(userRole, encryptionKey).toString();

      localStorage.setItem('userRole', encryptedRole);
      const redirectTo = redirect ? decodeURIComponent(redirect) : '/';
      router.push(redirectTo);
    } catch (error:any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
    });
    }
  };

  if (ok) return <Authorised />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary-foreground">
      <div className="bg-primary-foreground p-6 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="sm">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
