import PushNotifications from "@pusher/push-notifications-server";

const pushNotifications = new PushNotifications({
  instanceId: "e7843789-8f6e-4c23-86d2-14faddde20fe",
  secretKey: "971CDA3FEF7ED98D8A949F7441BD30735EB6DB57254A8F5BE917A48CB6129243",
});

export default function handler(req, res) {
  pushNotifications
    .publishToInterests([req.body.interest], {
      web: {
        notification: {
          title: req.body.title,
          body: req.body.body,
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
