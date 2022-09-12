import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { themeState } from '../../atoms/theme';
import Login from '../../pages/login';
import Header from "../../components/Header";
import Posts from "../../components/Posts";
import ProfileSec from "../../components/ProfileSec";
import { postView } from "../../atoms/postView";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";


const Profile = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [darkMode, setDarkMode] = useRecoilState(themeState);
    const [view, setView] = useRecoilState(postView);
    const [totalPosts, setTotalPosts] = useState(0);
    const [user, setUser] = useState({});
    const [bio, setBio] = useState('');
    const [name, setName] = useState('');
    const { profile } = router?.query;

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(darkMode));
    }, [darkMode])

    useEffect(() => {
        getDoc(doc(db, `profile/${profile}`)).then((userData) => {
            setBio(userData.data()?.bio ? userData.data()?.bio : "Bio");
            setName(userData.data()?.fullname ? userData.data()?.fullname : "Name");
            setUser(userData.data());
        })
    }, [profile])

    return (
        <>
            {session ? <div className={`relative ${darkMode ? "bg-gray-50 " : "dark bg-gray-900"} h-screen overflow-y-scroll scrollbar-hide flex justify-center`}>
                <div className="max-w-6xl min-w-[380px] dark:text-gray-200 flex-1 overflow-x-scroll scrollbar-hide">
                    {!view &&
                        <>
                            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                            <ProfileSec image={profile === session?.user.username ? session?.user?.image : user?.profImg} username={profile === session?.user.username ? session?.user?.username : user?.username} posts={totalPosts} profile={profile} bio={bio} setBio={setBio} name={name} setName={setName} session={session} />
                        </>}
                    <Posts setTotalPosts={setTotalPosts} profile={profile} />
                    <button disabled={!view} onClick={() => setView(false)} className={`w-full md:max-w-6xl text-white py-2 font-bold uppercase absolute bottom-0 z-50 transition duration-200 ${view ? "translate-y-0 dark:bg-blue-700" : "translate-y-10 dark:text-gray-900 dark:bg-gray-900"}`}>close view</button>
                </div>
            </div > : <Login />}
        </>
    )
}

export default Profile;
