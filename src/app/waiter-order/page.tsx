'use client'
import AdminLayout from '@/components/AdminLayout';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import { withAuth } from '@/components/Middleware/withAuth';
import Unauthorised from '@/components/Middleware/Unauthorised';
import Spinner from '@/components/Spinner';
import TableSelection from '@/components/table/TableSelection';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Item = {
  _id:string
  name: string;
  price: number | null;
  offer: number | null;
  image: File | null;
  description: string;
  ingredients: string[];
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  variants: { name: string; price: number; isAvailable: boolean }[];
  isVeg: boolean;
};

const Waiter = () => {
  const [loading, setLoading] = useState(true);
  const [isWaiter, setIsWaiter] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;


  useEffect(() => {
    const storedEncryptedRole: any = localStorage.getItem('userRole');
    if (storedEncryptedRole) {
      const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
      const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
      setIsWaiter(decryptedRole === 'waiter' || decryptedRole === 'admin');
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
    <TableSelection/>
    <Dialog>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </AdminLayout>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Waiter)
