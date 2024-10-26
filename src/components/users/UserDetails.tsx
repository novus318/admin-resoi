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
import { MapPin, Phone, User } from 'lucide-react'
import { Badge } from '../ui/badge'

interface User {
  name: string;
  mobileNumber: string;
  address: string;
}

interface CartItem {
  name: string;
  image: string;
  variant?: string;
  price: number;
  offer: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  user: User;
  totalAmount: number;
  status: string;
  createdAt: Date;
  cartItems: CartItem[];
  address: string;
  paymentMethod:string;
  paymentStatus: string;
}

const UserDetails = ({id}:any) => {
    const [user, setUser] = React.useState<any>({})
    const [loading, setLoading] = React.useState(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [onlineOrders,setOnlineOrders]=useState([])
    const [storeOrders,setStoreOrders]=useState<any>([])
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-yellow-100 text-yellow-800';
      }
    };
    const toggleOrderDetails = (orderId: string) => {
      setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
    };
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
            <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {onlineOrders?.sort((a: Order, b: Order) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Use getTime() to get a numeric value
  })
                  .map((order:Order) => (
                    <React.Fragment key={order._id}>
                    <TableRow className="cursor-pointer" onClick={() => toggleOrderDetails(order._id)}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>{user?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          <p>{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
                          <p className="text-muted-foreground">{format(new Date(order.createdAt), 'hh:mm a')}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {expandedOrderId === order._id && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Card className="mt-2">
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Customer Details</h3>
                                  <div className="space-y-1">
                                    <p className="text-xs flex items-center">
                                      <User className="h-3 w-3 mr-2" />
                                      {user?.name}
                                    </p>
                                    <p className="text-xs flex items-center">
                                      <Phone className="h-3 w-3 mr-2" />
                                      +91 {user?.mobileNumber}
                                    </p>
                                    <p className="text-xs flex items-center">
                                      <MapPin className="h-3 w-3 mr-2" />
                                      {order?.address}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Order Summary</h3>
                                  <div className="space-y-1 text-xs">
                                    <p>Payment: {order?.paymentMethod} - {order?.paymentStatus}</p>
                                    <p>Total Amount: {formatCurrency(order.totalAmount)}</p>
                                    <p>Status: {order.status}</p>
                                  </div>
                                </div>
                              </div>
                              <h3 className="font-semibold mb-2">Order Items</h3>
                              <div className="space-y-2">
                                {order.cartItems.map((item, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between border pe-4 p-1 rounded-lg bg-background"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={`${apiUrl}${item.image}`}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                      <div>
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        {item.variant && (
                                          <p className="text-xs text-muted-foreground font-medium">
                                            {item.variant}
                                          </p>
                                        )}
                                        <div className="text-xs">
                                          {item.offer ? (
                                            <>
                                              <span className="line-through text-muted-foreground">
                                                {formatCurrency(item.price)}
                                              </span>{' '}
                                              <span className="font-bold">
                                                {formatCurrency(
                                                  item.price - item.price * (item.offer / 100)
                                                )}
                                              </span>
                                            </>
                                          ) : (
                                            <span className="font-bold">
                                              {formatCurrency(item.price)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium">Qty: {item.quantity}</p>
                                      <p className="text-sm font-bold">
                                        {formatCurrency(
                                          item.price * item.quantity -
                                          item.price * item.quantity * (item.offer / 100)
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
            ))}
          </TableBody>
        </Table>

        <h3 className="text-xl font-semibold mb-2 mt-6">Store Orders</h3>
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeOrders.sort((a: Order, b: Order) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Use getTime() to get a numeric value
  })
                  .map((order:Order) => (
                    <React.Fragment key={order._id}>
                    <TableRow className="cursor-pointer" onClick={() => toggleOrderDetails(order._id)}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>{user?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          <p>{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
                          <p className="text-muted-foreground">{format(new Date(order.createdAt), 'hh:mm a')}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {expandedOrderId === order._id && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Card className="mt-2">
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Customer Details</h3>
                                  <div className="space-y-1">
                                    <p className="text-xs flex items-center">
                                      <User className="h-3 w-3 mr-2" />
                                      {user?.name}
                                    </p>
                                    <p className="text-xs flex items-center">
                                      <Phone className="h-3 w-3 mr-2" />
                                      +91 {user?.mobileNumber}
                                    </p>
                                    <p className="text-xs flex items-center">
                                      <MapPin className="h-3 w-3 mr-2" />
                                      {order?.address}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Order Summary</h3>
                                  <div className="space-y-1 text-xs">
                                    <p>Payment: {order?.paymentMethod} - {order?.paymentStatus}</p>
                                    <p>Total Amount: {formatCurrency(order.totalAmount)}</p>
                                    <p>Status: {order.status}</p>
                                  </div>
                                </div>
                              </div>
                              <h3 className="font-semibold mb-2">Order Items</h3>
                              <div className="space-y-2">
                                {order.cartItems.map((item, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between border pe-4 p-1 rounded-lg bg-background"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={`${apiUrl}${item.image}`}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                      <div>
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        {item.variant && (
                                          <p className="text-xs text-muted-foreground font-medium">
                                            {item.variant}
                                          </p>
                                        )}
                                        <div className="text-xs">
                                          {item.offer ? (
                                            <>
                                              <span className="line-through text-muted-foreground">
                                                {formatCurrency(item.price)}
                                              </span>{' '}
                                              <span className="font-bold">
                                                {formatCurrency(
                                                  item.price - item.price * (item.offer / 100)
                                                )}
                                              </span>
                                            </>
                                          ) : (
                                            <span className="font-bold">
                                              {formatCurrency(item.price)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium">Qty: {item.quantity}</p>
                                      <p className="text-sm font-bold">
                                        {formatCurrency(
                                          item.price * item.quantity -
                                          item.price * item.quantity * (item.offer / 100)
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  )
}

export default UserDetails
