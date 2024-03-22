import { useState } from 'react'
import databaseService from "../../appwrite/config"

function CommentForm({post}){
  console.log(post)
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!comment){
            return alert('Please enter a comment')
        }
        const res = await databaseService.addComment(post.$id, comment, post.userId)
        setComment('')
    }

    return(
    <form 
        onSubmit={handleSubmit} 
        className="mb-4 flex items-center"
    >
      <input
        type="text"
        placeholder="Add a comment"
        className="border border-gray-300 rounded-l-lg p-2 w-1/4
        ml-2"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
      >
        Post
      </button>
    </form>
    )
}

export default CommentForm;