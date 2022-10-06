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
const verfiedBadge = require("../public/verified.png");

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
  const [comment, setComment] = useState("");
  const focusElement = useRef(null);

  const postComment = async (e) => {
    e.preventDefault();
    if (subCommentRef?.id) {
      addSubComment(subCommentRef.id, subCommentRef.data()?.subcomments);
    } else {
      const commentToSend = comment;
      setComment("");
      await addDoc(collection(db, `posts/${post.id}/comments`), {
        comment: commentToSend,
        username: session.user.username,
        timeStamp: serverTimestamp(),
        subcomments: [],
      }).then(() => {
        if (typeof Notification !== "undefined") {
          axios.post("/api/sendNotification", {
            interest: users.filter(
              (user) => user.username === post.data().username
            )[0].uid,
            title: "InstaPro",
            body: session?.user.username + " has commented on your post",
            icon: "https://firebasestorage.googleapis.com/v0/b/instapro-dev.appspot.com/o/posts%2Fimage%2Fraohuraira_57d3d606-eebc-4875-a843-eb0a03e3baf5?alt=media&token=33898c43-2cd1-459c-a5c9-efa29abb35a5",
            link: "https://insta-pro.vercel.app",
          });
        }
      });
    }
    setSubCommentRef({});
  };

  const addSubComment = async (id, prevCom) => {
    const time = Timestamp.now();
    const commentToSend = comment;
    setComment("");
    await updateDoc(doc(db, `posts/${post.id}/comments/${id}`), {
      subcomments: [
        ...prevCom,
        {
          username: session.user.username,
          timeStamp: time,
          comment: commentToSend,
        },
      ],
    });
    setSubCommentRef({});
  };

  const triggerUsername = (comment) => {
    setSubCommentRef(comment);
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

  useEffect(() => {
    if (subCommentRef.id) {
      focusElement.current.focus();
    }
  }, [focusElement, subCommentRef]);

  console.log("object");

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
          <div className="m-3 flex border-b-2 border-gray-600 pb-4 mb-5">
            <div className="relative h-10 w-10">
              <Image
                loading="eager"
                alt="image"
                src={getUserProfilePic(post.data().username, users)}
                layout="fill"
                className="rounded-full"
              />
            </div>
            <div className="ml-3 flex-1 mr-3">
              <div className="text-md">
                <span
                  onClick={() =>
                    router.push(`/profile/${post.data().username}`)
                  }
                  className={`font-bold cursor-pointer relative ${
                    post.data().username === "hurairayounas" ? "mr-4" : ""
                  }`}
                >
                  {post.data().username}
                  {post.data().username === "hurairayounas" && (
                    <div className="absolute top-[2.5px] left-[103px] sm:left-[107px]">
                      <div className="relative h-4 w-4">
                        <Image
                          src={verfiedBadge}
                          layout="fill"
                          loading="eager"
                          alt="profile"
                          className="rounded-full"
                        />
                      </div>{" "}
                    </div>
                  )}{" "}
                </span>
                {post.data().caption}
              </div>
              <Moment fromNow className="text-xs font-semibold text-gray-400">
                {post.data().timeStamp?.toDate()}
              </Moment>
            </div>
          </div>
        )}
        <div className="m-3">
          {comments?.map((comment, i) => (
            <div key={i} className="mb-5">
              <div key={i} className="relative w-full flex">
                <div className="absolute">
                  <div className="relative h-10 w-10">
                    <Image
                      loading="eager"
                      alt="image"
                      src={getUserProfilePic(comment.data().username, users)}
                      layout="fill"
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="ml-12 flex-1 mr-3">
                  <div className="text-sm">
                    <span
                      onClick={() =>
                        router.push(`/profile/${comment?.data().username}`)
                      }
                      className={`font-bold cursor-pointer relative ${
                        comment?.data().username === "hurairayounas"
                          ? "mr-4"
                          : ""
                      }`}
                    >
                      {comment?.data().username}
                      {comment?.data().username === "hurairayounas" && (
                        <div className="absolute top-[1.5px] left-[90px] sm:left-[94px]">
                          <div className="relative h-4 w-4">
                            <Image
                              src={verfiedBadge}
                              layout="fill"
                              loading="eager"
                              alt="profile"
                              className="rounded-full"
                            />
                          </div>
                        </div>
                      )}{" "}
                    </span>
                    {comment.data().comment}
                  </div>
                </div>
                <HeartIcon className="h-5 w-5 btn" />
              </div>
              <div className="mt-1 text-xs text-gray-400 px-12 flex space-x-3 font-semibold">
                <Moment fromNow>{comment.data().timeStamp?.toDate()}</Moment>
                <button onClick={() => triggerUsername(comment)}>Reply</button>
                {comment.data().username === session?.user.username && (
                  <button onClick={() => deleteComment(comment.id)}>
                    Delete
                  </button>
                )}
              </div>
              {comment.data().subcomments?.map((subCom, index) => (
                <div key={index} className="ml-14 mt-5">
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
                      </div>
                    </div>
                    <div className="flex-1 ml-11 mr-3">
                      <div className="text-sm">
                        <span
                          onClick={() =>
                            router.push(`/profile/${subCom.username}`)
                          }
                          className={`font-bold cursor-pointer relative ${
                            subCom.username === "hurairayounas" ? "mr-5" : ""
                          }`}
                        >
                          {subCom.username}
                          {subCom.username === "hurairayounas" && (
                            <div className="absolute top-[1.5px] left-[90px] sm:left-[94px]">
                              <div className="relative h-4 w-4">
                                <Image
                                  src={verfiedBadge}
                                  layout="fill"
                                  loading="eager"
                                  alt="profile"
                                  className="rounded-full"
                                />
                              </div>
                            </div>
                          )}
                        </span>{" "}
                        {subCom.comment}
                      </div>
                    </div>
                    <HeartIcon className="h-5 w-5 btn" />
                  </div>
                  <div className="mt-1 text-xs text-gray-400 px-11 flex space-x-3 font-semibold">
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
        </div>
      </section>

      {/* comments bottom */}
      <section className="py-2 px-4">
        {subCommentRef?.id && (
          <div className="text-sm flex justify-between text-gray-500 my-2">
            replying to @{subCommentRef.data().username}
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
