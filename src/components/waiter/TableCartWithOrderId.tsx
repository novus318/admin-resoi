'use client'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from '@/store/cartSlice';
import { formatCurrency } from '@/lib/currencyFormat';
import { Button } from '@/components/ui/button';
import { Loader2, MinusIcon, PlusIcon, ShoppingBag, Trash2Icon } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';


const TableCartWithOrderId = ({ id }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = (item: any) => {
    const data: any = {
      _id: item._id,
      variant: item.variant
    }
    dispatch(removeFromCart(data));
  };

  const handleIncrement = (item: any) => {
    const data: any = {
      _id: item._id,
      variant: item.variant
    }
    dispatch(incrementQuantity(data));
  };

  const handleDecrement = (item: any) => {
    const data: any = {
      _id: item._id,
      variant: item.variant
    }
    dispatch(decrementQuantity(data));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total: any, item: any) => {
      const priceAfterDiscount = item.offer
        ? item.price - item.price * (item.offer / 100)
        : item.price;
      return total + priceAfterDiscount * item.quantity;
    }, 0);
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'No items in your cart please add.',
        variant: 'destructive'
      })
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/api/tableOrder/update/table-order`, {
        orderId:id,
        cartItems,
      });
        if (response.data.success) {
          toast({
            title: 'Item added successfully!',
            description:'please check your order section',
            variant: 'default'
          });
          router.push('/')
          dispatch(clearCart());
        }
    } catch (error: any) {
      toast({
        title: 'An error occurred while placing the order.',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className='rounded-none fixed bottom-0 left-1/2 transform -translate-x-1/2 z-30 w-full'>
          <div className="flex justify-between w-full max-w-6xl">
            <div className='font-bold tracking-wide'>
              {cartItems.length || 0} items added
            </div>
            <div className='flex gap-2 items-center'>
              <p className='font-extrabold'>VIEW CART</p><ShoppingBag />
            </div>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm p-2">
          <DrawerTitle className='mb-2'>
            Your Cart
          </DrawerTitle>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item: any, i: any) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border p-2 rounded-lg bg-white shadow-sm gap-1"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={`${apiUrl}${item?.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold text-xs">{item.name}</p>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground font-bold uppercase">
                            {item.variant}
                          </p>
                        )}
                        <div className="text-xs">
                          {item.offer ? (
                            <>
                              <span className="line-through text-red-500">
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
                    <div className="flex items-center space-x-1">
                      <Button
                        size="icon"
                        onClick={() => handleDecrement(item)}
                        className="bg-gray-200"
                      >
                        <MinusIcon className="h-4 w-4" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <span className="text-xs md:text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        onClick={() => handleIncrement(item)}
                        className="bg-gray-200"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleRemove(item)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="mt-4 text-lg font-bold flex justify-between">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>

              <Button className="mt-4 w-full" disabled={loading} onClick={handleOrder}>
                {loading ? <Loader2 className='animate-spin' /> : 'Confirm order'}
              </Button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TableCartWithOrderId;
