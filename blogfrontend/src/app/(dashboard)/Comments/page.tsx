"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchWithToken } from '@/app/(frontend)/_components/utils';

interface Profile {
  id: number;
  full_name: string;
  image: string;
}

interface Comment {
  id: number;
  date: string;
  comment: string;
  post: number;
  parent_comment: number | null;
  replies: Comment[];
}

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

const UserComments: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});

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

  const handleReplyChange = (commentId: number, content: string) => {
    setReplyContent(prev => ({ ...prev, [commentId]: content }));
  };

  const handleReplySubmit = async (commentId: number, postId: number) => {
    const replyText = replyContent[commentId];
    if (!replyText.trim()) return;

    try {
      const response = await fetchWithToken('http://127.0.0.1:8000/comments/reply/', {
        method: 'POST',
        body: JSON.stringify({ parent_comment: commentId, comment: replyText, post: postId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to post reply');
      }

      // Refresh comments to include the new reply
      fetchComments(user!.id);
      setReplyContent(prev => ({ ...prev, [commentId]: '' })); // Clear the reply input
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  if (loading || !user || comments.length === 0 || posts.length === 0) {
    return <div className="mt-12 w-[800px] text-center">Loading...</div>;
  }

  const renderComment = (comment: Comment) => (
    <div className="bg-white rounded-lg shadow-xl p-4 mb-4" key={comment.id}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Image
            src={user?.image || "/default-avatar.jpg"}
            alt="User Avatar"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">{user?.full_name}</h2>
            <span className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</span>
          </div>
          <p className="mt-2 text-gray-800">{comment.comment}</p>
          <p className="mt-2 text-gray-800">Post: {getPostTitle(comment.post)}</p>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            {comment.replies.map(renderComment)}
            <div className="mt-2">
              <textarea
                value={replyContent[comment.id] || ''}
                onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                placeholder="Write your reply..."
                className="w-full border rounded p-2"
              />
              <button
                onClick={() => handleReplySubmit(comment.id, comment.post)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-12 w-[800px]">
      <h1 className="mb-7 text-2xl font-semibold text-gray-800">Comments</h1>
      <div className="mt-8 space-y-8">
        {comments.map(renderComment)}
      </div>
    </div>
  );

  function getPostTitle(postId: number): string {
    const post = posts.find(post => post.id === postId);
    return post ? post.title : 'Unknown Post';
  }
};

export default UserComments;

















