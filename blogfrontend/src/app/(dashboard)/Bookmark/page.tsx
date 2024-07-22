
"use client"
// pages/bookmarked-posts.tsx

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchWithToken } from '@/app/(frontend)/_components/utils';

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

const BookmarkedPosts: React.FC = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBookmarkedPosts();
  }, []);

  const fetchBookmarkedPosts = async () => {
    try {
      const response = await fetchWithToken('http://127.0.0.1:8000/bookmarked-posts/');
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarked posts');
      }
      const data: Post[] = await response.json();
      setBookmarkedPosts(data);
    } catch (error) {
      console.error('Error fetching bookmarked posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="mt-12 w-[800px] text-center">Loading...</div>;
  }

  return (
    <div className="mt-12 w-[800px]">
      <h1 className="mb-7 text-2xl font-semibold text-gray-800">Bookmarked Posts</h1>
      <div className="grid grid-cols-3 gap-6">
        {bookmarkedPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-xl p-4">
            <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
            <p className="mt-2 text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
            <p className="mt-2 text-gray-800">{post.description}</p>
            <Image
              src={`http://localhost:8000/${post.image}`}
              alt="Post Image"
              width={200}
              height={150}
              className="mt-4 rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkedPosts;

