import React from 'react';
import { formatDistanceToNow } from "date-fns";
import { Link } from 'react-router-dom';
import { MessageCircle, Share2, ThumbsUp, Trash2 } from 'lucide-react';
import PostAction from '../PostAction/PostAction';


const Post = ({ post, data }) => {
    // console.log('data', data)
    // console.log('post', post)
    const isOwner = data._id === post.author._id;

    return (
        <div className='bg-white rounded-lg shadow mb-4'>
            <div className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                        <Link to={`/profile/${post?.author?.username}`}>
                            <img
                                src={post.author.profilePicture || "/avatar.png"}
                                alt={post.author.name}
                                className='size-10 rounded-full mr-3'
                            />
                        </Link>


                        <div>

                            <p className='text-xs text-info'>{post.author.headline}</p>
                            <p className='text-xs text-info'>
                                {/* {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })} */}
                                {new Date() - new Date(post.createdAt) < 60000
                                    ? "Just now"
                                    : formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    {isOwner && (
                        <button className='text-red-500 hover:text-red-700'>
                            <Trash2 size={18} />
                        </button>
                    )}

                </div>
                <p className='mb-4'>{post.content}</p>
                {post.image && <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4' />}

                <div className='flex justify-between text-info'>
                    <PostAction
                        icon={<ThumbsUp size={18} className={"text-blue-500 "} />}
                        text={`Like (50M)`}
                        onClick={() => { }}
                    />

                    <PostAction
                        icon={<MessageCircle size={18} />}
                        text={`Comment (90M)`}
                        onClick={() => { }}
                    // onClick={() => setShowComments(!showComments)}
                    />
                    <PostAction icon={<Share2 size={18} />} text='Share' />
                </div>
            </div>


        </div >
    )
}

export default Post