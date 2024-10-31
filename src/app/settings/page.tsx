'use client'
import AdminLayout from '@/components/AdminLayout';
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import Spinner from '@/components/Spinner';
import AddUsers from '@/components/settings/AddUsers';
import ChangeAdminPassword from '@/components/settings/ChangeAdminPassword';
import ListAdminUsers from '@/components/settings/ListAdminUsers';
import axios from 'axios';

const Settings = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedEncryptedRole: any = localStorage.getItem('userRole');
    if (storedEncryptedRole) {
      const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
      const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
      setIsAdmin(decryptedRole === 'admin');
    } else {
      setIsAdmin(false);
    }
    fetchUsers();
    setLoading(false);
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/getUsers/admin`);
     if(response.data.success) {
      setUsers(response.data.users);
     }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return isAdmin ? (
    <AdminLayout>
<div className='w-full p-2 mt-4 overflow-hidden'>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
  <div className='col-span-1 mx-auto'>
    <AddUsers fetchUsers={fetchUsers} />
  </div>

  <div className='col-span-1 mx-auto'>
    <ChangeAdminPassword />
  </div>

  {/* Admin User List Component */}
  <div className="col-span-1 md:col-span-2 lg:col-span-3 border shadow-md rounded-lg p-6">
    <ListAdminUsers users={users} isLoading={loading} fetchUsers={fetchUsers} />
  </div>
</div>
</div>

    </AdminLayout>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Settings)
