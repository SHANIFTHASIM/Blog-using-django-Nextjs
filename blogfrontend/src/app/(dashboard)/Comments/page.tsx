"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchWithToken } from '@/app/(frontend)/_components/utils';

interface Profile {
  id: number;
  full_name: string;
  image: string;
  email: string;
}

interface Comment {
  id: number;
  date: string;
  comment: string;
  post: number;
  parent_comment: number | null;
  replies: Comment[];
  user: string;
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
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
  const [showReply, setShowReply] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchUserDetails();
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (user) {
      fetchComments();
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

  const fetchComments = async () => {
    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/comments/user_posts/`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data: Comment[] = await response.json();
      setComments(data);
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

  const fetchProfiles = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/profiles/`);
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.results);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
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
      fetchComments();
      setReplyContent(prev => ({ ...prev, [commentId]: '' })); // Clear the reply input
      setShowReply(prev => ({ ...prev, [commentId]: false })); // Hide the reply input
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const toggleReplyInput = (commentId: number) => {
    setShowReply(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  if (loading || !user) {
    return <div className="mt-12 w-[800px] text-center">Loading...</div>;
  }

  // Filter out replies from top-level comments
  const topLevelComments = comments.filter(comment => comment.parent_comment === null);

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const profile = profiles.find(profile => profile.email === comment.user);
    return (
      <div
        className={`bg-white rounded-lg shadow-xl p-4 mb-4 ${isReply ? 'ml-12 border-l-4 border-gray-300' : ''}`}
        key={comment.id}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Image
              src={profile?.image || "/default-avatar.jpg"}
              alt="User Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-900">{profile?.full_name || "Unknown User"}</h2>
              <span className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-gray-800">{comment.comment}</p>
            {!isReply && <p className="mt-2 text-gray-800">Post: {getPostTitle(comment.post)}</p>}
            <div className="mt-4">
              {!isReply && (
                <button
                  onClick={() => toggleReplyInput(comment.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {showReply[comment.id] ? 'Cancel' : 'Reply'}
                </button>
              )}
              {showReply[comment.id] && (
                <div className="mt-2 pl-4 border-l-2 border-gray-200">
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
              )}
            </div>
            <div className="mt-4 pl-4 border-l-2 border-gray-200">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12 w-[800px]">
      <h1 className="mb-7 text-2xl font-semibold text-gray-800">Comments</h1>
      <div className="mt-8 space-y-8">
        {Array.isArray(topLevelComments) && topLevelComments.map(comment => renderComment(comment))}
      </div>
    </div>
  );

  function getPostTitle(postId: number): string {
    const post = posts.find(post => post.id === postId);
    return post ? post.title : 'Unknown Post';
  }
};

export default UserComments;


























