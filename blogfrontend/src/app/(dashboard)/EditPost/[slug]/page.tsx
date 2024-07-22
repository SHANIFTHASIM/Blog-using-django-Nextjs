// pages/EditPost.tsx
'use client';

// components/EditPost.tsx

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { IoMdAdd } from 'react-icons/io';
import { FaImage, FaVideo } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';
import { fetchWithToken } from '@/app/(frontend)/_components/utils';
import ProtectedRoute from '@/app/(frontend)/_components/ProtectedRoute';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Category {
  id: number;
  title: string;
  slug: string;
  post_count: number;
}

const EditPost = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [catId, setCatId] = useState<number | null>(null);
  const [status, setStatus] = useState("Active");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [featured, setFeatured] = useState<boolean>(false); // Added state for featured

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/categories/");
        const data = await res.json();
        setCategories(data.results);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPost = async () => {
      try {
        const res = await fetchWithToken(`http://127.0.0.1:8000/posts/${slug}/`);
        if (!res.ok) throw new Error('Error fetching post');
        const data = await res.json();
        setTitle(data.title);
        setValue(data.description);
        setCatId(data.category);
        setStatus(data.status);
        setImage(data.image);
        setFeatured(data.is_featured); // Set featured state from fetched post data
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchCategories();
    fetchPost();
  }, [slug]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", value);
    formData.append("status", status);
    if (file) {
      formData.append("image", file);
    }
    if (video) {
      formData.append("video", video);
    }
    if (catId) {
      formData.append("category", catId.toString());
    }
    formData.append("featured", featured.toString()); // Append featured boolean to form data

    let token = localStorage.getItem("access_token");

    const res = await fetchWithToken(`http://127.0.0.1:8000/posts/${slug}/edit/`, {
      method: "PUT",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/Posts`);
    } else {
      console.error('Error updating post:', await res.json());
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value).toLocaleString();
  };

  return (
    <ProtectedRoute>
      <div className="relative flex flex-col bg-gray-200 rounded-lg p-6">
        <input
          type="text"
          value={title}
          placeholder="Title"
          className="p-4 text-2xl border border-gray-300 rounded-md mb-4 outline-none bg-white text-gray-800 placeholder-gray-400"
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded-md mb-4 outline-none bg-white text-gray-800"
          value={catId || ""}
          onChange={(e) => setCatId(Number(e.target.value))}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>

        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
          className="mb-4"
        />

        <select
          className="p-2 border border-gray-300 rounded-md mb-4 outline-none bg-white text-gray-800"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Disabled">Disabled</option>
        </select>

        <div className="flex gap-5 relative mb-4">
          <button
            className="w-9 h-9 rounded-full bg-transparent border border-gray-800 flex items-center justify-center cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <IoMdAdd />
          </button>
          {open && (
            <div className="flex gap-5 p-2 absolute z-50 w-full left-12 border-gray-300 rounded-md">
              <input
                type="file"
                id="image"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                style={{ display: "none" }}
              />
              <button className="w-9 h-9 rounded-full bg-transparent border border-green-700 flex items-center justify-center cursor-pointer">
                <label htmlFor="image">
                  <FaImage />
                </label>
              </button>

              <input
                type="file"
                id="video"
                onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)}
                style={{ display: "none" }}
              />
              <button className="w-9 h-9 rounded-full bg-transparent border border-green-700 flex items-center justify-center cursor-pointer">
                <label htmlFor="video">
                  <FaVideo />
                </label>
              </button>
            </div>
          )}
        </div>

        {image && (
          <div className="mb-4">
            <img src={image} alt="Post image" className="w-20 h-20 object-cover rounded-md" />
          </div>
        )}

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="featured"
            className="mr-2"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Featured Post
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Publishing Date</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            onChange={handleDateChange}
          />
        </div>

        <button
          className="self-end px-4 py-2 bg-green-700 text-white cursor-pointer rounded-full"
          onClick={handleSubmit}
        >
          Publish
        </button>
      </div>
    </ProtectedRoute>
  );
};

export default EditPost;


