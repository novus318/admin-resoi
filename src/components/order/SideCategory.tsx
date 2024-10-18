'use client';
import React from 'react';
import { Button } from '../ui/button';

interface LayoutProps {
  items: any[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

function SideCategory({ items, selectedCategory, setSelectedCategory }: LayoutProps) {
  return (
    <div className="rounded-3xl px-5 py-4 shadow-lg w-2/3 md:w-1/2 lg:w-auto bg-white">
      <h3 className="font-semibold mb-2 text-lg text-cusblack">Categories</h3>
      <ul className="leading-9 text-xs">
        {/* 'All' option */}
        <li>
          <Button size='sm' variant='ghost'
            className={`cursor-pointer ${
              selectedCategory === 'All' ? 'bg-orange-100 text-secondary-foreground w-full font-bold' : 'bg-secondary-foreground text-orange-100 font-bold w-full'
            }`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </Button>
        </li>

        {/* Dynamically render category list */}
        {Array.from(new Set(items.map((item: any) => item.category.name))).map((category) => (
          <li key={category}>
            <Button size='sm' variant='ghost'
              className={`cursor-pointer ${
                selectedCategory === category ? 'bg-orange-100 text-secondary-foreground w-full font-bold' : 'bg-secondary-foreground text-orange-100 font-bold w-full'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideCategory;
