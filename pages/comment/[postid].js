import Loading from "../../components/Loading";
import { db } from "../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";;
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { themeState } from "../../atoms/theme";
import Image from "next/image";
import Moment from "react-moment";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { HeartIcon, EmojiHappyIcon } from "@heroicons/react/outline";
import { collection, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useSession } from "next-auth/react";
const LikeList = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { postid } = router.query;
    const [comments, loading] = useCollectionData(query(collection(db, `posts/${postid}/comments`), orderBy("timeStamp", 'desc')));
    const [darkTheme] = useRecoilState(themeState);
    const [comment, setComment] = useState("");

    const postComment = async (e) => {
        e.preventDefault();
        const commentToSend = comment;
        setComment('');

        await addDoc(collection(db, `posts/${postid}/comments`), {
            comment: commentToSend,
            username: session.user.username,
            userImg: session.user.image,
            timeStamp: serverTimestamp(),
        })
    }
    return (
        <div className={`${!darkTheme ? "dark bg-gray-900" : ""} h-screen overflow-y-scroll scrollbar-hide`}>
            <div className="w-full md:max-w-3xl m-auto dark:text-gray-200">
                <div className="flex space-x-3 px-3 items-center bg-blue-500 dark:bg-gray-900 text-white h-12">
                    <ArrowLeftIcon className="h-6 w-6 cursor-pointer" onClick={() => router.back()} />
                    <h1 className="text-lg font-bold">Comments</h1>
                </div>
                {loading ? <Loading /> :
                    <div className="m-3">
                        {comments?.map((comment, i) => (
                            <div key={i} className="mb-5">
                                <div key={i} className="w-full flex">
                                    <div className="relative h-10 w-10">
                                        {comment.userImg && <Image
                                            loading="eager"
                                            alt="image"
                                            src={comment.userImg}
                                            height='40px'
                                            width='40px'
                                            className="rounded-full"
                                        />}
                                    </div>
                                    <div className="flex-1 ml-2 mr-1">
                                        <p className='text-sm'>
                                            <span onClick={comment.username === session?.user?.username ? () => router.push("/profile") : () => router.push("/")} className='font-bold cursor-pointer'>{comment.username} </span>
                                            {comment.comment}
                                        </p>
                                    </div>
                                    <HeartIcon className="h-5 w-5 btn" />
                                </div>
                                <div className="mt-1 text-xs text-gray-400 px-12 flex space-x-3 font-semibold">
                                    <Moment fromNow>{comment.timeStamp?.toDate()}</Moment>
                                    <button>Reply</button>
                                    <button>Copy</button>
                                </div>
                            </div>
                        ))}
                    </div>}
                <form className='flex items-center py-2 px-4 absolute bottom-0 dark:bg-gray-900 w-full md:max-w-3xl'>
                    <EmojiHappyIcon className='h-7 dark:text-gray-200' />
                    <input value={comment} onChange={(e) => setComment(e.target.value)} className='border-none flex-1 outline-none focus:ring-0 dark:bg-transparent dark:placeholder:text-gray-400 dark:text-white' placeholder='add a comment...' type='text' />
                    <button type='submit' disabled={!comment.trim()} onClick={postComment} className='font-semibold text-blue-500 disabled:text-gray-400'>Post</button>
                </form>
            </div>
        </div>
    )
}

export default LikeList;