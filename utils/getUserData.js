const getUserData = (allUsers, currentUser) => {
    const validUsers = [];
    allUsers?.map(doc => {
        doc?.users.map(({ username }) => {
            if (username === currentUser && (validUsers.findIndex(e => e.id === doc.id)) === -1) {
                validUsers.push(doc);
            }
        })
    })
    return validUsers;
}

export default getUserData;