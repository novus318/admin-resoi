'use client'
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import EditStaff from '@/components/staff/EditStaff';
import RequestAdvancePay from '@/components/staff/RequestAdvancePay';
import StaffResign from '@/components/staff/StaffResign';
import PendingSalaries from '@/components/staff/PendingSalaries';
import DownloadPayslip from '@/components/staff/DownloadPayslip';
import AdvancePayments from '@/components/staff/AdvancePayments';
import { Badge } from '@/components/ui/badge';

interface Staff {
    _id: string,
    name: string,
    age: number,
    employeeId: string,
    department: string,
    position: string,
    salary: number,
    status: string,
    advancePayment: Number,
    joinDate: Date,
    contactInfo: {
      phone: string,
      email: string,
      address: string
    },
  }


  const SkeletonLoader = () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );


const Page = withAuth(({ params }: any) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;
  const { pid } = params
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [staff, setStaff] = useState<Staff>({
    _id: '',
    name: '',
    age: 0,
    employeeId: '',
    department: '',
    position: '',
    salary: 0,
    advancePayment: 0,
    joinDate: new Date(),
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    },
    status: ''
  })
  const [paySlips, setPaySlips] = useState<any>([])

  const fetchStaffDetails = async () => {
    axios.get(`${apiUrl}/api/staff/get/${pid}`)
      .then(response => {
        if (response.data.success) {
          setStaff(response.data.staff)
          setPaySlips(response.data.payslips)
        }
      })
      .catch(error => {
        console.error("Error fetching staff details:", error)
      })
  }
  useEffect(() => {
  if(pid){
    fetchStaffDetails()
  }
  }, [pid])

  const calculateAge = (dob:any) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

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


  if (!staff._id) {
    return <SkeletonLoader />
  }
  if (loading) {
    return <Spinner />;
  }

  return isAdmin ? (
      <>
      <div className="mt-8 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <Button onClick={
               () => window.history.back()
          }>
            Back
          </Button>
          {staff?._id &&
            <div className="flex space-x-1">
              {staff?.status === 'Active' &&
                (<div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
                  <EditStaff staff={staff} fetchStaffDetails={fetchStaffDetails} />
                  <RequestAdvancePay id={pid} fetchStaffDetails={fetchStaffDetails} />
                  <StaffResign id={pid} />
                </div>)
              }
            </div>
          }
        </div>

      </div>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={staff.status === 'Resigned' ? 'bg-red-50 rounded-lg border p-4' : 'bg-white rounded-lg border p-4'}>
            <div className="flex items-center mb-4">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarFallback>{staff?.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-base md:text-2xl font-bold">{staff?.name}</h2>
                <p className="text-gray-500 text-sm">{staff?.department} - {staff?.status}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Employee ID</p>
                <p className='text-xs md:text-base'>{staff?.employeeId}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Age</p>
                <p className='text-xs md:text-base'>{calculateAge(staff?.age)}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Department</p>
                <p className='text-xs md:text-base'>{staff?.department}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Position</p>
                <p className='text-xs md:text-base'>{staff?.position}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Join Date</p>
                <p className='text-xs md:text-base'>{format(staff?.joinDate, "PPP")}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Salary</p>
                <p className='text-xs md:text-base'>₹{staff?.salary.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Contact number</p>
                <p className='text-xs md:text-base'>{staff?.contactInfo?.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Contact email</p>
                <p className='text-xs md:text-base'>{staff?.contactInfo?.email || 'NIL'}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Address</p>
                <p className='text-xs md:text-base'>{staff?.contactInfo?.address}</p>
              </div>
            </div>
          </div>
          <div className='space-y-4'>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <p className="text-2xl font-bold mb-4">Payslips</p>
            <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Payment Date</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {paySlips?.map((pay: any) => {
      const netPay = pay?.status === 'Paid' ? pay?.netPay : pay?.basicPay;
      const formattedNetPay = Math.round(netPay).toLocaleString();
      const formattedAmount = Math.round(pay?.amount).toLocaleString();
      const paymentDate = new Date(pay?.paymentDate).toLocaleDateString(); // Format payment date

      return (
        <TableRow key={pay?._id}>
          <TableCell>{paymentDate}</TableCell>
          <TableCell>₹{formattedAmount}</TableCell>
          <TableCell>
            <Badge variant={pay?.status === 'Paid' ? 'default' : pay?.status === 'Pending' ? 'secondary' : 'destructive'}>
              {pay?.status}
            </Badge>
          </TableCell>
          <TableCell>
                        {pay?.status === 'Paid' ? (
                          <DownloadPayslip payslip={pay} staff={staff} />
                        ) : (
                          <div
                            className='font-semibold text-red-500'
                          >
                            Rejected due to {pay?.rejectionReason}
                          </div>
                        )}
                      </TableCell>
        </TableRow>
      );
    })}
    {paySlips?.length === 0 && (
      <TableRow>
        <TableCell colSpan={5} className="text-center">
          No payslips found.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Unauthorised />
  );
});

export default Page
