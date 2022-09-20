import Image from 'next/image';
import Moment from 'react-moment';
import getChatMessages from '../utils/getChatMessages';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';

const ChatList = ({ redirect, profImg, username, id, user }) => {
    const message = getChatMessages(id, "temp");
    const [curr, loading] = useDocumentData(doc(db, `profile/${user}`));

    const deleteChat = async () => {
        if (confirm("Do You really want to delete this chat?")) {
            await deleteDoc(doc(db, "chats", id));
        }
    }

    return (
        <div className='relative hover:bg-gray-200 dark:hover:bg-gray-800'>
            <button className='absolute right-4 cursor-pointer bg-gray-500 text-gray-200 text-sm font-semibold mt-2 px-2 py-[1.5px] rounded-lg shadow-sm' onClick={deleteChat}>
                delete
            </button>
            <div onClick={() => redirect(id)} className='flex items-center w-full py-2 px-3 cursor-pointer truncate'>
                <div className="flex items-center justify-center p-[1px] rounded-full border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out">
                    <div className="relative w-11 h-11">
                        <Image
                            loading='eager'
                            layout="fill"
                            src={profImg}
                            alt='story'
                            className="rounded-full"
                        />
                        <span className={`top-0 right-0 absolute  w-3.5 h-3.5 ${!loading && curr?.active ? "bg-green-400" : "bg-red-500"} border-2 border-white dark:border-gray-800 rounded-full`}></span>
                    </div>
                </div>
                <div className='ml-3 w-full truncate'>
                    <h1 className='font-semibold -mt-1 h-[22px]'>{username}</h1>
                    <div className='flex text-sm w-full justify-between items-center pr-2'>
                        <span className='text-gray-400 w-[70%] overflow-hidden truncate'>
                            {message?.data().text.length > 0 ? message.data().text : "loading.."}
                        </span>
                        <Moment fromNow className='text-[9px] text-gray-400 mt-2'>
                            {message?.data().timeStamp?.toDate()}
                        </Moment>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatList;