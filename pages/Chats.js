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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatList from "../components/ChatList";
import getUserActivity from "../utils/getUserActivity";
import { useRecoilState } from "recoil";
import { themeState } from "../atoms/theme";

const Chats = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState();
  const [search, setSearch] = useState("");
  const [snapshot, loading] = useCollection(collection(db, "chats"));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const values = getUserActivity();
  const [darkMode, setDarkMode] = useRecoilState(themeState);
  const [user, loadingUser] = useDocumentData(
    doc(db, `profile/${session?.user.username}`)
  );
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
          const ind = values.findIndex((user) => user.username === uName);
          if (ind !== -1 && !loading) {
            toastId.current = toast.loading("Finding...", {
              position: "top-center",
            });
            await addDoc(collection(db, "chats"), {
              users: [
                { username: values[ind].username },
                { username: session?.user.username },
              ],
            }).then(() => {
              toast.dismiss(toastId.current);
              toastId.current = null;
              toast.success("User Added Successfully 🤞", {
                position: "top-center",
              });
            });
          } else {
            toast.warn("User Not Found 😐", {
              position: "top-center",
            });
          }
        } else {
          toast.error("User Already Exist 🙂", {
            position: "top-center",
          });
        }
      } else {
        toast.error("You can not add yourselt 🙄", {
          position: "top-center",
        });
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
              <div className="flex items-center space-x-3 m-auto h-9 bg-slate-100 dark:bg-gray-700 rounded-lg p-3 w-full text-sm md:w-[60%]">
                <SearchIcon className="h-4 w-4" />
                <input
                  className="bg-transparent outline-none focus:ring-0"
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
            <div>
              {loading && values === undefined ? (
                <Loading />
              ) : (
                users
                  ?.filter((curuser) =>
                    getOtherEmail(curuser, session.user).includes(
                      search.toLowerCase()
                    )
                  )
                  .map((user, i) => (
                    <ChatList
                      toast={toast}
                      key={i}
                      id={user.id}
                      redirect={redirect}
                      user={getOtherEmail(user, session.user)}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={2500} theme="dark" pauseOnFocusLoss={false} />
    </div>
  );
};

export default Chats;
