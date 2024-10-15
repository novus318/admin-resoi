'use client'
import AdminLayout from '@/components/AdminLayout'
import { withAuth } from '@/components/Middleware/withAuth'
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import Unauthorised from '@/components/Middleware/Unauthorised';
import Spinner from '@/components/Spinner';
import TableManage from '@/components/table/TableManage';

const Table = () => {
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
    <AdminLayout>
      <TableManage/>
    </AdminLayout>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Table)
