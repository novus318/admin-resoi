'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from '@/lib/currencyFormat'
import { Button } from '../ui/button'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'
import { format } from 'date-fns'
import DeleteUser from './DeleteUser'

const UserDetails = ({id}:any) => {
    const [user, setUser] = React.useState<any>({})
    const [loading, setLoading] = React.useState(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [onlineOrders,setOnlineOrders]=useState([])
    const [storeOrders,setStoreOrders]=useState<any>([])
    const [loadingData, setLoadingData] = useState<boolean>(false);


    const fetchUser = async () => {
        try {
          setLoadingData(true);
          const response = await axios.get(`${apiUrl}/api/user/get-user/${id}`);
        if(response.data.success){
            setUser(response.data.user);
            setOnlineOrders(response.data.onlineOrders);
            setStoreOrders(response.data.storeOrders);
        }
        } catch (error: any) {
          toast({
            title: 'Error',
            description: error?.response?.data?.message || error.message || 'Failed to fetch tables',
            variant: 'destructive',
          });
        } finally {
          setLoadingData(false);
        }
      };
      useEffect(() => {
        fetchUser();
      }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className='flex justify-between'>
      <Button size='sm' onClick={
            () => window.history.back()
        }>
            Back
        </Button>
        <DeleteUser id={id}/>
      </div>
    <h1 className="text-3xl font-bold mb-6">User Details</h1>
    
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="font-semibold">Name</dt>
            <dd>{user?.name}</dd>
          </div>
          <div>
            <dt className="font-semibold">Mobile Number</dt>
            <dd>{user?.mobileNumber}</dd>
          </div>
          <div>
            <dt className="font-semibold">Delivery Address</dt>
            <dd>{user?.deliveryAddress}</dd>
          </div>
          <div>
            <dt className="font-semibold">Delivery Coordinates</dt>
            <dd><Link target='_blank' href={
                `https://www.google.com/maps?q=${user?.deliveryCoordinates?.lat},${user?.deliveryCoordinates?.lng}`}
             className='underline text-primary text-sm font-semibold'>{user?.deliveryCoordinates?.lat}, {user?.deliveryCoordinates?.lng}</Link></dd>
          </div>
          <div>
            <dt className="font-semibold">IP Address</dt>
            <dd>{user?.ipAddress}</dd>
          </div>
          <div>
            <dt className="font-semibold">Place of Operation</dt>
            <dd>{user?.placeOfOperation}</dd>
          </div>
          <div>
            <dt className="font-semibold">ISP</dt>
            <dd>{user?.isp}</dd>
          </div>
          <div>
            <dt className="font-semibold">Coordinates</dt>
            <dd><Link target='_blank' href={
                `https://www.google.com/maps?q=${user?.coordinates?.lat},${user?.coordinates?.lng}`}
             className='underline text-primary text-sm font-semibold'>{user?.coordinates?.lat}, {user?.coordinates?.lng}</Link></dd>
          </div>
          <div>
            <dt className="font-semibold">Device</dt>
            <dd>{user?.device}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Purchase Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">Total Purchases: {formatCurrency(129)}</p>
        
        <h3 className="text-xl font-semibold mb-2">Online Orders</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {onlineOrders.map((order:any) => (
              <TableRow key={order._id}>
                <TableCell>{order?.orderId}</TableCell>
                <TableCell>{format(new Date(order?.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell>{formatCurrency(order?.totalAmount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h3 className="text-xl font-semibold mb-2 mt-6">Store Orders</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeOrders.map((order:any) => (
              <TableRow key={order.id}>
                  <TableCell>{order?.orderId}</TableCell>
                <TableCell>{format(new Date(order?.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell>{formatCurrency(order?.totalAmount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  )
}

export default UserDetails
