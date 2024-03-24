import React, { useEffect, useState } from 'react';
import relativeTime from '../computation/relativeTime';
import { BsThreeDotsVertical } from "react-icons/bs";
import databaseService from "../appwrite/config";
import { useSelector } from 'react-redux';
import ReplyCard from './ReplyCard';
import { set } from 'react-hook-form';

const Comment = ({ username, content, createdAt, postOwnerId, postId, userId, commentId }) => {
  const [isPostOwner, setIsPostOwner] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const user = useSelector((state) => state.auth.userData);
  const [showDropdown, setShowDropdown] = useState(false);
  const time = relativeTime(createdAt);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [replyMode, setReplyMode] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState([]);
  const [isSave, setIsSave] = useState(false);

  useEffect(() => {
    if(user.userData.$id === postOwnerId){
      setIsPostOwner(true)
    }
    if(user.userData.$id === userId){
      setCurrUser(true)
    }

    databaseService.getReplyByCommentId(commentId)
    .then((response) => {
        setReplies(response);
    })
    .catch((error) => {
        console.log("Appwrite serive :: getReplyByCommentId :: error", error);
    })
  }, [isSave]);

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
      setEditMode(false);
      setIsSave(prev => !prev)
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    setShowDropdown(false);
    const deleteComment = await databaseService.deleteComment(commentId);
    if(deleteComment){
      console.log("Comment deleted");
    } else {
      console.log("Comment not deleted");
    }
    setIsSave(prev => !prev)
  };

  const handleReply = () => {
    setReplyMode(true);
    setShowDropdown(false)
  };

  const handleReplyContentChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleCancelReply = () => {
    setReplyContent("");
    setReplyMode(false);
  };

  const handleSaveReply = async () => {
    try {
      await databaseService.addReply(commentId, replyContent);
      setReplyContent("");
      setReplyMode(false);
      setIsSave(prev => !prev)
    } 
    catch (error) {
      console.error("Error saving reply:", error);
    }
  };

  return (
    <div className="flex items-start p-4 relative rounded-lg  bg-gray-200">
      <img
        className="w-8 h-15 rounded-full mr-4 "
        src="https://cdn-icons-png.freepik.com/256/1077/1077114.png"
        alt={`${username}'s profile`}
      />
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center">
          <div className='flex items-center gap-2'>
            <p 
              className=" text-gray-800 font-bold">
                @{username}
            </p>
            <p 
              className='font-light text-gray-500 text-xs'>
                {time}
            </p>
          </div>
          
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
              <button 
                className="block px-4 py-2 w-full text-sm text-gray-800 hover:bg-gray-100"
                onClick={handleReply}
              >
                Reply
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
          <p className="text-gray-700">{content}</p>
        )}
        

        {editMode && (
          <div className="flex justify-end mt-2 font-bold">
            <button 
              className="px-4 py-2 mr-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-            600"
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
        {replyMode && (
          <>
          <div className="flex items-start mt-2">
            <img
              className="w-8 h-15 rounded-full mr-2"
              src="https://cdn-icons-png.freepik.com/256/1077/1077114.png"
              alt="Profile"
            />
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={handleReplyContentChange}
            />
          </div>
          <div className="flex justify-end mt-2 font-bold">
            <button 
              className="px-4 py-2 mr-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={handleSaveReply}
            >
              Save
            </button>
            <button 
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              onClick={handleCancelReply}
            >
              Cancel
            </button>
        </div>
        </>
        )}
        {replies.map((reply, index) => (
          <ReplyCard key={index} reply={reply}/>
        ))}
      </div>
    </div>
  );
};

export default Comment;

