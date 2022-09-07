import Image from "next/image";
import { useState } from "react";


const ProfileSec = ({ image, username, posts }) => {
    const [bio, setBio] = useState('Temp');
    const [name, setName] = useState('Temp');
    const [textBio, setTextBio] = useState('');
    const [textName, setTextName] = useState('');
    const [editProf, setEditProf] = useState(false);

    const saveEditing = () => {
        if (textBio.trim().length > 0) {
            setBio(textBio);
        }
        if (textName.trim().length > 0) {
            setName(textName);
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
                        src={image}
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
                        <p className="font-bold">15B</p>
                        <p className="text-sm mt-1 text-gray-400">Followers</p>
                    </button>
                    <button className="flex flex-col items-center">
                        <p className="font-bold">20</p>
                        <p className="text-sm mt-1 text-gray-400">Followings</p>
                    </button>
                </div>
            </div>
            {!editProf &&
                <div className="mt-1 flex flex-col md:items-center">
                    <h1 className="font-semibold text-sm">{username}</h1>
                    <h1 className="font-semibold text-lg">~ {name}</h1>
                    <p className="text-sm">{bio}</p>
                </div>}
            <button onClick={() => setEditProf(true)} hidden={editProf} className="w-full mt-8 py-1 dark:bg-black border border-gray-700 rounded-md dark:hover:bg-gray-600 hover:bg-blue-500 hover:text-white font-semibold shadow-sm">Edit Profile</button>
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
                            <button onClick={saveEditing} className="bg-blue-500 px-2 rounded-lg">Save</button>
                            <button onClick={cancelEditing} className="bg-gray-500 px-2 rounded-lg">Cancel</button>
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default ProfileSec;
