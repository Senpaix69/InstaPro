import { ArrowLeftIcon, SearchIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Moment from "react-moment";
import getUserProfilePic from "../utils/getUserProfilePic";

const Likes = ({ setOpenLikes, users, likes, router }) => {
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  const getName = (username) => {
    const currUser = users?.filter((user) => user.username === username)[0];
    return currUser.fullname ? currUser.fullname : username;
  };

  return (
    <div className="w-full md:max-w-3xl m-auto bg-gray-100 dark:text-gray-200 dark:bg-gray-900 fixed top-0 z-50 h-screen flex flex-col">
      {/* likes header */}
      <section className="w-full md:max-w-3xl dark:bg-gray-900">
        <div className="flex space-x-3 px-3 items-center dark:bg-gray-900 dark:text-white h-16">
          <ArrowLeftIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => setOpenLikes(false)}
          />
          <h1 className="text-lg font-bold">Likes</h1>
        </div>

        <div className="mx-3 mt-5 flex">
          <div className="flex items-center space-x-3 m-auto h-9 bg-slate-200 dark:bg-gray-700 rounded-lg p-3 w-full text-sm md:w-[60%] dark:bg-opacity-40">
            <SearchIcon className="h-4 w-4" />
            <input
              className="bg-transparent outline-none focus:ring-0"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="mx-3 mt-5 flex justify-between items-center mb-2">
          <h1 className="font-semibold">LIKED BY</h1>
          {likes?.length && (
            <p className="text-gray-400 text-sm">
              {likes.length} {likes.length === 1 ? "Like" : "Likes"}
            </p>
          )}
        </div>
        <div className="mx-3 border-b-2 border-gray-500"></div>
      </section>

      <section className="flex-1 overflow-y-scroll scrollbar-hide bg-white dark:bg-gray-900">
        <div className="mx-3">
          {likes
            ?.filter((user) => user.username.includes(search.toLowerCase()))
            .map((like, i) => (
              <div
                key={i}
                className="mt-1 pl-2 w-full flex justify-between items-center shadow-sm rounded-md dark:bg-gray-900 dark:shadow-gray-400"
              >
                <div className="relative h-16 flex items-center w-full">
                  <Image
                    loading="eager"
                    alt="image"
                    src={getUserProfilePic(like.username, users)}
                    height="40px"
                    width="40px"
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <h1
                      onClick={() => router.push(`/profile/${like.username}`)}
                      className="font-semibold mt-1 cursor-pointer flex space-x-1 items-center"
                    >
                      {getName(like.username)}
                      {like.username === "hurairayounas" && (
                        <div className="relative h-4 w-4">
                          <Image
                            src={require("../public/verified.png")}
                            layout="fill"
                            loading="eager"
                            alt="profile"
                            className="rounded-full"
                          />
                        </div>
                      )}
                    </h1>
                    {like.timeStamp && (
                      <Moment
                        className="text-gray-400 text-xs align-text-top"
                        fromNow
                      >
                        {like.timeStamp.toDate()}
                      </Moment>
                    )}
                  </div>
                </div>
                {like.username !== session?.user.username && (
                  <button
                    onClick={() => router.push(`/profile/${like.username}`)}
                    className="bg-gray-900 dark:bg-slate-600 dark:text-white bg-opacity-80 dark:bg-opacity-90 border-gray-400 py-1 px-6 text-xs font-semibold rounded-md"
                  >
                    Profile
                  </button>
                )}
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Likes;
