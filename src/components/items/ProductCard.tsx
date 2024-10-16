import { formatCurrency } from '@/lib/currencyFormat'
import Image from "next/legacy/image"
import Link from 'next/link'
import React from 'react'
import { Badge } from '../ui/badge'

const ProductCard = ({ item }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  return (
<Link href={`/items/edit-items/${item?._id}`}>
  <div className="rounded-xl cursor-pointer">
    <div className="overflow-hidden cursor-default rounded-xl relative group">
      <div className="aspect-w-1 aspect-h-1 w-full">
        <Image
          height={700}
          width={700}
          objectFit="cover"
          priority
          src={`${apiUrl}${item?.image}`}
          alt='product'
          className="rounded-xl w-full h-full bg-cusgray object-cover"
        />
        {/* Offer Badge */}
        {item?.offer > 0 && (
        <Badge variant='destructive' className='absolute top-2 left-2'>
            {item.offer}% OFF
          </Badge>
        )}
      </div>
    </div>
    <div className="px-2 py-2">
      <p className="text-sm line-clamp-1">{item?.name}</p>
      <div className="text-sm font-semibold text-cusblack">
  {item?.price ? (
    <>
      {item?.offer > 0 ? (
        <div className='flex gap-2'>
          <p className="text-sm font-semibold line-through text-red-500">
            {formatCurrency(item?.price)}
          </p>
          <p className="text-sm font-semibold">
            {formatCurrency(item?.price - (item.price * (item.offer / 100)))}
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
      // Find the first available variant once
      (() => {
        const availableVariant = item.variants.find((variant: any) => variant.isAvailable);
        
        if (availableVariant) {
          const originalPrice = availableVariant.price;
          const discount = item.offer > 0 ? (originalPrice * (item.offer / 100)) : 0;
          const discountedPrice = originalPrice - discount;

          return (
            <div className='flex gap-2'>
              {item.offer > 0 && (
                <p className="text-sm font-semibold line-through text-red-500">
                  {formatCurrency(originalPrice)}
                </p>
              )}
              <p className="text-sm font-semibold">
                {formatCurrency(discountedPrice)}
                <span className='uppercase text-xs font-bold text-muted-foreground'>
                  {' '}- {availableVariant.name}
                </span>
              </p>
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
</Link>


  )
}

export default ProductCard
