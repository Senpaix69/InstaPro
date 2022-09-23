import { useCollection } from "react-firebase-hooks/firestore";
import { query, collection, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

const getChatMessages = (id) => {
  const [messages, loading] = useCollection(
    query(collection(db, `chats/${id}/messages`), orderBy("timeStamp", "asc"))
  );
  if (!loading) {
    return messages.docs;
  }
};

export default getChatMessages;
