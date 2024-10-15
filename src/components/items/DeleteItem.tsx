import React, { useState } from 'react';
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
} from "@/components/ui/alert-dialog";
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

const DeleteItem = ({ Id }: any) => {
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`${apiUrl}/api/item/delete-item/${Id}`);
            if (response.data.success) {
              router.push('/items')
            } 
        } catch (error:any) {
          toast({
            title: 'Error',
            description: error?.response?.data?.message || error.message || 'An error occurred while deleting the item try again.',
            variant: 'destructive',
          })
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='destructive' className='m-2'>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your item
                        and remove it from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button 
                            variant='destructive' 
                            onClick={handleDelete} 
                            disabled={loading}
                        >
                            {loading ? <Loader2 className='animate-spin' /> : "Delete"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteItem;
