import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { CommentForm } from "../components";
import AllComments from "./AllComments";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/all-posts");
            }
        });
    };

    return post ? (
        <div className="bg-gray-100 min-h-screen py-8">
            <Container>
                <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg relative">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="w-full h-auto object-cover"
                    />
                    {isAuthor && (
                        <div className="absolute top-0 right-0 mt-4 mr-4 flex space-x-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-2 px-3 py-1 rounded-md text-sm">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}
                            className="px-3 py-1 rounded-md text-sm"
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                    <div className="p-6">
                        <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
                        <div className="text-gray-700 prose">
                            {parse(post.content)}
                        </div>
                    </div>
                </div>
            </Container>
            <div className="mt-8">
                <CommentForm post={post} />
                <AllComments post={post} />
            </div>
        </div>
    ) : null;
}
