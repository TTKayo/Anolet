function openChest() {
    const chances = [
        { img: 'cereal.png', chance: 12.5 },
        { img: 'combo.png', chance: 12.5 },
        { img: 'orange juice.png', chance: 12.5 },
        { img: 'ToastT.png', chance: 12.5 }
    ];
  
    // Get a random number between 1 and 100
    const randomNumber = Math.floor(Math.random() * 100) + 1;
  
    // Determine the image based on the random number and chances
    let selectedImage;
    let cumulativeChance = 0;
    for (const { img, chance } of chances) {
        cumulativeChance += chance;
        if (randomNumber <= cumulativeChance) {
            selectedImage = img;
            break;
        }
    }
  
    // Display the selected image
    const chestElement = document.getElementById('chest');
    chestElement.innerHTML = `<img src="${selectedImage}" alt="Chest didnt Load" style="max-width: 100%; max-height: 100%; margin-left: 550px; margin-top: 150px;">`;
  }