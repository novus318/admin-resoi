'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, MapPin, Phone, User } from 'lucide-react';
import { formatCurrency } from "@/lib/currencyFormat";
import { format } from "date-fns";
import OnlineOrdersToggle from "./OnlineOrdersToggle";

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

interface RecentOrdersProps {
  orders: Order[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = orders?.filter((order) => {
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

  const statusColorMap:any = {
    all: 'bg-gray-200 text-gray-800', 
    pending: 'bg-yellow-100 text-yellow-800', 
    confirmed: 'bg-blue-100 text-blue-800', 
    'in-progress': 'bg-orange-100 text-orange-800', 
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800', 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Today&apos;s Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
           <OnlineOrdersToggle/>
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
          <div className="overflow-x-auto">
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
              {filteredOrders
  ?.sort((a: Order, b: Order) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Use getTime() to get a numeric value
  })
                  .map((order) => (
                    <React.Fragment key={order._id}>
                      <TableRow className="cursor-pointer" onClick={() => toggleOrderDetails(order._id)}>
                        <TableCell className="font-medium">{order.orderId}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-3 w-3" />
                            <span>{order.user?.name}</span>
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
                          <Badge variant="outline" className={`${statusColorMap[order.status]}`}>
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
                                        {order.user?.name}
                                      </p>
                                      <p className="text-xs flex items-center">
                                        <Phone className="h-3 w-3 mr-2" />
                                        +91 {order.user?.mobileNumber}
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
          </div>
          {filteredOrders?.length === 0 && (
            <p className="text-center mt-4 text-muted-foreground">No orders found matching the current filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentOrders;