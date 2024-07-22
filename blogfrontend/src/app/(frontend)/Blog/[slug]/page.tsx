"use client";


import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cardlist from '@/app/(frontend)/_components/Cardlist';
import Menu from '@/app/(frontend)/_components/Menu';

const CategoryPage = () => {
  const params = useParams();
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (slug) {
      fetchCategoryData(slug);
    }
  }, [slug]);

  const fetchCategoryData = async (slug: string) => {
    try {
      const response = await fetch(`http://localhost:8000/categories/?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.results.length > 0) {
          // Find the category with the matching slug
          const category = data.results.find((cat: any) => cat.slug === slug);
          if (category) {
            setCategoryName(category.title);
            setCategoryId(category.id);
          } else {
            console.error('Category not found for slug:', slug);
          }
        } else {
          console.error('No categories found for slug:', slug);
        }
      } else {
        console.error('Failed to fetch category data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!categoryId || !categoryName) {
    return <div>Error: Category not found</div>;
  }

  return (
    <div className="">
      <h1 className="bg-red-500 text-white px-2 py-5 text-center">{categoryName} Blog</h1>
      <div className="flex gap-[50px]">
        <Cardlist categoryId={categoryId} />
        <Menu />
      </div>
    </div>
  );
};

export default CategoryPage;










