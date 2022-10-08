import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { toast } from "react-toastify";

const initBeams = (uid, username, setBeamsInitialized, signOut) => {
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: process.env.BEAMS_INSTANCE_ID,
  });
  beamsClient
    .getRegistrationState()
    .then((state) => {
      let states = PusherPushNotifications.RegistrationState;
      switch (state) {
        case states.PERMISSION_DENIED: {
          toast.warn("You have blocked notifications", {
            toastId: uid,
          });
          break;
        }
        case states.PERMISSION_GRANTED_REGISTERED_WITH_BEAMS: {
          if (uid === "") {
            const toastId = toast.loading("Logging Out, Please Wait");
            console.log("Clearing Beams");
            beamsClient
              .clearAllState()
              .then(() => {
                beamsClient
                  .stop()
                  .then(() => {
                    toast.dismiss(toastId);
                    toast.info("Logged Out Successfully");
                    console.log("Beams SDK has been stopped");
                    signOut();
                  })
                  .catch((e) => {
                    toast.dismiss(toastId);
                    toast.error(`Error: ${e}`);
                    console.error("Could not stop Beams SDK", e);
                  });
              })
              .catch((e) => {
                toast.dismiss(toastId);
                toast.error(`Error: ${e}`);
                console.error("Could not clear Beams state", e);
              });
          }
          break;
        }
        case states.PERMISSION_GRANTED_NOT_REGISTERED_WITH_BEAMS:
        case states.PERMISSION_PROMPT_REQUIRED: {
          console.log("Beam is starting");
          beamsClient
            .start()
            .then(() =>
              beamsClient.setDeviceInterests([
                "public",
                uid,
                username,
                `debug-${username}`,
                `debug-${uid}`,
                "debug-public",
              ])
            )
            .then(() =>
              beamsClient.getDeviceInterests().then((int) => console.log(int))
            )
            .then(() => {
              localStorage.setItem("beamsState", JSON.stringify(true));
              setBeamsInitialized(true);
              toast.info("Push Notifications Enabled", {
                toastId: uid,
              });
            });
          break;
        }
      }
    })
    .catch((e) => console.error("Could not get registration state", e));
};

export default initBeams;
