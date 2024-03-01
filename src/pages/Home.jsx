import { useEffect, useState } from "react";
import databaseService from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import {Container, PostCard} from "../components/index"

function Home(){
    const [posts, setPosts] = useState([])

    useEffect(() => {
        databaseService.getPosts()
        .then((posts) => {
            if(posts){
                setPosts(posts)
            }
        })
    }, [])

    if(posts.length === 0){
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read Posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return(
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {
                        posts.map((post)=>(
                            <div key={post.$id} className="p-2 w-1/4">
                                <PostCard {...post} />
                            </div>
                        ))
                    }
                </div>
            </Container>
        </div>
    )
}
export default Home;