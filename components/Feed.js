import MiniProfile from "./MiniProfile";
import Posts from "./Posts";
import Stories from "./Stories";
import Suggestions from "./Suggestions";
import { useSession } from "next-auth/react";
import Login from "../pages/login";
import Notification from "./Notification";
import { showUpdate } from "../atoms/showUpdate";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";

const Feed = ({ setLoad }) => {
  const { data: session } = useSession();
  const [update, setUpdate] = useRecoilState(showUpdate);
  const [timer, setTimer] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!update) {
      setTimer(false);
      setTimeout(() => {
        setShowNotification(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setShowNotification(true);
        setTimeout(() => {
          setTimer(true);
        }, 300);
      }, 3000);
    }
  }, [update]);

  return (
    <main className="grid grid-cols-1 max-w-6xl xl:grid-cols-3 mx-auto dark:bg-black scroll-smooth">
      {session ? (
        <>
          <section className="col-span-2">
            <div
              hidden={!showNotification}
              className={`m-2 p-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-gray-900 dark:text-gray-300 transition-all duration-1000 ease-in-out ${
                timer ? "" : "-mt-[150px] sm:-mt-[100px] -translate-y-full"
              }`}
            >
              <span className="font-bold">CAUTION!</span>{" "}
              <span className="font-bold  text-red-500">
                Isbah BirthDay: 30th September
              </span>
              <p className="font-medium">
                Note:{" "}
                <span>
                  Optimizing The Whole Application Please Cooperate 😊
                </span>
              </p>
              <button
                onClick={() => setUpdate(false)}
                className="w-full bg-blue-400 rounded-md text-md py-1 shadow-md mt-6 text-white dark:bg-gray-600 font-medium"
              >
                close
              </button>
            </div>

            <Stories />
            <Posts setLoad={setLoad} />
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
    </main>
  );
};

export default Feed;
