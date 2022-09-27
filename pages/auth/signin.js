import { getProviders, signIn as signInto } from "next-auth/react";
import Image from "next/image";

const signIn = ({ providers }) => {
  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <div className="relative h-28 w-28">
          <Image
            loading="eager"
            src={require("../../public/icon-512x512.png")}
            alt="instaLogo"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <p className="font-xs italic text-gray-500">InstaPro</p>
        <div className="mt-10">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-gray-100 font-semibold hover:text-blue-500 shadow-lg border"
                onClick={() => signInto(provider.id, { callbackUrl: "/" })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default signIn;
