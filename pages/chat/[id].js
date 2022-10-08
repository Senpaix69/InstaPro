import {
  ArrowLeftIcon,
  ArrowRightIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import Moment from "react-moment";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import Loading from "../../components/Loading";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import getChatMessages from "../../utils/getChatMessages";
import getOtherEmail from "../../utils/getOtherEmail";
import axios from "axios";
import { useRecoilState } from "recoil";
import { themeState } from "../../atoms/states";
import { uuidv4 } from "@firebase/util";
import { toast, ToastContainer } from "react-toastify";

const Chat = () => {
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const messagesEndRef = useRef(null);
  const [sending, setSending] = useState(false);
  const messages = getChatMessages(id);
  const [selectFile, setSelectFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const filePickerRef = useRef(null);
  const [status, setStatus] = useState(0);
  const [darkMode] = useRecoilState(themeState);
  const [chat] = useDocumentData(doc(db, `chats/${id}`));
  const [user] = useDocumentData(
    doc(db, `profile/${getOtherEmail(chat, session?.user)}`)
  );
  const [secUser] = useDocumentData(
    doc(db, `profile/${session?.user.username}`)
  );

  const sendMessage = async (e) => {
    e.preventDefault();
    const msgToSend = text;
    setText("");

    if (selectFile) {
      const imgRef = selectFile;
      setSelectFile(null);
      setSending(true);
      const storageRef = ref(
        storage,
        `chats/${fileType}/${session?.user.username}-${uuidv4()}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imgRef);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setStatus(percent);
        },
        (err) => {
          setStatus(0);
          setFileType("");
          setSending(false);
        },
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (url) => {
              await addDoc(collection(db, "chats", id, "messages"), {
                text: msgToSend,
                username: session.user.username,
                timeStamp: serverTimestamp(),
                [fileType]: url,
              });
            })
            .then(() => {
              msgSend(msgToSend);
            });
        }
      );
    } else {
      await addDoc(collection(db, "chats", id, "messages"), {
        text: msgToSend,
        username: session.user.username,
        timeStamp: serverTimestamp(),
      }).then(() => {
        msgSend(msgToSend);
      });
    }
  };
  const msgSend = (msgToSend) => {
    if (typeof Notification !== "undefined") {
      axios.post("/api/sendNotification", {
        interest: user.uid,
        title: secUser.fullname,
        body: fileType ? fileType + "/" : msgToSend,
        icon: secUser.profImg ? secUser.profImg : secUser.image,
        link: "https://insta-pro.vercel.app/chat/" + id,
      });
    }
    setStatus(0);
    setFileType("");
    setSending(false);
  };

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const unsendMessage = async (msgID) => {
    if (confirm("Unsend Message?")) {
      await deleteDoc(doc(db, "chats", id, "messages", msgID));
    }
  };

  const addMedia = (file) => {
    if (file) {
      setFileType(file.type.includes("image") ? "image" : "video");
      if (fileType === "image") {
        if (file.size / (1024 * 1024) > 3) {
          toast.error("Image size is larger than 3mb");
        } else {
          setSelectFile(file);
        }
      } else if (file.size / (1024 * 1024) > 50) {
        toast.error("Video size is larger than 50mb");
      } else {
        setSelectFile(file);
      }
    }
  };

  const getProfileImage = (username) => {
    if (user?.username === username) {
      return user.profImg ? user.profImg : user.image;
    } else {
      return secUser.profImg ? secUser.profImg : secUser.image;
    }
  };

  return (
    <div className={darkMode ? "bg-gray-100" : "dark bg-gray-900"}>
      <div className="max-w-6xl lg:mx-auto flex justify-center">
        <div
          className="dark:bg-black bg-[url('https://i.pinimg.com/originals/b7/fc/af/b7fcaf2631fc54f28ef3f123855d03dc.jpg')] dark:bg-[url('https://wallpapercave.com/wp/wp9100371.jpg')]
            bg-no-repeat bg-cover bg-center w-full flex flex-col md:w-[700px] h-screen overflow-y-scroll scrollbar-hide"
        >
          {/* Chat Header */}
          <section className="shadow-md bg-white sticky top-0 z-50 dark:bg-gray-900 dark:text-gray-200">
            <div className="flex items-center px-2 py-1">
              <ArrowLeftIcon
                onClick={() => router?.back()}
                className="btn m-1"
              />
              <div className="flex items-center justify-center p-[1px] rounded-full object-contain mx-2">
                <div className="relative w-12 h-12">
                  <Image
                    loading="eager"
                    layout="fill"
                    src={
                      user
                        ? user.profImg
                          ? user.profImg
                          : user.image
                        : require("../../public/userimg.jpg")
                    }
                    alt="prof"
                    className="rounded-full"
                  />
                </div>
              </div>
              <button
                disabled={user ? false : true}
                onClick={() => router.push(`/profile/${user?.username}`)}
                className="text-left"
              >
                <div className="flex items-center">
                  <h1 className="font-bold">
                    {user ? user?.fullname : "Loading..."}
                  </h1>
                  {user?.username === "hurairayounas" && (
                    <div className="relative h-4 w-4">
                      <Image
                        src={require("../../public/verified.png")}
                        layout="fill"
                        loading="eager"
                        alt="profile"
                        className="rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  <span className="text-xs md:text-sm text-gray-400">
                    active
                  </span>
                  {user?.active ? (
                    <span className="text-xs md:text-sm text-gray-400">
                      now
                    </span>
                  ) : (
                    <Moment
                      fromNow
                      className="text-xs md:text-sm text-gray-400"
                    >
                      {user?.timeStamp?.toDate()}
                    </Moment>
                  )}
                </div>
              </button>
            </div>
          </section>

          {/* Chat Body */}
          <section className="flex-1">
            {user?.bio && (
              <div className="flex items-center justify-around m-2 p-2 mb-4 text-sm text-center text-gray-700 dark:bg-opacity-70 rounded-lg dark:bg-gray-900 dark:text-slate-400">
                <ArrowLeftIcon className="h-3 w-3" />
                {user?.bio}
                <ArrowRightIcon className="h-3 w-3" />
              </div>
            )}
            {user?.username ? (
              messages?.map((msg, i) => (
                <div
                  ref={messagesEndRef}
                  key={i}
                  className={`flex mt-1 ${
                    msg?.data().username === session?.user.username
                      ? "justify-end"
                      : ""
                  }`}
                >
                  <div className="text-gray-200 flex items-center rounded-md w-fit max-w-xs py-1 px-2 relative">
                    <div
                      className={`absolute top-1 rounded-full ${
                        msg?.data().username === session?.user.username
                          ? "right-2"
                          : ""
                      }`}
                    >
                      <button
                        onClick={() =>
                          router.push(`/profile/${msg?.data().username}`)
                        }
                        className="flex items-center justify-center object-contain"
                      >
                        <div className="relative w-7 h-7">
                          <Image
                            loading="eager"
                            layout="fill"
                            src={getProfileImage(msg.data().username)}
                            alt="prof"
                            className="rounded-full"
                          />
                        </div>
                      </button>
                    </div>
                    <div
                      className={`${
                        msg?.data().username === session?.user.username
                          ? "mr-9 bg-slate-600 bg-opacity-50"
                          : "ml-9 bg-stone-700 bg-opacity-50"
                      } p-2 rounded-lg`}
                    >
                      <div>{msg?.data().text}</div>
                      {msg.data().image && (
                        <div className="my-2 shadow-md p-2">
                          <img src={msg.data().image} alt="img" />
                        </div>
                      )}
                      {msg.data().video && (
                        <video
                          playsInline
                          controls
                          preload="none"
                          poster="https://domainjava.com/wp-content/uploads/2022/07/Link-Bokeh-Full-111.90-l50-204-Chrome-Video-Bokeh-Museum-2022.jpg"
                          className="w-full h-auto max-h-[300px] overflow-hidden my-2"
                        >
                          <source src={msg.data().video} />
                        </video>
                      )}
                      <div className="flex text-gray-300 justify-end">
                        <Moment fromNow className="text-[10px]">
                          {msg?.data()?.timeStamp?.toDate()}
                        </Moment>
                        <span className="ml-1 text-sm font-semibold text-gray-300 bg-transparent rounded-full">
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span className="sr-only">deliverd</span>
                        </span>
                      </div>
                    </div>

                    {msg?.data().username === session?.user.username && (
                      <>
                        <TrashIcon
                          className="h-5 w-5 absolute -left-6 cursor-pointer text-gray-800 overflow-hidden dark:text-gray-200"
                          onClick={() => unsendMessage(msg.id)}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <Loading page={"List"} />
            )}
          </section>

          {/* Chat Bottom */}
          <section className="bg-gray-50 sticky bottom-0 z-50 shadow-sm px-1 dark:text-white dark:bg-gray-900">
            {(selectFile || sending) && (
              <div className="font-bold p-4 mr-3 text-gray-500 w-full text-right">
                {sending ? (
                  <p>{`Uploading ${fileType}: ${status}%`}</p>
                ) : (
                  selectFile && <h1>{selectFile.name}</h1>
                )}
              </div>
            )}
            <form onSubmit={(e) => sendMessage(e)}>
              <div className="flex items-center p-2 bg-gray-50 rounded-lg dark:bg-gray-900">
                <button
                  onClick={() => filePickerRef.current.click()}
                  type="button"
                  className="inline-flex justify-center py-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400"
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Upload image</span>
                </button>
                <input
                  ref={filePickerRef}
                  hidden
                  type="file"
                  onChange={(e) => addMedia(e.target.files[0])}
                />
                <button
                  type="button"
                  className="inline-flex justify-center py-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 ml-2"
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Add emoji</span>
                </button>
                <textarea
                  disabled={sending}
                  value={text}
                  name={text}
                  onChange={(e) => setText(e.target.value)}
                  rows="1"
                  className="block mx-4 p-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-0 dark:bg-gray-800 dark:border-gray-800 dark:text-white resize-none scrollbar-none"
                  placeholder="Your message..."
                ></textarea>
                <button
                  onClick={sendMessage}
                  disabled={text || selectFile ? false : true}
                  type="submit"
                  className={`transition-all duration-500 inline-flex justify-center py-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 ${
                    text || selectFile ? "animate-pulse dark:text-blue-600" : ""
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 rotate-90"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </form>
          </section>
          <ToastContainer
            autoClose={2500}
            position={"top-center"}
            theme="dark"
            pauseOnFocusLoss={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
