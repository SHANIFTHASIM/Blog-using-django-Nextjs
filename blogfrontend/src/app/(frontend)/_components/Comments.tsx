"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchWithToken } from './utils';

interface Comment {
  id: number;
  user: string; // User's email instead of ID
  post: number;
  comment: string;
  date: string;
}

interface Profile {
  id: number;
  user: number; // You might not need this if using email
  full_name: string;
  image: string;
  email: string; // Add email to the profile
}

interface Props {
  postId: number;
  user: Profile | null; // Receive user data from PostPage
}

const Comments: React.FC<Props> = ({ postId, user }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
    fetchProfiles();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/comments/list/?post_id=${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data: { results: Comment[] } = await response.json();
      setComments(data.results);
    } catch (error) {
      console.error('Error fetching comments:', error);
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
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) return; // Don't allow submitting if user is not logged in

    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newComment,
          post_id: postId,
        }),
      });

      if (response.ok) {
        fetchComments(); // Refresh comments after successful submission
        setNewComment(""); // Clear the input field
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-12 w-[800px]">
      <h1 className="mb-7 text-slate-700">Comments</h1>
      {user ? (
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <textarea
            placeholder="Write a comment..."
            className="p-5 w-full border-2 border-slate-900"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="px-4 py-5 text-white font-bold border-none rounded-md cursor-pointer bg-slate-900"
            onClick={handleCommentSubmit}
          >
            Send
          </button>
        </div>
      ) : (
        <Link href="/login">Login to write a comment</Link>
      )}
      <div className="mt-12">
        {comments.map((comment) => {
          // Find the profile by email
          const profile = profiles.find(profile => profile.email === comment.user);
          return (
            <div className="mb-12" key={comment.id}>
              <div className="flex items-center gap-5 mb-5">
                <Image
                  src={profile?.image || "/default-avatar.jpg"}
                  alt="comment image"
                  width={50}
                  height={50}
                  className="rounded-[50%] w-[50px] h-[50px] object-cover"
                />
                <div className="flex flex-col gap-1 text-slate-500">
                  <span className="font-medium">{comment.user || "Unknown User"}</span>
                  <span className="text-sm">{new Date(comment.date).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-l font-light">{comment.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;






