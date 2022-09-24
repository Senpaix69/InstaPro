import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import Model from "../components/Model";
import { useSession } from "next-auth/react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRecoilState } from "recoil";
import { themeState } from "../atoms/theme";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useRecoilState(themeState);

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("theme"));
    setDarkMode(theme);
  }, []);

  useEffect(() => {
    const addProfile = async () => {
      const data = await getDoc(doc(db, "profile", session.user.username));
      if (!data.exists()) {
        await setDoc(doc(db, "profile", session.user.username), {
          fullname: session.user.name,
          bio: "",
          totalFollowers: 0,
          totalFollowings: 0,
          username: session.user.username,
          uid: session.user.uid,
          image: session.user?.image,
          profImg: "",
          email: session.user.email,
          timeStamp: serverTimestamp(),
        });
      }
    };
    if (session) addProfile();
  }, [session]);

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
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Feed />
      <Model />
    </div>
  );
}
