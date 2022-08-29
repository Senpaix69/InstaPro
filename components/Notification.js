import { useInterval } from 'interval-hooks';
import { useRef, useState } from 'react';

const Notification = () => {
    let hasNewDeploy = useHasNewDeploy();
    return (
        <div className={`p-2 text-white text-sm absolute bg-gray-600 bottom-2 left-1 rounded-lg flex items-center transition duration-200 ${hasNewDeploy ? "translate-x-0" : "-translate-x-56"}`}>
            <p>New version avaiable!</p>
            <button className="ml-2 underline cursor-pointer text-gray-300 hover:text-white"
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