"user client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchWithToken } from './utils';

interface Profile {
  id: number;
  user: number;
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

interface Comment {
  id: number;
  name: string;
  date: string;
  comment: string;
  user: Profile;
}

interface Props {
  postId: number;
  user: Profile; // Receive user prop
}

const Comments: React.FC<Props> = ({ postId, user }) => {
  const [status, setStatus] = useState("authenticated"); // Mock status for demonstration
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/comments/?post_id=${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data: { results: Comment[] } = await response.json();
      setComments(data.results);
      console.log(data)
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      // Fetch user details including email
      const userDetailsResponse = await fetchWithToken(`http://127.0.0.1:8000/user/${user.id}/`);
      if (!userDetailsResponse.ok) {
        throw new Error('Failed to fetch user details');
      }
      const userDetails = await userDetailsResponse.json();
      const userEmail = userDetails.email; // Assuming the email is at userDetails.email
  
      // Submit comment
      const response = await fetchWithToken(`http://127.0.0.1:8000/comments/create/${postId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newComment,
          user_id: user.id,
          name: user.full_name,
          email: userEmail, // Use fetched email
          post: postId, // Convert postId to integer for pk value
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

  return (
<div className="mt-12 w-[800px]">
  <h1 className="mb-7 text-slate-700">Comments</h1>
  {status === 'authenticated' ? (
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
        {comments.map((comment) => (
          <div className="mb-12" key={comment.id}>
            <div className="flex items-center gap-5 mb-5">
              <Image
                src={user.image || "/default-avatar.jpg"}
                alt="commentimage"
                width={50}
                height={50}
                className="rounded-[50%] w-[50px] h-[50px] object-cover"
              />
              <div className="flex flex-col gap-1 text-slate-500">
                <span className="font-medium">{user.full_name}</span>
                <span className="text-sm">{new Date(comment.date).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="text-l font-light">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;


