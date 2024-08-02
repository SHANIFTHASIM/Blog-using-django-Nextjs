"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchWithToken } from './utils';

interface Comment {
  id: number;
  user: string;
  post: number;
  comment: string;
  date: string;
  parent_comment: number | null;
  replies?: Comment[];
}

interface Profile {
  id: number;
  user: number;
  full_name: string;
  image: string;
  email: string;
}

interface Props {
  postId: number;
  user: Profile | null;
}

const Comments: React.FC<Props> = ({ postId, user }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReply, setActiveReply] = useState<number | null>(null);

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
    if (!user) return;

    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newComment,
          post: postId,
          parent_comment: null
        }),
      });

      if (response.ok) {
        fetchComments();
        setNewComment("");
      } else {
        const errorData = await response.json();
        console.error('Failed to submit comment:', errorData.message);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleReplySubmit = async (commentId: number) => {
    if (!user || !replyContent[commentId]) return;

    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: replyContent[commentId],
          post: postId,
          parent_comment: commentId
        }),
      });

      if (response.ok) {
        fetchComments();
        setReplyContent(prev => ({ ...prev, [commentId]: "" }));
        setActiveReply(null); // Close the reply form after submitting
      } else {
        const errorData = await response.json();
        console.error('Failed to submit reply:', errorData.message);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleReplyChange = (commentId: number, content: string) => {
    setReplyContent(prev => ({ ...prev, [commentId]: content }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderComment = (comment: Comment) => {
    const profile = profiles.find(profile => profile.email === comment.user);
    return (
      <div className="mb-12" key={comment.id}>
        <div className="flex items-center gap-5 mb-5">
          <Image
            src={profile?.image || "/default-avatar.jpg"}
            alt="User Avatar"
            width={50}
            height={50}
            className="rounded-full w-[50px] h-[50px] object-cover"
          />
          <div className="flex flex-col gap-1 text-slate-500">
            <span className="font-medium">{profile?.full_name || comment.user || "Unknown User"}</span>
            <span className="text-sm">{new Date(comment.date).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="text-l font-light">{comment.comment}</p>

        {user && (
          <div className="mt-2">
            {activeReply === comment.id ? (
              <div>
                <textarea
                  placeholder="Write a reply..."
                  className="p-2 w-full border-2 border-slate-900"
                  value={replyContent[comment.id] || ""}
                  onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                />
                <button
                  className="mt-2 mr-2 px-4 py-2 text-white font-bold border-none rounded-md cursor-pointer bg-slate-900"
                  onClick={() => handleReplySubmit(comment.id)}
                >
                  Submit
                </button>
                <button
                  className="mt-2 px-4 py-2 text-white font-bold border-none rounded-md cursor-pointer bg-gray-600"
                  onClick={() => setActiveReply(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="mt-2 px-4 py-2 text-white font-bold border-none rounded-md cursor-pointer bg-slate-900"
                onClick={() => setActiveReply(comment.id)}
              >
                Reply
              </button>
            )}
          </div>
        )}

        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          {comment.replies && comment.replies.map(renderComment)}
        </div>
      </div>
    );
  };

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
        {comments.filter(comment => comment.parent_comment === null).map(renderComment)}
      </div>
    </div>
  );
};

export default Comments;









