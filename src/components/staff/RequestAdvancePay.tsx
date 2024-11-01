'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {  IndianRupee, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'


interface BankAccount {
    _id: string;
    accountNumber: string;
    accountType: string;
    balance: number;
    createdAt: string;
    holderName: string;
    ifscCode: string;
    name: string;
    primary:boolean;
  }

const RequestAdvancePay = ({id,fetchStaffDetails}:any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [bank, setBank] = useState<BankAccount[]>([])
    const [targetAccount, setTargetAccount] = useState<any>(null);

    const fetchAccounts = () => {
        axios.get(`${apiUrl}/api/account/get`).then(response => {
          setBank(response.data.accounts)
        })
          .catch(error => {
            console.log("Error fetching accounts:", error)
          })
      }
    useEffect(() => {
        fetchAccounts();
      }, [])

      const handleSubmit = async () => {
        setLoading(true);
  
        if (!amount || 0 > amount) {
            setLoading(false);
            toast({
              title: 'Error',
              description: 'Please enter a valid amount greater than zero',
              variant: 'destructive',
            })
          return;
          }
        try {
         const res = await axios.post(`${apiUrl}/api/staff/request-advance-pay/${id}`, { amount, targetAccount });
         if (res.data.success) {
            setLoading(false);
            setIsOpen(false);
            toast({
              title: 'Advance request sent successfully',
              variant: 'default',
            });
            fetchStaffDetails()
         }
        } catch (error:any) {
            setLoading(false);
          toast({
            title: 'Failed to send advance request',
            description: error.response?.data?.message || error.message || 'something went wrong',
            variant: 'destructive',
          });
        }
      };
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
    <DialogTrigger asChild>
    <Button
              size='sm'>
              <IndianRupee className="h-4 w-4 mr-2" />
            Advance pay
            </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogTitle>
            Advance salary payment
        </DialogTitle>
        <div>
                <Label>
                    Amount
                </Label>
                <Input
                type='number'
                    name='amount'
                    value={amount === 0 ? '' : amount}
                    onChange={
                        (e) => {
                          setAmount(Number(e.target.value))
                        }
                    }
                    placeholder='amount'
                    className='w-full'
                />
            </div>
       <div>
       {loading ? (
            <Button disabled>
                <Loader2 className='animate-spin' />
            </Button>
        ) : (
            <Button
            disabled={loading || !amount || amount < 1 }
            onClick={handleSubmit}>
                Pay
            </Button>
        )}
       </div>
    </DialogContent>
</Dialog>
  )
}

export default RequestAdvancePay
