import { useState } from "react";
import axios from "axios";
import { Image, Loader } from "lucide-react";
import { toast } from "react-toastify";

const PostCreation = ({ authUser }) => {
    const [content, setContent] = useState('');
    const [ispending, setIspending] = useState(false)
    const [image, setImage] = useState(null); // Initialize as null


    const token = JSON.parse(localStorage.getItem('token'))


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image && !content) {
            return toast("post is required");
        }
        setIspending(true)
        const header = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const postData = { content };
        if (image) postData.image = await readFileAsDataURL(image);

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/post/create`, postData, header) // Adjust URL for post creation
            .then((res) => {
                toast(res.data.message);
            })
            .catch((err) => {
                toast(err.response?.data?.message);
                console.log("Error while creating post", err);
            })
            .finally(() => {
                setIspending(false);
                setContent("");
                setImage(null);
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            })
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <>
            <div className='bg-slate-100 rounded-lg shadow mb-4 p-4'>
                <div className='flex space-x-3'>
                    <img src={authUser.profilePicture || "/avatar.png"} alt={authUser.name} className='size-12 rounded-full' />
                    <textarea
                        placeholder="What's on your mind?"
                        className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {image && (
                    <div className='mt-4'>
                        <img src={URL.createObjectURL(image)} alt='Selected' className='w-full h-auto rounded-lg' />
                    </div>
                )}

                <div className='flex justify-between items-center mt-4'>
                    <div className='flex space-x-4'>
                        <label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
                            <Image size={20} className='mr-2' />
                            <span>Photo</span>
                            <input type='file' accept='image/*' className='hidden' name="image" onChange={handleChange} />
                        </label>
                    </div>

                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex justify-center"
                    >
                        {ispending ? <Loader className='size-5 animate-spin' /> : "Post"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default PostCreation;
