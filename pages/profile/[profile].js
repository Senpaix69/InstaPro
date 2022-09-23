import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { themeState } from "../../atoms/theme";
import Login from "../../pages/login";
import Header from "../../components/Header";
import Posts from "../../components/Posts";
import ProfileSec from "../../components/ProfileSec";
import FollowList from "../../components/FollowList";
import { postView } from "../../atoms/postView";
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
  const [totalPosts, setTotalPosts] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const { profile } = router?.query;

  const [followers] = useCollectionData(
    query(
      collection(db, `profile/${profile}/followers`),
      orderBy("timeStamp", "desc")
    )
  );
  const [followings, loading] = useCollectionData(
    query(
      collection(db, `profile/${profile}/followings`),
      orderBy("timeStamp", "desc")
    )
  );

  useEffect(() => {
    followings ? setShowFollowings(false) : setShowFollowers(false);
  }, [followings]);

  return (
    <>
      {session ? (
        <div
          className={`relative ${
            darkMode ? "bg-gray-50 " : "dark bg-gray-900"
          } h-screen overflow-y-scroll scrollbar-hide flex justify-center relative`}
        >
          <div className="max-w-6xl min-w-[380px] dark:text-gray-200 flex-1 overflow-y-scroll scrollbar-hide">
            <FollowList
              setShowFollowers={setShowFollowers}
              showFollowers={showFollowers}
              follow={true}
              followers={followers}
              router={router}
              currUsername={session?.user.username}
            />
            <FollowList
              setShowFollowings={setShowFollowings}
              showFollowings={showFollowings}
              followings={followings}
              router={router}
              currUsername={session?.user.username}
            />
            <Header
              showFollowers={showFollowers}
              showFollowings={showFollowings}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
            <ProfileSec
              posts={totalPosts}
              session={session}
              profile={profile}
              setShowFollowers={setShowFollowers}
              showFollowers={showFollowers}
              showFollowings={showFollowings}
              setShowFollowings={setShowFollowings}
              followers={followers}
              followings={followings}
            />
            <button
              hidden={showFollowers || showFollowings ? true : false}
              className="absolute z-50 bottom-20 ml-3 font-semibold bg-red-800 rounded-[10px] py-1 px-4"
              onClick={() => setView(!view)}
            >
              {view ? "G-View" : "P-View"}
            </button>
            {!showFollowers && !showFollowings && !loading && (
              <Posts setTotalPosts={setTotalPosts} profile={profile} />
            )}
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Profile;
