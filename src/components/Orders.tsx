'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from 'axios';
import Spinner from './Spinner';
import { Loader2, MapPin, Phone, Search, User } from 'lucide-react';
import { Input } from './ui/input';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currencyFormat';
import ChangeTableStatusWaiter from './waiter/ChangeTableStatusWaiter';
import Link from 'next/link';


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
  paymentMethod: string;
  orderType: string;
  paymentStatus: string;
  table: {
    tableName: number;
    _id: string
  }
}

const Orders = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const wsUrl: any = process.env.NEXT_PUBLIC_WS_URL;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const wsRef = useRef<WebSocket | null>(null);
  const [deleting, setDeleting] = useState<boolean | null>(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearchTerm =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.mobileNumber?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearchTerm && matchesStatus;
  });

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };


  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/tableOrder/get-store/ordersToday`);
      if (response.data.success) {
        setOrders(response.data.orders);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to fetch orders:', error);
    }
  };
  useEffect(() => {
    fetchOrders();

    if (!wsRef.current) {
      // Only establish the WebSocket connection if it doesn't already exist
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const { type, order } = JSON.parse(event.data);
        if (type === 'tableOrder') {
          setOrders((prevOrders: any) => [...prevOrders, order]);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        setTimeout(() => {
          wsRef.current = null; // Reset ref before attempting to reconnect
          connectWebSocket();
        }, 5000); // Adjust delay as necessary
      };

      wsRef.current = ws; // Store the WebSocket instance in the ref
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close(); // Cleanup on unmount
        wsRef.current = null;
      }
    };
  }, []);

  const connectWebSocket = () => {
    if (!wsRef.current) {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
    }
  };


  const handleDeleteItem = async(item: any, orderID: any) => {
    setDeleting(true);
try {
  const response = await axios.delete(`${apiUrl}/api/tableOrder/delete/table-order-item`, {
    data: {
      orderId: orderID,
      item: item,
    },
  });
  if (response.data.success) {
    setDeleting(false);
    fetchOrders();
  }
} catch (error) {
  setDeleting(false);
}
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Today&apos;s store orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full md:w-[300px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead >Date</TableHead>
                  <TableHead>Order type</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders
                  ?.sort((a: Order, b: Order) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime(); // Use getTime() to get a numeric value
                  })
                  .map((order: any) => (
                    <React.Fragment key={order._id}>
                      <TableRow className="cursor-pointer">
                        <TableCell onClick={() => toggleOrderDetails(order._id)} className="font-medium">{order.orderId}</TableCell>
                        <TableCell onClick={() => toggleOrderDetails(order._id)}>
                          <div className="flex items-center space-x-2">
                            <User className="h-3 w-3" />
                            <span>{order.user?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => toggleOrderDetails(order._id)}>
                          <div className="text-sm">
                            <p>{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
                            <p className="text-muted-foreground">{format(new Date(order.createdAt), 'hh:mm a')}</p>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => toggleOrderDetails(order._id)}>
                          <div className="text-sm">
                            <p>{order?.orderType}</p>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => toggleOrderDetails(order._id)}>{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell>
                          <ChangeTableStatusWaiter order={order}
                            refreshOrders={fetchOrders} />
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
                                        {order.user?.name}
                                      </p>
                                      <p className="text-xs flex items-center">
                                        <Phone className="h-3 w-3 mr-2" />
                                        +91 {order.user?.mobileNumber}
                                      </p>
                                      <p className="text-xs flex items-center">
                                        <MapPin className="h-3 w-3 mr-2" />
                                        {order?.orderType === 'dining' ? `${order?.table?.tableName}` : 'Percel'}
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
                                <Link href={`/waiter-order/edit/${order.orderId}`}
                                  className='bg-primary text-secondary font-medium py-1 px-2 rounded-md'>
                                  Add items
                                </Link>
                                <h3 className="font-semibold mb-2">Order Items</h3>
                              {deleting ? <div>
                                <Loader2 className='animate-spin'/>
                              </div> :
                                <div className="space-y-2">
                                {order.cartItems.map((item: any, i: any) => (
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
                                      <button
                                        onClick={() => handleDeleteItem(item, order.orderId)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium mt-2"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>}
                              </CardContent>
                            </Card>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </div>
          {filteredOrders?.length === 0 && (
            <p className="text-center mt-4 text-muted-foreground">No orders found matching the current filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Orders
