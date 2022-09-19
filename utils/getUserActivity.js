import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../firebase";
const getUserActivity = () => {
    const [values] = useCollectionData(collection(db, "profile"));
    if (values) {
        return values;
    }
}

export default getUserActivity;