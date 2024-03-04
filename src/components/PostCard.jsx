import { Link } from "react-router-dom"
import databaseService from "../appwrite/config"

function PostCard(props){
    return (
        <Link to={`/post/${props.post.$id}`}>
            <div className="w-full bg-gray-100 rounded-xl p-4">
                <div className=" w-full justify-center mb-4">
                    <img 
                        src={databaseService.getFilePreview(props.post.featuredImage)} 
                        alt={props.post.title}
                        className="rounded-xl"
                    />
                </div>
                <h2
                    className="text-xl font-bold"
                >
                    {props.post.title}
                </h2>
            </div>
        </Link>
    )
}

export default PostCard