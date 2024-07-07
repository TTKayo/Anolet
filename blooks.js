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

        firebase.initializeApp(firebaseConfig);
        const firestore = firebase.firestore();

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

        window.onload = function() {
            const username = getCookie("username");

            firestore.collection("users").doc(username).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        const unlockedSkins = userData.unlockedSkins || [];
                        displayUnlockedImages(unlockedSkins);
                        displayProfilePicture(userData.profilePicture);
                    } else {
                        console.error("No such document!");
                    }
                })
                .catch((error) => {
                    console.error("Error getting document:", error);
                });
        };

        function displayProfilePicture(profilePictureSrc) {
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
        }