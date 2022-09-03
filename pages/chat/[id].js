import { ArrowLeftIcon, CameraIcon, MicrophoneIcon, PhotographIcon, XCircleIcon } from "@heroicons/react/solid";
import Moment from "react-moment";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { collection, doc, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Loading from '../../components/Loading';
import getChatMessages from '../../utils/getChatMessages';
import getOtherEmail from '../../utils/getOtherEmail';
import getOtherProfImage from '../../utils/getOtherProfImage';
import getUserActivity from "../../utils/getUserActivity";

const Chat = () => {
    const { data: session } = useSession();
    const [text, setText] = useState("");
    const router = useRouter();
    const { id } = router.query;
    const messagesEndRef = useRef(null);
    const [chat, loading] = useDocumentData(doc(db, `chats/${id}`));
    const messages = getChatMessages(id);
    const users = getUserActivity();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('theme'))
        setDarkMode(theme);
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        const msgToSend = text;
        setText("");
        await addDoc(collection(db, 'chats', id, 'messages'), {
            text: msgToSend,
            username: session.user.username,
            userImg: session.user.image,
            timeStamp: serverTimestamp(),
        })
    }
    const scrollToBottom = () => {
        messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(scrollToBottom, [messages]);

    const unsendMessage = async (msgID) => {
        if (confirm("Unsend Message?")) {
            await deleteDoc(doc(db, "chats", id, "messages", msgID));
            console.log("Deleted");
        }
    }


    const addMedia = async () => {
        console.log("object");
    }

    return (
        <div className={` ${darkMode ? "bg-gray-100" : "dark bg-gray-900"}`}>
            <div className='max-w-6xl lg:mx-auto flex justify-center'>
                <div className="bg-[url('https://i.pinimg.com/originals/b7/fc/af/b7fcaf2631fc54f28ef3f123855d03dc.jpg')] dark:bg-[url('https://www.teahub.io/photos/full/8-87389_witcher-dark-background-minimal-4k-ultra-hd-mobile.jpg')]
            bg-no-repeat bg-cover bg-center w-full flex flex-col md:w-[700px] h-screen overflow-y-scroll scrollbar-hide">

                    {/* Chat Header */}
                    <section className="shadow-md bg-white sticky top-0 z-50 dark:bg-gray-900 dark:text-gray-200">
                        <button className="flex items-center px-2 py-1">
                            <ArrowLeftIcon onClick={() => router?.back()} className="btn m-1" />
                            <div className="flex items-center justify-center p-[1px] rounded-full border-red-500 border-2 object-contain mx-2">
                                <div className="relative w-8 h-8">
                                    <Image
                                        loading='eager'
                                        layout="fill"
                                        src={loading ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" : getOtherProfImage(chat, session?.user.username)}
                                        alt='prof'
                                        className="rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="text-left">
                                <h1 className="font-bold h-[20px]">{loading ? "Loading" : getOtherEmail(chat, session?.user)}</h1>
                                <span className="text-xs md:text-sm text-gray-400">active </span>
                                <Moment fromNow className="text-xs md:text-sm text-gray-400">
                                    {users && users[users.findIndex((user) => user.username === getOtherEmail(chat, session?.user))]?.timeStamp?.toDate()}
                                </Moment>
                            </div>
                        </button>
                    </section>

                    {/* Chat Body */}
                    <section className='flex-1'>
                        <div className="m-2 p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                            <span className="font-medium">Chat Alert!</span> You can send chat only for now,  have fun 😊.
                        </div>
                        {loading ? <Loading /> :
                            messages?.map((msg, i) => (
                                <div ref={messagesEndRef} key={i} className={`flex mt-1 ${msg?.data().username === session?.user.username ? "justify-end" : ""}`}>
                                    <div className="flex items-center rounded-md w-fit max-w-xs py-1 px-2 relative">
                                        <div className={`absolute top-1 rounded-full ${msg?.data().username === session?.user.username ? "right-2" : ""}`}>
                                            <div className="flex items-center justify-center object-contain">
                                                <div className="relative w-7 h-7">
                                                    <Image
                                                        loading='eager'
                                                        layout="fill"
                                                        src={msg?.data().userImg}
                                                        alt='prof'
                                                        className='rounded-full'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`${msg?.data().username === session?.user.username ? "mr-9 bg-green-200" : "ml-9 bg-blue-200"} p-2 rounded-lg`}>{msg?.data().text}
                                            <Moment fromNow className="ml-2 text-[10px] text-gray-500">
                                                {msg?.data()?.timeStamp?.toDate()}
                                            </Moment>
                                        </p>

                                        {msg?.data().username === session?.user.username &&
                                            <>
                                                <XCircleIcon className="h-7 w-7 absolute -left-6 cursor-pointer text-gray-800 overflow-hidden dark:text-gray-200"
                                                    onClick={() => unsendMessage(msg.id)}
                                                />
                                                <span className="absolute right-10 top-2 items-center p-[1.5px] mr-2 text-sm font-semibold text-gray-700 bg-transparent rounded-full">
                                                    <svg aria-hidden="true" className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                                    <span className="sr-only">deliverd</span>
                                                </span>
                                            </>
                                        }
                                    </div>
                                </div>
                            ))}
                    </section>

                    {/* Chat Bottom */}
                    <section className="bg-gray-50 sticky bottom-0 z-50 shadow-sm mx-1 dark:bg-gray-900 px-1 dark:text-white rounded-3xl">
                        <form>
                            <div className="w-full border rounded-3xl h-12 flex items-center dark:border-none">
                                <CameraIcon className="h-7 w-7 cursor-pointer text-gray-500 ml-2 dark:text-gray-200" />
                                <input
                                    placeholder="Message.."
                                    className="mx-2 flex-1 outline-none text-md focus:ring-0 bg-transparent"
                                    value={text}
                                    name={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <MicrophoneIcon className="h-7 w-7 cursor-pointer text-gray-500 dark:text-gray-200" />
                                <PhotographIcon className="mx-2 h-7 w-7 cursor-pointer text-gray-500 dark:text-gray-200" onClick={addMedia}/>
                                <button
                                    type="submit"
                                    hidden={true}
                                    onClick={sendMessage}
                                    disabled={text ? false : true}
                                    className="mr-3 font-semibold text-sm text-blue-500 disabled:text-gray-400">
                                    send
                                </button>
                            </div>
                        </form>
                    </section>
                </div >
            </div >
        </div>
    )
}

export default Chat;