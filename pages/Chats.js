import { db } from "../firebase";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Header from "../components/Header";
import {
  UserAddIcon,
  UserCircleIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { addDoc, collection, doc } from "firebase/firestore";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import Loading from "../components/Loading";
import getUserData from "../utils/getUserData";
import getOtherEmail from "../utils/getOtherEmail";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatList from "../components/ChatList";
import getUserActivity from "../utils/getUserActivity";
import { useRecoilState } from "recoil";
import { themeState } from "../atoms/states";
import axios from "axios";

const Chats = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState();
  const [search, setSearch] = useState("");
  const [snapshot, loading] = useCollection(collection(db, "chats"));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const values = getUserActivity();
  const [darkMode, setDarkMode] = useRecoilState(themeState);
  const [user] = useDocumentData(doc(db, `profile/${session?.user.username}`));
  const toastId = useRef(null);

  const chatExits = (email) => {
    let valid = false;
    chats?.map((docf) => {
      if (
        (docf.users[0].username === session.user.username &&
          docf.users[1].username === email) ||
        (docf.users[1].username === session.user.username &&
          docf.users[0].username === email)
      ) {
        valid = true;
        stop();
      }
    });
    return valid;
  };

  useEffect(() => {
    setUsers(getUserData(chats, session?.user.username));
  }, [snapshot]);

  const addUser = async () => {
    const uName = prompt("Enter username: ")?.split(" ").join("").toLowerCase();
    if (uName?.length) {
      if (uName !== session.user.username) {
        if (!chatExits(uName)) {
          toastId.current = toast.loading("Finding...");
          const ind = values.findIndex((user) => user.username === uName);
          if (ind !== -1 && !loading) {
            await addDoc(collection(db, "chats"), {
              users: [
                { username: values[ind].username },
                { username: session?.user.username },
              ],
            }).then(() => {
              toast.dismiss(toastId.current);
              toastId.current = null;
              toast.success("User Added Successfully 🤞");
              if (typeof Notification !== "undefined") {
                axios.post("/api/sendNotification", {
                  interest: values[ind].uid,
                  title: "InstaPro",
                  body: user.fullname + " has added you in chat",
                  icon: "https://firebasestorage.googleapis.com/v0/b/instapro-dev.appspot.com/o/posts%2Fimage%2Fraohuraira_57d3d606-eebc-4875-a843-eb0a03e3baf5?alt=media&token=33898c43-2cd1-459c-a5c9-efa29abb35a5",
                  link: "https://insta-pro.vercel.app/Chats",
                });
              }
            });
          } else {
            toast.warn("User Not Found 😐");
          }
        } else {
          toast.error("User Already Exist 🙂");
        }
      } else {
        toast.error("You can not add yourselt 🙄");
      }
    }
  };

  const redirect = (id) => {
    router.push(`/chat/${id}`);
  };

  if (!session && loading) return <Loading />;
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
            <button className="w-full flex text-lg justify-center items-center p-3 mb-2 shadow-md">
              <UserCircleIcon className="h-6 w-6 mr-2" />
              <h1
                onClick={() =>
                  router.push(`/profile/${session?.user.username}`)
                }
                className="font-semibold"
              >
                {session?.user.username}
              </h1>
            </button>
            <div className="mx-3 mb-5 flex">
              <div className="flex items-center space-x-3 m-auto h-9 bg-slate-100 dark:bg-gray-700 rounded-lg p-3 w-full text-sm md:w-[60%] dark:bg-opacity-40">
                <SearchIcon className="h-4 w-4" />
                <input
                  className="bg-transparent outline-none focus:ring-0 dark:placeholder:text-gray-300"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-bold ml-5 mb-2 flex-1">Messages</p>
              <button
                onClick={addUser}
                className="font-bold mr-5 text-sm text-blue-500 hover:underline"
              >
                <div className="flex">
                  <UserAddIcon className="h-4 w-4 mr-2 mt-[2px]" />
                  Add Chat
                </div>
              </button>
            </div>
            <div className="mt-1">
              {loading && values === undefined ? (
                <Loading page={router?.pathname} />
              ) : (
                users
                  ?.filter((curuser) =>
                    getOtherEmail(curuser, session.user).includes(
                      search.toLowerCase()
                    )
                  )
                  .map((curuser, i) => (
                    <ChatList
                      toast={toast}
                      axios={axios}
                      key={i}
                      visitor={user}
                      id={curuser.id}
                      redirect={redirect}
                      user={getOtherEmail(curuser, session.user)}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
