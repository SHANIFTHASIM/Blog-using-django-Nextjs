"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Card from '@/app/(frontend)/_components/Card'; // Replace with your actual Card component

interface User {
  full_name: string;
  avatar: string;
}

interface Post {
  id: number;
  title: string;
  user: User;
  description: string;
  date: string;
  image: string;
  slug: string;
  category: {
    title: string;
  };
  likes_count: number;
  views: number;
  is_liked: boolean;
  is_bookmarked: boolean;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query'); // Ensure this matches your query parameter name
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!query) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8000/posts/search/?search=${query}`);

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched posts:', data); // Debugging line
          setPosts(data);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch posts:', errorData);
          // Optionally handle error state or retry logic
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Handle network or fetch errors
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    return <div>No posts found for "{query}"</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold mb-5">Search Results for "{query}"</h1>
      <div>
        {posts.map((post) => (
          <Card key={post.id} post={post} /> // Adjust Card component as needed
        ))}
      </div>
    </div>
  );
};

export default SearchPage;






