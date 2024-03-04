import { Link } from "react-router-dom"
import databaseService from "../appwrite/config"

function PostCard({post}){
    return (
        <Link to={`/post/${post.$id}`}>
            <div className="w-full bg-gray-100 rounded-xl p-4">
                <div className=" w-full justify-center mb-4">
                    <img 
                        src={databaseService.getFilePreview(post.featuredImage)} 
                        alt={post.title}
                        className="rounded-xl"
                    />
                </div>
                <h2
                    className="text-xl font-bold"
                >
                    {post.title}
                </h2>
            </div>
        </Link>
    )
}

export default PostCard