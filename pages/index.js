import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import Model from "../components/Model";
import { useSession } from "next-auth/react";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "../firebase";
import { useRecoilState } from 'recoil';
import { themeState } from "../atoms/theme";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useRecoilState(themeState);

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem('theme'))
    setDarkMode(theme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(darkMode))
  }, [darkMode]);

  useEffect(() => {
    const addUser = async () => {
      await setDoc(doc(db, "users", session.user.username), {
        username: session.user.username,
        uid: session.user.uid,
        profImg: session.user.image,
        timeStamp: serverTimestamp()
      });
    };
    if (session) addUser();
  }, [session])

  return (
    <div className={`h-screen overflow-y-scroll scrollbar-hide ${darkMode ? "bg-gray-50" : "dark bg-gray-900"}`}>
      <Head>
        <title>InstaPro</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Feed />
      <Model />
    </div>
  )
}