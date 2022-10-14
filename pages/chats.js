import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Header from "../components/Header";
import { UserAddIcon, UserGroupIcon, SearchIcon } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import Loading from "../components/Loading";
import {
  getValidUsers,
  getOtherEmail,
  getAllUsers,
} from "../utils/utilityFunctions";
import { uuidv4 } from "@firebase/util";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatList from "../components/ChatList";
import { useRecoilState } from "recoil";
import { themeState } from "../atoms/states";
import Image from "next/image";
import sendPush from "../utils/sendPush";

const Chats = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [validChats, setValidChats] = useState([]);
  const [validGroups, setValidGroups] = useState([]);
  const [search, setSearch] = useState("");
  const values = getAllUsers();
  const [darkMode, setDarkMode] = useRecoilState(themeState);
  const [user] = useDocumentData(doc(db, `profile/${session?.user.username}`));
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let unsubGroups;
    let unsubChats;
    if (session) {
      unsubGroups = onSnapshot(
        query(collection(db, "groups"), orderBy("timeStamp", "desc")),
        (gRes) => {
          if (!gRes.empty) {
            setValidGroups(
              getValidUsers(getArray(gRes.docs), session?.user.username)
            );
          }
        }
      );
      unsubChats = onSnapshot(
        query(collection(db, "chats"), orderBy("timeStamp", "desc")),
        (cRes) => {
          if (!cRes.empty) {
            setValidChats(
              getValidUsers(getArray(cRes.docs), session?.user.username)
            );
          }
        }
      );
    }
    return () => {
      if (unsubChats) {
        unsubChats();
      }
      if (unsubGroups) {
        unsubGroups();
      }
    };
  }, [session, router]);

  const getArray = (documents) => {
    const arr = [];
    documents.forEach((user) => {
      arr.push({
        id: user.id,
        ...user.data(),
      });
    });
    return arr;
  };

  const chatExits = (email) => {
    let valid = false;
    validChats?.map((docf) => {
      if (
        (docf.users[0].username === session.user.username &&
          docf.users[1].username === email) ||
        (docf.users[1].username === session.user.username &&
          docf.users[0].username === email)
      ) {
        if (!docf.name) {
          valid = true;
        }
        stop();
      }
    });
    return valid;
  };

  const addUser = async () => {
    setMenu(false);
    const uName = prompt("Enter username: ")?.split(" ").join("").toLowerCase();
    if (uName?.length > 0) {
      if (uName !== session.user.username) {
        if (!chatExits(uName)) {
          const ind = values?.findIndex((user) => user.username === uName);
          if (ind !== -1) {
            await addDoc(collection(db, "chats"), {
              users: [
                { username: values[ind].username },
                { username: session?.user.username },
              ],
              timeStamp: serverTimestamp(),
            }).then(() => {
              actions("chat", ind);
            });
          } else {
            toast.warn("User Not Found 😐", { toastId: "notFound" });
          }
        } else {
          toast.error("User Already Exist 🙂", { toastId: "exits" });
        }
      } else {
        toast.error("You can not add yourselt 🙄", { toastId: "eorr" });
      }
    }
  };

  const createGroup = async () => {
    setMenu(false);
    const ref = uuidv4().split("/")[0];
    const newUser = prompt("Enter Username: ")
      ?.split(" ")
      .join("")
      .toLowerCase();
    if (newUser?.length > 0) {
      const ind = values?.findIndex((user) => user.username === newUser);
      if (ind !== -1) {
        const name = prompt("Enter Group Name: ") || "MyGroup";
        await setDoc(doc(db, `groups/group-${ref}`), {
          name: name,
          image:
            "https://www.hotelbenitsesarches.com/wp-content/uploads/community-group.jpg",
          users: [
            { username: values[ind].username },
            { username: session?.user.username, creator: true },
          ],
          timeStamp: serverTimestamp(),
        }).then(() => {
          actions("group", ind, name);
        });
      } else {
        toast.warn("User Not Found 😐", { toastId: "notFound" });
      }
    }
  };

  const actions = (create, ind, name) => {
    toast.success(create + " created Successfully 🤞", { toastId: "added" });
    sendPush(
      values[ind]?.uid,
      "",
      user?.fullname || user?.username,
      `has added you in ${create === "group" ? name : "chat"}`,
      user?.profImg || user?.image,
      "https://insta-pro.vercel.app/chats"
    );
  };

  const removeChat = (id) => {
    setValidChats(validChats.filter((chat) => chat.id !== id));
  };

  const removeGroup = (id) => {
    setValidGroups(validGroups.filter((group) => group.id !== id));
  };

  const redirect = (id) => {
    router.push(`/chat/${id}`);
  };

  if (!session) return <Loading />;
  return (
    <div
      className={`h-screen overflow-y-scroll scrollbar-hide ${
        darkMode ? "bg-gray-200" : "dark bg-gray-900"
      }`}
    >
      <div className="flex flex-col justify-between max-w-6xl md:mx-5 lg:mx-auto">
        <Header setDarkMode={setDarkMode} darkMode={darkMode} user={user} />
        <div className="bg-gray-100 flex justify-center dark:text-gray-200 dark:bg-gray-900 h-screen">
          <div className="flex flex-col shadow-md md:w-[700px] w-full">
            <div className="relative w-full flex items-center justfy-between">
              <button className="flex text-lg w-full justify-center items-center p-3 mb-2 shadow-md">
                <div className="relative w-12 h-12">
                  <Image
                    loading="eager"
                    layout="fill"
                    src={user?.profImg ? user.profImg : session?.user.image}
                    alt="story"
                    className="rounded-full"
                  />
                </div>
                <h1
                  onClick={() =>
                    router.push(`/profile/${session?.user.username}`)
                  }
                  className="font-semibold ml-2"
                >
                  {user?.fullname ? user.fullname : session?.user.username}
                </h1>
              </button>
              <button
                onClick={() => setMenu((prev) => !prev)}
                className="absolute right-3 top-4 items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-0 focus:outline-none dark:text-white dark:bg-gray-800"
                type="button"
              >
                <div className="flex space-x-2">
                  Create
                  {menu ? (
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </div>
              </button>
              <div
                hidden={!menu}
                className="absolute right-3 top-16 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      onClick={addUser}
                      className="flex items-center w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-left"
                    >
                      <UserAddIcon className="mr-2 h-5 w-5" />
                      Create Chat
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={createGroup}
                      className="flex items-center w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-left"
                    >
                      <UserGroupIcon className="mr-2 h-5 w-5" />
                      Create Group
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mx-3 mb-5 flex">
              <div className="flex items-center space-x-3 m-auto h-9 bg-slate-100 dark:bg-gray-700 rounded-lg p-3 w-full text-sm md:w-[60%] dark:bg-opacity-40">
                <SearchIcon className="h-4 w-4" />
                <input
                  className="bg-transparent outline-none focus:ring-0 dark:placeholder:text-gray-300"
                  placeholder="search username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-1">
              {validGroups && validChats && values === undefined ? (
                <Loading page={router?.pathname} />
              ) : (
                <>
                  {validGroups.length > 0 && (
                    <p className="font-bold ml-4 my-2">Groups</p>
                  )}
                  {validGroups.map((group, i) => (
                    <ChatList
                      toast={toast}
                      collection={collection}
                      removeGroup={removeGroup}
                      doc={doc}
                      key={i}
                      visitor={user}
                      group={group}
                      id={group.id}
                      redirect={redirect}
                    />
                  ))}
                  {validChats.length > 0 && (
                    <p
                      className={`font-bold ml-4 ${
                        validGroups.length > 0 ? "mt-4" : "mt-1"
                      } mb-2`}
                    >
                      Messages
                    </p>
                  )}
                  {validChats
                    ?.filter((curuser) =>
                      getOtherEmail(curuser, session.user)?.includes(
                        search.toLowerCase()
                      )
                    )
                    .map((curuser, i) => (
                      <ChatList
                        toast={toast}
                        removeChat={removeChat}
                        collection={collection}
                        doc={doc}
                        key={i}
                        visitor={user}
                        id={curuser.id}
                        redirect={redirect}
                        user={getOtherEmail(curuser, session.user)}
                      />
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
