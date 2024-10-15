'use client'
import axios from 'axios'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

const ItemsDisplay = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [items,setItems]=useState([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [loadingItems, setLoadingItems] = useState(false)

  const fetchitems =async()=>{
    try{
      setLoadingItems(true)
      const response = await axios.get(`${apiUrl}/api/item/get-items`)
      if(response.data.success){
        setItems(response.data.items)
      }
    }catch(error){
      console.error(error)
    }finally{
      setLoadingItems(false)
    }
  }
  const filterItems = () => {
    return items.filter((item:any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  const handleSearch = (e:any) => {
    setSearchTerm(e.target.value);
  }
  useEffect(() => {
    fetchitems()
  }, [])
  return (
   <>
    <div className="rounded-2xl overflow-hidden shadow-lg w-full bg-white  px-2 py-4">
    <div className="">
  <div className="flex flex-wrap justify-between items-center text-gray-600 text-sm gap-2">
    <Link
      href="/items/create-item"
      className="bg-secondary-foreground text-primary-foreground py-2 px-3 rounded-md"
    >
      Create Item
    </Link>
    <div className="w-full md:w-auto flex relative group mt-2 md:mt-0 justify-between md:ml-auto items-center flex-grow h-full rounded-3xl bg-white border">
      <input
        className="text-xs pl-4 rounded-3xl p-2.5 focus:outline-none w-full text-cusblack"
        type="text"
        placeholder="Search item"
      />
      <Search className='pe-2' />
    </div>
  </div>
</div>

    </div>
    <div>
    <div
      className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 mt-8`}
    >
      {items.length > 0 ? (
        items.map((item:any)=>
       <ProductCard item={item}/>
        )
      ):(
      <div>
        <p className="text-center">No items found</p>
      </div>
      )}
    </div>
  </div></>
  )
}

export default ItemsDisplay
