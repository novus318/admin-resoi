'use client'
import AdminLayout from '@/components/AdminLayout';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import { withAuth } from '@/components/Middleware/withAuth';
import Unauthorised from '@/components/Middleware/Unauthorised';
import Spinner from '@/components/Spinner';
import Layout from '@/components/order/OrderLayout';
import CardSkeleton from '@/components/ui/CardSkeleton';
import ProductCard from '@/components/order/ProductCard';
import axios from 'axios';


type Item = {
  _id:string
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

const Waiter = () => {
  const [loading, setLoading] = useState(true);
  const [isWaiter, setIsWaiter] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<string>('');

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
    fetchItems();
  }, []);

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
              <ProductCard key={item._id} item={item} isSelected={false} />
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
    </Layout>
    </AdminLayout>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Waiter)
