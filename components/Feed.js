import Posts from "./Posts";
import InstaStories from "./InstaStories";
import { useSession } from "next-auth/react";
import Login from "../pages/login";
import Notification from "./Notification";
import { useRecoilState } from "recoil";
import { likesView } from "../atoms/likesView";

const Feed = ({ setLoad, user }) => {
  const { data: session } = useSession();
  const [openLikes] = useRecoilState(likesView);

  return (
    <main className="max-w-3xl mx-auto dark:bg-black scroll-smooth relative">
      {session ? (
        <>
          <section>
            <InstaStories user={user} openLikes={openLikes} />
            <Posts
              setLoad={setLoad}
              useRecoilState={useRecoilState}
              likesView={likesView}
            />
            <Notification />
          </section>
        </>
      ) : (
        <Login />
      )}
    </main>
  );
};

export default Feed;
