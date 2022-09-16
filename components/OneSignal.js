import OneSignalReact from "react-onesignal";

export default async function runOneSignal() {
  await OneSignalReact.init({ appId: '70e7d3f0-737c-40ed-8025-a810a636bc14', allowLocalhostAsSecureOrigin: true});
}