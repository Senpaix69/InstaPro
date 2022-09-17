import { useInterval } from 'interval-hooks';
import { useEffect, useRef, useState } from 'react';
import runOneSignal from './OneSignal';

const Notification = () => {

    useEffect(() => {
        window.Notification.requestPermission().then(() => {
            runOneSignal();
        })
    }, [])

    let hasNewDeploy = useHasNewDeploy();
    return (
        <div className={`p-2 text-gray-900 text-sm absolute font-semibold bg-blue-300 bottom-2 left-1 rounded-lg shadow-xl flex items-center transition z-50 duration-200 ${hasNewDeploy ? "translate-x-0" : "-translate-x-56"}`}>
            <p>New version avaiable!</p>
            <button className="ml-2 underline cursor-pointer hover:text-blue-800"
                onClick={() => window.location.reload()}>
                Refresh
            </button>
        </div>
    )
}
export default Notification;

let getCurrentVersion = async () => {
    let response = await fetch("/api/has-new-deploy");
    let json = await response.json();
    return json.version;
}

let useHasNewDeploy = () => {
    let versionRef = useRef();
    let [hasNewDeploy, setHasNewDeploy] = useState(false);
    useInterval(async () => {
        let version = await getCurrentVersion();
        if (versionRef.current && version !== versionRef.current) {
            setHasNewDeploy(true);
        }
        versionRef.current = version;
    }, 5_000);

    return hasNewDeploy;
}