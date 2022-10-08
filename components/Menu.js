import {
  HomeIcon,
  PlusCircleIcon,
  ChatAlt2Icon,
  MoonIcon,
  SunIcon,
  SearchIcon,
  LogoutIcon,
} from "@heroicons/react/solid";
import {
  HomeIcon as AHomeIcon,
  PlusCircleIcon as APlusCircleIcon,
  ChatAlt2Icon as AChatAlt2Icon,
  SearchIcon as ASearchIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { useState } from "react";
import initBeams from "./initBeams";

const Menu = ({
  session,
  setOpen,
  signOut,
  router,
  darkMode,
  setDarkMode,
  open,
  user,
  setUserStatus,
}) => {
  const [active, setActive] = useState("");

  useState(() => {
    setActive(router.pathname);
  }, [router]);

  const handleAdd = () => {
    router.replace("/");
    setOpen(true);
  };

  const signout = () => {
    setUserStatus(false);
    if (typeof Notification !== "undefined") {
      initBeams("", "", signOut);
    }
  };

  return (
    <div className="xl:hidden max-w-6xl mx-auto">
      <div className="flex items-center space-x-3">
        <div onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? (
            <MoonIcon className="h-8 w-8 my-2 btn" />
          ) : (
            <SunIcon className="h-8 w-8 my-2 btn" />
          )}
        </div>
        {router.pathname.includes("/profile") && (
          <LogoutIcon onClick={signout} className="h-8 w-8 my-2 btn" />
        )}
      </div>
      <div className=" bg-white text-black dark:bg-gray-900 dark:text-gray-100 fixed bottom-0 w-full left-0 z-40 border-t border-gray-600">
        <ul className="flex justify-between py-3 px-5">
          <li onClick={() => router.push("/")}>
            {active === "/" ? (
              <HomeIcon className="h-7 w-7 btn" />
            ) : (
              <AHomeIcon className="h-7 w-7 btn" />
            )}
          </li>
          <li>
            {active.includes("Search") ? (
              <SearchIcon className="h-7 w-7 btn" />
            ) : (
              <ASearchIcon className="h-7 w-7 btn" />
            )}
          </li>
          <li onClick={handleAdd}>
            {open ? (
              <PlusCircleIcon className="h-7 w-7 btn" />
            ) : (
              <APlusCircleIcon className="h-7 w-7 btn" />
            )}
          </li>
          <li onClick={() => router.push("/Chats")}>
            {active.includes("Chat") ? (
              <ChatAlt2Icon className="h-7 w-7 btn" />
            ) : (
              <AChatAlt2Icon className="h-7 w-7 btn" />
            )}
          </li>
          <li onClick={() => router.push(`/profile/${session?.user.username}`)}>
            <div className="relative h-7 w-7 rounded-full cursor-pointer btn">
              <Image
                src={
                  user
                    ? user.profImg
                      ? user.profImg
                      : user.image
                    : session?.user?.image
                }
                alt="Profile Pic"
                loading="eager"
                layout="fill"
                className="rounded-full"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
