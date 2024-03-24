import { useState } from "react";
import { useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri";
import databaseService from "../appwrite/config";
import relativeTime from "../computation/relativeTime";

function ReplyCard({reply}){
    const [hovered, setHovered] = useState(false);
    const user = useSelector(state => state.auth.userData);
    const time = relativeTime(reply.$createdAt)

    const handleDeleteReply = async()=>{
        const deleteReply = await databaseService.deleteReply(reply.$id);
        if(deleteReply){
            console.log("reply deleted");
        }
        else{
            console.log("reply not deleted");
        }
    }

    return(
        <div className="flex items-start mt-2">
            <img
            className="w-8 h-15 rounded-full mr-4"
            src="https://cdn-icons-png.freepik.com/256/1077/1077114.png"
            alt="Profile"
            />
            <div 
                className="bg-gray-100 rounded-md p-2 relative"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="flex items-center gap-2">
                    <p className="font-semibold">@{reply.username}</p>
                    <p className="text-gray-500 text-xs">{time}</p> 
                
                </div>
             
            
            <div className="flex gap-5">
                <p className="text-gray-700">{reply.reply}</p>
                {hovered && user.userData.$id===reply.userId && (
                    <RiDeleteBin5Line 
                        className="cursor-pointer text-red-700 text-xl"
                        onClick={handleDeleteReply}
                    />
                )}
            </div>
            </div>
        </div>
    )
}
export default ReplyCard;