import Image from "next/image";
import Moment from "react-moment";
import {
  deleteDoc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import sendPush from "../utils/sendPush";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

const ChatList = ({
  redirect,
  id,
  user,
  toast,
  visitor,
  group,
  collection,
  removeChat,
  removeGroup,
  doc,
}) => {
  const [currUser, setCurrUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, loadingMessage] = useCollectionData(
    query(
      collection(
        db,
        `${id?.includes("group") ? "groups" : "chats"}/${id}/messages`
      ),
      orderBy("timeStamp", "desc"),
      limit(1)
    )
  );
  useEffect(() => {
    let unsub;
    if (user) {
      unsub = onSnapshot(doc(db, `profile/${user}`), (res) => {
        if (res.exists()) {
          setCurrUser(res.data());
        }
      });
    }
    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [user]);

  const deleteChat = async () => {
    const deletingWhat = id?.includes("group") ? "groups" : "chats";
    if (
      confirm(
        `Do You really want to delete this ${deletingWhat.slice(
          0,
          deletingWhat.length - 1
        )}?`
      )
    ) {
      setLoading(true);
      const toastId = toast.loading("deleting...", { toastId: "delete" });
      const checkGroup = await getDoc(doc(db, `${deletingWhat}/${id}`));
      if (checkGroup.exists()) {
        if (checkGroup.data()?.name) {
          if (
            checkGroup
              ?.data()
              .users?.find((user) => user.username === visitor.username)
              ?.creator
          ) {
            deleteAll(toastId, deletingWhat);
          } else {
            removeUser(checkGroup.data().users, toastId);
          }
        } else {
          deleteAll(toastId, deletingWhat);
        }
      }
    }
  };

  const removeUser = async (members, toastId) => {
    const newMembers = members?.filter(
      (itruser) => itruser.username !== visitor.username
    );
    if (newMembers?.length === 1) {
      await deleteDoc(doc(db, `groups/${id}`));
      setLoading(false);
    } else {
      await updateDoc(doc(db, `groups/${id}`), {
        users: newMembers,
      });
      setLoading(false);
    }
    if (!loading) {
      toast.dismiss(toastId);
      toast.success("Removed Member Successfully", { toastId: "success" });
    }
  };

  const deleteAll = async (toastId, deletingWhat) => {
    await deleteDoc(doc(db, `${deletingWhat}/${id}`))
      .then(() => {
        toast.dismiss(toastId);
        toast.success("Deleted Successfully 😄");
        if (deletingWhat === "groups") removeGroup(id);
        else removeChat(id);
      })
      .then(() => {
        setLoading(false);
        sendPush(
          currUser.uid,
          "",
          visitor.fullname || visitor.username,
          `has deleted ${group ? group : "your chat"}`,
          "",
          "https://insta-pro.vercel.app/chats"
        );
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };

  return (
    <div className="relative mx-3 my-1">
      <button
        disabled={loading}
        className="absolute right-2 cursor-pointer bg-red-600 text-gray-200 text-sm font-semibold mt-2 px-2 py-[1.5px] rounded-lg shadow-sm dark:bg-opacity-90"
        onClick={deleteChat}
      >
        delete
      </button>
      <div
        onClick={() => redirect(id)}
        className="flex items-center justify-center w-full py-2 cursor-pointer truncate"
      >
        <div className="flex items-center justify-center p-[1px] rounded-full cursor-pointer">
          <div className="relative w-14 h-14">
            <Image
              loading="eager"
              layout="fill"
              src={
                group
                  ? group.image
                  : currUser?.username
                  ? currUser.profImg
                    ? currUser.profImg
                    : currUser.image
                  : require("../public/userimg.jpg")
              }
              alt="story"
              className="rounded-full"
            />
            {!group && (
              <span
                className={`top-0 right-0 absolute w-4 h-4 ${
                  currUser?.active ? "bg-green-400" : "bg-slate-400"
                } border-[3px] border-white dark:border-gray-900 rounded-full`}
              ></span>
            )}
          </div>
        </div>
        <div className="ml-3 flex flex-col -space-y-1 w-full truncate">
          <div className="flex items-center">
            <h1 className="font-semibold">
              {group
                ? group.name
                : currUser?.fullname
                ? currUser.fullname
                : currUser?.username}
            </h1>
            {!group && currUser?.username === "hurairayounas" && (
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
                : `${message?.length > 0 ? `${message[0]?.username}: ` : ""} `}
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
