"use client"


import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  slug: string;
  title: string;
  image: string; // Assuming you have an image field in your categories
}

const colors = ['bg-green-200', 'bg-blue-300', 'bg-red-300', 'bg-violet-300', 'bg-yellow-100', 'bg-orange-300','bg-pink-200','bg-blue-600','bg-red-600'];

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/categories/');
        const data = await res.json();
        setCategories(data.results);
        
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className=' mt-[200px]'>
      <h1 className="mt-12 ml-0 mr-0">Popular Categories</h1>
      <div className="flex  flex-wrap justify-between gap-5">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/Blog/[slug]`}
            as={`/Blog/${category.slug}`} // Specify the actual URL path
            className={`  flex items-center gap-[10px] capitalize w-[15%] h-20 justify-center rounded-xl ${colors[index % colors.length]} sm:w-[100%] md:w-[45%] lg:w-[25%] xl:w-[15%]`}
          >
            <Image
              src={category.image || '/default-image.png'} // Fallback image if none is provided
              alt={category.title}
             width={20}
             height={20}
              className="rounded-[50%] w-[70px] h-[65px] border-2 border-gray-300"
            />
            {category.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

