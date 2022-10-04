import PushNotifications from "@pusher/push-notifications-server";

const pushNotifications = new PushNotifications({
  instanceId: process.env.PUSHER_INSTANCE_ID,
  secretKey: process.env.PUSHER_SECRET_KEY,
});

export default pushNotifications;
