'use client'
import AdminLayout from '@/components/AdminLayout';
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import Spinner from '@/components/Spinner';
import TableSelection from '@/components/table/TableSelection';
import { useParams } from 'next/navigation'
import CryptoJS from 'crypto-js'
import React, { useEffect, useState } from 'react'
import Layout from '@/components/waiter/OrderLayout';
import CardSkeleton from '@/components/ui/CardSkeleton';
import axios from 'axios';
import ProductCard from '@/components/waiter/ProductCard';
import { useSelector } from 'react-redux';
import TableCart from '@/components/waiter/TableCart';
import TableCartWithOrderId from '@/components/waiter/TableCartWithOrderId';


type Item = {
  _id: string
  name: string;
  price: number | null;
  offer: number | null;
  image: File | null;
  description: string;
  ingredients: string[];
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  variants: { name: string; price: number; isAvailable: boolean }[];
  isVeg: boolean;
};

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [isWaiter, setIsWaiter] = useState<boolean | null>(null);
    const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;  
    const { orderId } =useParams()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [ok, SetOk] = useState(true);
    const [items, setItems] = useState<Item[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortOrder, setSortOrder] = useState<string>('');
    const cart = useSelector((state: any) => state.cart.items);

    
    useEffect(() => {
        const storedEncryptedRole: any = localStorage.getItem('userRole');
        if (storedEncryptedRole) {
          const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
          const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
          setIsWaiter(decryptedRole === 'waiter');
        } else {
          setIsWaiter(false);
        }
        setLoading(false);
      }, []);


  useEffect(() => {
    checkTableId()
    fetchItems();
  }, []);


  const checkTableId = async () => {
  try {
    if (orderId) {
      SetOk(true)
    }else{
      SetOk(false)
    }
  } catch (error) {
    console.log(error)
    SetOk(false)
  }
  };

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const response = await axios.get(`${apiUrl}/api/item/get-items`);
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingItems(false);
    }
  };

  const getPrice = (item: Item) => {
    if (item.price) {
      return item.offer ? item.price - (item.price * (item.offer / 100)) : item.price;
    }
    const availableVariant = item.variants.find((variant) => variant.isAvailable);
    if (availableVariant) {
      return item.offer
        ? availableVariant.price - (availableVariant.price * (item.offer / 100))
        : availableVariant.price;
    }
    return 0;
  };

      const filteredItems = items
      .filter((item) => {
        const query = searchQuery.toLowerCase();
        const categoryMatch = selectedCategory === 'All' || item.category.name === selectedCategory;
        return (
          categoryMatch &&
          (item?.name?.toLowerCase().includes(query) ||
            item?.description?.toLowerCase().includes(query) ||
            item?.ingredients?.some((ingredient: any) => ingredient.toLowerCase().includes(query)) ||
            item?.category?.name?.toLowerCase().includes(query) ||
            item?.subcategory?.name?.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        if (sortOrder === 'lowToHigh') {
          return getPrice(a) - getPrice(b);
        }
        if (sortOrder === 'highToLow') {
          return getPrice(b) - getPrice(a);
        }
        return 0;
      });
      if (loading) {
        return <Spinner />;
      }

      return isWaiter ? (
        <AdminLayout>
     <Layout
      items={items}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
    >
      {!loadingItems ? (
        filteredItems.length < 1 ? (
          <p className="col-span-full mx-auto text-sm text-gray-400">No items found</p>
        ) : (
          filteredItems.map((item: Item) => (
            <div key={item?._id}>
              <ProductCard key={item._id} item={item} />
            </div>
          ))
        )
      ) : (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      )}
      {cart.length > 0 &&
        <TableCartWithOrderId id={orderId} />}
    </Layout>
        </AdminLayout>
      ) : (
        <Unauthorised />
      );
    };

export default withAuth(Page)