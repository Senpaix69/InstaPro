import Image from "next/image";
import Moment from "react-moment";
import {
  collection,
  deleteDoc,
  doc,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import sendPush from "../utils/sendPush";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useRef } from "react";

const ChatList = ({ redirect, id, user, toast, visitor }) => {
  const [message, loadingMessage] = useCollectionData(
    query(
      collection(db, `chats/${id}/messages`),
      orderBy("timeStamp", "desc"),
      limit(1)
    )
  );
  const [currUser, loading] = useDocumentData(doc(db, `profile/${user}`));
  const toastId = useRef(null);

  const deleteChat = async () => {
    if (confirm("Do You really want to delete this chat?")) {
      toastId.current = toast.loading("deleting...");
      await deleteDoc(doc(db, "chats", id))
        .then(() => {
          toast.dismiss(toastId.current);
          toastId.current = null;
          toast.success("Deleted Successfully 😄");
        })
        .then(() => {
          sendPush(
            currUser.uid,
            "",
            visitor.fullname,
            "has delete your chat",
            "",
            "https://insta-pro.vercel.app/Chats"
          );
        });
    }
  };

  return (
    <div className="relative mx-3 my-1">
      <button
        className="absolute right-2 cursor-pointer bg-red-600 text-gray-200 text-sm font-semibold mt-2 px-2 py-[1.5px] rounded-lg shadow-sm dark:bg-opacity-90"
        onClick={deleteChat}
      >
        delete
      </button>
      <div
        onClick={() => redirect(id)}
        className="flex items-center justify-center w-full py-2 cursor-pointer truncate"
      >
        <div className="flex items-center justify-center p-[1px] rounded-full object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out">
          <div className="relative w-14 h-14">
            <Image
              loading="eager"
              layout="fill"
              src={
                currUser
                  ? currUser.profImg
                    ? currUser.profImg
                    : currUser.image
                  : require("../public/userimg.jpg")
              }
              alt="story"
              className="rounded-full"
            />
            <span
              className={`top-0 right-0 absolute w-4 h-4 ${
                !loading && currUser?.active ? "bg-green-400" : "bg-slate-400"
              } border-[3px] border-white dark:border-gray-900 rounded-full`}
            ></span>
          </div>
        </div>
        <div className="ml-3 flex flex-col -space-y-1 w-full truncate">
          <div className="flex items-center">
            <h1 className="font-semibold">
              {currUser?.fullname ? currUser.fullname : currUser?.username}
            </h1>
            {currUser?.username === "hurairayounas" && (
              <div className="relative h-4 w-4">
                <Image
                  src={require("../public/verified.png")}
                  layout="fill"
                  loading="eager"
                  alt="profile"
                  className="rounded-full"
                />
              </div>
            )}
          </div>
          <div className="flex text-sm w-full justify-between items-center pr-2">
            <span className="text-gray-400 w-[70%] overflow-hidden truncate">
              {!loadingMessage && message[0]?.username === visitor.username
                ? "You: "
                : ""}
              {!loadingMessage
                ? message[0]?.text?.length > 0
                  ? message[0].text
                  : message[0]?.image
                  ? "image/"
                  : message[0]?.image
                  ? "video/"
                  : "tap to send text"
                : "loading.."}
            </span>
            {!loadingMessage && (
              <Moment fromNow className="text-[9px] text-gray-400 mt-2">
                {message[0]?.timeStamp?.toDate()}
              </Moment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
