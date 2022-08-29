import Image from "next/image";
import {
    SearchIcon, PlusCircleIcon,
    UserGroupIcon, HeartIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/outline';
import { HomeIcon } from '@heroicons/react/solid';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from 'recoil';
import { modelState } from "../atoms/modelAtom";
import Menu from './Menu';


const Header = ({ darkMode, setDarkMode }) => {
    const { data: session } = useSession();
    const [open, setOpen] = useRecoilState(modelState);
    const router = useRouter();
    return (
        <div className={`shadow-sm bg-white sticky top-0 z-50`}>
            {session && (
                <div className="flex justify-between max-w-6xl px-5 lg:mx-auto dark:shadow-gray-600 dark:border-gray-500 dark:bg-gray-900 py-1">
                    {/* Header */}
                    <h1 className="dark:text-white italic flex items-center font-bold font-serif text-[20px]">
                        Instagram
                    </h1>

                    {/* Search */}
                    <div className="w-[60%] hidden md:block">
                        <div className="mt-1 relative p-2 rounded-md">
                            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className='h-5 w-5 text-gray-500 dark:text-white' />
                            </div>
                            <input className="bg-gray-50 dark:bg-transparent md:block w-full pl-10 sm:text-sm border-gray-700 dark:border-gray-600 focus:ring-gray-700 focus:border-gray-600 dark:placeholder:text-gray-300 rounded-md dark:text-white" placeholder="search.." type='text' />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4 justify-end">
                        <Menu darkMode={darkMode} setDarkMode={setDarkMode} setOpen={setOpen} signOut={signOut} session={session} router={router} />
                        <div className="md:flex hidden items-center space-x-4 justify-end">
                            <HomeIcon onClick={() => router.push('/')} className="navBtn dark:text-gray-200" />
                            <div className="relative navBtn dark:text-gray-200">
                                <PaperAirplaneIcon onClick={() => router.push('/Chats')} className="navBtn rotate-45" />
                                <div className="absolute -top-2 -right-2 text-xs w-5 h-5 bg-red-500 flex items-center justify-center rounded-full animate-pulse text-white">5</div>
                            </div>
                            <PlusCircleIcon onClick={() => setOpen(true)} className="navBtn dark:text-gray-200" />
                            <UserGroupIcon className="navBtn dark:text-gray-200" />
                            <HeartIcon className="navBtn dark:text-gray-200" />
                            <img src={session.user?.image} alt='Profile Pic' className="h-8 w-8 rounded-full cursor-pointer" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header;