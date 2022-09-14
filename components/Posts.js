import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post";
import Loading from './Loading';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { postView } from "../atoms/postView";
import { useRecoilState } from "recoil";

const Posts = ({ setTotalPosts, profile }) => {
    const [posts, setPosts] = useState(undefined);
    const { data: session } = useSession();
    const router = useRouter();
    const [view] = useRecoilState(postView);

    useEffect(() => {
        if (router.pathname === "/") {
            onSnapshot(query(collection(db, "posts"), orderBy('timeStamp', 'desc')),
                (snapshot) => {
                    setPosts(snapshot.docs);
                }
            )
        }
    }, [router.pathname]
    );

    useEffect(() => {
        if (router.pathname !== "/") {
            getDocs(query(collection(db, "posts"), where("username", "==", profile), orderBy('timeStamp', 'desc'))).then((snapshot) => {
                setPosts(snapshot?.docs);
                setTotalPosts(snapshot.docs?.length);
            })
        }
    }, [profile, router.pathname])

    return (
        <div className={`${router.asPath !== '/' && !view ? `grid ${posts?.length ? "grid-cols-3" : "grid-cols-1"} place-items-center md:flex md:flex-wrap p-3 justify-left` : ""}`}>
            {posts === undefined ? <Loading /> :
                posts?.map((post) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        username={post.data().username}
                        userImg={post.data().profImg}
                        img={post.data().image}
                        caption={post.data().caption}
                        timeStamp={post.data().timeStamp}
                        router={router}
                    />
                ))}
                {posts?.length === 0 && 
                <h1 className="font-bold mt-[30%] text-gray-400">No posts yet</h1>}
        </div>
    )
}

export default Posts;