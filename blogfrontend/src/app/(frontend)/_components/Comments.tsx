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
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});

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
      const data = await response.json();
      setComments(data.results || []); // Ensure data.results is set as comments
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);  // Ensure comments is an array even if fetching fails
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

  const toggleReplies = (commentId: number) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderComment = (comment: Comment, isNested: boolean = false) => {
    const profile = profiles.find(profile => profile.email === comment.user);
    return (
      <div className={`mb-6 ${isNested ? 'ml-6 border-l-2 border-slate-200' : ''}`} key={comment.id}>
        <div className="flex items-start gap-3 mb-2">
          <Image
            src={profile?.image || "/default-avatar.jpg"}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col gap-1 text-slate-500">
            <span className="font-medium">{profile?.full_name || comment.user || "Unknown User"}</span>
            <span className="text-sm">{new Date(comment.date).toLocaleDateString()}</span>
            <p className="text-base font-light">{comment.comment}</p>

            {user && (
              <div className="mt-1">
                {activeReply === comment.id ? (
                  <div>
                    <textarea
                      placeholder="Write a reply..."
                      className="p-2 w-full border-2 border-slate-900"
                      value={replyContent[comment.id] || ""}
                      onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                    />
                    <div className="flex gap-2 mt-1">
                      <button
                        className="px-3 py-2 text-white font-bold border-none rounded-md cursor-pointer bg-slate-900"
                        onClick={() => handleReplySubmit(comment.id)}
                      >
                        Submit
                      </button>
                      <button
                        className="px-3 py-2 text-white font-bold border-none rounded-md cursor-pointer bg-gray-600"
                        onClick={() => setActiveReply(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="mt-2 text-sm font-bold text-slate-900"
                    onClick={() => setActiveReply(comment.id)}
                  >
                    Reply
                  </button>
                )}
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <button
                className="mt-2 text-sm font-bold text-slate-900"
                onClick={() => toggleReplies(comment.id)}
              >
                {showReplies[comment.id] ? 'Hide Replies' : `View Replies (${comment.replies.length})`}
              </button>
            )}
          </div>
        </div>

        {showReplies[comment.id] && (
          <div className="pl-6">
            {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-12 w-full max-w-2xl">
      <h1 className="mb-7 text-slate-700 text-xl font-semibold">Comments</h1>
      {user ? (
        <div className="flex flex-col items-start gap-4">
          <textarea
            placeholder="Write a comment..."
            className="p-4 w-full border-2 border-slate-900 rounded-md"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="px-4 py-2 text-white font-bold border-none rounded-md cursor-pointer bg-slate-900"
            onClick={handleCommentSubmit}
          >
            Send
          </button>
        </div>
      ) : (
        <Link href="/login">
          <a className="text-blue-500 hover:underline">Login to write a comment</a>
        </Link>
      )}
      <div className="mt-8">
        {Array.isArray(comments) && comments.filter(comment => comment.parent_comment === null).map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default Comments;













