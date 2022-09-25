import {
  BookmarkIcon,
  ChatAlt2Icon,
  EmojiHappyIcon,
  DotsHorizontalIcon,
  HeartIcon,
  PaperAirplaneIcon,
  DownloadIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import { XCircleIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  doc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Moment from "react-moment";
import { useSession } from "next-auth/react";
import { postView } from "../atoms/postView";
import { useRecoilState } from "recoil";

const Post = ({
  id,
  username,
  userImg,
  img,
  video,
  caption,
  timeStamp,
  router,
  deletePost,
}) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLike, setHasLike] = useState(false);
  const [view, setView] = useRecoilState(postView);
  const [user] = useDocumentData(doc(db, `profile/${username}`));

  useEffect(() => {
    setView(false);
  }, [router]);

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [id]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timeStamp", "asc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [id]
  );

  useEffect(
    () =>
      setHasLike(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes, session?.user?.uid]
  );

  const likePost = async () => {
    if (hasLike) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.username,
        userImg: session.user.image,
        timeStamp: serverTimestamp(),
      });
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImg: session.user.image,
      timeStamp: serverTimestamp(),
    });
  };

  return (
    <div>
      {router.asPath === "/" || view ? (
        <div className="bg-white border rounded-lg my-2 shadow-md dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center py-2 px-[5px] shadow-md bg-blue-500 dark:bg-gray-900 text-white">
            <div className="flex flex-1">
              <div className="relative rounded-full h-9 w-9 mr-3 ml-2">
                <Image
                  loading="eager"
                  layout="fill"
                  className="rounded-full"
                  src={user ? (user.profImg ? user.profImg : userImg) : userImg}
                  alt="img"
                />
              </div>
              <button
                onClick={() => router.push(`/profile/${username}`)}
                className="font-bold dark:text-gray-200 cursor-pointer w-auto"
              >
                {user ? user.fullname : username}
              </button>
            </div>
            <Moment fromNow className="mr-2 text-[10px]">
              {timeStamp?.toDate()}
            </Moment>
            {session?.user?.username === username ? (
              <XCircleIcon
                className="w-8 h-8 mr-3 cursor-pointer dark:text-gray-200"
                onClick={() => deletePost(id)}
              />
            ) : (
              <DotsHorizontalIcon className="btn pr-3 dark:text-gray-200" />
            )}
          </div>
          <div
            className={`${
              img ? "relative w-full h-[400px] md:h-[500px]" : ""
            } dark:bg-black bg-blue-200`}
          >
            {img && (
              <Image
                loading="eager"
                layout="fill"
                objectFit="contain"
                src={img}
                alt="cover"
              />
            )}
            {video && (
              <video
                autoPlay
                loop
                src={video}
                muted
                onClick={(e) => (e.target.muted = !e.target.muted)}
                controls
                className="w-full h-auto max-h-[500px] overflow-hidden"
              ></video>
            )}
          </div>

          <div className="flex justify-between px-3 py-2 bg-blue-500 dark:bg-gray-900 text-white items-center">
            <div className="flex space-x-3 items-center">
              {hasLike ? (
                <HeartIconFilled
                  onClick={likePost}
                  className="btn text-red-500"
                />
              ) : (
                <HeartIcon onClick={likePost} className="btn" />
              )}
              <ChatAlt2Icon
                className="btn"
                onClick={() => router.push(`/comment/${id}`)}
              />
              <PaperAirplaneIcon className="btn pt-1 rotate-90" />
            </div>
            <div className="flex space-x-3 items-center">
              <a href={img} alt="" download={img}>
                <DownloadIcon className="btn" />
              </a>
              <BookmarkIcon className="btn" />
            </div>
          </div>
          <p className="px-4 dark:text-gray-200 mb-2">
            {likes.length > 0 && (
              <button
                onClick={() => router.push(`/like/${id}`)}
                className="font-bold mb-1 flex"
              >
                {likes.length} {likes.length === 1 ? "like" : "likes"}
              </button>
            )}
            <button
              onClick={() => router.push(`/profile/${username}`)}
              className="font-bold mr-1"
            >
              {username}{" "}
            </button>
            <span className="text-sm">{caption}</span>
          </p>

          {comments.length > 0 && (
            <button
              onClick={() => router.push(`/comment/${id}`)}
              className="px-4 text-sm text-gray-400"
            >
              View {comments.length}{" "}
              {comments.length === 1 ? "comment" : "comments"}
            </button>
          )}

          <form className="flex items-center py-1 px-4">
            <EmojiHappyIcon className="h-7 dark:text-gray-200" />
            <input
              value={comment}
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
        </div>
      ) : (
        <div className="bg-blue-200 dark:bg-black rounded-md m-[1.5px]">
          <button
            onClick={() => setView(true)}
            className="relative h-[120px] w-[120px] sm:w-36 sm:h-36 md:h-[155px] md:w-[155px] rounded-md"
          >
            {img && (
              <Image
                src={img}
                layout="fill"
                objectFit="cover"
                loading="eager"
                alt="image"
                className="rounded-md"
              />
            )}
            {video && (
              <>
                <VideoCameraIcon className="h-5 w-5 absolute text-slate-200 m-1" />
                <video
                  autoPlay={false}
                  preload="metadata"
                  src={video}
                  className="h-full w-full overflow-hidden"
                ></video>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
