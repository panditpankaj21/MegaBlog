import React from 'react';
import { Link } from "react-router-dom"
import databaseService from "../appwrite/config"
import relativeTime from "../computation/relativeTime"

function PostCard({ post }) { 
    const time = relativeTime(post.$createdAt)
    return (
        <Link to={`/post/${post.$id}`}>
            <div className="max-w-xs mx-auto bg-white rounded-xl overflow-hidden shadow-lg mb-4 transition duration-300 transform hover:scale-105">
                <img className="w-full h-40 object-cover" src={databaseService.getFilePreview(post.featuredImage)} alt="Post" />
                <div className="p-4">
                    <div className="font-semibold text-xl mb-2 transform hover:rotate-3 transition-transform">{post.title}</div>
                    {/* <p className="text-gray-700 text-base">
                        {description.length > 200
                            ? `${description.substring(0, 200)}...`
                            : description}
                    </p> */}
                    <div className="mt-4 text-gray-500 text-sm">{time}</div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard;
