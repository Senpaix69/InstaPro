import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../firebase";
const getUserActivity = () => {
    const [values] = useCollectionData(collection(db, "users"));
    if(values) {
        return values;
    }
}

export default getUserActivity;