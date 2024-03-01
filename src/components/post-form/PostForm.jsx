import { useCallback, useEffect } from "react"
import { useForm} from "react-hook-form"
import {Button, RTE, Input, Select} from '../index'
import databaseService from "../../appwrite/config"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"



function PostForm({post}){

    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues:{
            title: post?.title || '',
            slug: post?.title || '',
            content: post?.title || '',
            status: post?.status || 'active',
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.user.userData)

    const submit = async(data) => {
        if(post){
            const file = data.image[0] ? databaseService.uploadFile(data.image[0]) : null

            if(file){
                databaseService.deleteFile(post.featuredImage)
            }

            const dbPost = await databaseService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            })

            if(dbPost){
                navigate(`/post/${dbPost}`)
            }

        }else{
            const file = data.image[0] ? databaseService.uploadFile(data.image[0]) : null

            if(file){
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await databaseService.createPost({
                    ...data,
                    userId: userData.$id,
                })

                if(dbPost){
                    navigate(`/post/${dbPost}`)
                }
            }

        }
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string')
        return value
            .trim()
            .toLowerCase()
            .replace(/\s/g, '-')
    }, [])

    useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name === 'title'){
                setValue('slug', slugTransform(value.title, {shouldValidate: true}))
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [watch, slugTransform, setValue])

    return(
        <form onSubmit={handleSubmit(submit)} className="
        flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title: "
                    placeholder= "Title"
                    className="mb-4"
                    {...register("title", {required: true})}
                />
                <Input
                    label="Slug: "
                    placeholder= "Slug"
                    className="mb-4"
                    {...register("slub", {required: true})}
                    onInput={
                        (e) => {
                            setValue("slug", slugTransform(e.target.value), {shouldValidate: true})
                        }
                    }
                />
                <RTE 
                    label="Content: "
                    name= "content"
                    control={control}
                    defaultValue={getValues("content")}
                />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image: "
                    type='file'
                    className="mb-4"
                    accept= "image/png, image/jpg, image/jpeg, img/gif"
                    {...register("image", {required: !post})}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img 
                            src={databaseService.getFilePreview(post.featuredImage)} 
                            alt={post.title}
                            className="rounded-lg" 
                        />
                    </div>
                )}
                <Select
                    option={["active", "inactive"]}
                    label="status"
                    className="mb-4"
                    {...register("status", {required: true})}
                />
                <Button 
                    type="submit"
                    bgColor={post? "bg-green-500" : undefined}
                    className="w-full"
                >
                    {post ? "Update": "Submit"}
                </Button>
            </div>

        </form>
    )
}
export default PostForm