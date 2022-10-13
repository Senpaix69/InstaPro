import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [menu, setMenu] = useState([]);
  const [defMenu, setDefMenu] = useState([]);
  const [admin] = useState(
    members?.filter((member) => member.username === you)[0]?.admin || false
  );
  const [creator] = useState(
    members?.filter((member) => member.username === you)[0]?.creator || false
  );
  useEffect(() => {
    const dummy = new Array(members?.length).fill(-1);
    setDefMenu(dummy);
    setMenu(dummy);
  }, [members?.length]);

  const removeUser = async (username, status, user) => {
    if (status) {
      alert(`You can not remove ${status} of this group`);
    } else {
      const uidRef = user.uid;
      if (confirm(`Do you really want to remove ${username}?`)) {
        const newMembers = await members?.filter(
          (itruser) => itruser.username !== username
        );
        if (newMembers?.length === 1) {
          await deleteDoc(doc(db, `groups/${id}`)).then(() => {
            alert("Removed Member Successfully");
            sendNotification(uidRef, `has removed you from ${name}`);
            setShowMembers(false);
            setTimeout(() => {
              router.back();
            }, 3000);
          });
        } else {
          await updateDoc(doc(db, `groups/${id}`), {
            users: newMembers,
          });
          sendNotification(uidRef, `has removed you from ${name}`);
        }
      }
    }
  };

  const makeWhat = async (username, action) => {
    const user = getUser(username, users);
    const newMembers = [];
    members?.forEach((itruser) => {
      if (itruser.username === username) {
        if (action === "makeAdmin") {
          newMembers.push({
            username: itruser.username,
            admin: true,
          });
        } else if (action === "removeAdmin") {
          newMembers.push({
            username: itruser.username,
          });
        }
      } else {
        newMembers.push(itruser);
      }
    });
    updateDoc(doc(db, `groups/${id}`), {
      users: newMembers,
    });
    if (action === "makeAdmin")
      sendNotification(user?.uid, `has made you admin of ${name}`);
    else sendNotification(user?.uid, `has removed you from admin of ${name}`);
  };

  const sendNotification = (uid, message) => {
    const sender = getUser(you, users);
    sendPush(
      uid,
      "",
      sender?.fullname || you,
      message,
      sender?.profImg || sender.image,
      "https://insta-pro.vercel.app/chats"
    );
  };

  const openMenu = (index) => {
    const newMenu = [];
    menu.forEach((val, i) => {
      if (i === index) newMenu.push(val === 1 ? -1 : 1);
      else newMenu.push(-1);
    });
    setMenu(newMenu);
  };

  return (
    <>
      <div
        onClick={() => {
          setShowMembers(false);
          setMenu(defMenu);
        }}
        className={`${
          !showMembers ? "hidden" : ""
        } absolute w-full inset-0 h-screen z-30`}
      ></div>
      <div
        className={`absolute w-full max-w-[80%] h-screen text-white z-40 bg-gray-200 bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-90 p-3 transition-all duration-500 overflow-y-scroll scrollbar-hide backdrop-blur-sm ${
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
              onClick={() => {
                if (user.username !== you) openMenu(index);
              }}
              className={`my-2 flex items-start gap-2 p-[3px] rounded-full object-contain cursor-pointer ${
                menu[index] === 1 ? "scale-105" : "-z-10"
              } transition transform duration-200 ease-out hover:bg-gray-200 dark:hover:bg-gray-600 relative`}
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
                <p className="text-md font-semibold flex items-center gap-2">
                  {curUser?.fullname || curUser?.username}
                  {user?.creator ? (
                    <span className="text-xs font-semibold rounded-3xl px-2 bg-red-600">
                      creator
                    </span>
                  ) : (
                    user?.admin && (
                      <span className="text-xs font-semibold rounded-3xl px-2 bg-blue-500">
                        admin
                      </span>
                    )
                  )}
                </p>
                <p className="text-xs text-gray-300 truncate">{curUser?.bio}</p>
              </div>
              <div
                hidden={menu[index] === -1}
                className="absolute z-auto right-0 top-0 w-44 bg-white rounded shadow dark:bg-slate-700"
              >
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      onClick={() => router.push(`/profile/${user?.username}`)}
                      className="flex items-center w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-left"
                    >
                      Visit Profile
                    </button>
                  </li>
                  {(creator ||
                    (admin && !user?.creator && admin && !user?.admin)) && (
                    <li>
                      <button
                        onClick={() => {
                          e.stopPropagation();
                          setMenu(false);
                          removeUser(
                            user.username,
                            user.admin || user.creator,
                            curUser
                          );
                        }}
                        className="flex items-center w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-left"
                      >
                        Remove User
                      </button>
                    </li>
                  )}
                  {creator && (
                    <>
                      {!user?.admin && (
                        <li>
                          <button
                            onClick={() => makeWhat(user.username, "makeAdmin")}
                            className="flex items-center w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-left"
                          >
                            Make Admin
                          </button>
                        </li>
                      )}
                      {user?.admin && (
                        <li>
                          <button
                            onClick={() =>
                              makeWhat(user.username, "removeAdmin")
                            }
                            className="flex items-center w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-left"
                          >
                            Remove Admin
                          </button>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GroupMembers;
