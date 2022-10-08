import pushNotifications from "../../lib/pusher";

export default function handler(req, res) {
  pushNotifications
    .publishToInterests([`debug-${req.body.interest}`], {
      web: {
        notification: {
          title: req.body.title,
          body: req.body.body,
          icon: req.body.icon,
          deep_link: req.body.link,
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
