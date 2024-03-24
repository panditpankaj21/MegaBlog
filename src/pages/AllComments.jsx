import { useState, useEffect } from 'react'
import databaseService from "../appwrite/config"
import {Comment} from "../components/index"

export default function AllComments({post}){
    const [allComments, setAllComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        setLoading(true);
        databaseService.getAllComments({postId: post.$id})
        .then((res)=>{
            setAllComments(res)
        })
        .catch((err)=>{
            console.log(err)
        })
        .finally(()=>{
            setLoading(false);
        })
    }, [])

    if(loading) return (
        <div>
            <h1>Loding</h1>
        </div>
    )

    const comments = allComments.map((comment, index)=>{
        return <Comment 
        key={comment.$id}
        content={comment.comment}
        postId = {comment.postId}
        userId={comment.userId}
        postOwnerId={comment.postOwnerId}
        username={comment.username}
        createdAt={comment.$createdAt}
        commentId = {comment.$id}
        />
    })

    
// {comment: 'nice', username: 'one', postId: 'my-car', $id: 'rr_4c8xDBdft--8kt-i8U', $createdAt: '2024-03-21T17:02:35.012+00:00', …}

    return(
        <div>
           {comments.length > 0 ? comments : "No comments yet"}
        </div>
    )
}