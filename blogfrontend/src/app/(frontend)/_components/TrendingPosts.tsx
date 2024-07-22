'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  full_name: string;
}

interface Post {
  id: number;
  slug: string;
  image: string;
  title: string;
  date: string;
  tags: string[];
  user: User;
}

interface ApiResponse {
    results: Post[];
  }

const TrendingPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchTrendingPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/trending-posts/');
      if (!response.ok) {
        throw new Error('Failed to fetch trending posts');
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await fetchTrendingPosts();
      setPosts(posts);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2 className="text-slate-500 text-base font-normal">Flow with the Trend</h2>
      <h1 className="text-3xl">Trending</h1>

      <div className="mt-9 mb-16 flex flex-col gap-9">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`} className="flex items-center gap-5">
            <div className="flex-[1] relative aspect-square">
              <Image
                src={post.image || "/default-image.jpg"}
                alt={post.title}
                fill
                className="object-cover rounded-[50%] border-4 border-solid border-gray-300"
              />
            </div>
            <div className="flex-[4] flex flex-col gap-1">
             
              <h3 className="text-lg font-medium text-slate-600">{post.title}</h3>
              <div className="text-xs">
                <span>{post.user.full_name}</span>
                <span className="text-gray-600">{new Date(post.date).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
