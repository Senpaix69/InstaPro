import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { HomeIcon, UserCircleIcon, PlusCircleIcon, ChatAlt2Icon, SparklesIcon, ArrowCircleLeftIcon, MoonIcon, SunIcon } from '@heroicons/react/solid';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example({ session, setOpen, signOut, router, darkMode, setDarkMode }) {

    return (
        <Menu as="div" className="relative inline-block text-left xl:hidden pt-2">
            <Menu.Button>
                <img src={session?.user?.image} alt='Profile Pic' className="h-10 w-10 rounded-full cursor-pointer btn" />
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black font-semibold">
                    <div>
                        {router.pathname !== '/' &&
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => router.push('/')}
                                        className={classNames(
                                            active ? 'dark:bg-blue-700 bg-blue-500 text-white' : 'text-black',
                                            'block px-4 py-3 text-sm w-full dark:text-gray-200'
                                        )}
                                    >
                                        <div className='flex'>
                                            <HomeIcon className='h-5 w-5 mr-2 dark:text-gray-200' />
                                            Home
                                        </div>
                                    </button>
                                )}
                            </Menu.Item>}
                        {router.asPath !== `/profile/${session?.user?.username}` &&
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => router.push(`/profile/${session?.user?.username}`)}
                                        className={classNames(
                                            active ? 'dark:bg-blue-700 bg-blue-500 text-white' : 'text-black',
                                            'block px-4 py-3 text-sm w-full dark:text-gray-200'
                                        )}
                                    >
                                        <div className='flex'>
                                            <UserCircleIcon className='h-5 w-5 mr-2 dark:text-gray-200' />
                                            Profile
                                        </div>
                                    </button>
                                )}
                            </Menu.Item>}
                        {router.pathname !== '/Chats' && !router.pathname.includes("/profile") &&
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setOpen(true)}
                                        className={classNames(
                                            active ? 'dark:bg-blue-700 bg-blue-500 text-white' : 'text-black',
                                            'block px-4 py-3 text-sm w-full dark:text-gray-200'
                                        )}
                                    >
                                        <div className='flex'>
                                            <PlusCircleIcon className='h-5 w-5 mr-2 dark:text-gray-200' />
                                            Add Post
                                        </div>
                                    </button>
                                )}
                            </Menu.Item>}
                        {router.pathname !== '/Chats' &&
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => router.push('/Chats')}
                                        className={classNames(
                                            active ? 'dark:bg-blue-700 bg-blue-500 text-white' : 'text-black',
                                            'block px-4 py-3 text-sm w-full dark:text-gray-200'
                                        )}
                                    >
                                        <div className='flex'>
                                            <ChatAlt2Icon className='h-5 w-5 mr-2 dark:text-gray-200' />
                                            Chats
                                        </div>
                                    </button>
                                )}
                            </Menu.Item>}
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href='https://senpaiprofile.surge.sh'
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classNames(
                                        active ? 'dark:bg-blue-700 bg-blue-500 text-white' : 'text-black',
                                        'block px-4 py-3 text-sm w-full dark:text-gray-200'
                                    )}
                                >
                                    <div className='flex'>
                                        <SparklesIcon className='h-5 w-5 mr-2 dark:text-gray-200' />
                                        Support
                                    </div>
                                </a>
                            )}
                        </Menu.Item>
                        {router.pathname !== '/Chats' &&
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={classNames(
                                            active ? 'dark:bg-blue-700 bg-blue-500 text-white' : 'text-black',
                                            'block px-4 py-3 text-sm w-full dark:text-gray-200'
                                        )}
                                    >
                                        <div className='flex'>
                                            {darkMode ? <MoonIcon className='h-5 w-5 mr-2 dark:text-gray-200' /> : <SunIcon className='h-5 w-5 mr-2 dark:text-gray-200' />}
                                            Theme
                                        </div>
                                    </button>
                                )}
                            </Menu.Item>}
                        {router.pathname !== '/Chats' &&
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={signOut}
                                        className={classNames(
                                            active ? 'dark:bg-blue-700 bg-blue-500 text-white' : 'text-black',
                                            'block px-4 py-3 text-sm w-full dark:text-gray-200'
                                        )}
                                    >
                                        <div className='flex'>
                                            <ArrowCircleLeftIcon className='h-5 w-5 mr-2 dark:text-gray-200' />
                                            Sign out
                                        </div>
                                    </button>
                                )}
                            </Menu.Item>}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}