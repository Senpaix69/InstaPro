import { useCollectionData } from "react-firebase-hooks/firestore";
import { query, collection, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const getChatMessages = (id) => {
    const [messages, loading] = useCollectionData(query(collection(db, `chats/${id}/messages`), orderBy("timeStamp", "asc")));

    if(!loading) {
        return messages;
    }
}

export default getChatMessages;