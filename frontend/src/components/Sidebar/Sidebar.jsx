import { Home, UserPlus, Bell } from "lucide-react";

import { Link } from "react-router-dom";

export default function Sidebar({ authUser }) {
    // console.log('authUser', authUser)

    return (
        <>
            < div className='bg-gray-100 rounded-lg shadow'>
                <div className='p-4 text-center'>
                    <div
                        className='h-32 rounded-t-lg bg-cover bg-center'
                        style={{
                            backgroundImage: `url("${authUser?.data?.bannerImg || "/banner.png"}")`,
                        }}
                    />
                    <Link to={`/profile/${authUser?.data?.username}`}>
                        <img
                            src={authUser?.data?.profilePicture || "/avatar.png"}
                            alt={authUser.name}
                            className='w-20 h-20 rounded-full mx-auto mt-[-40px]'
                        />
                        <h2 className='text-xl font-semibold mt-2'>{authUser?.data?.name}</h2>
                    </Link>

                </div>
                <div className='border-t border-base-100 p-4'>
                    <nav>
                        <ul className='space-y-2'>
                            <li>
                                <Link
                                    to='/'
                                    className='flex items-center py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition-colors'
                                >
                                    <Home className='mr-2' size={20} /> Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/network'
                                    className='flex items-center py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition-colors'
                                >
                                    <UserPlus className='mr-2' size={20} /> My Network
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/notifications'
                                    className='flex items-center py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition-colors'
                                >
                                    <Bell className='mr-2' size={20} /> Notifications
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className='border-t border-base-100 p-4'>
                    <Link to={`/profile/${authUser?.data?.username}`} className='text-sm font-semibold'>
                        Visit your profile
                    </Link>
                </div>
            </div >
        </>

    );
}