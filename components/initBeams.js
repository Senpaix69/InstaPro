import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { toast } from "react-toastify";

const initBeams = (uid) => {
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: "a297b2ef-0169-403d-87ba-6e23421e36d4",
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
          toast.success("You have Subscribed To InstaApp", {
            position: "top-center",
            toastId: uid,
          });
          break;
        }
        case states.PERMISSION_GRANTED_NOT_REGISTERED_WITH_BEAMS:
        case states.PERMISSION_PROMPT_REQUIRED: {
          beamsClient
            .start()
            .then(() => beamsClient.addDeviceInterest(`debug-${uid}`))
            .then(() =>
              console.log(`Successfully registered and subscribed! with ${uid}`)
            )
            .catch(console.error);
          break;
        }
      }
    })
    .catch((e) => console.error("Could not get registration state", e));
};

export default initBeams;
