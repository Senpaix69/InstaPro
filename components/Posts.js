import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post";
import Loading from './Loading';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { postView } from "../atoms/postView";
import { useRecoilState } from "recoil";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const { data: session } = useSession();
    const router = useRouter();
    const [view] = useRecoilState(postView);

    useEffect(() => {
        if (router.asPath === "/") {
            onSnapshot(query(collection(db, "posts"), orderBy('timeStamp', 'desc')),
                (snapshot) => {
                    setPosts(snapshot.docs);
                }
            )
        } else {
            onSnapshot(query(collection(db, "posts"), where("username", "==", session?.user?.username), orderBy('timeStamp', 'desc')),
                (snapshot) => {
                    setPosts(snapshot.docs);
                }
            )
        }
    }, []
    );

    return (
        <div className={`${router.asPath !== '/' && !view ? "flex flex-wrap p-3 justify-center" : ""}`}>
            {posts?.length === 0 ? <Loading /> :
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
        </div>
    )
}

export default Posts;