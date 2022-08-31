import { signIn } from "next-auth/react";

const Login = () => {
    return (
        <div className="flex flex-col m-auto col-span-3 items-center mt-20 shadow-lg rounded-lg w-full md:w-1/2 h-screen p-20 dark:bg-gray-900">
            <h1 className="dark:text-white italic flex items-center font-bold font-serif text-[50px]">
                Instagram Pro
            </h1>
            <h6 className="px-2 py-1 text-sm font-bold italic mt-10 text-gray-600 dark:text-gray-400">Welcome To Insta-Pro</h6>
            <button onClick={signIn} className="p-2 px-3 bg-blue-400 shadow-lg border rounded-lg text-lg font-bold italic mt-2 text-white cursor-pointer hover:text-blue-500 hover:bg-gray-50 dark:bg-slate-900 dark:border-slate-500 dark:text-gray-300 dark:hover:text-blue-600">Go To SignIn Page</button>
        </div>
    )
}

export default Login;