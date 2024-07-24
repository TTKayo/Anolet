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

function toggleChest() {
    const chestContainer = document.querySelector('.chest-container');
    chestContainer.classList.toggle('clicked');
    if (chestContainer.classList.contains('clicked')) {
        buyChest();
    }
}

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
        setCookie("tokens", tokens, 1);

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

async function unlockImages(username) {
    let unlockedImages = [];

    // Fetch chances from Firestore
    const chancesSnapshot = await firestore.collection("chances").get();
    const chances = {};
    chancesSnapshot.forEach(doc => {
        chances[doc.id] = doc.data().chance;
    });

    const images = [];
    for (const [src, chance] of Object.entries(chances)) {
        images.push({ src, chance });
    }

    images.forEach(function(image) {
        if (Math.random() < image.chance) {
            unlockedImages.push(image.src);
        }
    });

    console.log('Unlocked images: ', unlockedImages);

    if (unlockedImages.length > 0) {
        const imageToShow = unlockedImages[0];

        firestore.collection("users").doc(username).update({
            unlockedSkins: firebase.firestore.FieldValue.arrayUnion(imageToShow)
        }).then(() => {
            displayUnlockedImages([imageToShow]);
        }).catch((error) => {
            console.error("Error updating unlocked skins: ", error);
        });
    } else {
        Swal.fire({
            icon: 'info',
            title: 'No Images Unlocked',
            text: 'Better luck next time!'
        });
    }
}

function displayUnlockedImages(imageUrls) {
    const imageContainer = document.getElementById('unlocked-images');
    imageContainer.innerHTML = '';

    imageUrls.forEach((url) => {
        const img = document.createElement('img');
        img.src = url;
        imageContainer.appendChild(img);
    });
}

// Initialize chances in Firestore if they don't exist
async function initializeChances() {
    const images = [
       
        { src: 'Lost Bot.png', chance: 0.00001 },
    ];

    images.forEach(async (image) => {
        const docRef = firestore.collection("chances").doc(image.src);
        const doc = await docRef.get();
        if (!doc.exists) {
            docRef.set({ chance: image.chance });
        }
    });
}

initializeChances();