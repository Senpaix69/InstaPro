import Image from "next/image";
import { useState } from "react";
import { db } from "../firebase";
import { setDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const ProfileSec = ({ image, username, posts, bio, setBio, name, setName, session }) => {
    const [textBio, setTextBio] = useState('');
    const [textName, setTextName] = useState('');
    const [followers, setFollowers] = useState(0);
    const [followings, setFollowings] = useState(0);
    const [editProf, setEditProf] = useState(false);

    const saveEditing = async () => {
        const data = await getDoc(doc(db, "profile", username));
        if (textBio.trim().length > 0 && textName.trim().length > 0) {
            if (!data.exists()) {
                await setDoc(doc(db, "profile", username), {
                    username: username,
                    profImg: image,
                    timeStamp: serverTimestamp(),
                    bio: textBio,
                    fullname: textName,
                });
            } else {
                updateDoc(doc(db, "profile", username), {
                    bio: textBio,
                    fullname: textName,
                })
            }
            setBio(textBio)
            setName(textName)
        }
        setEditProf(false);
    }

    const cancelEditing = () => {
        setTextBio = "";
        setTextName = "";
        setEditProf(false);
    }

    return (
        <div className="relative w-full p-1 px-3 flex flex-col">
            <div className="flex px-2 relative md:justify-center">
                <div className="relative h-20 w-20 md:h-24 md:w-24 mr-10">
                    <Image
                        src={image ? image : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"}
                        layout="fill"
                        loading="eager"
                        alt="profile"
                        className="rounded-full"
                    />
                </div>
                <div className="absolute top-0 right-0 flex w-64 md:w-80 ml-10 justify-between md:max-w-2xl mt-5 px-4 text-lg">
                    <button className="flex flex-col items-center">
                        <p className="font-bold">{posts}</p>
                        <p className="text-sm mt-1 text-gray-400">Posts</p>
                    </button>
                    <button className="flex flex-col items-center">
                        <p className="font-bold">{followers}</p>
                        <p className="text-sm mt-1 text-gray-400">Followers</p>
                    </button>
                    <button className="flex flex-col items-center">
                        <p className="font-bold">{followings}</p>
                        <p className="text-sm mt-1 text-gray-400">Followings</p>
                    </button>
                </div>
            </div>
            {!editProf &&
                <div className="mt-1 flex flex-col md:items-center">
                    <h1 className="font-semibold text-sm">{username}</h1>
                    <h1 className="font-semibold text-lg"><span className="text-gray-400">~</span> {name}</h1>
                    <p className="text-sm">{bio}</p>
                </div>}
            {(username && username === session.user.username) ?
                <button onClick={() => setEditProf(true)} hidden={editProf} className="w-full mt-8 py-1 dark:bg-black border border-gray-700 rounded-md dark:hover:bg-gray-600 bg-blue-500 text-white font-semibold shadow-sm">Edit Profile</button> :
                <button className="w-full mt-8 py-1 dark:bg-black border border-gray-700 rounded-md dark:hover:bg-gray-600 bg-blue-500 text-white font-semibold shadow-sm">Follow</button>}
            {editProf &&
                <div className="mt-5 w-full md:max-w-6xl relative">
                    <p className="text-xs ml-3">Name</p>
                    <input className="bg-transparent border-none focus:ring-0 w-full" type='text' placeholder="Enter name" value={textName} onChange={(e) => setTextName(e.target.value)} />
                    <div className="border-b-2 ml-3 mr-3"></div>
                    <p className="mt-5 text-xs ml-3">Bio</p>
                    <input className="bg-transparent border-none focus:ring-0 w-full" type='text' placeholder="Enter bio" value={textBio} onChange={(e) => setTextBio(e.target.value)} />
                    <div className="border-b-2 ml-3 mr-3"></div>
                    <div className="relative h-10">
                        <div className="flex space-x-4 absolute bottom-1 right-3 text-white text-sm font-semibold">
                            <button onClick={saveEditing} className="bg-blue-500 w-20 h-7 rounded-lg">Save</button>
                            <button onClick={cancelEditing} className="bg-gray-500 w-20 h-7 rounded-lg">Cancel</button>
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default ProfileSec;
