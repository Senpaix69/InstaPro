import MiniProfile from "./MiniProfile";
import Posts from "./Posts";
import Stories from "./Stories";
import Suggestions from "./Suggestions";
import { useSession } from 'next-auth/react';
import Login from "../pages/login";
import Notification from "./Notification";
import { showUpdate } from '../atoms/showUpdate';
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";

const Feed = () => {
  const { data: session } = useSession();
  const [update, setUpdate] = useRecoilState(showUpdate);
  const [timer, setTimer] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!update) {
      setTimer(false);
      setTimeout(() => {
        setShowNotification(false);
      }, 500)
    } else {
      setTimeout(() => {
        setShowNotification(true);
        setTimeout(()=>{
          setTimer(true)
        }, 300)
      }, 500)
    }
  }, [update])

  return (
    <main className="grid grid-cols-1 max-w-6xl xl:grid-cols-3 mx-auto dark:bg-black">
      {session ? (
        <>
          <section className="col-span-2">
            <div hidden={!showNotification} className={`m-2 p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-gray-900 dark:text-gray-300 transition-all duration-700 ${timer ? "translate-y-0" : "-translate-y-96"}`}>
              <span className="font-bold">CAUTION!</span> <span className="font-bold  text-red-500">Isbah BirthDay: 30th September</span>
              <p className="font-medium">Feed Updates!</p>
              <p>1: You can now post comments and reply to a comment</p>
              <p>2: You can delete comments and also delete your sub-comments</p>
              <p>3: You can check which user has liked the posts</p>
              <span className="font-medium">Profile Updates!</span>
              <p>1: You can check other users profile by clicking on usernames</p>
              <p>2: You can follow and unfollow users</p>
              <p>3: You can check your own profile</p>
              <p>4: You can modify you profile name and bio</p>
              <span className="font-medium">Chat Updates!</span>
              <p>1: You can now send images in chat</p>
              <p>2: You can now delete chat and unsend texts</p>
              <button onClick={() => setUpdate(false)} className="w-full bg-blue-400 rounded-md text-md py-1 shadow-md mt-6 text-white dark:bg-gray-600 font-medium">close</button>
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