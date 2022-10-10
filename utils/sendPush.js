import axios from "axios";

const sendPush = (
  uid,
  title,
  fullname,
  message,
  icon,
  link = "https://insta-pro.vercel.app"
) => {
  if (typeof Notification !== "undefined") {
    axios.post("/api/sendNotification", {
      interest: uid,
      title: title ? title : "InstaPro",
      body: fullname ? fullname + " " + message : message,
      icon: icon
        ? icon
        : "https://firebasestorage.googleapis.com/v0/b/instapro-dev.appspot.com/o/posts%2Fimage%2Fraohuraira_57d3d606-eebc-4875-a843-eb0a03e3baf5?alt=media&token=33898c43-2cd1-459c-a5c9-efa29abb35a5",
      link: link,
    });
  }
};

export default sendPush;
