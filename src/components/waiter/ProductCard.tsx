'use client'
import React from "react";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/currencyFormat";
import { Badge } from "../ui/badge";
import AddtoCart from "@/components/waiter/AddtoCart";



const ProductCard = ({ item,isOnline }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const imageUrl = `${apiUrl}${item?.image}`

  return (
    <div className="rounded-xl cursor-pointer relative">
    {isOnline === false && (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-xl cursor-not-allowed">
        <p className="text-white text-lg font-semibold">Closed</p>
      </div>
    )}
  
    <AddtoCart isOnline={isOnline} item={item}>
      <div className={`overflow-hidden cursor-default rounded-xl relative group ${!isOnline && 'pointer-events-none'}`}>
        <motion.div
          initial={{ scale: 1.3, x: 50, opacity: 0 }}
          animate={{ scale: 1, x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="aspect-w-1 aspect-h-1 w-full"
        >
          <Image
            height={700}
            width={700}
            objectFit="cover"
            priority
            src={imageUrl}
            alt='product'
            className="rounded-xl h-36 object-cover"
          />
          {item?.offer > 0 && (
            <Badge variant='destructive' className='absolute top-1 left-1 rounded-lg'>
              {item.offer}% OFF
            </Badge>
          )}
        </motion.div>
      </div>
    </AddtoCart>
  
    <div className="px-2 py-2">
      <p className="text-sm line-clamp-1">{item?.name}</p>
      <div className="text-sm font-semibold text-cusblack">
        {item?.price ? (
          <>
            {item?.offer > 0 ? (
              <div className='flex gap-1 items-end'>
                <p className="text-sm font-semibold">
                  {formatCurrency(item?.price - (item.price * (item.offer / 100)))}
                </p>
                <p className="text-xs font-semibold line-through text-red-500">
                  {formatCurrency(item?.price)}
                </p>
              </div>
            ) : (
              <p className="text-sm font-semibold">
                {formatCurrency(item?.price)}
              </p>
            )}
          </>
        ) : (
          item?.variants && item.variants.length > 0 && (
            (() => {
              const availableVariant = item.variants.find((variant: any) => variant.isAvailable);
  
              if (availableVariant) {
                const originalPrice = availableVariant.price;
                const discount = item.offer > 0 ? (originalPrice * (item.offer / 100)) : 0;
                const discountedPrice = originalPrice - discount;
  
                return (
                  <div className='flex gap-1 items-end'>
                    <p className="text-sm font-semibold">
                      {formatCurrency(discountedPrice)}
                      <span className='uppercase text-xs font-bold text-muted-foreground'>
                        -{availableVariant.name}
                      </span>
                    </p>
                    {item.offer > 0 && (
                      <p className="text-xs font-semibold line-through text-red-500">
                        {formatCurrency(originalPrice)}
                      </p>
                    )}
                  </div>
                );
              } else {
                return <p className="text-sm font-semibold text-red-500">No available variants</p>;
              }
            })()
          )
        )}
      </div>
    </div>
  </div>
  

  );
};

export default ProductCard;
