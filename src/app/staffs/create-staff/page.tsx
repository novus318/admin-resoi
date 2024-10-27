'use client'
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import Spinner from '@/components/Spinner';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { DateTimePicker } from '@/components/ui/datetime-picker';


interface Staff {
    name: string,
    age: any,
    employeeId: string,
    department: string,
    position: string,
    salary: number,
    joinDate: Date,
    contactInfo: {
        phone: string,
        email: string,
        address: string
    }
}
const Page = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [staff, setStaff] = useState<Staff>({
    name: '',
    age: null,
    employeeId: '',
    department: '',
    position: '',
    salary: 0,
    joinDate: new Date(),
    contactInfo: {
        phone: '',
        email: '',
        address: ''
    }
});

const validate = () => {
    const currentYear = new Date().getFullYear();
    const dobYear = new Date(staff.age).getFullYear();
    let isValid = true;
    if (!staff.name) {
        toast({
            title: 'Name is required',
            variant: 'destructive',
        });
        isValid = false;
    }
    if (!staff.age || dobYear === currentYear) {
        toast({
          title: "Please enter a valid Date of Birth",
          variant: "destructive",
        });
        isValid = false;
      }
    if (!staff.employeeId) {
        toast({
            title: 'Employee ID is required',
            variant: 'destructive',
        });
        isValid = false;
    }
    if (!staff.department) {
        toast({
            title: 'Department is required',
            variant: 'destructive',
        });
        isValid = false;
    }
    if (!staff.position) {
        toast({
            title: 'Position is required',
            variant: 'destructive',
        });
        isValid = false;
    }
    if (staff.salary <= 0) {
        toast({
            title: 'Salary must be greater than zero',
            variant: 'destructive',
        });
        isValid = false;
    }
    if (!staff.joinDate) {
        toast({
            title: 'Join date is required',
            variant: 'destructive',
        });
        isValid = false;
    }
    if (!staff.contactInfo.phone) {
        toast({
            title: 'Phone number is required',
            variant: 'destructive',
        });
        isValid = false;
    }
    if (!staff.contactInfo.address) {
        toast({
            title: 'Address is required',
            variant: 'destructive',
        });
        isValid = false;
    }
    return isValid;
};
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('contactInfo.')) {
        const key = name.split('.')[1]; // Get the nested field name (phone, email, address)
        setStaff(prevState => ({
            ...prevState,
            contactInfo: {
                ...prevState.contactInfo,
                [key]: value
            }
        }));
    } else {
        setStaff(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
};

const handleDateChange = (date: any) => {
    setStaff((prev) => ({ ...prev, joinDate: date }));
  };
  const handleAgeChange = (date: any) => {
    setStaff((prev) => ({ ...prev, age: date }));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
        setLoading(true);
        const response = await axios.post(`${apiUrl}/api/staff/create`, staff); 
        if (response.data.success) {
            toast({
                title: 'Staff added successfully!',
                variant:'default',
            });
            setStaff({
                name: '',
                age: 0,
                employeeId: '',
                department: '',
                position: '',
                salary: 0,
                joinDate: new Date(),
                contactInfo: {
                    phone: '',
                    email: '',
                    address: ''
                }
            });
            setLoading(false);
            router.push('/staff');
        } 
    } catch (error:any) {
        setLoading(false);
        toast({
            title: 'Failed to add staff',
            description: error.response?.data?.message || error.message || 'something went wrong',
            variant: 'destructive',
        })
    }
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

                <div className='mx-auto p-4 bg-white rounded-md border my-8'>
                    <h2 className='text-2xl font-semibold mb-4'>Add New Staff</h2>
                    <div className='mb-4'>
                        <Label>
                            Name
                        </Label>
                        <Input
                            name='name'
                            value={staff.name}
                            onChange={handleChange}
                            placeholder='Name'
                            className='w-full'
                        />
                    </div>
                  <div className='grid grid-cols-2 gap-3'>
                  <div>
                <p className='text-sm font-medium' >
                  Date of birth
                </p>
                <DateTimePicker value={staff.age} onChange={handleAgeChange} />
              </div>
                    <div>
              <p className='text-sm font-medium' >
                Date of Join
              </p>
              <DateTimePicker value={staff.joinDate} onChange={handleDateChange} />
            </div>
                  </div>
                    <div className='mb-4'>
                        <Label>
                            Employee ID
                        </Label>
                        <Input
                            name='employeeId'
                            value={staff.employeeId}
                            onChange={handleChange}
                            placeholder='Employee ID'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label>
                            Department
                        </Label>
                        <Input
                            name='department'
                            value={staff.department}
                            onChange={handleChange}
                            placeholder='Department'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label>
                            Position
                        </Label>
                        <Input
                            name='position'
                            value={staff.position}
                            onChange={handleChange}
                            placeholder='Position'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label>
                            Salary
                        </Label>
                        <Input
                            type='text'
                            name='salary'
                            value={staff.salary ===0 ? '': staff?.salary}
                            onChange={handleChange}
                            placeholder='Salary'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Input
                            name='contactInfo.phone'
                            value={staff.contactInfo.phone}
                            onChange={handleChange}
                            placeholder='Phone'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Input
                            name='contactInfo.email'
                            value={staff.contactInfo.email}
                            onChange={handleChange}
                            placeholder='Email'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Input
                            name='contactInfo.address'
                            value={staff.contactInfo.address}
                            onChange={handleChange}
                            placeholder='Address'
                            className='w-full'
                        />
                    </div>
                    <Button
                    disabled={loading} type='submit' onClick={handleSubmit}>
                        {loading ? <Loader2 className='animate-spin' /> : 'Add staff'}
                    </Button>
                </div>
            </div>
        </div>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Page)
