"use client";

import { fetchWithToken } from '@/app/(frontend)/_components/utils';
import Image from 'next/image';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    username: string;
    full_name: string;
    email: string; // Add email here
}

interface Profile {
    id: number;
    user: number; // Change to number to hold the user ID
    full_name: string;
    bio: string;
    about: string;
    country: string;
    facebook: string;
    twitter: string;
    image: string;
    author: boolean;
    date: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            try {
                // Fetch logged-in user's profile
                const profileResponse = await fetchWithToken('http://127.0.0.1:8000/profile/');
                if (!profileResponse.ok) throw new Error('Error fetching profile');
                const profileData = await profileResponse.json();
                setProfile(profileData);

                // Fetch logged-in user's data based on their ID
                const userResponse = await fetchWithToken(`http://127.0.0.1:8000/user/${profileData.user}/`);
                if (!userResponse.ok) throw new Error('Error fetching user data');
                const userData = await userResponse.json();
                setUser(userData);

                setLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        fetchUserAndProfile();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (profile) {
            setProfile({
                ...profile,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (profile) {
                formData.append('user', profile.user.toString()); // Include the user ID
                formData.append('full_name', profile.full_name);
                formData.append('bio', profile.bio);
                formData.append('about', profile.about);
                formData.append('country', profile.country);
                formData.append('facebook', profile.facebook);
                formData.append('twitter', profile.twitter);
                if (imageFile) {
                    formData.append('image', imageFile);
                }
            }
    
            const response = await fetchWithToken('http://127.0.0.1:8000/profile/edit/', {
                method: 'PUT',
                body: formData,
                headers: {} // Don't set Content-Type for multipart/form-data
            });
    
            if (!response.ok) throw new Error('Error updating profile');
            setEditMode(false);
            alert('Profile updated successfully');
            router.refresh(); // Refresh the page
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading profile: {error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-2xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Profile</h1>
        {profile && user ? (
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <div className="flex items-center space-x-4">
                    <div className="relative w-24 h-24">
                        <Image
                            src={profile.image}
                            layout="fill"
                            objectFit="cover"
                            alt="Profile"
                            className="rounded-full border-4 border-indigo-600 shadow-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">{profile.full_name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-600">Username: {user.username}</p>
                    </div>
                </div>
                {editMode && (
                    <div>
                        <label className="block text-gray-700 font-semibold">Change Profile Picture</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-gray-700 font-semibold">Bio</label>
                    <textarea
                        name="bio"
                        value={profile.bio || ''}
                        onChange={handleChange}
                        readOnly={!editMode}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                            !editMode ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold">About</label>
                    <textarea
                        name="about"
                        value={profile.about || ''}
                        onChange={handleChange}
                        readOnly={!editMode}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                            !editMode ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={profile.country || ''}
                        onChange={handleChange}
                        readOnly={!editMode}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                            !editMode ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold">Facebook</label>
                    <input
                        type="text"
                        name="facebook"
                        value={profile.facebook || ''}
                        onChange={handleChange}
                        readOnly={!editMode}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                            !editMode ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold">Twitter</label>
                    <input
                        type="text"
                        name="twitter"
                        value={profile.twitter || ''}
                        onChange={handleChange}
                        readOnly={!editMode}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                            !editMode ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={toggleEditMode}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {editMode ? 'Cancel' : 'Edit'}
                    </button>
                    {editMode && (
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Save
                        </button>
                    )}
                </div>
            </form>
        ) : (
            <p className="text-center mt-4 text-gray-600">Profile data not available.</p>
        )}
    </div>
    );
};

export default Profile;








































