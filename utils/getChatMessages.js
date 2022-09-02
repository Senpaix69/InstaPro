import { useCollection } from "react-firebase-hooks/firestore";
import { query, collection, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

const getChatMessages = (id, ref) => {
    if (ref) {
        const [messages, loading] = useCollection(query(collection(db, `chats/${id}/messages`), orderBy("timeStamp", "desc"), limit(1)));
        if (!loading) {
            return messages.docs[0];
        }
    } else {
        const [messages, loading] = useCollection(query(collection(db, `chats/${id}/messages`), orderBy("timeStamp", "asc")));
        if (!loading) {
            return messages.docs;
        }
    }
}

export default getChatMessages;