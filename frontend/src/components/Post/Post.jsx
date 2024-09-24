import { Link } from 'react-router-dom';
import { MessageCircle, Share2, ThumbsUp, Trash2 } from 'lucide-react';
import PostAction from '../PostAction/PostAction';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { Send, Loader } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";

const Post = ({ post, authUser, onDelete }) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState(post.comments || []); // Initialize with post.comments

    const isOwner = authUser._id === post.author._id;
    const token = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        setLikes(post.likes.length);
        setIsLiked(post.likes.includes(authUser._id));
    }, [post]);

    // Delete functionality
    const handleDeletePost = () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        const header = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/post/delete/${post._id}`, header)
            .then((res) => {
                toast.success(res.data.message);
                onDelete(post._id); // Call the callback to remove the post from UI
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Error deleting post');
            });
    };

    // Like/Unlike functionality
    const handleLikePost = () => {
        const header = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/post/${post._id}/like`, {}, header)
            .then((res) => {
                const updatedLikes = res.data.likes.length;
                setLikes(updatedLikes);
                setIsLiked(res.data.likes.includes(authUser._id));
                toast.success(res.data.message);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Error liking post');
            });
    };

    // Comment functionality
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const header = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/user/post/${post._id}/comment`,
            { content },  // Wrap content in an object
            header
        )
            .then((res) => {
                const newComment = res.data.comment; // Make sure new comment is returned from backend
                setComments((prevComments) => [...prevComments, newComment]); // Add the new comment to the list
                setContent('');  // Optionally clear the input after successful submission
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Error while adding comment');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Function to format dates for comments
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return "Invalid date"; // Handle invalid date
        }
        return formatDistanceToNow(date, { addSuffix: true });
    };

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
                            <Link to={`/profile/${post?.author?.username}`}>
                                <h3 className='font-semibold'>{post.author.name}</h3>
                            </Link>
                            <p className='text-xs text-info'>{post.author.headline}</p>
                            <p className='text-xs text-info'>
                                {new Date() - new Date(post?.createdAt) < 60000 ? "Just now"
                                    : formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    {isOwner && (
                        <button
                            onClick={handleDeletePost}
                            className='text-red-500 hover:text-red-700'>
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
                <p className='mb-4'>{post.content}</p>
                {post.image && <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4' />}
                <div className='flex justify-between text-info'>
                    {/* <PostAction
                        icon={isLiked ? (<AiFillLike size={25} className="text-blue-600" />) : (< ThumbsUp size={25} />)}
                        text={<div className={isLiked ? "text-[#1a71ff] font-bold" : "font-bold"}>Like ({likes})</div>}
                        onClick={handleLikePost}
                    /> */}
                    <PostAction
                        icon={
                            isLiked ? (
                                <AiFillLike size={25} className="text-blue-600" />
                            ) : (
                                <ThumbsUp size={25} />
                            )
                        }
                        text={
                            <div className={isLiked ? "text-blue-600 font-bold" : "font-bold"}>
                                Like ({likes})
                            </div>
                        }
                        onClick={handleLikePost}
                    />

                    <PostAction
                        icon={<MessageCircle size={18} />}
                        text={`Comment (${comments.length})`}  // Display the length of comments
                        onClick={() => setShowComments(!showComments)}
                    />
                    <PostAction icon={<Share2 size={18} />} text='Share' />
                </div>
            </div>
            {showComments && (
                <div className='px-4 pb-4'>
                    <div className='mb-4 max-h-60 overflow-y-auto'>
                        {comments.map((comment) => (
                            <div key={comment?._id} className='mb-2 bg-base-100 p-2 rounded flex items-start'>
                                <img
                                    src={comment?.user?.profilePicture || "/avatar.png"}
                                    alt={comment?.user?.name || 'Anonymous'}
                                    className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
                                />
                                <div className='flex-grow'>
                                    <div className='flex items-center mb-1'>
                                        <span className='font-semibold mr-2'>{comment?.user?.name}</span>
                                        <span className='text-xs text-info'>
                                            {comment?.createdAt && formatDate(comment?.createdAt)}
                                        </span>
                                    </div>
                                    <p>{comment?.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleCommentSubmit} className='flex items-center'>
                        <input
                            type='text'
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder='Add a comment...'
                            className='flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary'
                        />
                        <button
                            type='submit'
                            className='bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300'
                        >
                            {loading ? <Loader size={18} className='animate-spin text-black' /> : <Send className="text-black" size={18} />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Post;

