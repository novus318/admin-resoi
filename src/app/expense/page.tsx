'use client'
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import AdminLayout from '@/components/AdminLayout';
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import Spinner from '@/components/Spinner';
import AddExpenses from '@/components/expense/AddExpenses';
import AddExpenseCategory from '@/components/expense/AddExpenseCategory';
import axios from 'axios';
import TodaysExpenses from '@/components/expense/TodaysExpenses';

const Expense = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;
  const [categories, setCategories] = useState([])
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const storedEncryptedRole: any = localStorage.getItem('userRole');
    if (storedEncryptedRole) {
      const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
      const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
      setIsAdmin(decryptedRole === 'admin');
    } else {
      setIsAdmin(false);
    }
    fetchCategories()
    setLoading(false);
  }, []);


    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/expense/get-expense/categories`)
        setCategories(response.data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const refreshExpenses = () => {
      setRefresh(prev => !prev); // Toggle refresh to trigger re-fetch
    }

  if (loading) {
    return <Spinner />;
  }

  return isAdmin ? (
    <AdminLayout>
    <div className="container mx-auto px-4 py-6 space-y-6 sm:space-y-8 lg:space-y-10">
    <AddExpenseCategory fetchCategories={fetchCategories} />
      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        <div className="w-full">
          <AddExpenses categories={categories} onExpenseAdded={refreshExpenses} />
        </div>
      </div>
      <TodaysExpenses refresh={refresh}  categories={categories}/>
    </div>
  </AdminLayout>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Expense)
