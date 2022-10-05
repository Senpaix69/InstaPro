import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

const Login = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col m-auto items-center justify-center w-full h-screen p-20 dark:bg-gray-900">
      {!session ? (
        <>
          <div className="relative h-28 w-28">
            <Image
              loading="eager"
              src={require("../public/icon-512x512.png")}
              alt="instaLogo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h6 className="px-2 py-1 text-sm font-bold italic mt-10 text-gray-600 dark:text-gray-400">
            Welcome To InstaPro
          </h6>
          {!session && (
            <button
              onClick={signIn}
              className="p-2 px-3 bg-blue-400 shadow-lg border rounded-lg text-lg font-bold italic mt-2 text-white cursor-pointer hover:text-blue-500 hover:bg-gray-50 dark:bg-slate-900 dark:border-slate-500 dark:text-gray-300 dark:hover:text-blue-600"
            >
              Go To SignIn Page
            </button>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Login;
