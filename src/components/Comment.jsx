import React, { useEffect, useState } from 'react';
import relativeTime from '../computation/relativeTime';
import { BsThreeDotsVertical } from "react-icons/bs";
import authService from "../appwrite/auth"
import databaseService from "../appwrite/config"
import { useSelector } from 'react-redux';

const Comment = ({ username, content, createdAt, postOwnerId, postId, userId, commentId }) => {
  const [isPostOwner, setIsPostOwner] = useState(false );
  const [currUser, setCurrUser] = useState(null);
  const user = useSelector((state) => state.auth.userData);
  const [showDropdown, setShowDropdown] = useState(false);
  const time = relativeTime(createdAt);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    if(user.userData.$id === postOwnerId){
      setIsPostOwner(true)
    }
    if(user.userData.$id === userId){
      setCurrUser(true)
    }
  }, []);
  
  
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEdit = () => {
    setEditMode(true);
  };
  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };
  const handleCancelEdit = () => {
    setEditedContent(content);
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    try {
      await databaseService.updateComment(commentId, editedContent);
      console.log("Comment updated");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    const deleteComment = await databaseService.deleteComment(commentId)
    if(deleteComment){
      console.log("Comment deleted");
    }else{
      console.log("Comment not deleted");
    }
  };

  return (
    <div className="flex pl-4 p-5 relative hover:bg-gray-300">
      <img
        className="w-7 h-8 rounded-full mr-4"
        src="https://cdn-icons-png.freepik.com/256/1077/1077114.png"
        alt={`${username}'s profile`}
      />
      <div className=" ">
        <p className="font-semibold ">
          @{username}
          <span className=' text-gray-700 text-xs ml-1 mr-7'> 
            {time}
          </span>
          
          {(isPostOwner || currUser) && (<BsThreeDotsVertical  
            className='pointer ml-5 absolute right-10 top-1 cursor-pointer'
            onClick={handleDropdownToggle}
          />)}
          
        </p>
        { showDropdown &&  (<div 
              className="absolute font-semibold right-14 top-0 bg-white border border-gray-300 rounded shadow-lg"
            >
              {currUser && (<button 
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" 
                onClick={handleEdit}
              >
                Edit
              </button>)}
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" 
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>)
        }
        {editMode ? (
          <textarea
            className="w-full border border-gray-300 rounded p-2 mb-2"
            value={editedContent}
            onChange={handleContentChange}
          />
        ) : (
          <p>{content}</p>
        )}
        {editMode && (
              <>
                <button 
                  className="block w-1/2 text-center px-4 py-2 mb-2 font-bold text-sm hover:bg-blue-700 text-white rounded-lg bg-blue-600" 
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button 
                  className="block w-1/2 text-center font-bold px-4 py-2 text-sm hover:bg-red-700 rounded-lg text-white bg-red-600" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            )}
      </div>
    </div>
  );
};

export default Comment;
