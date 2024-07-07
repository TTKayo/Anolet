function displayProfilePicture() {
    const username = getCookie("username");
    console.log('Username from cookie:', username); // Confirm the username value

    if (!username) {
        console.error("Username is not set in cookies.");
        return;
    }

    firestore.collection("users").doc(username).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                console.log('User data retrieved:', userData); // Confirm user data

                const profilePictureSrc = userData.profilePicture;
                console.log('Profile picture source:', profilePictureSrc); // Confirm profile picture source

                if (profilePictureSrc) {
                    const profilePictureElement = document.getElementById('profile-picture');
                    console.log('Profile picture element:', profilePictureElement); // Confirm the element is found

                    if (profilePictureElement) {
                        profilePictureElement.src = profilePictureSrc;
                        profilePictureElement.style.display = 'block'; // Show the image
                        console.log('Profile picture element updated.'); // Confirm the element update
                    } else {
                        console.error("Profile picture element not found in HTML.");
                    }
                } else {
                    console.log('No profile picture set for this user.');
                }
            } else {
                console.error("No such user document!");
            }
        })
        .catch((error) => {
            console.error("Error getting user document:", error);
        });
}
