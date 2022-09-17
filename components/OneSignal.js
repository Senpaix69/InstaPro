import OneSignalReact from "react-onesignal";

export default async function runOneSignal() {
  // localhost: appId: "9113e602-24c9-47e1-b77f-1582ae760a00"
  // instaPro: appId: 70e7d3f0-737c-40ed-8025-a810a636bc14
  await OneSignalReact.init({ appId: '70e7d3f0-737c-40ed-8025-a810a636bc14', allowLocalhostAsSecureOrigin: true });
}