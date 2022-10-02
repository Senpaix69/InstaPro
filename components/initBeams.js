import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { toast } from "react-toastify";

const initBeams = (uid, signOut) => {
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: "e7843789-8f6e-4c23-86d2-14faddde20fe",
  });
  beamsClient
    .getRegistrationState()
    .then((state) => {
      let states = PusherPushNotifications.RegistrationState;
      switch (state) {
        case states.PERMISSION_DENIED: {
          toast.warn("You have blocked notifications", {
            position: "top-center",
            toastId: uid,
          });
          break;
        }
        case states.PERMISSION_GRANTED_REGISTERED_WITH_BEAMS: {
          if (uid === "") {
            const toastId = toast.loading("Logging Out, Please Wait", {
              position: "top-center",
            });
            console.log("Clearing Beams");
            beamsClient
              .clearAllState()
              .then(() => {
                beamsClient
                  .stop()
                  .then(() => {
                    toast.dismiss(toastId);
                    toast("Logged Out Successfully", {
                      position: "top-center",
                    });
                    console.log("Beams SDK has been stopped");
                    signOut();
                  })
                  .catch((e) => {
                    toast.dismiss(toastId);
                    toast.error(`Error: ${e}`, { position: "top-center" });
                    console.error("Could not stop Beams SDK", e);
                  });
              })
              .catch((e) => {
                toast.dismiss(toastId);
                toast.error(`Error: ${e}`, { position: "top-center" });
                console.error("Could not clear Beams state", e);
              });
          }
          break;
        }
        case states.PERMISSION_GRANTED_NOT_REGISTERED_WITH_BEAMS:
        case states.PERMISSION_PROMPT_REQUIRED: {
          beamsClient
            .start()
            .then(() => beamsClient.addDeviceInterest(uid))
            .then(() => beamsClient.addDeviceInterest("public"))
            .then(() => beamsClient.addDeviceInterest(`debug-${uid}`))
            .then(() => beamsClient.addDeviceInterest("debug-public"))
            .then(() => {
              toast.success("Push Notifications Enabled", {
                position: "top-center",
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
