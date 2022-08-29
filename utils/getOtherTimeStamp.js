
const getOtherTimeStamp = (all, uName) => {
    const time = "";
    all?.users.map(user => {
        if (user.username !== uName) {
            time = user?.timeStamp;
        }
    })
    return time;
}

export default getOtherTimeStamp;