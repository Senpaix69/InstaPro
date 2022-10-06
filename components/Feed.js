import Posts from "./Posts";
import InstaStories from "./InstaStories";
import { useSession } from "next-auth/react";
import Login from "../pages/login";
import Notification from "./Notification";
import { useRecoilState } from "recoil";

const Feed = ({ setLoad, user }) => {
  const { data: session } = useSession();

  return (
    <main className="max-w-3xl mx-auto dark:bg-black scroll-smooth relative">
      {session ? (
        <>
          <section>
            <InstaStories user={user} />
            <Posts
              setLoad={setLoad}
              useRecoilState={useRecoilState}
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
