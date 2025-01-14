'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IndianRupee, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'



const RequestAdvancePay = ({ id, fetchStaffDetails }: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        if (!amount || amount <= 0) {
            setLoading(false);
            toast({
                title: 'Error',
                description: 'Please enter a valid amount greater than zero',
                variant: 'destructive',
            });
            return;
        }

        if (!date) {
            setLoading(false);
            toast({
                title: 'Error',
                description: 'Please select a valid date',
                variant: 'destructive',
            });
            return;
        }

        try {
            const res = await axios.post(`${apiUrl}/api/staff/salary-pay/${id}`, { amount, paymentDate:date });
            if (res.data.success) {
                setLoading(false);
                setIsOpen(false);
                toast({
                    title: 'Success',
                    description: 'Salary payment processed successfully',
                    variant: 'default',
                });
                fetchStaffDetails();
            }
        } catch (error: any) {
            setLoading(false);
            toast({
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Something went wrong',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
            <DialogTrigger asChild>
                <Button size='sm'>
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Salary pay
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Salary payment
                </DialogTitle>
                <div>
                    <Label>
                        Amount
                    </Label>
                    <Input
                        type='number'
                        name='amount'
                        value={amount === 0 ? '' : amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder='Amount'
                        className='w-full'
                    />
                </div>
                <div>
                    <Label>
                        Date
                    </Label>
                    <Input
                        type='date'
                        name='date'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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
                            disabled={loading || !amount || amount < 1 || !date}
                            onClick={handleSubmit}>
                            Pay
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RequestAdvancePay;