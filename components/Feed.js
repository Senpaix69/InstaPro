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
    <main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto dark:bg-black">
      {session ? (
        <>
          <section className="col-span-2">
            <div className="m-2 p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800">
              <span className="font-bold">CAUTION!</span> <span className="font-bold  text-red-500">Isbah's BirthDay: 30th September</span>
              <p className="font-medium">Feed Updates!</p>
              <p>1: You can now post comments and reply to a comment</p>
              <p>2: You can delete comments and also delete you sub-comments</p>
              <p>3: You can check which user has liked the posts</p>
              <span className="font-medium">Profile Updates!</span>
              <p>1: You can check other users profile by clicking on usernames</p>
              <p>2: You can check your own profile</p>
              <p>3: You can modify you profile name and bio</p>
              <span className="font-medium">Chat Updates!</span>
              <p>1: You can now send images in chat</p>
              <p>2: You can now delete chat and unsend texts</p>
              <span className="font-medium">Alert!</span> You can not follow/unfollow user for now
            </div>
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