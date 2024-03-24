import { nanoid } from '@reduxjs/toolkit';
import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";
import authService from './auth.js';

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }


    //comments
    async addComment(postId, comment, postOwnerId){
        try {
            const userData = await authService.getCurrentUser()
            console.log(userData)
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentCollectionId,
                nanoid(),
                {
                    userId: userData.$id,
                    comment,
                    postId, 
                    postOwnerId,
                    username: userData.name, 
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updateComment :: error", error);
        }
    }

    async getAllComments({postId}){
        
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCommentCollectionId
            );
    
            // Filter documents based on postId
            const filteredComments = response.documents.filter(comment => comment.postId === postId);
            
            return filteredComments;

        } catch (error) {
            console.log("Appwrite serive :: getAllComments :: error", error);
        }
    }
    async deleteComment(commentId){
        try {
            //delete reply of related comment from database
            const listOfReplies = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteReplyCollectionId
            );
            const toDeleteList = listOfReplies.documents.filter(reply => reply.commentId === commentId)

            for (const reply of toDeleteList) {
                await this.databases.deleteDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteReplyCollectionId,
                    reply.$id
                )
            }
            
            //now delete comment from database
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentCollectionId,
                commentId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteComment :: error", error);
            return false
        }
    }

    async updateComment(commentId, comment){
        try {
            await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentCollectionId,
                commentId,
                {
                    comment
                }
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: updateComment :: error", error);
            return false
        }
    }

    async addReply(commentId, reply) {
        try {
            const userData = await authService.getCurrentUser();
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteReplyCollectionId,
                nanoid(),
                {
                    userId: userData.$id,
                    reply,
                    commentId,
                    username: userData.name,
                }
            );
        } catch (error) {
            console.log("Appwrite serive :: addReply :: error", error);
        }
    }

    async getReplyByCommentId(commentId){
        try{
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteReplyCollectionId
            );
            return response.documents.filter(reply => reply.commentId === commentId);
        }
        catch(error){
            console.log("Appwrite serive :: getReplyByCommentId :: error", error);
        }
    }
    async deleteReply(replyId){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteReplyCollectionId,
                replyId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteReply :: error", error);
            return false
        }
    }
}


const service = new Service()
export default service





























// import conf from "../conf/conf";
// import {ID, Client, Databases, Storage, Query} from "appwrite"

// export class Service{
//     client = new Client()
//     databases;
//     bucket;

//     constructor(){
//         this.client
//             .setEndpoint(conf.appwriteUrl)
//             .setProject(conf.appwriteProjectId);
//         this.databases = new Databases(this.client)
//         this.bucket = new Storage(this.client)
//     }

//     async createPost(userId, {title, slug, content, featuredImage, status}){
//         console.log(userId)
//         try {
//             return await this.databases.createDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {
//                     title,
//                     content,
//                     featuredImage,
//                     status,
//                     userId,
//                 }
//             )
//         } catch (error) {
//             console.log("Appwrite serive :: createPost :: error", error);
//         }
//     }

//     async updatePost(slug, {title, content, featuredImage, status}){
//          try {
//             return await this.databases.updateDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {
//                     title,
//                     content,
//                     featuredImage, 
//                     status,
//                 }
//             )
//          } catch (error) {
//             console.log("Appwrite servie :: updatePost :: error", error)
//          }
//     }

//     async deletPost(slug){
//         try{
//             await this.databases.deleteDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//             )
//             return true;
//         }
//         catch(error){
//             console.log("Appwrite servie :: deletePost :: error", error)
//             return false;
//         }
//     }

//     async getPost(slug){
//         try {
//             return await this.databases.getDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug, 
//             )
//         } catch (error) {
//             console.log("Appwrite servie :: getPost :: error", error)
//         }
//     }

//     async getPosts(queries = [Query.equal("status", "active")]){
//         try {
//             return await this.databases.listDocuments(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 queries,

//             )
//         } catch (error) {
//             console.log("Appwrite servie :: getPosts :: error", error)
//         }
//     }

//     async uploadFile(file){
//         try{
//             return await this.bucket.createFile(
//                 conf.appwriteBucketId,
//                 ID.unique(),
//                 file,
//             )
//         }catch(error){
//             console.log("Appwrite servie :: uploadFile :: error", error)
//             return false
//         }
//     }
    
//     async deleteFile(fileId){
//         try{
//             await this.bucket.deleteFile(
//                 conf.appwriteBucketId,
//                 fileId
//             )
//             return true
//         }catch{
//             console.log("Appwrite servie :: deleteFile :: error", error)
//             return false

//         }
//     }

//     getFilePreview(fileId){
//         return this.bucket.getFilePreview(
//             conf.appwriteBucketId,
//             fileId
//         )
//     }


// }

// const service = new Service();
// export default service;