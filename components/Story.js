import Image from "next/image";

const Story = ({ img, username }) => {
  return (
    <div>
      <div className="flex items-center justify-center p-[1px] rounded-full border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out">
        <div className="relative w-14 h-14">
          <Image
            loading='eager'
            layout="fill"
            src={img}
            alt='story'
            className="rounded-full"
          />
        </div>
      </div>
      <p className="text-xs w-14 mt-1 truncate text-center dark:text-gray-300">{username}</p>
    </div>
  )
}

export default Story;