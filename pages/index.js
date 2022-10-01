import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import Model from "../components/Model";
import { useSession } from "next-auth/react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRecoilState } from "recoil";
import { themeState } from "../atoms/theme";
import { useEffect, useState } from "react";
import initBeams from "../components/initBeams";
import { userActivity } from "../atoms/userActivity";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function Home() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useRecoilState(themeState);
  const [load, setLoad] = useState(false);
  const [active, setActive] = useRecoilState(userActivity);
  const [user, loading] = useDocumentData(
    doc(db, `profile/${session?.user.username}`)
  );

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("theme"));
    setDarkMode(theme);
  }, []);

  useEffect(() => {
    const addProfile = async () => {
      getDoc(doc(db, "profile", session.user.username)).then(async (data) => {
        if (!data.exists()) {
          await setDoc(doc(db, "profile", session.user.username), {
            username: session.user.username,
            uid: session.user.uid,
            image: session.user?.image,
            email: session.user.email,
            timeStamp: serverTimestamp(),
          });
        }
      });
    };
    if (session) {
      addProfile();
      setActive(true);
      if (typeof Notification !== "undefined") {
        initBeams(session.user.uid);
      }
    }
  }, [session]);

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
    if (load) {
      const elements = document.querySelectorAll("video");
      elements.forEach((element) => {
        observer.observe(element);
      });
    }
  }, [load]);

  // const send = ()=>{
  //   initBeams("Push");
  // }

  return (
    <div
      className={`h-screen overflow-y-scroll scrollbar-hide ${
        darkMode ? "bg-gray-50" : "dark bg-black"
      }`}
    >
      <Head>
        <title>InstaPro</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <button className="h-10 w-full text-white font-semibold" onClick={send}>
        Send Notification
      </button> */}
      {!loading && (
        <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
      )}
      <Feed setLoad={setLoad} user={user} />
      <Model />
    </div>
  );
}
