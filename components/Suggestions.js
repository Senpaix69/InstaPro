import { useEffect, useState } from "react";
import { faker } from '@faker-js/faker';

const Suggestions = () => {
    const [suggestions, setSuggestions] = useState();

    useEffect(() => {
        const suggestions = [...Array(5)].map((_, i) => ({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            password: faker.internet.password(),
            birthdate: faker.date.birthdate(),
            company: faker.company.name(),
            id: i,
        }))
        setSuggestions(suggestions);
    }, [])


    return (
        <div className="mt-4 ml-5">
            <div className="flex justify-between text-sm mb-5">
                <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
                <button className="text-gray-500 font-semibold">See all</button>
            </div>

            {suggestions?.map((profile) => (
                <div key={profile.id}
                    className='flex items-center justify-between mt-3 dark:text-gray-200'>
                    <img className="w-10 h-10 rounded-full border p-[2px]"
                        src={profile.avatar} alt='profile pic' />
                    <div className="flex-1 ml-4">
                        <h2 className="font-semibold text-sm">
                            {profile.username}</h2>
                        <h3 className="text-xs text-gray-400">
                            Works at {profile.company}</h3>
                    </div>
                    <button className="text-blue-400 text-sm">
                        Follow</button>
                </div>
            ))}
        </div>
    )
}

export default Suggestions;