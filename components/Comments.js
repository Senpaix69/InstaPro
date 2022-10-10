import {
  ArrowLeftIcon,
  EmojiHappyIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import {
  addDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import { db } from "../firebase";
import getUserProfilePic from "../utils/getUserProfilePic";

const Comments = ({
  users,
  comments,
  router,
  setOpenComments,
  collection,
  doc,
  deleteDoc,
  post,
}) => {
  const { data: session } = useSession();
  const [subCommentRef, setSubCommentRef] = useState({});
  const [openIndex, setOpenIndex] = useState(
    new Array(comments?.length).fill(-1)
  );
  const [comment, setComment] = useState("");
  const focusElement = useRef(null);

  const postComment = async (e) => {
    e.preventDefault();
    if (subCommentRef?.username) {
      addSubComment();
    } else {
      const commentToSend = comment;
      setComment("");
      await addDoc(collection(db, `posts/${post.id}/comments`), {
        comment: commentToSend,
        username: session.user.username,
        timeStamp: serverTimestamp(),
        subcomments: [],
      }).then(() => {
        if (session.user.username !== post.data().username) {
          sendNotification(post.data().username, "has commented to your post");
        }
      });
    }
    setSubCommentRef({});
  };

  const addSubComment = async () => {
    const time = Timestamp.now();
    const commentToSend = comment;
    const prevCom = subCommentRef.comment.data().subcomments;
    setComment("");
    await updateDoc(
      doc(db, `posts/${post.id}/comments/${subCommentRef.comment.id}`),
      {
        subcomments: [
          ...prevCom,
          {
            username: session.user.username,
            timeStamp: time,
            comment: `@${subCommentRef.username} ${commentToSend}`,
          },
        ],
      }
    ).then(() => {
      // ---------------------------------------------------------------------
      const you = session.user.username;
      const yourSubComment = you === subCommentRef.username ? true : false;
      const isYourPost = post.data().username === you ? true : false;
      const isYourComment =
        subCommentRef.comment.data()?.username === you ? true : false;
      const ownerComment =
        subCommentRef.comment.data()?.username === post.data().username
          ? true
          : false;
      const ownerSubComment =
        post.data().username === subCommentRef.username ? true : false;
      // ---------------------------------------------------------------------

      console.log("You:", you);
      console.log("Is Your Post:", isYourPost);
      console.log("Comment is yours:", isYourComment);
      console.log("To your subcomment:", yourSubComment);
      console.log("Owners Comment:", ownerComment);
      console.log("You replying to owner's subcomment:", ownerSubComment);
    });
    setSubCommentRef({});
  };

  const sendNotification = (sendToUser, message) => {
    if (typeof Notification !== "undefined") {
      axios.post("/api/sendNotification", {
        interest: getUser(sendToUser).uid,
        title: "InstaPro",
        body: getName(getUser(session?.user.username)) + " " + message,
        icon: "https://firebasestorage.googleapis.com/v0/b/instapro-dev.appspot.com/o/posts%2Fimage%2Fraohuraira_57d3d606-eebc-4875-a843-eb0a03e3baf5?alt=media&token=33898c43-2cd1-459c-a5c9-efa29abb35a5",
        link: "https://insta-pro.vercel.app",
      });
    }
  };

  const triggerUsername = (comment, username) => {
    setSubCommentRef({ comment: comment, username: username });
  };

  const cancelSubComment = () => {
    setSubCommentRef({});
  };

  const deleteComment = async (id) => {
    if (confirm("Do you really want to delete this comment?")) {
      await deleteDoc(doc(db, `posts/${post.id}/comments/${id}`));
    }
  };

  const deleteSubComment = async (comment, indexOfSubComment) => {
    const newSubComment = comment
      .data()
      .subcomments?.filter((_, i) => i !== indexOfSubComment);

    if (
      newSubComment &&
      confirm("Do you really want to delete this comment?")
    ) {
      await updateDoc(doc(db, `posts/${post.id}/comments/${comment.id}`), {
        subcomments: newSubComment,
      });
    }
  };

  const handleSubComment = (index, action) => {
    const newIndexes = [];
    openIndex.forEach((val, n) => {
      if (n === index) {
        newIndexes.push(action === "show" ? 1 : -1);
      } else return newIndexes.push(val);
    });
    setOpenIndex(newIndexes);
  };

  useEffect(() => {
    if (subCommentRef.username) {
      focusElement.current.focus();
    }
  }, [focusElement, subCommentRef]);

  const getUser = (username) => {
    const currUser = users?.filter((user) => user.username === username)[0];
    return currUser;
  };
  const getName = (user) => {
    return user.fullname ? user.fullname : user.username;
  };

  return (
    <div className="fixed top-0 z-50 bg-white dark:bg-gray-900 w-full md:max-w-3xl m-auto dark:text-gray-200 flex flex-col h-screen">
      {/* comments header */}
      <section className="w-full md:max-w-3xl">
        <div className="flex space-x-3 px-3 items-center bg-blue-500 dark:bg-gray-900 text-white h-16">
          <ArrowLeftIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => setOpenComments(false)}
          />
          <h1 className="text-lg font-bold">Comments</h1>
        </div>
      </section>

      {/* comments Body */}
      <section className="flex-1 overflow-y-scroll scrollbar-hide">
        {post?.data().caption && (
          <div className="m-3 flex border-b-2 border-gray-700 pb-3">
            <div className="relative h-10 w-10">
              <Image
                loading="eager"
                alt="image"
                src={getUserProfilePic(post.data().username, users)}
                layout="fill"
                className="rounded-full"
              />
              <span
                className={`absolute -top-1 right-0 w-3.5 h-3.5 ${
                  getUser(post.data().username)?.active
                    ? "bg-green-400"
                    : "bg-slate-400"
                } border-[3px] border-white dark:border-gray-900 rounded-full`}
              ></span>
            </div>
            <div className="flex-1 mx-3">
              <div className="text-md -mb-1">
                <span
                  onClick={() =>
                    router.push(`/profile/${post.data().username}`)
                  }
                  className="font-bold cursor-pointer"
                >
                  {getName(getUser(post.data().username))}
                </span>{" "}
                {post.data().caption}
              </div>
              <Moment fromNow className="text-xs font-semibold text-gray-400">
                {post.data().timeStamp?.toDate()}
              </Moment>
            </div>
          </div>
        )}
        {comments?.map((comment, i) => (
          <div key={i} className="mb-2 mx-3 pb-3 border-b dark:border-gray-800">
            <div className="relative w-full flex">
              <div className="absolute">
                <div className="relative h-10 w-10">
                  <Image
                    loading="eager"
                    alt="image"
                    src={getUserProfilePic(comment.data().username, users)}
                    layout="fill"
                    className="rounded-full"
                  />
                  <span
                    className={`-top-1 right-0 absolute  w-3.5 h-3.5 ${
                      getUser(comment.data().username)?.active
                        ? "bg-green-400"
                        : "bg-slate-400"
                    } border-[3px] border-white dark:border-gray-900 rounded-full`}
                  ></span>
                </div>
              </div>
              <div className="ml-12 flex-1 mr-3">
                <div className="text-sm">
                  <span
                    onClick={() =>
                      router.push(`/profile/${comment?.data().username}`)
                    }
                    className="font-bold cursor-pointer relative"
                  >
                    {getName(getUser(comment?.data().username))}
                  </span>{" "}
                  {comment.data().comment}
                </div>
              </div>
              <HeartIcon className="h-5 w-5 btn" />
            </div>
            <div className="mt-1 text-xs text-gray-400 px-12 flex space-x-3 font-semibold">
              <Moment fromNow>{comment.data().timeStamp?.toDate()}</Moment>
              <button
                onClick={() =>
                  triggerUsername(comment, comment.data().username)
                }
              >
                Reply
              </button>
              {comment.data().username === session?.user.username && (
                <button onClick={() => deleteComment(comment.id)}>
                  Delete
                </button>
              )}
            </div>
            {comment.data()?.subcomments?.length > 0 && openIndex[i] === -1 ? (
              <button
                onClick={() => handleSubComment(i, "show")}
                className="ml-14 mt-2 text-gray-400 text-xs"
              >
                view {comment.data()?.subcomments?.length} comments
              </button>
            ) : (
              comment.data()?.subcomments?.length > 0 && (
                <button
                  onClick={() => handleSubComment(i, "hide")}
                  className="ml-14 mt-2 text-gray-400 text-xs"
                >
                  hide comments
                </button>
              )
            )}
            {openIndex[i] !== -1 &&
              comment.data()?.subcomments?.map((subCom, index) => (
                <div key={index} className="ml-12 mt-3">
                  <div className="w-full flex relative">
                    <div className="absolute">
                      <div className="relative h-7 w-7">
                        <Image
                          loading="eager"
                          alt="image"
                          src={getUserProfilePic(subCom.username, users)}
                          layout="fill"
                          className="rounded-full"
                        />
                        <span
                          className={`-top-1 right-0 absolute  w-3.5 h-3.5 ${
                            getUser(subCom.username)?.active
                              ? "bg-green-400"
                              : "bg-slate-400"
                          } border-[3px] border-white dark:border-gray-900 rounded-full`}
                        ></span>
                      </div>
                    </div>
                    <div className="flex-1 ml-9 mr-3">
                      <div className="text-sm">
                        <span
                          onClick={() =>
                            router.push(`/profile/${subCom.username}`)
                          }
                          className="font-bold cursor-pointer relative"
                        >
                          {getName(getUser(subCom.username))}
                        </span>{" "}
                        {subCom.comment}
                      </div>
                    </div>
                    <HeartIcon className="h-5 w-5 btn" />
                  </div>
                  <div className="mt-1 text-xs text-gray-400 px-9 flex space-x-3 font-semibold">
                    <Moment fromNow>{subCom.timeStamp?.toDate()}</Moment>
                    <button
                      onClick={() => triggerUsername(comment, subCom.username)}
                    >
                      Reply
                    </button>
                    {subCom.username === session?.user.username && (
                      <button onClick={() => deleteSubComment(comment, index)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </section>

      {/* comments bottom */}
      <section className="py-2 px-4">
        {subCommentRef?.username && (
          <div className="text-sm flex justify-between text-gray-500 my-2">
            replying to @{getName(getUser(subCommentRef.username))}
            <button onClick={cancelSubComment}>cancel</button>
          </div>
        )}
        <form className="flex items-center sticky bottom-0 z-50 bg-white dark:bg-gray-900 w-full md:max-w-3xl">
          <EmojiHappyIcon className="h-7 dark:text-gray-200" />
          <input
            value={comment}
            ref={focusElement}
            onChange={(e) => setComment(e.target.value)}
            className="border-none flex-1 outline-none focus:ring-0 dark:bg-transparent dark:placeholder:text-gray-400 dark:text-white"
            placeholder="add a comment..."
            type="text"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            onClick={postComment}
            className="font-semibold text-blue-500 disabled:text-gray-400"
          >
            Post
          </button>
        </form>
      </section>
    </div>
  );
};

export default Comments;
