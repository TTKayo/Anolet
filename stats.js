  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
        import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
        
        // Your Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCOIKlP9YhtX9xa5aoggmsrWwavlW-XuzI",
            authDomain: "cosmik-7c124.firebaseapp.com",
            databaseURL: "https://cosmik-7c124-default-rtdb.firebaseio.com",
            projectId: "cosmik-7c124",
            storageBucket: "cosmik-7c124.appspot.com",
            messagingSenderId: "412506429662",
            appId: "1:412506429662:web:9ca3e17199297df7384a4f",
            measurementId: "G-R7K0LTHCK3"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Function to get a cookie by name
        function getCookie(name) {
            let cookieArr = document.cookie.split(";");
            for (let i = 0; i < cookieArr.length; i++) {
                let cookiePair = cookieArr[i].split("=");
                if (name == cookiePair[0].trim()) {
                    return decodeURIComponent(cookiePair[1]);
                }
            }
            return null;
        }

        // Get the username from cookies
        const username = getCookie("username");
        console.log("Username from cookies:", username);

        // Function to fetch and display badges
        async function fetchBadges() {
            if (username) {
                try {
                    const userDocRef = doc(db, "users", username);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const badges = userData.badges;
                        console.log("Badges found:", badges);
                        const badgeContainer = document.getElementById("badgeContainer");
                        const noBadgesMessage = document.getElementById("noBadgesMessage");

                        if (Array.isArray(badges) && badges.length > 0) {
                            badges.forEach(badgeUrl => {
                                const badgeDiv = document.createElement("div");
                                badgeDiv.className = "badge";
                                const badgeImg = document.createElement("img");
                                badgeImg.src = badgeUrl;
                                badgeDiv.appendChild(badgeImg);
                                badgeContainer.appendChild(badgeDiv);
                            });
                        } else {
                            noBadgesMessage.style.display = "block";
                        }
                    } else {
                        console.log("No such user document!");
                    }
                } catch (error) {
                    console.error("Error fetching user document:", error);
                }
            } else {
                console.log("Username not found in cookies.");
            }
        }

        // Fetch and display badges on page load
        window.onload = fetchBadges;

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function buyChest() {
    const username = getCookie("username");
    let tokens = parseInt(getCookie("tokens"), 10);

    if (tokens >= 25) {
        tokens -= 25;
        setCookie("tokens", tokens, 1); // Update tokens in cookies

        firestore.collection("users").doc(username).update({
            tokens: tokens
        }).then(() => {
            unlockImages(username);
        }).catch((error) => {
            console.error("Error updating tokens: ", error);
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Not Enough Tokens',
            text: 'You need at least 25 tokens to buy a chest.'
        });
    }
}

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
        firestore.collection("users").doc(username).update({
            unlockedSkins: firebase.firestore.FieldValue.arrayUnion(...unlockedImages)
        }).then(() => {
            displayUnlockedImages(unlockedImages);
        }).catch((error) => {
            console.error("Error updating unlocked images: ", error);
        });
    } else {
        Swal.fire({
            icon: 'info',
            title: 'No Images Unlocked',
            text: 'You didn\'t unlock any images this time. Try again!'
        });
    }
}

function displayUnlockedImages(images) {
    const container = document.getElementById('unlocked-images');
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
}

function updateProfilePicture(imageSrc) {
    const username = getCookie("username");
    firestore.collection("users").doc(username).update({
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

function displayProfilePicture() {
    const username = getCookie("username");
    if (!username) {
        console.error("Username is not set in cookies.");
        return;
    }

    firestore.collection("users").doc(username).get()
        .then((doc) => {
            if (doc.exists) {
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
        })
        .catch((error) => {
            console.error("Error getting user document:", error);
        });
}

function displayStats() {
    const username = getCookie("username");
    const roles = getCookie("roles");
    const tokens = getCookie("tokens");

    const usernameElement = document.getElementById("username");
    usernameElement.innerText = username;

    const rolesElement = document.getElementById("roles");
    rolesElement.innerText = roles;

    const tokensElement = document.getElementById("tokens");
    tokensElement.innerText = tokens;

    // Check if the role is "Owner" and apply rainbow animation
    if (roles === "Owner") {
        usernameElement.classList.add("rainbow-text");
    }
}

function checkAccountStatus() {
    const username = getCookie("username");
    if (!username) return;

    firestore.collection("users").doc(username).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.ban) {
                    clearCookies();
                    Swal.fire({
                        icon: 'error',
                        title: 'Banned',
                        text: 'You have been banned for: ' + userData.banReason
                    }).then(() => {
                        window.location.href = "login.html";
                    });
                }
            } else {
                clearCookies();
                Swal.fire({
                    icon: 'error',
                    title: 'User Not Found',
                    text: 'User does not exist.'
                }).then(() => {
                    window.location.href = "login.html";
                });
            }
        })
        .catch((error) => {
            console.error("Error checking account status:", error);
        });
}

function clearCookies() {
    setCookie("username", "", -1);
    setCookie("roles", "", -1);
    setCookie("tokens", "", -1);
}

