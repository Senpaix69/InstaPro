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

  console.log(name);

  const removeUser = async (username, user) => {
    if (confirm(`Do you really want to remove ${username}?`)) {
      const newMembers = await members?.filter(
        (itruser) => itruser.username !== username
      );
      if (newMembers?.length === 1) {
        console.log("first");
        await deleteDoc(doc(db, `chats/${id}`)).then(() => {
          const uidRef = user.uid;
          sendNotification(uidRef);
          setShowMembers(false);
          setTimeout(() => {
            router.back();
          }, 3000);
        });
      } else {
        await updateDoc(doc(db, `chats/${id}`), {
          users: newMembers,
        });
        console.log("second");
        sendNotification(username, user);
      }
    }
  };

  const sendNotification = (uid) => {
    const sender = getUser(you, users);
    const Sname = sender?.fullname || you;
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
        className={`absolute w-full max-w-[70%] h-screen text-white z-50 bg-gray-200 bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 p-5 transition-all duration-500 overflow-y-scroll scrollbar-hide ${
          showMembers
            ? "translate-x-0 opacity-100"
            : "-translate-x-[100%] opacity-0"
        }`}
      >
        <h1 className="font-bold text-lg">Members</h1>
        {members.map((user, index) => {
          const curUser = getUser(user.username, users);
          const profImg = curUser?.profImg || curUser?.image;
          return (
            <div
              key={index}
              onClick={() => router.push(`/profile/${user?.username}`)}
              className="mt-4 flex items-start gap-2 p-[2px] rounded-full object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out hover:bg-gray-200 dark:hover:bg-gray-600 relative"
            >
              <div className="relative w-14 h-14">
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
              <div className="flex flex-col items-center">
                <h1 className="text-lg font-semibold">
                  {curUser?.fullname || curUser?.username}
                </h1>
                <p className="text-sm text-gray-300">{curUser.bio}</p>
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
