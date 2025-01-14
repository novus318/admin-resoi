'use client'
import AdminLayout from '@/components/AdminLayout';
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link';
import { formatCurrency } from '@/lib/currencyFormat';

interface Staff {
    _id: string,
    name: string,
    age: number,
    employeeId: string,
    department: string,
    position: string,
    salary: number,
    joinDate: Date,
    status: string,
    contactInfo: {
      phone: string,
      email: string,
      address: string
    }
  }

const Staffs = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchStaff = async () => {
    const response = await axios.get(`${apiUrl}/api/staff/all-staff`);
    if (response.data.success) {
      setStaff(response.data.staff);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filtered staff based on search term and status filter
  const filteredStaff = staff.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <div className='p-4'>
    <div className="w-full p-6 border border-b-0 rounded-t-md">
        <div className="mb-4 grid grid-cols-2 md:grid-cols-5 justify-between items-center">
          <h2 className="text-2xl font-semibold col-span-2 md:col-span-3">Staff Management</h2>
          <div className='space-x-2 col-span-2'>
            <Link href='/staffs/create-staff' className='bg-primary text-primary-foreground py-1 px-2 rounded-sm'>
              Create staff
            </Link>
          </div>
        </div>

        <div className="flex space-x-4 mb-4 max-w-xl">
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-4"
          />
        <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="bg-secondary-foreground text-primary-foreground py-1 px-3 rounded-sm"
  >
    <option value="All">Filter by Status</option>
    <option value="Active">Active</option>
    <option value="Resigned">Resigned</option>
  </select>
        </div>

        <div className="mt-6 overflow-x-auto">
          <Table className="min-w-full bg-white">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2">ID</TableHead>
                <TableHead className="px-4 py-2">Name</TableHead>
                <TableHead className="px-4 py-2">Position</TableHead>
                <TableHead className="px-4 py-2">Phone</TableHead>
                <TableHead className="px-4 py-2">Salary</TableHead>
                <TableHead className="px-4 py-2">Status</TableHead>
                <TableHead className="px-4 py-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((item) => (
                <TableRow key={item._id} className={item.status === 'Resigned' ? 'bg-red-100': ''}>
                  <TableCell className="px-4 py-2">{item.employeeId}</TableCell>
                  <TableCell className="px-4 py-2">{item.name}</TableCell>
                  <TableCell className="px-4 py-2">{item.position}</TableCell>
                  <TableCell className="px-4 py-2">{item.contactInfo.phone}</TableCell>
                  <TableCell className="px-4 py-2">{formatCurrency(item.salary)}</TableCell>
                  <TableCell className="px-4 py-2">{item.status}</TableCell>
                  <TableCell className="px-4 py-2">
                    <Link href={`/staffs/details/${item._id}`} className='bg-primary text-primary-foreground px-2 py-1 rounded-sm'>
                      Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
    </AdminLayout>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Staffs)
