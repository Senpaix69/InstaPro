const getUserProfilePic = (username, users) => {
  let profileImg;
  users?.forEach((user) => {
    if (user.username === username) {
      profileImg = user.profImg ? user.profImg : user.image;
    }
  });
  return profileImg;
};
export default getUserProfilePic;
