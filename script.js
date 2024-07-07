const packsContainer = document.getElementById('pack_container');
const userItems = [];

async function getPacks() {
    const packs = [
        { name: 'Pirate', price: 25 },
    ];

    packs.forEach(pack => {
        const packElement = document.createElement('div');
        packElement.classList.add('pack_container');
        packElement.innerHTML = `
            <div class="pack" id="${pack.name}" onclick="buyPack('${pack.name}')">
                <div class="pack_bg"></div>
                <img src="https://ac.blooket.com/dashboard/d89ce3599c10ed99d41b17fa9579232d.png" alt="${pack.name}" class="pack_shadow" draggable="false">
                <img src="https://ac.blooket.com/dashboard/d89ce3599c10ed99d41b17fa9579232d.png" alt="${pack.name}" class="pack_image" draggable="false">
            </div>
        `;
        packsContainer.appendChild(packElement);
    });

    displayUserItems();
}

function buyPack(name) {
    function selectItem(itemDict) {
        const randNum = Math.random();
        let cumulativeProb = 0;

        for (const [item, prob] of Object.entries(itemDict)) {
            cumulativeProb += prob;
            if (randNum < cumulativeProb) {
                return item;
            }
        }
    }

    // Select item based on probability
    const items = {
        "Deckhand": 0.16,
        "Buccaneer": 0.16,
        "Swashbuckler": 0.16,
        "Treasure Map": 0.16,
        "Seagull": 0.16,
        "Jolly Pirate": 0.08,
        "Pirate Ship": 0.08,
        "Kraken": 0.0367,
        "Captain Blackbeard": 0.003,
        "Pirate Pufferfish": 0.0003,
    };

    const selectedItem = selectItem(items);

    // Store the selected item in the userItems array
    userItems.push(selectedItem);

    // Save userItems in localStorage
    localStorage.setItem('userItems', JSON.stringify(userItems));

    displayUserItems();
    playPackOpeningAnimation(name);
}

function playPackOpeningAnimation(packName) {
    const packContainer = document.getElementById(packName);
    const packBg = packContainer.querySelector('.pack_bg');
    packBg.style.opacity = '1'; // Show background image
    
    setTimeout(function() {
        packBg.style.opacity = '0'; // Hide background image after animation
    }, 1000); // Adjust the timing as needed

    packContainer.classList.add('animate_pack');
}

function displayUserItems() {
    const itemsContainer = document.getElementById('user_items');
    itemsContainer.innerHTML = '';

    const itemOrder = ["Deckhand", "Buccaneer", "Swashbuckler", "Treasure Map", "Seagull", "Jolly Pirate", "Pirate Ship", "Kraken", "Captain Blackbeard", "Pirate Pufferfish"];

    const itemMap = userItems.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {});

    itemOrder.forEach(item => {
        const quantity = itemMap[item] || 0;
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item} (${quantity})`;
        itemsContainer.appendChild(itemElement);
    });

    // Display blook images instead of text
    displayBlookImages(itemMap);
}

function displayBlookImages(itemMap) {
    const blooksContainer = document.getElementById('blooks_container');
    blooksContainer.innerHTML = '';

    const blookImages = {
        "Deckhand": "url_to_deckhand_image",
        "Buccaneer": "url_to_buccanear_image",
        "Swashbuckler": "url_to_swashbuckler_image",
        // Add more blook images here
    };

    for (const [item, quantity] of Object.entries(itemMap)) {
        for (let i = 0; i < quantity; i++) {
            const blookElement = document.createElement('div');
            blookElement.classList.add('blook');
            blookElement.style.backgroundImage = `url(${blookImages[item]})`;
            blooksContainer.appendChild(blookElement);
        }
    }
}

getPacks();