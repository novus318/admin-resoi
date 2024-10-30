'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import RecentStoreOrders from './order/RecentStoreOrders'
import axios from 'axios'
import RecentOrders from './order/RecentOrders'
import { Banknote, Logs, ReceiptIndianRupeeIcon, Ticket } from 'lucide-react'
import { formatCurrency } from '@/lib/currencyFormat'

const Dashboard = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const wsUrl:any = process.env.NEXT_PUBLIC_WS_URL;
  const [orders, setOrders] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTermOnline, setSearchTermOnline] = useState('');
  const [statusFilterOnline, setStatusFilterOnline] = useState('all');
  const wsRef = useRef<WebSocket | null>(null);
  const [onlineOrders, setOnlineOrders] = useState<any>([]);
  const [asset, setAsset] = useState<any>({});


  const fetchAssets = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/dashboard/totalof-day`);
      if (response.data.success) {
        setAsset({
          tableOrderTotal:response.data.tableOrderTotal,
            onlineOrderTotal:response.data.onlineOrderTotal,
            totalExpenses:response.data.totalExpenses,
            totalRevenue:response.data.totalRevenue
        });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchonlineOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/online/get-online/ordersToday`);
      if (response.data.success) {
        setOnlineOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };
  // Fetch initial orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/tableOrder/get-store/ordersToday`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchonlineOrders();
    fetchAssets();

    if (!wsRef.current) {
      // Only establish the WebSocket connection if it doesn't already exist
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const { type, order } = JSON.parse(event.data);
        if (type === 'tableOrder') {
          setOrders((prevOrders:any) => [...prevOrders, order]);
          fetchAssets();
        }
        if (type === 'onlineOrder') {
          setOnlineOrders((prevOrders:any) => [...prevOrders, order]);
          fetchAssets();
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
  return (
  <div className='px-4 pt-4'>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Today&apos;s Revenue
        </CardTitle>
        <Banknote/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(asset.totalRevenue||0)}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
         In Store
        </CardTitle>
        <Logs/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(asset.tableOrderTotal||0)}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Online</CardTitle>
        <Ticket/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(asset.onlineOrderTotal||0)}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Today&apos;s Expense
        </CardTitle>
        <ReceiptIndianRupeeIcon/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(asset.totalExpenses||0)}</div>
      </CardContent>
    </Card>
  </div>
  <div>
  <div className=" space-y-4 mt-4">
          <RecentStoreOrders
        orders={orders} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
        refreshOrders={fetchOrders} 
        refreshAssets={fetchAssets}
      />
         <RecentOrders 
        orders={onlineOrders} 
        searchTerm={searchTermOnline} 
        setSearchTerm={setSearchTermOnline} 
        statusFilter={statusFilterOnline} 
        setStatusFilter={setStatusFilterOnline} 
        refreshOrders={fetchonlineOrders} 
        refreshAssets={fetchAssets}
      />
    </div>
  </div>
  </div>
  )
}

export default Dashboard
