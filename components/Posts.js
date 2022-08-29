import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post";
import Loading from './Loading';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(
        () =>
            onSnapshot(query(collection(db, "posts"), orderBy('timeStamp', 'desc')),
                (snapshot) => {
                    setPosts(snapshot.docs);
                }
            ),
        []
    );

    return (
        <div>
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
                    />
                ))}
        </div>
    )
}

export default Posts;