importScripts("https://js.pusher.com/beams/service-worker.js");

PusherPushNotifications.onNotificationReceived = ({
  payload,
  pushEvent,
  handleNotification,
}) => {
  payload.notification.title = "You Got Message!";
  pushEvent.waitUntil(handleNotification(payload));
};
