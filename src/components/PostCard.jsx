import React, { useState } from 'react';
import { Link } from "react-router-dom"
import databaseService from "../appwrite/config"
import relativeTime from "../computation/relativeTime"
import { FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';

function PostCard({ post }) { 
    const time = relativeTime(post.$createdAt);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const handleLikeClick = () => {
        setLiked(!liked);
        // Add logic to update like count in the database
    };

    const handleDislikeClick = () => {
        setDisliked(!disliked);
        // Add logic to update dislike count in the database
    };

    return (
        <>
            <div className="max-w-xs mx-auto bg-white rounded-xl overflow-hidden shadow-lg mb-4 transition duration-300 transform hover:scale-105">
                <Link to={`/post/${post.$id}`}>
                    <img className="w-full h-40 object-cover" src={databaseService.getFilePreview(post.featuredImage)} alt="Post" />
                </Link>
                
                <div className="p-4">
                    <div className="font-semibold text-xl mb-2 transform hover:rotate-3 transition-transform">{post.title}</div>
                    {/* <div className="flex gap-4 items-center">
                        <button className="flex items-center text-gray-500 text-sm" onClick={handleLikeClick}>
                            <FaThumbsUp className={`mr-1 ${liked ? 'text-blue-500' : ''}`} />
                            <span>{post.likes || 0}</span>
                        </button>
                        <button className="flex items-center text-gray-500 text-sm" onClick={handleDislikeClick}>
                            <FaThumbsDown className={`mr-1 ${disliked ? 'text-blue-500' : ''}`} />
                            <span>{post.dislikes || 0}</span>
                        </button>
                        <div className="flex items-center text-gray-500 text-sm">
                            <FaComment className="mr-1" />
                            <span>{post.comments || 0}</span>
                        </div>
                    </div> */}
                    <div className="mt-4 text-gray-500 text-sm">{time}</div>
                </div>
            </div>
        </>
    );
}

export default PostCard;
