import { ArrowLeftIcon, CameraIcon, MicrophoneIcon, PhotographIcon, XCircleIcon, ArrowSmRightIcon } from "@heroicons/react/solid";
import Moment from "react-moment";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { collection, doc, addDoc, serverTimestamp, deleteDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import Loading from '../../components/Loading';
import getChatMessages from '../../utils/getChatMessages';
import getOtherEmail from '../../utils/getOtherEmail';
import getOtherProfImage from '../../utils/getOtherProfImage';
import getUserActivity from "../../utils/getUserActivity";

const Chat = () => {
    const [text, setText] = useState("");
    const [uploading, setUploading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const messagesEndRef = useRef(null);
    const [chat, loading] = useDocumentData(doc(db, `chats/${id}`));
    const messages = getChatMessages(id);
    const users = getUserActivity();
    const [darkMode, setDarkMode] = useState(false);
    const [selectFile, setSelectFile] = useState(null);
    const filePickerRef = useRef(null);

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('theme'))
        setDarkMode(theme);
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        const msgToSend = text;
        setUploading(true);
        setText("");

        const docRef = await addDoc(collection(db, 'chats', id, 'messages'), {
            text: msgToSend,
            username: session.user.username,
            userImg: session.user.image,
            timeStamp: serverTimestamp(),
        })

        if (selectFile) {
            const imageRef = ref(storage, `chats/${docRef.id}/image`);
            await uploadString(imageRef, selectFile, "data_url").then(async () => {
                const downloadURL = await getDownloadURL(imageRef);

                await updateDoc(doc(db, 'chats', id, 'messages', docRef.id), {
                    image: downloadURL,
                });
            });
            setSelectFile(null);
        }
        setUploading(false);
    }

    const scrollToBottom = () => {
        messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(scrollToBottom, [messages]);

    const unsendMessage = async (msgID) => {
        if (confirm("Unsend Message?")) {
            await deleteDoc(doc(db, "chats", id, "messages", msgID));
        }
    }

    const addMedia = (e) => {
        const read = new FileReader();
        if (e.target.files[0]) {
            read.readAsDataURL(e.target.files[0]);
        }
        read.onload = (readEvent) => {
            setSelectFile(readEvent.target.result);
        };
    };

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
                            <span className="font-medium">Chat Alert!</span> You can send/unsend text and images, have fun 😊.
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
                                            {msg.data().image &&
                                                <div className="mt-2 shadow-md p-2">
                                                    <Image src={msg.data().image} alt='img' width='500px' height='700px' objectFit="contain" loading="eager" />
                                                </div>}
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
                            {selectFile &&
                                <div className="relative flex gap-5 items-center p-5 text-semibold italic">
                                    <Image
                                        height='100px'
                                        width='100px'
                                        className='object-contain cursor-pointer'
                                        src={selectFile} alt='file'
                                        onClick={() => setSelectFile(null)} />
                                    <h1>Status: </h1>
                                    {uploading ? <h1>Uploading...</h1> : <h1>Loaded</h1>}
                                </div>}
                            <div className="w-full border rounded-3xl h-12 flex justify-between items-center dark:border-none">
                                <div className="flex items-center flex-1">
                                    <CameraIcon className="h-9 w-9 cursor-pointer text-gray-500 ml-2 dark:text-gray-200 bg-red-400 rounded-full p-1" onClick={() => filePickerRef.current.click()} />
                                    <input
                                        placeholder="Message..."
                                        className="mx-2 outline-none text-md focus:ring-0 bg-transparent w-full"
                                        value={text}
                                        name={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center p-1">
                                    <MicrophoneIcon className="h-7 w-7 cursor-pointer text-gray-500 dark:text-gray-200" />
                                    <div>
                                        <PhotographIcon className="mx-2 h-8 w-8 cursor-pointer text-gray-500 dark:text-gray-200" onClick={() => filePickerRef.current.click()} />
                                        <div>
                                            <input ref={filePickerRef} type='file' hidden onChange={addMedia} />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={sendMessage}
                                        disabled={text || selectFile ? false : true}>
                                        <ArrowSmRightIcon className={`mr-2 h-9 w-9 cursor-pointer text-blue-500 ${text || selectFile ? "text-blue-500" : "text-gray-500"}`} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>
                </div >
            </div >
        </div>
    )
}

export default Chat;