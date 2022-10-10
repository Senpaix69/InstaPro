import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import {
  themeState,
  postView,
  likesView,
  commentsView,
} from "../../atoms/states";
import Login from "../../pages/login";
import Header from "../../components/Header";
import Posts from "../../components/Posts";
import ProfileSec from "../../components/ProfileSec";
import FollowList from "../../components/FollowList";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Profile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useRecoilState(themeState);
  const [view, setView] = useRecoilState(postView);
  const [openLikes, setOpenLikes] = useRecoilState(likesView);
  const [openComments, setOpenComments] = useRecoilState(commentsView);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const { profile } = router?.query;
  const [load, setLoad] = useState(false);
  const [users, loading] = useCollectionData(collection(db, "profile"));

  const [followers] = useCollectionData(
    query(
      collection(db, `profile/${profile}/followers`),
      orderBy("timeStamp", "desc")
    )
  );
  const [followings] = useCollectionData(
    query(
      collection(db, `profile/${profile}/followings`),
      orderBy("timeStamp", "desc")
    )
  );

  useEffect(() => {
    return () => {
      setShowFollowings(false);
      setShowFollowers(false);
    };
  }, [followings]);

  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  };

  useEffect(() => {
    let observer;
    if (session) {
      observer = new IntersectionObserver(callback, { threshold: 0.6 });
    }
    if (load && view) {
      const elements = document.querySelectorAll("video");
      elements.forEach((element) => {
        observer.observe(element);
      });
    }
    return () => {
      observer?.disconnect();
      setOpenComments(false);
      setOpenLikes(false);
    };
  }, [load, view]);

  return (
    <>
      {session ? (
        <div
          className={`relative ${
            darkMode ? "bg-gray-50" : "dark bg-gray-900"
          } h-screen overflow-y-scroll scrollbar-hide flex justify-center relative`}
        >
          <div className="max-w-3xl min-w-[380px] dark:text-gray-200 flex-1 overflow-y-scroll scrollbar-hide">
            {loading ? (
              <Loading page={"profile"} />
            ) : (
              <>
                <FollowList
                  setShowFollowers={setShowFollowers}
                  showFollowers={showFollowers}
                  users={users}
                  follow={true}
                  followers={followers}
                  router={router}
                  currUsername={session?.user.username}
                />
                <FollowList
                  setShowFollowings={setShowFollowings}
                  users={users}
                  showFollowings={showFollowings}
                  followings={followings}
                  router={router}
                  currUsername={session?.user.username}
                />
                <Header
                  showFollowers={showFollowers}
                  showFollowings={showFollowings}
                  darkMode={darkMode}
                  user={
                    users?.filter(
                      (user) => user.username === session?.user.username
                    )[0]
                  }
                  setDarkMode={setDarkMode}
                />
                <ProfileSec
                  posts={totalPosts}
                  session={session}
                  openLikes={openLikes}
                  setOpenLikes={setOpenLikes}
                  openComments={openComments}
                  setOpenComments={setOpenComments}
                  view={view}
                  user={
                    users.filter((ituser) => ituser.username === profile)[0]
                  }
                  visitor={
                    users.filter(
                      (ituser) => ituser.username === session?.user.username
                    )[0]
                  }
                  setShowFollowers={setShowFollowers}
                  showFollowers={showFollowers}
                  showFollowings={showFollowings}
                  setShowFollowings={setShowFollowings}
                  followers={followers}
                  followings={followings}
                />
                <button
                  hidden={
                    showFollowers || showFollowings || openLikes || openComments
                      ? true
                      : false
                  }
                  className="absolute z-50 bottom-20 text-white dark:text-gray-300 bg-blue-400 font-semibold dark:bg-slate-700 rounded-r-2xl py-1 px-4"
                  onClick={() => setView(!view)}
                >
                  {view ? "G-View" : "P-View"}
                </button>
              </>
            )}
            <div className={loading ? "hidden" : ""}>
              <Posts
                showFollowers={showFollowers}
                showFollowings={showFollowings}
                setLoad={setLoad}
                setTotalPosts={setTotalPosts}
                profile={profile}
              />
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Profile;
