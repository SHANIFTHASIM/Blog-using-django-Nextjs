"use client";

import { useEffect, useState } from 'react';
import Card from './Card';
import Pagination from './Pagination';

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

const Cardlist = ({ categoryId }: { categoryId?: number }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = categoryId 
          ? `http://localhost:8000/categories/${categoryId}/posts/`
          : `http://localhost:8000/posts/`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched posts:', data); // Debugging line
          if (data && data.results) {
            setPosts(data.results);
          } else {
            console.error('No results found in API response:', data);
          }
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(posts)) {
    console.error('Posts is not an array:', posts);
    return <div>Error: Failed to load posts</div>;
  }

  return (
    <div className="flex-[2]">
      <h1 className="m-[50px]">Recent Posts</h1>
      <div>
        {posts.map((post) => (
          <Card key={post.id} post={post} />
        ))}
      </div>
      <Pagination next="/page2" previous="/page1"/>
    </div>
  );
};

export default Cardlist;





