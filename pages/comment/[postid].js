import Loading from "../../components/Loading";
import { db } from "../../firebase";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";;
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { themeState } from "../../atoms/theme";
import Image from "next/image";
import Moment from "react-moment";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { HeartIcon, EmojiHappyIcon } from "@heroicons/react/outline";
import { collection, query, orderBy, addDoc, Timestamp, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useSession } from "next-auth/react";

const CommentList = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { postid } = router.query;
    const [comments, loading] = useCollection(query(collection(db, `posts/${postid}/comments`), orderBy("timeStamp", 'desc')));
    const [post] = useDocumentData(doc(db, "posts", postid));
    const [darkTheme] = useRecoilState(themeState);
    const [subCommentRef, setSubCommentRef] = useState({});
    const [comment, setComment] = useState("");

    const postComment = async (e) => {
        e.preventDefault();
        if (subCommentRef?.id && comment.indexOf("@") !== -1) {
            addSubComment(subCommentRef.id, subCommentRef.data()?.subcomments);
        } else {
            const commentToSend = comment;
            setComment('');
            await addDoc(collection(db, `posts/${postid}/comments`), {
                comment: commentToSend,
                username: session.user.username,
                userImg: session.user.image,
                timeStamp: serverTimestamp(),
                subcomments: [],
            })
        }
        setSubCommentRef({});
    }

    const addSubComment = async (id, prevCom) => {
        const time = Timestamp.now();
        const commentToSend = comment;
        setComment('');
        await updateDoc(doc(db, `posts/${postid}/comments/${id}`), {
            subcomments: [...prevCom, {
                username: session.user.username,
                userImg: session.user.image,
                timeStamp: time,
                comment: commentToSend,
            }],
        })
        setSubCommentRef({});
    }

    const triggerUsername = (comment, username) => {
        setComment("@" + username + " ");
        setSubCommentRef(comment);
    }

    const deleteComment = async (id) => {
        if (confirm("Do You really want to delete this comment?")) {
            await deleteDoc(doc(db, `posts/${postid}/comments/${id}`));
        }
    }

    const deleteSubComment = async (comment, indexOfSubComment) => {
        const newSubComment = comment.data().subcomments?.filter((_, i) => i !== indexOfSubComment);

        if (newSubComment && confirm("Do You really want to delete this comment?")) {
            await updateDoc(doc(db, `posts/${postid}/comments/${comment.id}`), {
                subcomments: newSubComment,
            })
        }
    }
    return (
        <div className={`${!darkTheme ? "dark bg-gray-900" : ""} h-screen overflow-y-scroll scrollbar-hide`}>
            <div className="w-full md:max-w-3xl m-auto dark:text-gray-200">
                <div className="flex space-x-3 px-3 items-center bg-blue-500 dark:bg-gray-900 text-white h-16">
                    <ArrowLeftIcon className="h-6 w-6 cursor-pointer" onClick={() => router.back()} />
                    <h1 className="text-lg font-bold">Comments</h1>
                </div>
                {post?.caption &&
                    <div className="m-3 flex border-b-2 border-gray-600 pb-4 mb-5">
                        <div className="relative h-10 w-10">
                            {post.profImg && <Image
                                loading="eager"
                                alt="image"
                                src={post.profImg}
                                height='40px'
                                width='40px'
                                className="rounded-full"
                            />}
                        </div>
                        <div className="ml-3 flex-1 mr-3">
                            <p className='text-md'>
                                <span onClick={post.username === session?.user?.username ? () => router.push("/profile") : () => router.push("/")} className='font-bold cursor-pointer'>{post.username} </span>
                                {post.caption}
                            </p>
                            <Moment fromNow className="text-xs font-semibold text-gray-400">{post.timeStamp?.toDate()}</Moment>
                        </div>
                    </div>}
                {loading ? <Loading /> :
                    <div className="m-3">
                        {comments.docs?.map((comment, i) => (
                            <div key={i} className="mb-5">
                                <div key={i} className="relative w-full flex">
                                    <div className="absolute">
                                        <div className="relative h-10 w-10">
                                            {comment.data().userImg && <Image
                                                loading="eager"
                                                alt="image"
                                                src={comment.data().userImg}
                                                height='40px'
                                                width='40px'
                                                className="rounded-full"
                                            />}
                                        </div>
                                    </div>
                                    <div className="ml-12 flex-1 mr-3">
                                        <p className='text-sm'>
                                            <span onClick={comment.data().username === session?.user?.username ? () => router.push("/profile") : () => router.push("/")} className='font-bold cursor-pointer'>{comment.data().username} </span>
                                            {comment.data().comment}
                                        </p>
                                    </div>
                                    <HeartIcon className="h-5 w-5 btn" />
                                </div>
                                <div className="mt-1 text-xs text-gray-400 px-12 flex space-x-3 font-semibold">
                                    <Moment fromNow>{comment.data().timeStamp?.toDate()}</Moment>
                                    <button onClick={() => triggerUsername(comment, comment.data().username)}>Reply</button>
                                    {comment.data().username === session?.user.username && <button onClick={() => deleteComment(comment.id)}>Delete</button>}
                                </div>
                                {comment.data().subcomments?.map((subCom, index) => (
                                    <div key={index} className="ml-14 mt-5">
                                        <div className="w-full flex relative">
                                            <div className="absolute">
                                                <div className="relative h-9 w-9">
                                                    {comment.data().userImg && <Image
                                                        loading="eager"
                                                        alt="image"
                                                        src={subCom.userImg}
                                                        height='35px'
                                                        width='35px'
                                                        className="rounded-full"
                                                    />}
                                                </div>
                                            </div>
                                            <div className="flex-1 ml-11 mr-3">
                                                <p className='text-sm'>
                                                    <span onClick={subCom.username === session?.user?.username ? () => router.push("/profile") : () => router.push("/")} className='font-bold cursor-pointer'>{subCom.username} </span>
                                                    {subCom.comment}
                                                </p>
                                            </div>
                                            <HeartIcon className="h-5 w-5 btn" />
                                        </div>
                                        <div className="mt-1 text-xs text-gray-400 px-11 flex space-x-3 font-semibold">
                                            <Moment fromNow>{subCom.timeStamp?.toDate()}</Moment>
                                            <button onClick={() => triggerUsername(comment, subCom.username)}>Reply</button>
                                            {subCom.username === session?.user.username && <button onClick={() => deleteSubComment(comment, index)}>Delete</button>}
                                        </div>
                                    </div>))}
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

export default CommentList;