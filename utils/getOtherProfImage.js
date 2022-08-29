
const getOtherProfImage = (all, uName) => {
    const url = "";
    all?.users.map(user => {
        if (user.username !== uName) {
            url = user?.profImg;
        }
    })
    return url;
}

export default getOtherProfImage;