import { ArrowLeftIcon, SearchIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Moment from "react-moment";

const Likes = ({ setOpenLikes, users, likes, router }) => {
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  const getUserProfilePic = (username) => {
    let profileImg;
    users?.forEach((user) => {
      if (user.username === username) {
        profileImg = user.profImg ? user.profImg : user.image;
      }
    });
    return profileImg;
  };

  return (
    <div className="overflow-y-scroll scrollbar-hide">
      <div className="w-full md:max-w-3xl m-auto bg-gray-100 dark:text-gray-200 dark:bg-gray-900 fixed top-0 z-50 h-screen">
        {/* likes header */}
        <section className="sticky top-0 z-40 w-full md:max-w-3xl dark:bg-gray-900">
          <div className="flex space-x-3 px-3 items-center dark:bg-gray-900 dark:text-white h-16">
            <ArrowLeftIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => setOpenLikes(false)}
            />
            <h1 className="text-lg font-bold">Likes</h1>
          </div>

          <div className="mx-3 mt-5 flex">
            <div className="flex items-center space-x-3 m-auto h-9 bg-slate-200 dark:bg-gray-700 rounded-lg p-3 w-full text-sm md:w-[60%]">
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
                  className="w-full flex justify-between items-center"
                >
                  <div className="relative h-16 flex items-center w-full">
                    <Image
                      loading="eager"
                      alt="image"
                      src={getUserProfilePic(like.username)}
                      height="40px"
                      width="40px"
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <h1
                        onClick={() => router.push(`/profile/${like.username}`)}
                        className="font-semibold mt-1 cursor-pointer flex space-x-1 items-center"
                      >
                        {like.username}
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
    </div>
  );
};

export default Likes;
