import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../firebase";

const SetStatus = ({ username, active, setActive }) => {
  useEffect(() => {
    window.addEventListener("focus", () => setActive(true));
    window.addEventListener("blur", () => setActive(false));
    window.addEventListener("online", () => setActive(true));
    window.addEventListener("offline", () => setActive(false));
    return () => {
      window.removeEventListener("focus", () => setActive(true));
      window.removeEventListener("blur", () => setActive(false));
      window.addEventListener("online", () => setActive(true));
      window.addEventListener("offline", () => setActive(false));
    };
  }, []);

  useEffect(() => {
    const setStatus = async () => {
      getDoc(doc(db, "profile", username)).then(async (data) => {
        if (data.exists()) {
          await updateDoc(doc(db, `profile/${username}`), {
            active: active,
            timeStamp: serverTimestamp(),
          });
        }
      });
    };
    if (username) {
      setStatus();
    }
  }, [username, active]);

  return <></>;
};

export default SetStatus;
