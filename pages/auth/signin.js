import { getProviders, signIn as signInto } from 'next-auth/react';
import Image from 'next/image';

const signIn = ({ providers }) => {
    return (
        <>
            <div className='flex flex-col items-center justify-cente mt-[170px] text-center'>
                <div className='relative h-44 w-[350px] md:w-80'>
                    <Image
                        layout='fill'
                        src='https://links.papareact.com/ocw' alt='Instagram' />
                </div>
                <p className='font-xs italic text-gray-500'>Made By Senpai</p>
                <div className='mt-20'>
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                            <button className='p-3 bg-blue-500 text-white rounded-lg hover:bg-gray-100 font-semibold hover:text-blue-500 shadow-lg border' onClick={() => signInto(provider.id, { callbackUrl: '/' })}>

                                Sign in with {provider.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps() {
    const providers = await getProviders()
    return {
        props: { providers },
    };
}

export default signIn;