import {
    BookmarkIcon,
    ChatAlt2Icon,
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

    useEffect(() => {
        setView(false);
    }, [router])

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
                userImg: session.user.image,
                timeStamp: serverTimestamp()
            });
        }
    };

    const deletePost = async () => {
        if (confirm("Do you really want to delete this post?")) {
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
                    <div className='flex items-center py-2 px-[5px] shadow-md bg-blue-500 dark:bg-gray-900 text-white'>
                        <div className='flex flex-1'>
                            <div className='relative rounded-full h-9 w-9 mr-3 ml-2'>
                                <Image
                                    loading='eager'
                                    layout='fill'
                                    className='rounded-full'
                                    src={userImg} alt='img' />
                                <span className="top-0 -right-1 absolute  w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                            </div>
                            <button onClick={() => router.push(`/profile/${username}`)} className='font-bold dark:text-gray-200 cursor-pointer w-auto'> {username} </button>
                        </div>
                        <Moment fromNow className='mr-2 text-[10px]'>
                            {timeStamp?.toDate()}
                        </Moment>
                        {session?.user?.username === username ?
                            <XCircleIcon className='w-8 h-8 mr-3 cursor-pointer dark:text-gray-200' onClick={deletePost} /> :
                            <DotsHorizontalIcon className='btn pr-3 dark:text-gray-200' />}
                    </div>
                    <div className='relative w-full h-[400px] md:h-[500px] dark:bg-black bg-blue-200'>
                        {img && <Image
                            loading='eager'
                            layout='fill'
                            objectFit='contain'
                            src={img} alt='cover' />}
                    </div>

                    <div className='flex justify-between px-3 py-2 bg-blue-500 dark:bg-gray-900 text-white items-center'>
                        <div className='flex space-x-3 items-center'>
                            {hasLike ? <HeartIconFilled onClick={likePost} className='btn text-red-500' />
                                : <HeartIcon onClick={likePost} className='btn' />}
                            <ChatAlt2Icon className='btn' onClick={() => router.push(`/comment/${id}`)} />
                            <PaperAirplaneIcon className='btn pt-1 rotate-90' />
                        </div>
                        <div className='flex space-x-3 items-center'>
                            <DownloadIcon className='btn' onClick={downloadPic} />
                            <BookmarkIcon className='btn' />
                        </div>
                    </div>
                    <p className='px-4 dark:text-gray-200'>
                        {likes.length > 0 && (
                            <button onClick={() => router.push(`/like/${id}`)} className='font-bold mb-1 flex'>{likes.length} {likes.length === 1 ? "like" : "likes"}</button>
                        )}
                        <button onClick={() => router.push(`/profile/${username}`)}className='font-bold mr-1'>{username} </button>
                        <span className='text-sm'>{caption}</span>
                    </p>

                    {comments.length > 0 && (
                        <button onClick={() => router.push(`/comment/${id}`)} className='px-4 text-sm text-gray-400'>
                            View {comments.length} {comments.length === 1 ? "comment" : "comments"}
                        </button>
                    )}

                    <form className='flex items-center py-1 px-4'>
                        <EmojiHappyIcon className='h-7 dark:text-gray-200' />
                        <input value={comment} onChange={(e) => setComment(e.target.value)} className='border-none flex-1 outline-none focus:ring-0 dark:bg-transparent dark:placeholder:text-gray-400 dark:text-white' placeholder='add a comment...' type='text' />
                        <button type='submit' disabled={!comment.trim()} onClick={postComment} className='font-semibold text-blue-500 disabled:text-gray-400'>Post</button>
                    </form>
                </div>
                :
                <div className='bg-blue-200 dark:bg-black rounded-md m-[1.5px]'>
                    <button onClick={() => setView(true)} className='relative h-36 w-36 md:h-[155px] md:w-[155px] rounded-md'>
                        <Image
                            src={img}
                            layout='fill'
                            objectFit='cover'
                            loading='eager'
                            alt='image'
                            className='rounded-md'
                        />
                    </button>
                </div>
            }
        </div>
    )
}

export default Post;