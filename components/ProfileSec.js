import Image from "next/image";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const ProfileSec = ({
  posts,
  showFollowers,
  showFollowings,
  session,
  profile,
  setShowFollowers,
  setShowFollowings,
  followers,
  followings,
}) => {
  const [textBio, setTextBio] = useState("");
  const [textName, setTextName] = useState("");
  const [hasFollowed, setHasFollowed] = useState(false);
  const [followYou, setFollowYou] = useState(false);
  const [editProf, setEditProf] = useState(false);
  const [user, setUser] = useState({});
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    getDoc(doc(db, `profile/${profile}`)).then((userData) => {
      setBio(userData.data()?.bio ? userData.data()?.bio : "Bio");
      setName(userData.data()?.fullname ? userData.data()?.fullname : "Name");
      setUser(userData.data());
    });
  }, [profile]);

  const followUser = async () => {
    const load = toast.loading("Following...", { position: "top-center" });
    await setDoc(
      doc(db, `profile/${profile}/followers/${session.user.username}`),
      {
        username: session.user.username,
        profImg: session.user.image,
        timeStamp: serverTimestamp(),
      }
    );
    await setDoc(
      doc(db, `profile/${session.user.username}/followings/${profile}`),
      {
        username: user.username,
        profImg: user.profImg,
        timeStamp: serverTimestamp(),
      }
    );
    toast.update(load, {
      render: "Followed Successfully 😇",
      position: "top-center",
      type: "success",
      isLoading: false,
      autoClose: true,
    });
  };

  const unFollowUser = async () => {
    if (confirm(`Do you really want to unfollow: ${profile}`)) {
      const load = toast.loading("unfollowing...", { position: "top-center" });
      await deleteDoc(
        doc(db, `profile/${profile}/followers/${session.user.username}`)
      );
      await deleteDoc(
        doc(db, `profile/${session.user.username}/followings/${profile}`)
      );
      toast.update(load, {
        render: "Unfollowed Successfully 😇",
        position: "top-center",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  const saveEditing = async () => {
    if (textBio.trim().length > 0 && textName.trim().length > 0) {
      await updateDoc(doc(db, "profile", profile), {
        bio: textBio,
        fullname: textName,
      });
      setBio(textBio);
      setName(textName);
    }
    setEditProf(false);
  };

  useEffect(() => {
    setHasFollowed(
      followers?.findIndex(
        (user) => user.username === session?.user.username
      ) !== -1
    );
    setFollowYou(
      followings?.findIndex(
        (user) => user.username === session?.user.username
      ) !== -1
    );
  }, [followers, session]);

  const cancelEditing = () => {
    setTextBio = "";
    setTextName = "";
    setEditProf(false);
  };

  return (
    <div
      className={`relative w-full p-1 px-3 ${
        showFollowers || showFollowings ? "hidden" : "flex"
      } flex-col`}
    >
      <div className="flex px-2 relative md:justify-center">
        <div className="relative h-20 w-20 md:h-24 md:w-24">
          {profile === session?.user.username ? (
            <Image
              src={session.user.image}
              layout="fill"
              loading="eager"
              alt="profile"
              className="rounded-full"
            />
          ) : (
            <Image
              src={
                user?.profImg
                  ? user.profImg
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTagSIpNvrU1N3lvzrWDoSf5oJzABckJ3HbMw&usqp=CAU"
              }
              layout="fill"
              loading="eager"
              alt="profile"
              className="rounded-full"
            />
          )}
        </div>
        <div className="absolute top-0 right-0 flex w-64 xl:w-80 ml-10 justify-between md:max-w-2xl mt-5 px-4 text-lg">
          <button className="flex flex-col items-center">
            <p className="font-bold">{posts}</p>
            <p className="text-sm mt-1 text-gray-200">Posts</p>
          </button>
          <button
            onClick={() => setShowFollowers(true)}
            className="flex flex-col items-center"
          >
            <p className="font-bold">{followers ? followers.length : 0}</p>
            <p className="text-sm mt-1 text-gray-200">Followers</p>
          </button>
          <button
            onClick={() => setShowFollowings(true)}
            className="flex flex-col items-center"
          >
            <p className="font-bold">{followings ? followings.length : 0}</p>
            <p className="text-sm mt-1 text-gray-200">Followings</p>
          </button>
          {profile !== session.user.username && followings && (
            <div className="bg-gray-100 border border-gray-700 dark:bg-black text-sm text-center w-[226px] xl:w-[290px] py-1 rounded-md absolute -bottom-10 font-semibold">
              <span
                className={`${followYou ? "text-green-500" : "text-red-500"}`}
              >
                {followYou ? "Follows You" : "Not Follows You"}
              </span>
            </div>
          )}
        </div>
      </div>

      {!editProf && (
        <div className="mt-1 flex flex-col md:items-center">
          <h1 className="font-semibold text-sm">
            {profile === session?.user.username
              ? session?.user?.username
              : user?.username}
          </h1>
          <h1 className="font-semibold text-lg">
            <span className="text-gray-400">~</span> {name}
          </h1>
          <p className="text-sm text-gray-200">{bio}</p>
        </div>
      )}

      {profile === session.user.username ? (
        <button
          onClick={() => setEditProf(true)}
          hidden={editProf}
          className="w-full max-w-xl mx-auto mt-8 py-1 dark:bg-gray-700 border border-gray-700 rounded-2xl dark:hover:bg-gray-600 bg-blue-500 text-white font-semibold shadow-sm"
        >
          Edit Profile
        </button>
      ) : (
        <button
          onClick={!hasFollowed ? followUser : unFollowUser}
          className="w-full max-w-xl mx-auto mt-8 py-1 dark:bg-gray-700 border border-gray-700 rounded-2xl dark:hover:bg-gray-600 bg-blue-500 text-white font-semibold shadow-sm"
        >
          {hasFollowed ? "Unfollow" : "Follow"}
        </button>
      )}

      {editProf && (
        <div className="mt-5 w-full md:max-w-6xl relative">
          <p className="text-xs ml-3">Name</p>
          <input
            className="bg-transparent border-none focus:ring-0 w-full"
            type="text"
            placeholder="Enter name"
            value={textName}
            onChange={(e) => setTextName(e.target.value)}
          />
          <div className="border-b-2 ml-3 mr-3"></div>
          <p className="mt-5 text-xs ml-3">Bio</p>
          <input
            className="bg-transparent border-none focus:ring-0 w-full"
            type="text"
            placeholder="Enter bio"
            value={textBio}
            onChange={(e) => setTextBio(e.target.value)}
          />
          <div className="border-b-2 ml-3 mr-3"></div>
          <div className="relative h-10">
            <div className="flex space-x-4 absolute bottom-1 right-3 text-white text-sm font-semibold">
              <button
                onClick={saveEditing}
                className="bg-blue-500 w-20 h-7 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                className="bg-gray-500 w-20 h-7 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer autoClose={2500} theme="dark" />
    </div>
  );
};

export default ProfileSec;
