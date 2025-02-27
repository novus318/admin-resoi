'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CheckCircle} from 'lucide-react';
import axios from 'axios';
import { sendOtp } from '@/utils/sendOtp';
import { toast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { DateTimePicker } from '../ui/datetime-picker';

interface BankAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  createdAt: string;
  holderName: string;
  ifscCode: string;
  name: string;
  primary: boolean;
}

const UpdateSalaryPayment = ({  salary }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [btLoading, setBtLoading] = useState(false);
  const [targetAccount, setTargetAccount] = useState<any>(null);
  const [payDate, setPayDate] = useState<any>(new Date());
  const [leaveDays, setLeaveDays] = useState(null);
  const [advanceRepayment, setAdvanceRepayment] = useState(null); // State for advance repayment
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const otpSentRef = useRef(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
 

  const handleOpenDialog = (salary: any) => {
    setSelectedSalary(salary);
    setIsDialogOpen(true);
  };

  const handleSendOtp = async (): Promise<void> => {
    if (otpSentRef.current) return;
    otpSentRef.current = true;

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);

    const otpSentStatus = await sendOtp(generatedOtp);
    setOtpSent(otpSentStatus);
    toast({
      title: 'OTP sent to your registered number',
      variant: 'default',
    });
  };

  const verifyOtp = () => {
    if (enteredOtp === otp) {
      setOtpVerified(true);
      toast({
        title: 'OTP verified',
        variant: 'default',
      });
    } else {
      toast({
        title: 'Invalid OTP',
        variant: 'destructive',
      });
    }
  };
  const handleRejectPayment = async () => {
    if (!otpVerified) {
      await handleSendOtp()
      return;
    }
    if (otpVerified && !rejectionReason) {
      toast({
        title: 'Please enter a rejection reason',
        variant: 'destructive',
      });
      return;
    }
    setBtLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/api/staff/update/salary/${selectedSalary?._id}`, {
        status: 'Rejected',
        rejectionReason:rejectionReason
      });
      if (response.data.success) {
        toast({
          title: 'Salary has been rejected successfully',
          variant: 'default',
        });
        setIsDialogOpen(false);
        setTargetAccount(null);
        setPayDate(null);
        setLeaveDays(null);
        setAdvanceRepayment(null);
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        title: 'Failed to reject salary',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
    setBtLoading(false);
  };

  const handleSubmitPayment = async () => {
   
    if (!payDate) {
      toast({
        title: 'Please select payment date',
        variant: 'destructive',
      });
      return;
    }
    if(selectedSalary?.staffId.advancePayment < (advanceRepayment||0)){
      toast({
        title: 'Advance repayment amount cannot be more than advance payment',
        variant: 'destructive',
      });
      return;
    }
    setBtLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/api/staff/update/salary/${selectedSalary?._id}`, {
        netPay: netPay,
        status: 'Paid',
        paymentDate: payDate,
        leaveDays: leaveDays,
        leaveDeduction,
        advanceRepayment: advanceRepayment
      });
      if (response.data.success) {
        toast({
          title: 'Salary has been updated successfully',
          variant: 'default',
        });
        setIsDialogOpen(false);
        setTargetAccount(null);
        setPayDate(null);
        setLeaveDays(null);
        setAdvanceRepayment(null);
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        title: 'Failed to update Salary',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setBtLoading(false);
    }
  };

  // Calculate leave amount: basicPay / 30 * leaveDays
  const leaveDeduction = (selectedSalary?.basicPay / 30) * (leaveDays || 0);

  // Advance repayment deduction directly from input
  const advanceDeduction = advanceRepayment;

  // Net pay calculation now includes leave and advance repayment deductions
  const netPay = selectedSalary?.basicPay - leaveDeduction - (advanceDeduction || 0);
  const formattedNetPay = Math.round(netPay).toLocaleString();
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setOtpSent(false);
    setOtpVerified(false);
    setEnteredOtp('');
    setOtp('');
    otpSentRef.current = false;
    setRejectionReason('');
    setTargetAccount(null);
    setPayDate(null);
    setLeaveDays(null);
    setAdvanceRepayment(null);
  };
  return (
    <>
      <Button size='sm' onClick={() => handleOpenDialog(salary)} className="cursor-pointer">
        Update payment
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogTitle>
            Update Payment for {selectedSalary?.staffId?.employeeId}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-semibold text-sm">
            Salary: ₹{(selectedSalary?.basicPay || 0).toFixed(2)}<br />
            Advance payment: ₹{(selectedSalary?.staffId.advancePayment || 0).toFixed(2)}
          </DialogDescription>
          {!otpSent && (
            <div>
            <div>
              <p className='text-sm font-medium'>Date of Pay</p>
              <DateTimePicker value={payDate} onChange={setPayDate} />
            </div>

            <div>
              <Label>Leave (Max 30 days)</Label>
              <Input
                type="number"
                min={0}
                max={30}
                placeholder="Number of leave days"
                value={leaveDays || ''}
                onChange={(e: any) => setLeaveDays(e.target.value)} // Ensure leaveDays is between 0 and 30
              />
              <p className='text-sm'>Leave deduction: ₹{leaveDeduction.toFixed(2)}</p>
            </div>

           {selectedSalary?.staffId?.advancePayment > 0 && 
             <div>
             <Label>Advance Repayment</Label>
             <Input
               type="number"
               max={selectedSalary?.staffId?.advancePayment} // Ensure repayment does not exceed advance payment
               placeholder="Repayment amount"
               value={advanceRepayment || ''} // Show empty string for 0
               onChange={(e: any) => setAdvanceRepayment(e.target.value)}
             />
             <p className='text-sm'>Advance Balance: ₹{selectedSalary?.staffId?.advancePayment ? (selectedSalary?.staffId?.advancePayment.toFixed(2)) : 0}</p>
           </div>
           }

            <h4 className='font-semibold text-muted-foreground'>Net Pay: ₹{formattedNetPay}</h4>
          </div>)}
          {otpSent && (
            <div className='grid grid-cols-5 items-center gap-2'>
              <div className='col-span-3'>
                {!otpVerified ? (
                  <>
                    <Label className="mt-4">Enter OTP</Label>
                    <Input
                      type="number"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter OTP"
                    /></>
                ) : (
                  <>
                    <Label className="mt-4">Rejection Reason</Label>
                    <Input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter rejection reason"
                    />
                  </>
                )}
              </div>
              {!otpVerified ? (
                <Button size='sm' onClick={verifyOtp} className="mt-6">
                  Verify OTP
                </Button>
              ) : (
                <CheckCircle className="mr-2 animate-pulse mt-5" />
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectPayment}
              disabled={btLoading}
            >
              Reject
            </Button>
          {!otpSent && ( <Button
              onClick={handleSubmitPayment}
              disabled={btLoading ||  !payDate}
            >
              Submit
            </Button>)}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateSalaryPayment;
