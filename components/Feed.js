import MiniProfile from "./MiniProfile";
import Posts from "./Posts";
import Stories from "./Stories";
import Suggestions from "./Suggestions";
import { useSession } from 'next-auth/react';
import Login from "../pages/login";
import Notification from "./Notification";

const Feed = () => {
  const { data: session } = useSession();

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto dark:bg-gray-900">
      {session ? (
        <>
          <section className="col-span-2">
            <Stories />
            <Posts />
            <Notification />
          </section>

          <section className="hidden xl:inline-grid md:col-span-1">
            <div className="fixed top-20">
              <MiniProfile />
              <Suggestions />
            </div>
          </section>
        </>
      ) : (
        <Login />
      )}
    </main >
  )
}

export default Feed;