import { formatCurrency } from '@/lib/currencyFormat'
import Image from "next/legacy/image"
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ item }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  return (
    <Link  href={`/items/edit-items/${item?._id}`}>
      <div  className="rounded-xl cursor-pointer">
        <div className="overflow-hidden cursor-default rounded-xl relative group shadow-md">
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
          </div>
        </div>
        <div className="px-2 py-2">
          <p className="text-sm line-clamp-1">{item?.name}</p>
          <div className="text-sm font-semibold text-cusblack">
            <p className="text-sm font-semibold">
              {formatCurrency(item?.price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
