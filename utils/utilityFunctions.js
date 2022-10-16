import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { query, collection, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

const getChatMessages = (id, lim = 15) => {
  const [messages, loading] = useCollection(
    query(
      collection(
        db,
        `${id?.includes("group") ? "groups" : "chats"}/${id}/messages`
      ),
      orderBy("timeStamp", "desc"),
      limit(lim)
    )
  );
  if (!loading) {
    return messages.docs;
  }
};

const getOtherEmail = (all, currentUser) => {
  return all?.users?.filter(
    (user) => user.username !== currentUser?.username
  )[0]?.username;
};

const getAllUsers = () => {
  const [values] = useCollectionData(collection(db, "profile"));
  return values;
};

const getValidUsers = (allUsers, currentUser) => {
  const validUsers = [];
  allUsers?.map((doc) => {
    doc?.users?.map(({ username }) => {
      if (
        username === currentUser &&
        validUsers.findIndex((e) => e.id === doc.id) === -1
      ) {
        validUsers.push(doc);
      }
    });
  });
  return validUsers;
};

const getUserProfilePic = (username, users) => {
  let profileImg;
  users?.forEach((user) => {
    if (user.username === username) {
      profileImg = user.profImg ? user.profImg : user.image;
    }
  });
  return profileImg;
};

const getUser = (username, users) => {
  const currUser = users?.filter((user) => user.username === username)[0];
  return currUser;
};

const getName = (user) => {
  return user?.fullname ? user.fullname : user?.username;
};

export {
  getChatMessages,
  getOtherEmail,
  getAllUsers,
  getUser,
  getName,
  getValidUsers,
  getUserProfilePic,
};
