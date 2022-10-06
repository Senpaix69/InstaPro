import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { storyState, modelState } from "../atoms/states";
import { useRecoilState } from "recoil";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../firebase";
import Image from "next/image";

const InstaStories = ({ user }) => {
  const { data: session } = useSession();
  const [storyOpen, setStoryOpen] = useRecoilState(storyState);
  const [open, setOpen] = useRecoilState(modelState);
  const [users, uLoading] = useCollectionData(collection(db, "profile"));
  const [followings, fLoading] = useCollectionData(
    collection(db, `profile/${session.user.username}/followings`)
  );
  const [validUsers, setValidUsers] = useState([]);

  useEffect(() => {
    const getValidUsers = () => {
      users?.forEach((user) => {
        if (
          followings.forEach((us) => {
            if (us.username === user?.username) {
              setValidUsers((prev) => [...prev, user]);
            }
          })
        );
      });
    };
    if (!fLoading && !uLoading && validUsers.length === 0) {
      getValidUsers();
    }
  }, [fLoading, uLoading, user]);

  const postStories = () => {
    setStoryOpen(true);
    setOpen(true);
  };

  return (
    <div
      className="flex space-x-2 items-center py-1 md:py-3 px-3 bg-white mt-1 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-none md:scrollbar-default
        md:scrollbar-thin scrollbar-thumb-gray-300 dark:bg-gray-900 dark:border-gray-800"
    >
      <div>
        <PlusIcon
          onClick={postStories}
          className="h-[60px] w-[60px] btn bg-gray-600 dark:text-gray-400 border-2 border-gray-500 rounded-full p-1"
        />
        <p className="text-xs w-14 mt-1 truncate text-center dark:text-gray-300">
          Add Story
        </p>
      </div>
      {user && (
        <div>
          <div className="flex items-center justify-center p-[1px] rounded-full border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out">
            <div className="relative w-14 h-14">
              <Image
                loading="eager"
                layout="fill"
                src={user.profImg ? user.profImg : user.image}
                alt="story"
                className="rounded-full"
              />
            </div>
          </div>
          <p className="text-xs w-14 mt-1 truncate text-center dark:text-gray-300">
            {user.username}
          </p>
        </div>
      )}
      {validUsers?.map((curruser, index) => (
        <div key={index}>
          <div className="flex items-center justify-center p-[1px] rounded-full border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out">
            <div className="relative w-14 h-14">
              <Image
                loading="eager"
                layout="fill"
                src={curruser.profImg ? curruser.profImg : curruser.image}
                alt="story"
                className="rounded-full"
              />
            </div>
          </div>
          <p className="text-xs w-14 mt-1 truncate text-center dark:text-gray-300">
            {curruser.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InstaStories;
