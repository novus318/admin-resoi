import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from '../ui/button';
  import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

const DeleteUser = ({id}:any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`${apiUrl}/api/user/delete-user/${id}`);
            if (response.data.success) {
              toast({
                title: 'Success',
                description: 'User deleted successfully',
                variant:'default',
              });
              router.push('/users')
            } 
        } catch (error:any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || error.message || 'Failed to delete user try again.',
                variant: 'destructive',
              })
        } finally {
            setLoading(false);
            }
            }
  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size='sm' variant="destructive">Delete</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          user and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction disabled={loading}
        onClick={handleDelete}
        >{loading ? <Loader2 className='animate-spin'/>:'Continue'}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default DeleteUser
