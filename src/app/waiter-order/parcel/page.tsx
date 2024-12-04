'use client'
import AdminLayout from '@/components/AdminLayout';
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import Spinner from '@/components/Spinner';
import CryptoJS from 'crypto-js'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [isWaiter, setIsWaiter] = useState<boolean | null>(null);
    const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;  
   
    
    useEffect(() => {
        const storedEncryptedRole: any = localStorage.getItem('userRole');
        if (storedEncryptedRole) {
          const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
          const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
          setIsWaiter(decryptedRole === 'waiter');
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
       Parcel
        </AdminLayout>
      ) : (
        <Unauthorised />
      );
    };

export default withAuth(Page)