"use client"


import { fetchWithToken } from '@/app/(frontend)/_components/utils';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import parse from 'html-react-parser';

interface Post {
    id: number;
    slug:string;
    title: string;
    description: string;
    views: number;
    likes_count: number;
    is_liked: boolean;
    is_bookmarked: boolean;
    status: string;
    date: string;
    image: string | null;
}

const MyPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetchWithToken('http://127.0.0.1:8000/user/posts/');
                if (!response.ok) throw new Error('Error fetching posts');
                const data = await response.json();
                setPosts(data.results);
                console.log(data)
                setLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDelete = async (postId: string) => {
        try {
            const response = await fetchWithToken(`http://127.0.0.1:8000/user/posts/${postId}/`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error deleting post');
            setPosts(posts.filter(post => post.slug !== postId));
            console.log(posts.filter(post => post.slug !== postId))
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-9">
            <h1 className="text-3xl font-bold mb-6">My Posts</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-slate-400">
                                <th className="px-4 py-2 border">Title</th>
                                <th className="px-4 py-2 border">Description</th>
                                <th className="px-4 py-2 border">Views</th>
                                <th className="px-4 py-2 border">Likes</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Date</th>
                                <th className="px-4 py-2 border">Image</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border">{post.title}</td>
                                    <td className="px-4 py-2 border">{parse(post.description)}</td>
                                    <td className="px-4 py-2 border">{post.views}</td>
                                    <td className="px-4 py-2 border">{post.likes_count}</td>
                                    <td className="px-4 py-2 border">{post.status}</td>
                                    <td className="px-4 py-2 border">{new Date(post.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border">
                                        {post.image ? (
                                            <Image src={post.image} alt={post.title} width={80} height={80} className="w-20 h-20 object-cover" />
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border flex space-x-2">
                                        <Link href={`/EditPost/${post.slug}`}>
                                            <p className="text-blue-500 hover:text-blue-700">
                                                <FiEdit />
                                            </p>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.slug)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyPosts;
