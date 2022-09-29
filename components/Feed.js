import Posts from "./Posts";
import Stories from "./Stories";
import { useSession } from "next-auth/react";
import Login from "../pages/login";
import Notification from "./Notification";

const Feed = ({ setLoad, user }) => {
  const { data: session } = useSession();

  return (
    <main className="max-w-3xl mx-auto dark:bg-black scroll-smooth">
      {session ? (
        <>
          <section>
            {user && <Stories user={user} />}
            <Posts setLoad={setLoad} />
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
