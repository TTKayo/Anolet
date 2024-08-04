// Function to buy a chest
function buyChest() {
    const username = getCookie("username");
    let tokens = parseInt(getCookie("tokens"), 10);

    if (tokens >= 25) {
        tokens -= 25;
        setCookie("tokens", tokens.toString(), 1); // Update tokens in cookies

        const userRef = doc(firestore, "users", username);
        updateDoc(userRef, {
            tokens: tokens
        }).then(() => {
            unlockImages(username);
        }).catch((error) => {
            console.error("Error updating tokens: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update tokens.'
            });
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Not Enough Tokens',
            text: 'You need at least 25 tokens to buy a chest.'
        });
    }
}

// Function to unlock images based on chances
function unlockImages(username) {
    const images = [
        { src: 'Season1.gif', chance: 0.1 },
        { src: 'Season2.gif', chance: 0.15 },
        { src: 'Season3.gif', chance: 0.2 },
        { src: 'Season4.gif', chance: 0.05 },
        { src: 'Season5.gif', chance: 0.1 },
        { src: 'Season6.gif', chance: 0.1 },
        { src: 'Season7.gif', chance: 0.1 },
        { src: 'Season8.gif', chance: 0.05 },
        { src: 'Season9.gif', chance: 0.1 },
        { src: 'Season10.gif', chance: 0.05 }
    ];

    let unlockedImages = [];

    images.forEach(function(image) {
        if (Math.random() < image.chance) {
            unlockedImages.push(image.src);
        }
    });

    if (unlockedImages.length > 0) {
        const userRef = doc(firestore, "users", username);
        updateDoc(userRef, {
            unlockedSkins: arrayUnion(...unlockedImages)
        }).then(() => {
            displayUnlockedImages(unlockedImages);
        }).catch((error) => {
            console.error("Error updating unlocked images: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to unlock images.'
            });
        });
    } else {
        Swal.fire({
            icon: 'info',
            title: 'No Images Unlocked',
            text: 'You didn\'t unlock any images this time. Try again!'
        });
    }
}

// Function to display unlocked images
function displayUnlockedImages(images) {
    const container = document.getElementById('unlocked-images');
    if (container) {
        container.innerHTML = '';

        images.forEach(function(imageSrc) {
            const imgElement = document.createElement('img');
            imgElement.src = imageSrc;
            imgElement.classList.add('badge');
            imgElement.addEventListener('click', function() {
                updateProfilePicture(imageSrc);
            });
            container.appendChild(imgElement);
        });
    } else {
        console.error("Container for unlocked images not found.");
    }
}

// Function to update profile picture
function updateProfilePicture(imageSrc) {
    const username = getCookie("username");
    const userRef = doc(firestore, "users", username);
    updateDoc(userRef, {
        profilePicture: imageSrc
    }).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Profile Picture Updated',
            text: 'Your profile picture has been updated successfully.'
        });
    }).catch((error) => {
        console.error("Error updating profile picture: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'There was a problem updating your profile picture.'
        });
    });
}

// Function to display profile picture on page load
function displayProfilePicture() {
    const username = getCookie("username");
    if (!username) {
        console.error("Username is not set in cookies.");
        return;
    }

    const userRef = doc(firestore, "users", username);
    getDoc(userRef).then((doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            const profilePictureSrc = userData.profilePicture;
            if (profilePictureSrc) {
                const profilePictureElement = document.getElementById('profile-picture');
                if (profilePictureElement) {
                    profilePictureElement.src = profilePictureSrc;
                    profilePictureElement.style.display = 'block'; // Show the image
                } else {
                    console.error("Profile picture element not found in HTML.");
                }
            } else {
                console.log('No profile picture set for this user.');
            }
        } else {
            console.error("No such user document!");
        }
    }).catch((error) => {
        console.error("Error getting user document:", error);
    });
}

// Function to display user stats (username, roles, tokens)
function displayStats() {
    const username = getCookie("username");
    const roles = getCookie("roles");
    const tokens = getCookie("tokens");

    const usernameElement = document.getElementById("username");
    const rolesElement = document.getElementById("roles");
    const tokensElement = document.getElementById("tokens");

    if (usernameElement) usernameElement.innerText = username;
    if (rolesElement) rolesElement.innerText = roles;
    if (tokensElement) tokensElement.innerText = tokens;

    // Check if the role is "Owner" and apply rainbow animation
    if (roles === "Owner" && usernameElement) {
        usernameElement.classList.add("rainbow-text");
    }
}

// Function to check account status (e.g., ban status)
function checkAccountStatus() {
    const username = getCookie("username");
    if (!username) return;

    const userRef = doc(firestore, "users", username);
    getDoc(userRef).then((doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            if (userData.ban) {
                clearCookies();
                Swal.fire({
                    icon: 'error',
                    title: 'Banned',
                    text: 'You have been banned for: ' + userData.banReason
                }).then(() => {
                    window.location.href = "login.html"; // Redirect to login page
                });
            }
        } else {
            clearCookies();
            Swal.fire({
                icon: 'error',
                title: 'User Not Found',
                text: 'User does not exist.'
            }).then(() => {
                window.location.href = "login.html"; // Redirect to login page
            });
        }
    }).catch((error) => {
        console.error("Error checking account status:", error);
    });
}

// Function to clear all cookies
function clearCookies() {
    setCookie("username", "", -1);
    setCookie("roles", "", -1);
    setCookie("tokens", "", -1);
}

// Fetch and display badges function
async function fetchBadges() {
    const username = getCookie("username");
    if (!username) {
        console.error("Username is not set in cookies.");
        return;
    }

    try {
        const userRef = doc(firestore, "users", username);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const badges = userData.badges;

            const badgeContainer = document.getElementById("badgeContainer");
            const noBadgesMessage = document.getElementById("noBadgesMessage");

            if (Array.isArray(badges) && badges.length > 0) {
                badges.forEach(badgeUrl => {
                    const badgeDiv = document.createElement("div");
                    badgeDiv.className = "badge";
                    const badgeImg = document.createElement("img");
                    badgeImg.src = badgeUrl;
                    badgeDiv.appendChild(badgeImg);
                    if (badgeContainer) badgeContainer.appendChild(badgeDiv);
                });
            } else {
                if (noBadgesMessage) noBadgesMessage.style.display = "block";
            }
        } else {
            console.error("User document not found.");
        }
    } catch (error) {
        console.error("Error fetching badges:", error);
    }
}

// Initialize function to setup the page
function initializePage() {
    displayProfilePicture();
    displayStats();
    checkAccountStatus();
    fetchBadges();

    const buyChestButton = document.getElementById("buyChestButton");
    if (buyChestButton) {
        buyChestButton.addEventListener("click", buyChest);
    } else {
        console.error("Element with ID 'buyChestButton' not found.");
    }

    const updateProfilePictureButton = document.getElementById("updateProfilePictureButton");
    if (updateProfilePictureButton) {
        updateProfilePictureButton.addEventListener("click", function() {
            const imageSrc = document.getElementById("newProfilePicture").value;
            updateProfilePicture(imageSrc);
        });
    } else {
        console.error("Element with ID 'updateProfilePictureButton' not found.");
    }
}

// Call initializePage() when the page is loaded
window.onload = function() {
    initializePage();
};
