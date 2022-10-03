import PushNotifications from "@pusher/push-notifications-server";

const pushNotifications = new PushNotifications({
  instanceId: process.env.PUSHER_INSTANCE_ID,
  secretKey: process.env.PUSHER_SECRET_KEY,
});

export default function handler(req, res) {
  pushNotifications
    .publishToInterests([req.body.interest], {
      web: {
        notification: {
          title: req.body.title,
          body: req.body.body,
          deep_link: "https://insta-pro.vercel.app",
          icon: "https://ibb.co/fndWFHk",
        },
      },
    })
    .then((publishResponse) => {
      console.log("Just published:", publishResponse.publishId);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
  res.status(200).json({ message: "Notification Sent" });
}
