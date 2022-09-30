import Loading from "../../components/Loading";
import { db } from "../../firebase";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { themeState } from "../../atoms/theme";
import Image from "next/image";
import Moment from "react-moment";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { HeartIcon, EmojiHappyIcon } from "@heroicons/react/outline";
import {
  collection,
  query,
  orderBy,
  addDoc,
  Timestamp,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

const CommentList = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { postid } = router.query;
  const [comments] = useCollection(
    query(
      collection(db, `posts/${postid}/comments`),
      orderBy("timeStamp", "desc")
    )
  );
  const [post] = useDocumentData(doc(db, `posts/${postid}`));
  const [darkTheme] = useRecoilState(themeState);
  const [subCommentRef, setSubCommentRef] = useState({});
  const [comment, setComment] = useState("");
  const focusElement = useRef(null);
  const [users, loading] = useCollectionData(collection(db, "profile"));

  const postComment = async (e) => {
    e.preventDefault();
    if (subCommentRef?.id) {
      addSubComment(subCommentRef.id, subCommentRef.data()?.subcomments);
    } else {
      const commentToSend = comment;
      setComment("");
      await addDoc(collection(db, `posts/${postid}/comments`), {
        comment: commentToSend,
        username: session.user.username,
        timeStamp: serverTimestamp(),
        subcomments: [],
      });
    }
    setSubCommentRef({});
  };

  const addSubComment = async (id, prevCom) => {
    const time = Timestamp.now();
    const commentToSend = comment;
    setComment("");
    await updateDoc(doc(db, `posts/${postid}/comments/${id}`), {
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
      await deleteDoc(doc(db, `posts/${postid}/comments/${id}`));
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
      await updateDoc(doc(db, `posts/${postid}/comments/${comment.id}`), {
        subcomments: newSubComment,
      });
    }
  };

  useEffect(() => {
    if (subCommentRef.id) {
      focusElement.current.focus();
    }
  }, [focusElement, subCommentRef]);

  const getUserProfilePic = (username) => {
    let profileImg;
    users?.forEach((user) => {
      if (user.username === username) {
        profileImg = user.profImg ? user.profImg : user.image;
      }
    });
    return profileImg;
  };

  return (
    <div
      className={`${
        !darkTheme ? "dark bg-gray-900" : ""
      } h-screen overflow-y-scroll scrollbar-hide`}
    >
      <div className="w-full md:max-w-3xl m-auto dark:text-gray-200 flex flex-col h-screen relative">
        {/* comments header */}
        <section className="sticky top-0 z-50 w-full md:max-w-3xl">
          <div className="flex space-x-3 px-3 items-center bg-blue-500 dark:bg-gray-900 text-white h-16">
            <ArrowLeftIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => router.back()}
            />
            <h1 className="text-lg font-bold">Comments</h1>
          </div>
        </section>

        {/* comments Body */}
        <section className="flex-1 overflow-y-scroll scrollbar-hide">
          {loading ? (
            <Loading page={"List"} />
          ) : (
            <>
              {post?.caption && (
                <div className="m-3 flex border-b-2 border-gray-600 pb-4 mb-5">
                  <div className="relative h-10 w-10">
                    {post.profImg && (
                      <Image
                        loading="eager"
                        alt="image"
                        src={getUserProfilePic(post.username)}
                        layout="fill"
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <div className="ml-3 flex-1 mr-3">
                    <div className="text-md">
                      <span
                        onClick={() =>
                          router.push(`/profile/${post?.username}`)
                        }
                        className={`font-bold cursor-pointer relative ${
                          post?.username === "hurairayounas" ? "mr-4" : ""
                        }`}
                      >
                        {post?.username}
                        {post?.username === "hurairayounas" && (
                          <div className="absolute top-[2.5px] left-[103px] sm:left-[107px]">
                            <div className="relative h-4 w-4">
                              <Image
                                src={require("../../public/verified.png")}
                                layout="fill"
                                loading="eager"
                                alt="profile"
                                className="rounded-full"
                              />
                            </div>{" "}
                          </div>
                        )}{" "}
                      </span>
                      {post.caption}
                    </div>
                    <Moment
                      fromNow
                      className="text-xs font-semibold text-gray-400"
                    >
                      {post.timeStamp?.toDate()}
                    </Moment>
                  </div>
                </div>
              )}
              <div className="m-3">
                {comments?.docs?.map((comment, i) => (
                  <div key={i} className="mb-5">
                    <div key={i} className="relative w-full flex">
                      <div className="absolute">
                        <div className="relative h-10 w-10">
                          <Image
                            loading="eager"
                            alt="image"
                            src={getUserProfilePic(comment.data().username)}
                            layout="fill"
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div className="ml-12 flex-1 mr-3">
                        <div className="text-sm">
                          <span
                            onClick={() =>
                              router.push(
                                `/profile/${comment?.data().username}`
                              )
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
                                    src={require("../../public/verified.png")}
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
                      <Moment fromNow>
                        {comment.data().timeStamp?.toDate()}
                      </Moment>
                      <button onClick={() => triggerUsername(comment)}>
                        Reply
                      </button>
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
                                src={getUserProfilePic(subCom.username)}
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
                                  subCom.username === "hurairayounas"
                                    ? "mr-4"
                                    : ""
                                }`}
                              >
                                {subCom.username}
                                {subCom.username === "hurairayounas" && (
                                  <div className="absolute top-[1.5px] left-[90px] sm:left-[94px]">
                                    <div className="relative h-4 w-4">
                                      <Image
                                        src={require("../../public/verified.png")}
                                        layout="fill"
                                        loading="eager"
                                        alt="profile"
                                        className="rounded-full"
                                      />
                                    </div>
                                  </div>
                                )}{" "}
                              </span>
                              {subCom.comment}
                            </div>
                          </div>
                          <HeartIcon className="h-5 w-5 btn" />
                        </div>
                        <div className="mt-1 text-xs text-gray-400 px-11 flex space-x-3 font-semibold">
                          <Moment fromNow>{subCom.timeStamp?.toDate()}</Moment>
                          <button
                            onClick={() =>
                              triggerUsername(comment, subCom.username)
                            }
                          >
                            Reply
                          </button>
                          {subCom.username === session?.user.username && (
                            <button
                              onClick={() => deleteSubComment(comment, index)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
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
    </div>
  );
};

export default CommentList;
