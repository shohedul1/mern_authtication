import { Link } from "react-router-dom";

const RecommendedUser = ({ user }) => {
    return (
        <div className='flex items-center justify-between mb-4'>
            <Link to={`/profile/${user.username}`} className='flex items-center flex-grow'>
                <img
                    src={user.profilePicture || "/avatar.png"}
                    alt={user.name}
                    className='w-12 h-12 rounded-full mr-3'
                />
                <div>
                    <h3 className='font-semibold text-sm'>{user.name}</h3>
                    <p className='text-xs text-info'>{user.headline}</p>
                </div>
            </Link>
            {/* {renderButton()} */}
        </div>
    );
};

export default RecommendedUser;
