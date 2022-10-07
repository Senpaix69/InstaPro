import Posts from "./Posts";
import InstaStories from "./InstaStories";
import { useSession } from "next-auth/react";
import Login from "../pages/login";
import { useRecoilState } from "recoil";
import { commentsView, likesView } from "../atoms/states";

const Feed = ({ setLoad, user }) => {
  const { data: session } = useSession();
  const [openLikes] = useRecoilState(likesView);
  const [openComments] = useRecoilState(commentsView);

  return (
    <main className="max-w-3xl mx-auto dark:bg-black scroll-smooth relative">
      {session ? (
        <>
          <section>
            <InstaStories
              user={user}
              openLikes={openLikes}
              openComments={openComments}
            />
            <Posts setLoad={setLoad} />
          </section>
        </>
      ) : (
        <Login />
      )}
    </main>
  );
};

export default Feed;
