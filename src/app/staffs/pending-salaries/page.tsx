'use client'
import AdminLayout from '@/components/AdminLayout';
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import UpdateSalaryPayment from '@/components/staff/UpdateSalaryPayment';
import { formatCurrency } from '@/lib/currencyFormat';
const Page = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [salaries, setSalaries] = useState<any[]>([]);

    const fetchSalary = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/staff/pending-salaries`);
        if (response.data.success) {
          setSalaries(response.data.payslips);
          setLoading(false)
        }
      } catch (error: any) {
        toast({
          title: 'Failed to fetch salaries',
          description: error.response?.data?.message || error.message || 'Something went wrong',
          variant: 'destructive',
        });
        setLoading(false)
      }
    };

    useEffect(() => {
      fetchSalary();
    },[]);

    function formatMonth(dateString:any) {
      const date = new Date(dateString);
      return date.toLocaleString('default', { month: 'long' }); // e.g., "June"
    }
  
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
    <div className='p-2'>
    <div className='max-w-5xl mx-auto'>
        <div className="mb-4 flex justify-between items-center">
        <Button onClick={
               () => window.history.back()
          }>
            Back
          </Button>
        </div>
        <div>
        <div className='w-full p-2 rounded-md border my-2 md:my-4 mx-auto'>
      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>ID</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>House</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.map((salary, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{salary?.staffId?.employeeId}</TableCell>
                <TableCell>
                {formatMonth(salary?.salaryPeriod?.startDate)}
                </TableCell>
                <TableCell>{salary?.staffId?.name}</TableCell>
                <TableCell>{formatCurrency(salary?.basicPay)}</TableCell>
                <TableCell>
                 <UpdateSalaryPayment fetchSalary={fetchSalary} salary={salary} />
                </TableCell>
              </TableRow>
            );
          })}
          {salaries.length === 0 && (
            <TableCell colSpan={5} className="text-center text-gray-600 text-sm">
              <p className="text-base font-bold">No pending salaries...</p>
            </TableCell>
          )}
        </TableBody>
        <TableFooter>
          <p>{salaries?.length} salaries are Unpaid</p>
        </TableFooter>
      </Table>

    </div>
        </div>
    </div>
</div>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Page)
