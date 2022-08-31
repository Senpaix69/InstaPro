import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../components/Header';
import { UserAddIcon, UserCircleIcon } from '@heroicons/react/solid';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import Loading from '../components/Loading';
import getUserData from '../utils/getUserData';
import getOtherEmail from '../utils/getOtherEmail';
import getOtherProfImage from '../utils/getOtherProfImage';
import ChatList from '../components/ChatList';
import getUserActivity from '../utils/getUserActivity';

const Chats = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState();
    const [snapshot, loading] = useCollection(collection(db, "chats"));
    const chats = snapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const values = getUserActivity();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('theme'))
        setDarkMode(theme);
    }, []);

    const chatExits = (email) => {
        let valid = false;
        chats?.map(docf => {
            if ((docf.users[0].username === session.user.username && docf.users[1].username === email) ||
                docf.users[1].username === session.user.username && docf.users[0].username === email) {
                valid = true;
                stop();
            }
        })
        return valid;
    }

    useEffect(() => {
        setUsers(getUserData(chats, session?.user.username));
    }, [snapshot])

    const addUser = async () => {
        const uName = prompt("Enter username: ")?.split(' ').join('').toLowerCase();
        if (uName?.length && uName !== session.user.username) {
            if (!chatExits(uName)) {
                const ind = values.findIndex((user) => user.username === uName);
                if (ind !== -1 && !loading) {
                    const time = Timestamp.now();
                    await addDoc(collection(db, "chats"), {
                        users:
                            [
                                values[ind],
                                {
                                    username: session.user.username,
                                    uid: session.user.uid,
                                    profImg: session.user.image,
                                    timeStamp: time
                                },
                            ]
                    }).then(() => {
                        alert("Chat Added Successfully");
                    })
                } else {
                    alert("User Not Found");
                }
            } else {
                alert("Chat already exits");
            }
        } else {
            alert("Error Please Add Proper Username");
        }
    }

    const redirect = (id) => {
        router.push(`/chat/${id}`);
    }

    if (!session) return <Loading />
    return (
        <div className={`h-screen overflow-y-scroll scrollbar-hide ${darkMode ? "" : "dark"}`}>
            <div className='flex flex-col justify-between max-w-6xl md:mx-5 lg:mx-auto h-screen'>
                <Header />
                <div className='bg-gray-100 flex justify-center dark:text-gray-200 dark:bg-gray-900 h-screen'>
                    <div className='flex flex-col shadow-md md:w-[700px] w-full'>
                        <button className='w-full flex text-lg justify-center items-center p-3 mb-2 shadow-md'>
                            <UserCircleIcon className='h-6 w-6 mr-2' />
                            <h1 className='font-bold hover:underline'>{session.user.username}</h1>
                        </button>
                        <div className='flex items-center'>
                            <p className='font-bold ml-5 mb-2 flex-1'>Messages</p>
                            <button onClick={addUser} className='font-bold mr-5 text-sm text-blue-500 hover:underline'>
                                <div className='flex'>
                                    <UserAddIcon className='h-4 w-4 mr-2 mt-[2px]' />
                                    Add Chat
                                </div>
                            </button>
                        </div>
                        <div>
                            {loading && values === undefined ? <Loading /> :
                                users?.map((user, i) => (
                                    <ChatList
                                        key={i}
                                        id={user.id}
                                        redirect={redirect}
                                        username={getOtherEmail(user, session.user)}
                                        profImg={getOtherProfImage(user, session.user.username)}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chats;