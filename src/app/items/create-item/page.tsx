'use client'
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import Unauthorised from '@/components/Middleware/Unauthorised';
import Spinner from '@/components/Spinner';
import { withAuth } from '@/components/Middleware/withAuth';
import Create from '@/components/items/Create';

const CreateItem = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;

  useEffect(() => {
    const storedEncryptedRole: any = localStorage.getItem('userRole');
    if (storedEncryptedRole) {
      const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
      const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
      setIsAdmin(decryptedRole === 'admin');
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return isAdmin ? (
 <Create/>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(CreateItem);
