import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";
import Post from "./Post";
import Loading from "./Loading";
import { useRouter } from "next/router";
import Likes from "../components/Likes";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { postView, likesView, commentsView } from "../atoms/states";
import { useRecoilState } from "recoil";
import Comments from "./Comments";
import { getUser } from "../utils/utilityFunctions";

const Posts = ({
  setTotalPosts,
  profile,
  setLoad,
  showFollowers,
  showFollowings,
}) => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState(undefined);
  const [postLikes, setPostLikes] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [curPost, setCurPost] = useState(null);
  const router = useRouter();
  const [view] = useRecoilState(postView);
  const toastId = useRef(null);
  const [users, loading] = useCollectionData(collection(db, "profile"));
  const [openLikes, setOpenLikes] = useRecoilState(likesView);
  const [openComments, setOpenComments] = useRecoilState(commentsView);
  const visitor = getUser(session?.user.username, users);
  let unsubscribe = null;

  useEffect(() => {
    if (posts) {
      setLoad(true);
    }
  }, [posts]);

  useEffect(() => {
    if (router.pathname === "/") {
      unsubscribe = onSnapshot(
        query(collection(db, "posts"), orderBy("timeStamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      );
    }
    return () => {
      setOpenComments(false);
      setOpenLikes(false);
      unsub();
    };
  }, [router.pathname]);

  useEffect(() => {
    if (router.pathname !== "/" && profile) {
      unsubscribe = onSnapshot(
        query(
          collection(db, "posts"),
          where("username", "==", profile),
          orderBy("timeStamp", "desc")
        ),
        (snapshot) => {
          setPosts(snapshot?.docs);
          setTotalPosts(snapshot.docs?.length);
        }
      );
    }
    return () => unsub();
  }, [profile, router.pathname]);

  const deletePost = async (id) => {
    if (confirm("Do you really want to delete this post?")) {
      toastId.current = toast.loading("deleting...");
      await deleteDoc(doc(db, "posts", id)).then(() => {
        toast.dismiss(toastId.current);
        toastId.current = null;
        toast.success("Post Deleted Successfully 👍");
      });
    }
  };

  const unsub = () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };

  return (
    <>
      {openLikes && (
        <Likes
          setOpenLikes={setOpenLikes}
          users={users}
          likes={postLikes}
          router={router}
        />
      )}
      {openComments && (
        <Comments
          setOpenComments={setOpenComments}
          users={users}
          router={router}
          comments={postComments}
          collection={collection}
          post={curPost}
          doc={doc}
          deleteDoc={deleteDoc}
        />
      )}
      <div
        className={`relative mb-14 ${
          showFollowers || showFollowings ? "hidden" : ""
        } ${
          router.asPath !== "/" && !view
            ? `grid ${
                posts?.length ? "grid-cols-3" : "grid-cols-1"
              } place-items-center md:flex md:flex-wrap p-3 justify-left`
            : ""
        }`}
      >
        {loading && posts === undefined ? (
          <Loading page={" "} />
        ) : (
          posts?.map((post, index) => (
            <Post
              key={post.id}
              ind={index}
              post={post}
              router={router}
              deletePost={deletePost}
              setOpenComments={setOpenComments}
              openComments={openComments}
              setPostComments={setPostComments}
              setCurPost={setCurPost}
              setOpenLikes={setOpenLikes}
              setPostLikes={setPostLikes}
              user={getUser(post.data().username, users)}
              visitor={visitor}
            />
          ))
        )}
        {posts?.length === 0 && (
          <h1 className="absolute font-bold left-[40%] top-[200px] text-gray-400">
            No posts yet 🙁
          </h1>
        )}
      </div>
    </>
  );
};

export default Posts;
