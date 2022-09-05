import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { themeState } from '../atoms/theme';
import Loading from '../components/Loading';
import Header from "../components/Header";
import Image from "next/image";
import { useState } from "react";
import Stories from "../components/Stories";
import Posts from "../components/Posts";

const Profile = () => {
    const { data: session } = useSession();
    const [bio, setBio] = useState('Boy Play Boy Ni Bs Ashiq Mizaj Hai');
    const [darkMode, setDarkMode] = useRecoilState(themeState);

    if (!session) return <Loading />
    return (
        <div className={`${darkMode ? "bg-gray-50 " : "dark bg-gray-900"} h-screen overflow-y-scroll scrollbar-hide flex justify-center`}>
            <div className="max-w-6xl dark:text-gray-200 flex-1 overflow-x-scroll scrollbar-hide">
                <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className="relative w-full p-3 flex flex-col">
                    <div className="flex space-x-2 px-2">
                        <div className="relative h-20 w-20 md:h-24 md:w-24 mr-10">
                            <Image
                                src={session.user?.image}
                                layout="fill"
                                loading="eager"
                                alt="profile"
                                className="rounded-full"
                            />
                        </div>
                        <div className="flex w-72 ml-10 justify-between md:max-w-2xl mt-5 px-4">
                            <button className="flex flex-col items-center">
                                <p className="font-bold">110</p>
                                <p className="text-sm mt-1 text-gray-400">Posts</p>
                            </button>
                            <button className="flex flex-col items-center">
                                <p className="font-bold">15M</p>
                                <p className="text-sm mt-1 text-gray-400">Followers</p>
                            </button>
                            <button className="flex flex-col items-center">
                                <p className="font-bold">20</p>
                                <p className="text-sm mt-1 text-gray-400">Followings</p>
                            </button>
                        </div>
                    </div>
                    <div className="mt-1 flex flex-col">
                        <h1 className="font-semibold text-lg">{session.user?.username}</h1>
                        <p className="text-sm">{bio}</p>
                    </div>
                    <button className="w-full mt-8 py-1 dark:bg-black border border-gray-700 rounded-md dark:hover:bg-gray-600 hover:bg-blue-500 hover:text-white font-semibold shadow-sm">Edit Profile</button>
                </div>
                <Stories />
                <Posts />
            </div>
        </div>
    )
}

export default Profile;
