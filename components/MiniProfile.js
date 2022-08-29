import { signOut, useSession } from 'next-auth/react';

const MiniProfile = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between mt-14 ml-5">
      <img className="rounded-full w-16 h-16 border p-[2px]"
        src={session?.user?.image} alt="Profile Pic" />
      <div className="flex-1 mx-4">
        <h2 className="font-bold dark:text-gray-200">{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome To My Instagram</h3>
      </div>
      <button className="text-blue-400 font-semibold text-sm pr-5" onClick={signOut}>Sign Out</button>
    </div>
  )
}

export default MiniProfile;