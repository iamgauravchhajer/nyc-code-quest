// funciton to sanitize user object before sending it to the client
function sanitizeUser({ _id, name, email }) {

    return {
        id: _id,
        name,
        email,
    };

}

export default sanitizeUser;