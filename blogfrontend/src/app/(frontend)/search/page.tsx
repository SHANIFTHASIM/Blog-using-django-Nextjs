"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { AiFillLike } from 'react-icons/ai';
import parse from 'html-react-parser';

interface Post {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  main_image_url: string;
  sub_images: Array<{ image: string }> | null; // Allow null
  likes_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  category?: string;
  slug:string;
  date:string;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/all-posts/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filterPosts = () => {
      if (!query) {
        setFilteredPosts(posts);
        return;
      }

      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredPosts(filtered);
    };

    filterPosts();
  }, [posts, query]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredPosts.map(post => (
          <div key={post.id} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg shadow-md">
            <Link href={`/posts/${post.slug}`}>
              <div className="relative w-full h-60">
                <Image
                  src={`http://localhost:8000/${post.image}`}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </Link>
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600">{parse(post.description)}</p>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">{new Date(post.date).toLocaleDateString()}</span>
        
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;











