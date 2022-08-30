import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import Story from './Story';
import { useSession } from 'next-auth/react';

const Stories = () => {
    const [suggestions, setSuggestions] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        const suggestions = [...Array(20)].map((_, i) => ({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            password: faker.internet.password(),
            birthdate: faker.date.birthdate(),
            registeredAt: faker.date.past(),
            id: i,
        }))
        setSuggestions(suggestions);
    }, [])

    return (
        <div className='flex space-x-2 py-1 md:py-3 px-3 bg-white mt-1 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-none md:scrollbar-default
        md:scrollbar-thin scrollbar-thumb-gray-300 dark:bg-gray-900 dark:border-gray-800'>
            {session && <Story img={session?.user?.image} username={session?.user?.username} />}
            {suggestions.map((profile) => (
                <Story
                    key={profile.id}
                    img={profile.avatar}
                    username={profile.username}
                />
            ))}
        </div>
    )
}

export default Stories;