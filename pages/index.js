import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import Model from "../components/Model";
import { useSession } from "next-auth/react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRecoilState } from "recoil";
import { themeState, userActivity, beamsState } from "../atoms/states";
import { useEffect, useState } from "react";
import initBeams from "../components/initBeams";
import { toast } from "react-toastify";

export default function Home() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useRecoilState(themeState);
  const [beamsInitialized, setBeamsInitialized] = useRecoilState(beamsState);
  const [load, setLoad] = useState(false);
  const [active, setActive] = useRecoilState(userActivity);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("theme"));
    setDarkMode(theme);
    const beams = JSON.parse(localStorage.getItem("beamsState"));
    setBeamsInitialized(beams);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (session?.user && !user) {
      getDoc(doc(db, `profile/${session?.user.username}`)).then(
        async (prof) => {
          if (prof.exists()) {
            setUser(prof.data());
          } else {
            await setDoc(doc(db, "profile", session.user.username), {
              username: session.user.username,
              uid: session.user.uid,
              image: session.user?.image,
              email: session.user.email,
              timeStamp: serverTimestamp(),
            });
            toast.success(`Welcome User: ${session.user.username}🥰`, {
              toastId: session.user.uid,
            });
            setUser(session.user);
          }
        }
      );
      if (typeof Notification !== "undefined" && !beamsInitialized) {
        initBeams(session.user.uid, session.user.username, setBeamsInitialized);
      }
    }
    setActive(true);
  }, [session, beamsInitialized]);

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
    if (load) {
      observer = new IntersectionObserver(callback, { threshold: 0.6 });
      const elements = document.querySelectorAll("video");
      elements.forEach((element) => {
        observer.observe(element);
      });
    }
    return () => {
      observer?.disconnect();
    };
  }, [load]);

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
      <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
      <Feed setLoad={setLoad} user={user} />
      <Model />
    </div>
  );
}
