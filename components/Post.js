import {
    BookmarkIcon,
    ChatIcon,
    EmojiHappyIcon,
    DotsHorizontalIcon,
    HeartIcon,
    PaperAirplaneIcon,
    DownloadIcon
} from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import { saveAs } from 'file-saver';
import Image from "next/image";
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { addDoc, doc, collection, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import Moment from 'react-moment';
import { useSession } from 'next-auth/react';
import { postView } from "../atoms/postView";
import { useRecoilState } from 'recoil';

const Post = ({ id, username, userImg, img, caption, timeStamp, router }) => {
    const { data: session } = useSession();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [hasLike, setHasLike] = useState(false);
    const [view, setView] = useRecoilState(postView);

    useEffect(
        () =>
            onSnapshot(collection(db, "posts", id, "likes"),
                (snapshot) => setLikes(snapshot.docs)
            ),
        [id])

    useEffect(
        () =>
            onSnapshot(query(collection(db, "posts", id, "comments"), orderBy("timeStamp", 'asc')), (snapshot) => setComments(snapshot.docs)
            ),
        [id]
    );

    useEffect(() => setHasLike
        (likes.findIndex((like) => like.id === session?.user?.uid) !== -1),
        [likes, session?.user?.uid]
    );

    const likePost = async () => {
        if (hasLike) {
            await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
        } else {
            await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
                username: session.user.username,
            });
        }
    };

    const deletePost = async () => {
        if (confirm("Do You really want to delete this post?")) {
            await deleteDoc(doc(db, "posts", id));
        }
    };

    const postComment = async (e) => {
        e.preventDefault();
        const commentToSend = comment;
        setComment('');

        await addDoc(collection(db, "posts", id, "comments"), {
            comment: commentToSend,
            username: session.user.username,
            userImg: session.user.image,
            timeStamp: serverTimestamp(),
        })
    }

    const downloadPic = () => {
        console.log(img);
        const downloadImage = () => {
            saveAs(img, 'image.jpg')
        }
        downloadImage();
    }

    return (
        <div>
            {router.asPath === '/' || view ?
                <div className='bg-white border rounded-sm my-2 shadow-md dark:bg-gray-900 dark:border-gray-800'>
                    <div className='flex items-center py-2 px-[5px] shadow-md'>
                        <div className='relative rounded-full h-9 w-9 border mr-3 ml-2'>
                            <Image
                                loading='eager'
                                layout='fill'
                                className='rounded-full'
                                src={userImg} alt='img' />
                            <span className="top-0 -right-1 absolute  w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        </div>
                        <p className='flex-1 font-bold dark:text-gray-200'> {username} </p>
                        <Moment fromNow className='mr-2 text-[10px] text-gray-400'>
                            {timeStamp?.toDate()}
                        </Moment>
                        {session?.user?.username === username ?
                            <XCircleIcon className='w-8 h-8 text-gray-500 mr-3 cursor-pointer dark:text-gray-200' onClick={deletePost} /> :
                            <DotsHorizontalIcon className='btn pr-3 dark:text-gray-200' />}
                    </div>
                    <div className='relative w-full h-[400px] md:h-[500px] dark:bg-black'>
                        <Image
                            loading='eager'
                            layout='fill'
                            objectFit='contain'
                            src={img} alt='cover' />
                    </div>

                    <div className='flex justify-between px-4 pt-4'>
                        <div className='flex space-x-3'>
                            {hasLike ? <HeartIconFilled onClick={likePost} className='btn text-red-500' />
                                : <HeartIcon onClick={likePost} className='btn dark:text-gray-200' />}
                            <ChatIcon className='btn dark:text-gray-200' />
                            <PaperAirplaneIcon className='btn pt-1 rotate-90 dark:text-gray-200' />
                        </div>
                        <div className='flex space-x-3'>
                            <DownloadIcon className='btn dark:text-gray-200' onClick={downloadPic} />
                            <BookmarkIcon className='btn dark:text-gray-200' />
                        </div>
                    </div>

                    <p className='px-5 py-2 shadow-sm dark:shadow-lg dark:text-gray-200'>
                        {likes.length > 0 && (
                            <span className='font-bold mb-1 flex'>{likes.length} {likes.length === 1 ? "like" : "likes"}</span>
                        )}
                        <span className='font-bold mr-1'>{username} </span>
                        <span className='text-sm'>{caption}</span>
                    </p>

                    {comments.length > 0 && (
                        <div className='pl-5 pt-1 h-20 overflow-y-scroll scrollbar-thumb-gray-300 scrollbar-thin dark:bg-gray-900 dark:text-gray-200'>
                            {comments.map((comment) => (
                                <div key={comment.id} className='flex items-center space-x-2 mb-3'>
                                    <div className='relative h-7 w-7 rounded-full'>
                                        <Image
                                            loading='eager'
                                            layout='fill'
                                            src={comment.data().userImg}
                                            alt='userimg'
                                            className='rounded-full'
                                        />
                                    </div>
                                    <p className='text-sm flex-1'>
                                        <span className='font-bold'>{comment.data().username} </span>
                                        {comment.data().comment}
                                    </p>
                                    <Moment fromNow className='text-[9px] text-gray-400 pr-5'>
                                        {comment.data().timeStamp?.toDate()}
                                    </Moment>
                                </div>
                            ))}
                        </div>
                    )}


                    <form className='flex items-center py-2 px-4'>
                        <EmojiHappyIcon className='h-7 dark:text-gray-200' />
                        <input value={comment} onChange={(e) => setComment(e.target.value)} className='border-none flex-1 outline-none focus:ring-0 dark:bg-transparent dark:placeholder:text-gray-400 dark:text-white' placeholder='add a comment...' type='text' />
                        <button type='submit' disabled={!comment.trim()} onClick={postComment} className='font-semibold text-blue-500 disabled:text-gray-400'>Post</button>
                    </form>
                </div>
                :
                <div className='p-[1.5px] bg-gray-400 dark:bg-black'>
                    <button onClick={() => setView(true)} className='relative h-28 w-28 md:h-[155px] md:w-[155px]'>
                        <Image
                            src={img}
                            layout='fill'
                            objectFit='cover'
                            loading='eager'
                            alt='image'
                        />
                    </button>
                </div>
            }
        </div>
    )
}

export default Post;