'use client'
import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMediaQuery } from "react-responsive"
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { MinusIcon, PlusIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/currencyFormat'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { toast } from '@/hooks/use-toast'

// Define types for props and state
type Variant = {
  _id: string;
  name: string;
  price: number;
  isAvailable: boolean;
};

type Item = {
  _id:string
  name: string;
  offer: number;
  image: string;
  description: string;
  category?: {
    name: string;
  },
  subcategory?: {
    name: string;
  },
  isVeg: boolean;
  price: number;
  variants?: Variant[];
};

type AddToCartProps = {
  isOnline: boolean;
  item: Item;
  children: React.ReactNode;
};

const AddtoCart: React.FC<AddToCartProps> = ({ isOnline,item,children }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const [quantity, setQuantity] = useState(1);
  const availableVariant = item?.variants?.find((variant: any) => variant.isAvailable);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(availableVariant || null);

  const handleAddToCart = () => {
    const data:any = {
      _id: item._id,
      name: item.name,
      offer: item.offer,
      image: item.image,
      description: item.description,
      category: item.category,
      subcategory: item.subcategory,
      isVeg: item.isVeg,
      quantity,
      variant: selectedVariant ? selectedVariant.name : null,
      price: selectedVariant ? selectedVariant.price : item.price,
    };
    dispatch(addToCart(data));
    setQuantity(1)
    setOpen(false);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleVariantChange = (variantId: string) => {
    const variant = item.variants?.find(v => v._id === variantId);
    setSelectedVariant(variant || null);
  };

  const calculatePrice = () => {
    const price = selectedVariant ? selectedVariant.price : item.price;
    const discount = item.offer > 0 ? (price * (item.offer / 100)) : 0;
    const finalPrice = price - discount;
    return {
      originalPrice: price,
      discountedPrice: finalPrice,
    };
  };

  const { originalPrice, discountedPrice } = calculatePrice();
  const totalOriginalPrice = (originalPrice * quantity).toFixed(2);
  const totalDiscountedPrice = (discountedPrice * quantity).toFixed(2);

  const CartContent = () => (
    <div  className='px-2'>
      <div className='space-y-3'>
        <h3 className="text-lg font-bold mb-2">{item.name}</h3>
        {(item?.variants?.length||0) > 0 && (
          <div>
            <Label htmlFor="variant-options" className="font-semibold">
              Select Variant
            </Label>
            <RadioGroup
              id="variant-options"
              value={selectedVariant?._id || ""}
              onValueChange={(value) => handleVariantChange(value)}
              className="grid gap-2 sm:grid-cols-3 mt-2"
            >
              {item?.variants?.map((variant) => (
                <Label
                  key={variant._id}
                  htmlFor={variant._id}
                  className={cn(
                    " [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-2",
                    variant.isAvailable ? "hover:bg-accent hover:text-accent-foreground" : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <RadioGroupItem 
                    value={variant._id} 
                    id={variant._id} 
                    className="sr-only" 
                    disabled={!variant.isAvailable}
                  />
                  <span className="font-semibold text-sm uppercase">{variant.name}</span>
                  <span className="text-xs">
                    {item.offer > 0 ? (
                      <>
                        <span className="line-through text-red-500">
                          {formatCurrency(variant.price)}
                        </span> 
                        {' '}
                        {formatCurrency(variant.price - (variant.price * (item.offer / 100)))}
                      </>
                    ) : (
                      formatCurrency(variant.price)
                    )}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="mb-4">
          <Label className="font-semibold">Quantity</Label>
          <div className="flex items-center gap-2 mt-2">
            <Button
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <MinusIcon className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              disabled
              className="text-center h-7 w-1/6"
            />
            <Button
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
        </div>
      </div>

    <div className='py-2'>
    <div className="mb-4 font-bold">
        <p>Amount:  {item.offer > 0 && (
          <span className="text-red-500 line-through mr-2">
            {formatCurrency(parseFloat(totalOriginalPrice))}
          </span>
        )}{formatCurrency(parseFloat(totalDiscountedPrice))}</p>
      </div>

      <Button onClick={handleAddToCart} className="w-full">
        Add to Cart
      </Button>
    </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild disabled={!isOnline}>
          <div>
            {children}
          <Button
            size='sm'
            className="relative bottom-9 left-2 text-xs h-6 px-2 font-extrabold tracking-wide"
          >
            Add
          </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <CartContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild disabled={!isOnline}>
      <div>
            {children}
          <Button
            size='sm'
            className="relative bottom-9 left-2 text-xs h-6 px-2 font-extrabold tracking-wide"
          >
            Add
          </Button>
          </div>
      </DrawerTrigger>
      <DrawerContent>
        <CartContent />
      </DrawerContent>
    </Drawer>
  );
};

export default AddtoCart;
