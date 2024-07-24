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

        async function buyItem(itemName, itemCost) {
            const username = getCookie("username");
            let tokens = parseInt(getCookie("tokens"), 10);

            if (tokens >= itemCost) {
                tokens -= itemCost;
                setCookie("tokens", tokens, 1);

                try {
                    await firestore.collection("users").doc(username).update({
                        tokens: tokens,
                        unlockedSkins: firebase.firestore.FieldValue.arrayUnion(itemName)
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Purchase Successful',
                        text: `You have successfully bought ${itemName}.`
                    });

                    displayTokens(tokens);
                } catch (error) {
                    console.error("Error updating tokens: ", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Purchase Failed',
                        text: 'There was an error processing your purchase. Please try again.'
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Not Enough Tokens',
                    text: 'You need more tokens to buy this item.'
                });
            }
        }

        function displayTokens(tokens) {
            document.getElementById('tokens-display').textContent = `Tokens: ${tokens}`;
        }

        async function loadShopItems() {
            const shopContainer = document.getElementById('shop-container');

            const itemsSnapshot = await firestore.collection("shopItems").get();
            itemsSnapshot.forEach(doc => {
                const item = doc.data();
                const itemDiv = document.createElement('div');
                itemDiv.style.border = "1px solid black";
                itemDiv.style.margin = "10px";
                itemDiv.style.padding = "10px";
                itemDiv.style.textAlign = "center";

                const itemName = document.createElement('h2');
                itemName.textContent = item.name;

                const itemImage = document.createElement('img');
                itemImage.src = item.image;
                itemImage.style.width = "100px";
                itemImage.style.height = "100px";

                const itemPrice = document.createElement('p');
                itemPrice.textContent = `Price: ${item.price} tokens`;

                const buyButton = document.createElement('button');
                buyButton.textContent = 'Buy';
                buyButton.onclick = () => buyItem(item.name, item.price);

                itemDiv.appendChild(itemName);
                itemDiv.appendChild(itemImage);
                itemDiv.appendChild(itemPrice);
                itemDiv.appendChild(buyButton);

                shopContainer.appendChild(itemDiv);
            });
        }

        window.onload = function() {
            const tokens = getCookie("tokens");
            displayTokens(tokens);
            loadShopItems();
        };
// Initialize shop items in Firestore if they don't exist
async function initializeShopItems() {
    const items = [
        { name: 'Lost Bot', price: 100, image: 'Lost Bot.png' },
        // Add more items here
    ];

    items.forEach(async (item) => {
        const docRef = firestore.collection("shopItems").doc(item.name);
        const doc = await docRef.get();
        if (!doc.exists) {
            docRef.set({
                name: item.name,
                price: item.price,
                image: item.image
            });
        }
    });
}

initializeShopItems();
