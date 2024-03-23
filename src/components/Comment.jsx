import React, { useEffect, useState } from 'react';
import relativeTime from '../computation/relativeTime';
import { BsThreeDotsVertical } from "react-icons/bs";
import authService from "../appwrite/auth"
import databaseService from "../appwrite/config"
import { useSelector } from 'react-redux';

const Comment = ({ username, content, createdAt, postOwnerId, postId, userId, commentId }) => {
  const [isPostOwner, setIsPostOwner] = useState(false);
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
    setShowDropdown(false); 
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
    setShowDropdown(false);
  };

  return (
    <div className="flex items-start p-4 relative hover:bg-gray-200 rounded-lg">
      <img
        className="w-10 h-10 rounded-full mr-4"
        src="https://cdn-icons-png.freepik.com/256/1077/1077114.png"
        alt={`${username}'s profile`}
      />
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800">
            @{username}
            <span className=' text-gray-600 text-xs ml-2'>
              {time}
            </span>
          </p>
          {(isPostOwner || currUser) && (
            <BsThreeDotsVertical  
              className='text-gray-500 cursor-pointer hover:text-gray-800'
              onClick={handleDropdownToggle}
            />
          )}
          { showDropdown &&  (
            <div className="absolute right-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg font-bold">
              {currUser && (
                <button 
                  className="block px-4 py-2 w-full text-sm text-gray-800 hover:bg-gray-100"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              )}
              <button 
                className="block px-4 py-2 w-full text-sm text-red-600 hover:bg-gray-100"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        {editMode ? (
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mt-2"
            value={editedContent}
            onChange={handleContentChange}
          />
        ) : (
          <p className="text-gray-700 mt-2">{content}</p>
        )}
        {editMode && (
          <div className="flex justify-end mt-2">
            <button 
              className="px-4 py-2 mr-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button 
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
