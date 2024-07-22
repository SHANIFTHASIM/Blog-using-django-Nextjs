"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchWithToken } from '@/app/(frontend)/_components/utils';

interface Profile {
  id: number;
  full_name: string;
  image: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

interface Comment {
  id: number;
  date: string;
  comment: string;
  post: number; // Corrected to match the actual data structure
}

const UserComments: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (user) {
      fetchComments(user.id);
      fetchUserPosts(user.id);
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/profile/`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data: Profile = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (userId: number) => {
    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/comments/user_posts/?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data: { results: Comment[] } = await response.json();
      setComments(data.results);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchUserPosts = async (userId: number) => {
    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/user/posts/?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
      const data: { results: Post[] } = await response.json();
      setPosts(data.results);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  if (loading || !user || comments.length === 0 || posts.length === 0) {
    return <div className="mt-12 w-[800px] text-center">Loading...</div>;
  }


  return (
    <div className="mt-12 w-[800px]">
      <h1 className="mb-7 text-2xl font-semibold text-gray-800">Comments</h1>
      <div className="mt-8 space-y-8">
        {comments.map((comment) => (
          <div className="bg-white rounded-lg shadow-xl p-4" key={comment.id}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={user.image || "/default-avatar.jpg"}
                  alt="User Avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-gray-900">{user.full_name}</h2>
                  <span className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-gray-800">{comment.comment}</p>
                <p className="mt-2 text-gray-800 ">Post: {getPostTitle(comment.post)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function getPostTitle(postId: number): string {
    const post = posts.find(post => post.id === postId);
    return post ? post.title : 'Unknown Post';
  }
};

export default UserComments;















