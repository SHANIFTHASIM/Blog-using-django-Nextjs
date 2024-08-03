"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { AiFillLike } from 'react-icons/ai';
import { IoEyeSharp } from 'react-icons/io5';
import { fetchWithToken } from '../../_components/utils';
import Comments from '../../_components/Comments';
import Menu from '../../_components/Menu';
import parse from 'html-react-parser';

interface Profile {
  id: number;
  user: number;
  email: string;
  full_name: string;
  bio: string;
  about: string;
  author: boolean;
  country: string;
  facebook: string;
  twitter: string;
  date: string;
  image: string;
}

interface Post {
  id: number;
  title: string;
  user: number;
  date: string;
  image: string;
  description: string;
  likes_count: number;
  views: number;
  tags: string;
  subDescription: string;
  is_liked: boolean;
  is_bookmarked: boolean;
  slug: string;
}

const PostPage = () => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // For audio playback

  useEffect(() => {
    if (slug) {
      fetchPostData(slug);
    }
  }, [slug]);

  const fetchPostData = async (slug: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/posts/${slug}/`);
      if (res.ok) {
        const data: Post = await res.json();
        setPost(data);
        setLikes(data.likes_count);
        setViews(data.views);
        setLiked(data.is_liked);
        fetchUserData(data.user);
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const fetchUserData = async (userId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/profiles/?user=${userId}`);
      if (res.ok) {
        const data = await res.json();
        const userProfile = data.results.find((profile: Profile) => profile.user === userId);
        if (userProfile) {
          setUser(userProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleBookmarkClick = async () => {
    if (!post) return;

    const bookmarkKey = `bookmarked_${post.slug}`;
    const isBookmarkedInStorage = sessionStorage.getItem(bookmarkKey) === 'true';

    if (isBookmarkedInStorage) {
      sessionStorage.removeItem(bookmarkKey);
      setPost((prevPost) => ({
        ...prevPost!,
        is_bookmarked: false,
      }));
    } else {
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
      sessionStorage.removeItem(LikeKey);
      setPost((prevPost) => ({
        ...prevPost!,
        is_liked: false,
      }));
    } else {
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

  const handleReadAloud = async () => {
    if (!post) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/text-to-speech/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: post.description }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error:', error);
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

  useEffect(() => {
    const handleView = async () => {
      if (!post || sessionStorage.getItem(`viewed_${post.slug}`)) return;
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

    handleView();
  }, [post]);

  if (!post || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex flex-col lg:flex-row lg:items-center gap-10">
        <div className="flex-1">
          <h1 className="text-4xl mb-6 lg:text-5xl xl:text-6xl font-bold text-gray-900">{post.title}</h1>
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 relative">
              <Image
                src={user.image || "/default-avatar.jpg"}
                alt="avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1 text-gray-700">
              <span className="text-lg font-semibold">{user.full_name}</span>
              <span className="text-sm">{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-row gap-4 cursor-pointer p-2 mb-4">
            <span
              className="text-xl p-2 rounded-full transition-colors hover:bg-gray-200"
              onClick={handleBookmarkClick}
            >
              <BsFillBookmarkFill color={post.is_bookmarked ? 'red' : 'gray'} />
            </span>
            <span
              className="text-xl p-2 rounded-full transition-colors hover:bg-gray-200 flex items-center"
              onClick={handleLikeClick}
            >
              <AiFillLike color={liked ? 'red' : 'gray'} />
              <span className="ml-1">{likes}</span>
            </span>
            <span className="text-xl p-2 rounded-full transition-colors hover:bg-gray-200 flex items-center">
              <IoEyeSharp />
              <span className="ml-1">{views}</span>
            </span>
            <span
              className="text-xl p-2 rounded-full transition-colors hover:bg-gray-200 flex items-center cursor-pointer"
              onClick={handleReadAloud}
            >
              🔊
            </span>
          </div>
          {audioUrl && (
            <div className="mt-4">
              <audio controls src={audioUrl} className="" />
            </div>
          )}
        </div>
        {post.image && (
          <div className="flex-1 h-72 relative hidden lg:block">
            <Image src={post.image} alt="blogpost" fill className="object-cover rounded-lg" />
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        <div className="flex-5">

          <div className="text-lg font-light text-gray-800">
            <div className="mb-5">{parse(post.description)}</div>
            <Comments postId={post.id} user={user} />
          </div>
        </div>
        <div className="lg:flex-1">
          <Menu />
        </div>
      </div>


    </div>
  );
};

export default PostPage;

















