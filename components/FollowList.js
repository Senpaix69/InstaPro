import { ArrowLeftIcon, SearchIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import Image from "next/image";
const randomImg = require("../public/userimg.jpg");

const FollowList = ({
  setShowFollowers,
  setShowFollowings,
  showFollowers,
  showFollowings,
  follow,
  followers,
  followings,
  router,
  users,
  currUsername,
}) => {
  const [show, setShow] = useState([]);
  const [search, setSearch] = useState("");

  const getUserImage = (username) => {
    let profImg;
    users.forEach((user) => {
      if (user.username === username)
        profImg = user.profImg ? user.profImg : randomImg;
    });
    return profImg;
  };

  useEffect(() => {
    if (followers) {
      setShow([...followers]);
    } else if (followings) {
      setShow([...followings]);
    }
  }, [followers, followings]);

  return (
    <div hidden={showFollowers || showFollowings ? false : true}>
      {/* Followers header */}
      <section className="sticky top-0 z-50 w-full md:max-w-3xl">
        <div className="flex space-x-3 px-3 items-center bg-blue-500 dark:bg-gray-900 text-white h-16">
          <ArrowLeftIcon
            className="h-6 w-6 cursor-pointer"
            onClick={
              follow
                ? () => setShowFollowers(false)
                : () => setShowFollowings(false)
            }
          />
          <h1 className="text-lg font-bold">
            {follow ? "Followers" : "Followings"}
          </h1>
        </div>

        <div className="mx-3 mt-5 flex border-b-2 pb-4 border-gray-700">
          <div className="flex items-center space-x-3 m-auto h-9 bg-slate-100 dark:bg-gray-700 rounded-lg p-3 w-full text-sm md:w-[60%]">
            <SearchIcon className="h-4 w-4" />
            <input
              className="bg-transparent outline-none focus:ring-0"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="flex-1 overflow-y-scroll scrollbar-hide">
        <div className="mx-3">
          {show
            ?.filter((curruser) =>
              curruser.username.includes(search.toLowerCase())
            )
            .map((user, i) => (
              <div key={i} className="w-full flex justify-between items-center">
                <div className="relative h-16 flex items-center w-full">
                  <Image
                    loading="eager"
                    alt="image"
                    src={users ? getUserImage(user.username) : randomImg}
                    height="40px"
                    width="40px"
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <button
                      onClick={() => router.push(`/profile/${user.username}`)}
                      className="font-bold mt-1 cursor-pointer flex items-center"
                    >
                      {user.username}
                      {user.username === "hurairayounas" && (
                        <div className="relative h-4 w-4 ml-1">
                          <Image
                            src={require("../public/verified.png")}
                            layout="fill"
                            loading="eager"
                            alt="profile"
                            className="rounded-full"
                          />
                        </div>
                      )}
                    </button>
                    {user.timeStamp && (
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400 text-xs">
                          Followed:{" "}
                        </span>
                        <Moment
                          className="text-gray-400 text-xs align-text-top"
                          fromNow
                        >
                          {user.timeStamp.toDate()}
                        </Moment>
                      </div>
                    )}
                  </div>
                </div>
                {user.username !== currUsername && (
                  <button
                    onClick={() => router.push(`/profile/${user.username}`)}
                    className="bg-slate-600 py-1 px-6 text-xs font-semibold rounded-md text-white"
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

export default FollowList;
