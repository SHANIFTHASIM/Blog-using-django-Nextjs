"use client";



import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import parse from 'html-react-parser';

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
}

const Featured = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/featured-posts/');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error('Failed to fetch featured posts');
        }
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className="mt-8">
          <h1 className="text-8xl font-light">{post.title}</h1>
          <div className="mt-24 flex items-center gap-14">
            <div className="flex-1 h-[500px] relative">
              <div className="relative h-full">
                <Image src={`http://localhost:8000${post.image}`} alt={post.title} layout="fill" objectFit="cover" />
              </div>
              <div className="flex flex-col gap-5 bg-white p-5">
                <div className="text-xl font-light text-slate-700">
                  <p>{parse(post.description)}</p>
                </div>
                <Link href={`/posts/${post.slug}`}>
                  <p className="border-b w-max border-solid border-red-500 pt-1 pb-1">
                    Read More
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Featured;


