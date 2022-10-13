import Image from "next/image";
import { useState } from "react";
import sendPush from "../utils/sendPush";

const GroupMembers = ({
  name,
  members,
  deleteDoc,
  updateDoc,
  doc,
  db,
  you,
  getUser,
  users,
  id,
  showMembers,
  router,
  setShowMembers,
}) => {
  const [admin] = useState(
    members?.filter((member) => member.username === you)[0]?.admin || false
  );

  const removeUser = async (username, user) => {
    if (confirm(`Do you really want to remove ${username}?`)) {
      const newMembers = await members?.filter(
        (itruser) => itruser.username !== username
      );
      if (newMembers?.length === 1) {
        await deleteDoc(doc(db, `groups/${id}`)).then(() => {
          const uidRef = user.uid;
          alert("Removed Member Successfully");
          sendNotification(uidRef);
          setShowMembers(false);
          setTimeout(() => {
            router.back();
          }, 3000);
        });
      } else {
        await updateDoc(doc(db, `groups/${id}`), {
          users: newMembers,
        });
        sendNotification(username, user);
      }
    }
  };

  const sendNotification = (uid) => {
    const sender = getUser(you, users);
    const Sname = sender?.fullname ? sender?.fullname : you;
    sendPush(
      uid,
      "",
      Sname,
      `has removed you from ${name}`,
      "",
      "https://insta-pro.vercel.app/chats"
    );
  };

  return (
    <>
      <div
        onClick={() => setShowMembers(false)}
        className={`${
          !showMembers ? "hidden" : ""
        } absolute w-full inset-0 h-screen z-40`}
      ></div>
      <div
        className={`absolute w-full max-w-[80%] h-screen text-white z-50 bg-gray-200 bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-90 p-3 transition-all duration-500 overflow-y-scroll scrollbar-hide ${
          showMembers
            ? "translate-x-0 opacity-100"
            : "-translate-x-[100%] opacity-0"
        }`}
      >
        <h1 className="font-bold text-xl mb-4">Members</h1>
        {members.map((user, index) => {
          const curUser = getUser(user.username, users);
          const profImg = curUser?.profImg ? curUser.profImg : curUser?.image;
          return (
            <div
              key={index}
              onClick={() => router.push(`/profile/${user?.username}`)}
              className="my-2 flex items-start gap-2 p-[3px] rounded-full object-contain cursor-pointer hover:scale-105 transition transform duration-200 ease-out hover:bg-gray-200 dark:hover:bg-gray-600 relative"
            >
              <div className="relative w-12 h-12">
                <Image
                  loading="eager"
                  layout="fill"
                  src={profImg || require("../public/userimg.jpg")}
                  alt="story"
                  className="rounded-full"
                />
                <span
                  className={`top-0 right-0 absolute w-4 h-4 ${
                    curUser?.active ? "bg-green-400" : "bg-slate-400"
                  } border-[3px] border-white dark:border-gray-900 rounded-full`}
                ></span>
              </div>
              <div className="flex flex-col">
                <p className="text-md font-semibold flex items-center gap-4">
                  {curUser?.fullname || curUser?.username}
                  {user?.creator ? (
                    <span className="text-xs text-red-600">creator</span>
                  ) : (
                    user?.admin && (
                      <span className="text-xs text-blue-500">admin</span>
                    )
                  )}
                </p>
                <p className="text-xs text-gray-300 truncate">{curUser?.bio}</p>
              </div>

              {admin && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 absolute right-5 top-4 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUser(user.username, curUser);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GroupMembers;
