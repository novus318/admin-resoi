'use client'
import { useEffect, useState } from 'react';
import Orders from "@/components/Orders";
import AdminLayout from "../components/AdminLayout";
import Dashboard from "../components/Dashboard";
import { withAuth } from "@/components/Middleware/withAuth";
import CryptoJS from 'crypto-js';
import Spinner from '@/components/Spinner';

function Home() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;

  useEffect(() => {
    const storedEncryptedRole: any = localStorage.getItem('userRole');
    if (storedEncryptedRole) {
      const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
      const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
      setRole(decryptedRole);
    } else {
      setRole(null);
    }
    setLoading(false);
  }, []);

  const isAdmin = role === 'admin';
  const isDelivery = role === 'delivery';
  const isWaiter = role === 'waiter';

  if (loading) {
    return <Spinner />;
  }

  return (
    <AdminLayout>
      {isAdmin && <Dashboard />}
      {isWaiter && <Orders />}
      {isDelivery && <div>Delivery dashboard goes here</div>}
    </AdminLayout>
  );
}

export default withAuth(Home);
