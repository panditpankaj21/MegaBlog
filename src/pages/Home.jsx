import { useEffect, useState } from "react";
import databaseService from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import {Container, PostCard} from "../components/index"
import { useSelector } from "react-redux";
import {Loading} from "../components/index";

function Home(){
    const [posts, setPosts] = useState([])
    const isUser = useSelector(state => state.auth.status)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        databaseService.getPosts([])
        .then((posts) => {
            console.log(posts) 
            if(posts){
                setPosts(posts.documents)
            }
        })
        .finally(()=>{
            setLoading(false)
        })
    }, [])

    

    if(!isUser){
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

    if(loading){
        return <Loading />
    }


    if(isUser && posts.length === 0){
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                No Posts Yet
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
                <div className="container mx-auto p-4 flex flex-wrap justify-center">
                    {
                        posts.map((post)=>(
                            <div key={post.$id} className="p-2 w-1/4">
                                <PostCard post={post} />
                            </div>
                        ))
                    }
                </div>
            </Container>
        </div>
    )
}
export default Home;