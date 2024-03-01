import { useEffect, useState } from "react";
import {Container, PostCard} from "../components/index";
import databaseService from "../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";


function EditPost(){
    const [posts, setPosts] = useState([]);
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        if(slug){
            databaseService.getPost(slug)
            .then((post)=>{
                if(post){
                    setPosts(post)
                }else{
                    navigate('/')
                }
            })
        }
    }, [slug, navigate])
    return posts ? (
        <div className="py-8">
            <Container>
                <PostCard post={posts} />
            </Container>
        </div>
    ) : null
}
export default EditPost;