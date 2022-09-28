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
  updateDoc,
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
  videoViews,
  caption,
  timeStamp,
  router,
  deletePost,
  user
}) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLike, setHasLike] = useState(false);
  const [view, setView] = useRecoilState(postView);

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

  const handlePlay = async () => {
    await updateDoc(doc(db, "posts", id), {
      views: videoViews ? videoViews + 1 : 1,
    });
  };

  return (
    <div>
      {router.asPath === "/" || view ? (
        <div className="bg-white border rounded-lg my-2 shadow-md dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center py-2 px-[5px] shadow-md bg-blue-500 dark:bg-gray-900 text-white">
            <div className="flex flex-1 items-center">
              <div className="relative rounded-full h-9 w-9 mr-3 ml-2">
                <Image
                  loading="eager"
                  layout="fill"
                  className="rounded-full"
                  src={user ? (user.profImg ? user.profImg : userImg) : userImg}
                  alt="img"
                />
                <span
                  className={`-top-1 right-0 absolute  w-3.5 h-3.5 ${
                    user && user?.active ? "bg-green-400" : "bg-slate-500"
                  } border-2 border-white dark:border-gray-800 rounded-full`}
                ></span>
              </div>
              <button
                onClick={() => router.push(`/profile/${username}`)}
                className="font-bold dark:text-gray-200 cursor-pointer w-auto"
              >
                {user ? user.fullname : username}
              </button>
              {user?.username === "hurairayounas" && (
                <div className="ml-1 relative h-4 w-4">
                  <Image
                    src={require("../public/verified.png")}
                    layout="fill"
                    loading="eager"
                    alt="profile"
                    className="rounded-full"
                  />
                </div>
              )}
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
                onPlay={handlePlay}
                playsInline
                muted={
                  router.pathname?.includes("profile") && !view ? "muted" : ""
                }
                onClick={(e) => (e.target.muted = !e.target.muted)}
                className="w-full h-auto max-h-[500px] overflow-hidden"
              >
                <source src={video} />
              </video>
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
              <a href={img ? img : video} alt="" download={img ? img : video}>
                <DownloadIcon className="btn" />
              </a>
              <BookmarkIcon className="btn" />
            </div>
          </div>
          <div className="px-4 dark:text-gray-200 mb-2">
            <p className="flex space-x-2 font-semibold">
              {likes.length > 0 && (
                <button
                  onClick={() => router.push(`/like/${id}`)}
                  className="mb-1 flex"
                >
                  {likes.length} {likes.length === 1 ? "like" : "likes"}
                </button>
              )}
              {videoViews && (
                <span>{videoViews > 1 ? `${videoViews} views` : "1 view"}</span>
              )}
            </p>
            <button
              onClick={() => router.push(`/profile/${username}`)}
              className="font-bold mr-1"
            >
              {username}{" "}
            </button>
            <span className="text-sm">{caption}</span>
          </div>

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
            className="relative h-[120px] w-[120px] sm:w-36 sm:h-36 rounded-md"
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
                  preload="metadata"
                  muted
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
