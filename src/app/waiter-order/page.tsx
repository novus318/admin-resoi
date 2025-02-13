'use client'
import AdminLayout from '@/components/AdminLayout';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import { withAuth } from '@/components/Middleware/withAuth';
import Unauthorised from '@/components/Middleware/Unauthorised';
import Spinner from '@/components/Spinner';
import TableSelection from '@/components/table/TableSelection';


type Item = {
  _id:string
  name: string;
  price: number | null;
  offer: number | null;
  image: File | null;
  description: string;
  ingredients: string[];
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  variants: { name: string; price: number; isAvailable: boolean }[];
  isVeg: boolean;
};

const Waiter = () => {
  const [loading, setLoading] = useState(true);
  const [isWaiter, setIsWaiter] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;


  useEffect(() => {
    const storedEncryptedRole: any = localStorage.getItem('userRole');
    if (storedEncryptedRole) {
      const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
      const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
      setIsWaiter(decryptedRole === 'waiter' || decryptedRole === 'admin');
    } else {
      setIsWaiter(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return isWaiter ? (
    <AdminLayout>
    <TableSelection/>
    </AdminLayout>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Waiter)
