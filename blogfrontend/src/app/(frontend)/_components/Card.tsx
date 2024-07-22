"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { AiFillLike } from 'react-icons/ai';
import { IoEyeSharp } from 'react-icons/io5';
import { fetchWithToken } from './utils';
import parse from 'html-react-parser';

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

interface CardProps {
  post: Post;
}

const Card: React.FC<CardProps> = ({ post: initialPost }) => {
  const [post, setPost] = useState<Post | null>(initialPost);
  const [likes, setLikes] = useState(initialPost.likes_count);
  const [views, setViews] = useState(initialPost.views);
  const [liked, setLiked] = useState(initialPost.is_liked);

  const handleBookmarkClick = async () => {
    if (!post) return;

    const bookmarkKey = `bookmarked_${post.slug}`;
    const isBookmarkedInStorage = sessionStorage.getItem(bookmarkKey) === 'true';

    if (isBookmarkedInStorage) {
      // Remove from session storage and update state
      sessionStorage.removeItem(bookmarkKey);
      setPost((prevPost) => ({
        ...prevPost!,
        is_bookmarked: false,
      }));
    } else {
      // Add to session storage and update state
      sessionStorage.setItem(bookmarkKey, 'true');
      setPost((prevPost) => ({
        ...prevPost!,
        is_bookmarked: true,
      }));
    }

    try {
      const res = await fetchWithToken(`http://127.0.0.1:8000/posts/${post.slug}/bookmark/`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const handleLikeClick = async () => {
    if (!post) return;
    const LikeKey = `liked_${post.slug}`;
    const isLikedInStorage = sessionStorage.getItem(LikeKey) === 'true';

    if (isLikedInStorage) {
      // Remove from session storage and update state
      sessionStorage.removeItem(LikeKey);
      setPost((prevPost) => ({
        ...prevPost!,
        is_liked: false,
      }));
    } else {
      // Add to session storage and update state
      sessionStorage.setItem(LikeKey, 'true');
      setPost((prevPost) => ({
        ...prevPost!,
        is_liked: true,
      }));
    }
    try {
      const res = await fetchWithToken(`http://127.0.0.1:8000/posts/${post.slug}/like/`, {
        method: 'POST',
      });
      if (res.ok) {
        setLikes(likes + (liked ? -1 : 1));
        setLiked(!liked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleViewClick = async () => {
    if (!post) return;
    try {
      const res = await fetchWithToken(`http://127.0.0.1:8000/posts/${post.slug}/view/`, {
        method: 'POST',
      });
      if (res.ok) {
        setViews(views + 1);
        sessionStorage.setItem(`viewed_${post.slug}`, 'true');
      }
    } catch (error) {
      console.error('Error adding view:', error);
    }
  };

  useEffect(() => {
    const likedInStorage = sessionStorage.getItem(`liked_${post?.slug}`);
    const bookmarkedInStorage = sessionStorage.getItem(`bookmarked_${post?.slug}`);
    if (likedInStorage !== null) {
      setLiked(likedInStorage === 'true');
    }
    if (bookmarkedInStorage !== null) {
      setPost((prevPost) => ({
        ...prevPost!,
        is_bookmarked: bookmarkedInStorage === 'true',
      }));
    }
  }, [post?.slug]);

  if (!post) return null;

  return (
    <div className="mb-12 flex items-center gap-12">
      <div className="flex-[1] h-[350px] relative">
        <Image src={post.image} alt="Post" layout="fill" objectFit="cover" />
      </div>
      <div className="flex-[1] flex flex-col gap-7">
        <div>
          <span className="text-slate-500">{new Date(post.date).toLocaleDateString()}</span>
          <span className="text-red-500 font-medium"> - {post.user.full_name}</span>
          <div className="flex flex-row gap-2 cursor-pointer p-1">
            <span className="text-slate-500 text-xl" onClick={handleBookmarkClick}>
              <BsFillBookmarkFill color={post.is_bookmarked ? 'red' : 'gray'} />
            </span>
            <span className="text-red-500 text-2xl" onClick={handleLikeClick}>
              <AiFillLike color={liked ? 'red' : 'gray'} />
              {likes}
            </span>
            <span className="text-slate-500 text-2xl" onClick={handleViewClick}>
              <IoEyeSharp />
              {views}
            </span>
          </div>
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h1 className="cursor-pointer">{post.title}</h1>
        </Link>
        <p className="text-lg font-light text-black">{parse(post.description)}</p>
        <Link href={`/posts/${post.slug}`} className="border-b w-max border-solid border-red-500 pt-1 pb-1">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Card;













