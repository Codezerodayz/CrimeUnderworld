// Define Player Object
let player = {
    username: null,
    health: 100,
    maxHealth: 100, 
    cash: 50,
    location: "Downtown", 
    inventory: [],
    smallJobsCompleted: 0,
    milestone_petty_crime_initiate_sent: false,
    equippedWeapon: null,
    equippedArmor: null
};

// Define Locations Array
const locations = [
    {
        name: "Downtown",
        description: "The bustling heart of the city. Skyscrapers pierce the clouds, and yellow cabs fill the streets.",
        actions: ["Scout Area", "Shoplift from Convenience Store", "Visit Bank (Not Implemented)", "Go to West Side", "Go to Residential Area", "Go to Pawn Shop", "Go to Sweet Shop"],
        encounterChance: 0.1
    },
    {
        name: "West Side",
        description: "A slightly rougher part of town. Graffiti adorns the walls, and the sound of distant sirens is common.",
        actions: ["Look for small jobs", "Visit Pawn Shop (Not Implemented)", "Go to Downtown", "Go to Old Warehouse", "Go to Residential Area"],
        encounterChance: 0.3
    },
    {
        name: "Residential Area",
        description: "Quiet streets lined with houses. The kind of place where people forget to lock their doors.",
        actions: ["Scout Area", "Burglarize Suburban Home", "Go to Downtown", "Go to West Side"],
        encounterChance: 0.2
    },
    {
        name: "Old Warehouse",
        description: "A derelict warehouse by the docks. The air is damp, and the smell of saltwater and decay hangs heavy.",
        actions: ["Search for goods", "Meet contact (Not Implemented)", "Go to West Side", "Go to Docks"],
        encounterChance: 0.5
    },
    {
        name: "Docks",
        description: "The busy port area, with ships constantly coming and going. The air is filled with the cries of gulls and the shouts of dockworkers.",
        actions: ["Look for contraband", "Speak to a sailor (Not Implemented)", "Go to Old Warehouse"],
        encounterChance: 0.4
    },
    {
        name: "Pawn Shop",
        description: "A dimly lit shop with various goods behind a counter. The owner looks ready to haggle.",
        actions: ["Scout Area", "Buy Leather Jacket", "Buy Old Vest", "Go to Downtown"], 
        encounterChance: 0.1
    },
    {
        name: "Tools R Us",
        description: "A hardware store with tools of all kinds. Some look more 'specialized' than others.",
        actions: ["Scout Area", "Buy Lockpick Kit", "Buy Basic Crowbar", "Buy Pocket Knife", "Buy Baseball Bat", "Go to West Side"],
        encounterChance: 0.1
    },
    {
        name: "Shady Alley",
        description: "A dark, narrow alley. You spot a tough-looking Thug lurking here.",
        actions: ["Scout Area", "Confront Thug", "Go to West Side"],
        encounterChance: 0.8
    },
    {
        name: "Jewelry Store",
        description: "A brightly lit store with sparkling gems in display cases. Heavy security.",
        actions: ["Scout Area", "Rob Jewelry Store", "Go to Downtown"],
        encounterChance: 0.3
    },
    {
        name: "Sweet Shop",
        description: "A colorful shop filled with sugary treats. The owner seems distracted.",
        actions: ["Scout Area", "Shoplift Sweet Shop", "Go to Downtown"],
        encounterChance: 0.2
    }
];

// Define Game State Object
let gameState = {
    currentLocationName: "Downtown",
    messageLog: []
};

// Function to display username
function displayUsername(username) {
    player.username = username; 
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `Logged in as: ${username}`;
    document.getElementById('loginButton').style.display = 'none';
    gameState.currentLocationName = player.location;
    updateUI(); 
    logMessage(`Welcome, ${player.username}! You are in ${player.location}.`);
}

// Function to display error messages
function displayError(message) {
    const userInfoDiv = document.getElementById('userInfo'); 
    userInfoDiv.innerHTML = `Error: ${message}`;
    logMessage(`ERROR: ${message}`); 
}

// Function to get current location details
function getCurrentLocation() {
    return locations.find(loc => loc.name === player.location);
}

// Function to log messages
function logMessage(message) {
    gameState.messageLog.push(message);
    if (gameState.messageLog.length > 10) {
        gameState.messageLog.shift(); 
    }
    if (typeof updateUI === "function") {
        updateUI(); 
    }
}

// Function to update all UI elements
function updateUI() {
    const playerStatsDiv = document.getElementById('playerStats');
    playerStatsDiv.innerHTML = `Health: ${player.health}/${player.maxHealth} | Cash: $${player.cash} | Equipped Weapon: ${player.equippedWeapon ? player.equippedWeapon : 'None'} | Equipped Armor: ${player.equippedArmor ? player.equippedArmor : 'None'}`;

    const healthBar = document.getElementById('healthBar');
    if (healthBar) { 
        const healthPercent = Math.max(0, (player.health / player.maxHealth) * 100); 
        healthBar.style.width = healthPercent + '%';
        healthBar.textContent = player.health + '/' + player.maxHealth;

        if (healthPercent <= 0) {
             healthBar.style.backgroundColor = '#f44336'; 
             healthBar.style.color = 'white';
        } else if (healthPercent < 30) {
            healthBar.style.backgroundColor = '#f44336'; 
            healthBar.style.color = 'white';
        } else if (healthPercent < 60) {
            healthBar.style.backgroundColor = '#ffeb3b'; 
            healthBar.style.color = '#000'; 
        } else {
            healthBar.style.backgroundColor = '#4CAF50'; 
            healthBar.style.color = 'white';
        }
    }

    const inventoryDiv = document.getElementById('inventoryDisplay');
    inventoryDiv.innerHTML = '<h3>Inventory:</h3>';
    if (player.inventory.length === 0) {
        inventoryDiv.innerHTML += '<p>Your pockets are empty.</p>';
    } else {
        const ul = document.createElement('ul');
        player.inventory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        inventoryDiv.appendChild(ul);
    }

    const locationInfoDiv = document.getElementById('locationInfo');
    let currentLocation = getCurrentLocation(); 
    if (currentLocation) {
        locationInfoDiv.innerHTML = `<h3>${currentLocation.name}</h3><p>${currentLocation.description}</p>`;
    } else {
        locationInfoDiv.innerHTML = "<p>Unknown location!</p>";
    }

    const gameMessagesDiv = document.getElementById('gameMessages');
    gameMessagesDiv.innerHTML = ''; 
    gameState.messageLog.forEach(msg => {
        const p = document.createElement('p');
        p.textContent = msg;
        gameMessagesDiv.appendChild(p);
    });

    const actionButtonsDiv = document.getElementById('actionButtons');
    actionButtonsDiv.innerHTML = ''; 
    if (!currentLocation) currentLocation = getCurrentLocation(); 

    const sellableAtPawnShop = { 
        "Stolen Watch": 15, "Diamond Ring": 100, "Gold Bracelet": 75, "Small Gems": 20,
        "Silver Locket": 10, "Old Laptop": 30, "Antique Figurine": 40,
        "Lollipop": 1, "Chocolate Bar": 2, "Expired Candy": 0
    };

    if (currentLocation && currentLocation.actions && currentLocation.actions.length > 0) {
        currentLocation.actions.forEach(actionName => {
            if (player.location === "Pawn Shop" && actionName === "Sell Stolen Watch" && player.inventory.some(item => sellableAtPawnShop[item] && item !== "Stolen Watch")) {
                return; 
            }
            const button = document.createElement('button');
            button.textContent = actionName;
            button.addEventListener('click', () => handleActionClick(actionName));
            actionButtonsDiv.appendChild(button);
        });
    }

    const knownWeapons = ["Pocket Knife", "Baseball Bat"]; 
    knownWeapons.forEach(weaponName => {
        if (player.inventory.includes(weaponName) && player.equippedWeapon !== weaponName) {
            const button = document.createElement('button');
            button.textContent = `Equip ${weaponName}`;
            button.addEventListener('click', () => handleActionClick(`Equip ${weaponName}`));
            actionButtonsDiv.appendChild(button);
        }
    });

    if (player.equippedWeapon) {
        const button = document.createElement('button');
        button.textContent = `Unequip ${player.equippedWeapon}`;
        button.addEventListener('click', () => handleActionClick(`Unequip ${player.equippedWeapon}`));
        actionButtonsDiv.appendChild(button);
    }

    const knownArmor = ["Leather Jacket", "Old Vest"]; 
    knownArmor.forEach(armorName => {
        if (player.inventory.includes(armorName) && player.equippedArmor !== armorName) {
            const button = document.createElement('button');
            button.textContent = `Equip ${armorName}`;
            button.addEventListener('click', () => handleActionClick(`Equip ${armorName}`));
            actionButtonsDiv.appendChild(button);
        }
    });

    if (player.equippedArmor) {
        const button = document.createElement('button');
        button.textContent = `Unequip ${player.equippedArmor}`;
        button.addEventListener('click', () => handleActionClick(`Unequip ${player.equippedArmor}`));
        actionButtonsDiv.appendChild(button);
    }
    
    if (player.location === "Pawn Shop") {
        player.inventory.forEach(item => {
            if (sellableAtPawnShop[item] !== undefined) { 
                let buttonExists = false;
                actionButtonsDiv.querySelectorAll('button').forEach(btn => {
                    if (btn.textContent.startsWith(`Sell ${item}`)) {
                        buttonExists = true;
                    }
                });
                if (item === "Stolen Watch" && currentLocation.actions.includes("Sell Stolen Watch")) {
                     const otherSellableItems = player.inventory.filter(i => i !== "Stolen Watch" && sellableAtPawnShop[i] !== undefined);
                     if (otherSellableItems.length > 0) buttonExists = true; 
                }

                if (!buttonExists) {
                    const button = document.createElement('button');
                    button.textContent = `Sell ${item} ($${sellableAtPawnShop[item]})`;
                    button.addEventListener('click', () => handleActionClick(`Sell ${item}`));
                    actionButtonsDiv.appendChild(button);
                }
            }
        });
    }
}

function handleActionClick(actionName) {
    console.log("Action clicked:", actionName);
    performAction(actionName);
}

function performAction(actionName) {
    console.log("performAction called for:", actionName);

    if (actionName === "Scout Area") {
        const scoutMessages = ["The area seems quiet.","You spot a few locals.","A stray cat darts by.","Nothing of interest.","The wind whistles."];
        logMessage(scoutMessages[Math.floor(Math.random() * scoutMessages.length)]);
    } else if (actionName.startsWith("Go to ")) {
        const destinationName = actionName.substring("Go to ".length);
        if (locations.some(loc => loc.name === destinationName)) {
            player.location = destinationName;
            gameState.currentLocationName = destinationName; 
            logMessage(`You travel to ${destinationName}.`);
        } else {
            logMessage(`Error: Unknown location: ${destinationName}.`);
        }
    } else if (actionName === "Look for small jobs") {
        logMessage("You start looking for a quick score...");
        if (Math.random() < 0.6) {
            player.cash += 10;
            player.smallJobsCompleted++;
            logMessage("Success! You earned $10.");
            if (player.smallJobsCompleted >= 3 && !player.milestone_petty_crime_initiate_sent) {
                logMessage("Milestone: Petty Crime Initiate! Broadcasting to Hive...");
                const customJsonData = ['custom_json', { required_auths: [], required_posting_auths: [player.username], id: 'hive-crime-rpg', json: JSON.stringify({ action: 'game_milestone', milestone: 'petty_crime_initiate', game_username: player.username }) }];
                if (typeof window.hive_keychain !== 'undefined') {
                    window.hive_keychain.requestBroadcast(player.username, [customJsonData], 'Posting', function(response) {
                        if (response.success) {
                            logMessage(`Milestone recorded on Hive! TxID: ${response.result.id}`);
                            player.milestone_petty_crime_initiate_sent = true;
                        } else {
                            logMessage(`Failed to record milestone: ${response.message}`);
                        }
                    });
                } else { logMessage("Hive Keychain not found for milestone broadcast."); }
            }
        } else {
            logMessage("No easy pickings. Better lay low.");
        }
    } else if (actionName.startsWith("Sell ")) {
        const itemName = actionName.substring("Sell ".length);
        const sellableAtPawnShop = { 
            "Stolen Watch": 15, "Diamond Ring": 100, "Gold Bracelet": 75, "Small Gems": 20,
            "Silver Locket": 10, "Old Laptop": 30, "Antique Figurine": 40,
            "Lollipop": 1, "Chocolate Bar": 2, "Expired Candy": 0
        };
        const price = sellableAtPawnShop[itemName];
        const itemIndex = player.inventory.indexOf(itemName);

        if (price !== undefined && itemIndex > -1) { 
            player.inventory.splice(itemIndex, 1);
            player.cash += price;
            logMessage(`You sold the ${itemName} for $${price}.`);
        } else {
            logMessage(`Cannot sell "${itemName}" here or you don't have it.`);
        }
    } else if (actionName === "Buy Leather Jacket") {
        const price = 30;
        if (player.cash >= price) { player.cash -= price; player.inventory.push("Leather Jacket"); logMessage("Bought Leather Jacket for $30."); } else { logMessage("Not enough cash ($30)."); }
    } else if (actionName === "Buy Old Vest") {
        const price = 20;
        if (player.cash >= price) { player.cash -= price; player.inventory.push("Old Vest"); logMessage("Bought Old Vest for $20."); } else { logMessage("Not enough cash ($20)."); }
    } else if (actionName === "Buy Lockpick Kit") {
        const price = 30;
        if (player.cash >= price) {
            player.cash -= price; player.inventory.push("Lockpick Kit"); logMessage("Bought Lockpick Kit for $30.");
            logMessage("Recording purchase on Hive...");
            const customJsonData = ['custom_json', { required_auths: [], required_posting_auths: [player.username], id: 'hive-crime-rpg', json: JSON.stringify({ action: 'item_purchase', item_name: 'Lockpick Kit', price: price, shop: 'Tools R Us', game_username: player.username }) }];
            if (typeof window.hive_keychain !== 'undefined') {
                window.hive_keychain.requestBroadcast(player.username, [customJsonData], 'Posting', function(response) {
                    if (response.success) { logMessage(`Purchase recorded! TxID: ${response.result.id}`); } else { logMessage(`Failed to record purchase: ${response.message}`); }
                });
            } else { logMessage("Hive Keychain not found for purchase broadcast."); }
        } else { logMessage("Not enough cash ($30)."); }
    } else if (actionName === "Buy Pocket Knife") {
        const price = 15;
        if (player.cash >= price) { player.cash -= price; player.inventory.push("Pocket Knife"); logMessage("Bought Pocket Knife for $15."); } else { logMessage("Not enough cash ($15)."); }
    } else if (actionName === "Buy Baseball Bat") {
        const price = 25;
        if (player.cash >= price) { player.cash -= price; player.inventory.push("Baseball Bat"); logMessage("Bought Baseball Bat for $25."); } else { logMessage("Not enough cash ($25)."); }
    } else if (actionName === "Buy Basic Crowbar") {
        const price = 20;
        if (player.cash >= price) { player.cash -= price; player.inventory.push("Basic Crowbar"); logMessage("Bought Basic Crowbar for $20."); } else { logMessage("Not enough cash ($20)."); }
    } else if (actionName === "Shoplift from Convenience Store") {
        logMessage("You try to pocket items from the convenience store...");
        if (Math.random() < 0.7) { player.cash += 5; logMessage("Discreetly swiped $5 cash."); } else { logMessage("Clerk is watching. You back off."); }
    } else if (actionName === "Burglarize Suburban Home") {
        logMessage("You approach a suburban home...");
        let successChance = 0.5;
        if (player.inventory.includes("Lockpick Kit")) { logMessage("Using Lockpick Kit..."); successChance += 0.2; }
        if (Math.random() < successChance) {
            player.cash += 25;
            let msg = "Found unlocked window. +$25 cash.";
            if (Math.random() < 0.3) {
                const possibleItems = ["Stolen Watch", "Jewelry Box", "Old Laptop", "Antique Figurine", "Silver Locket"];
                const foundItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
                player.inventory.push(foundItem);
                msg += ` Also found a ${foundItem}!`;
            }
            logMessage(msg);
        } else { logMessage("Dog barks, light flicks on. Escaped empty-handed."); }
    } else if (actionName.startsWith("Equip ")) {
        const itemName = actionName.substring("Equip ".length);
        const knownWeapons = ["Pocket Knife", "Baseball Bat"]; 
        const knownArmor = ["Leather Jacket", "Old Vest"];
        if (knownWeapons.includes(itemName)) {
            if (player.inventory.includes(itemName)) {
                if (player.equippedWeapon) player.inventory.push(player.equippedWeapon);
                player.equippedWeapon = itemName;
                player.inventory.splice(player.inventory.indexOf(itemName), 1);
                logMessage(`Equipped ${itemName}.`);
            } else { logMessage(`No ${itemName} to equip.`); }
        } else if (knownArmor.includes(itemName)) {
            if (player.inventory.includes(itemName)) {
                if (player.equippedArmor) player.inventory.push(player.equippedArmor);
                player.equippedArmor = itemName;
                player.inventory.splice(player.inventory.indexOf(itemName), 1);
                logMessage(`Equipped ${itemName}.`);
            } else { logMessage(`No ${itemName} to equip.`); }
        } else { logMessage(`Cannot equip unknown: ${itemName}.`); }
    } else if (actionName.startsWith("Unequip ")) {
        const itemName = actionName.substring("Unequip ".length);
        if (player.equippedWeapon === itemName) {
            logMessage(`Unequipped ${player.equippedWeapon}.`); player.inventory.push(player.equippedWeapon); player.equippedWeapon = null;
        } else if (player.equippedArmor === itemName) {
            logMessage(`Unequipped ${player.equippedArmor}.`); player.inventory.push(player.equippedArmor); player.equippedArmor = null;
        } else { logMessage("Nothing like that equipped."); }
    } else if (actionName === "Confront Thug") {
        logMessage("Confronting the Thug!");
        let thugCurrentHealth = 30; const thugAttack = 5, thugDefense = 2, thugHitChance = 0.7;
        const playerBaseAttack = 10; let playerBonusAttack = 0;
        if (player.equippedWeapon === "Pocket Knife") playerBonusAttack = 3; else if (player.equippedWeapon === "Baseball Bat") playerBonusAttack = 5;
        const playerTotalAttack = playerBaseAttack + playerBonusAttack; const playerHitChance = 0.8;
        let playerArmorDefense = 0;
        if (player.equippedArmor === "Leather Jacket") playerArmorDefense = 3; else if (player.equippedArmor === "Old Vest") playerArmorDefense = 2;

        if (Math.random() < playerHitChance) {
            let dmgDealt = Math.max(0, playerTotalAttack - thugDefense); thugCurrentHealth -= dmgDealt; logMessage(`You hit Thug for ${dmgDealt}. Thug health: ${Math.max(0,thugCurrentHealth)}/30`);
        } else { logMessage("Your attack misses."); }

        if (thugCurrentHealth > 0) {
            if (Math.random() < thugHitChance) {
                let dmgTaken = Math.max(0, thugAttack - playerArmorDefense); player.health -= dmgTaken; logMessage(`Thug hits for ${dmgTaken}. Your health: ${Math.max(0,player.health)}/100`);
            } else { logMessage("Thug attack misses."); }
        }

        if (player.health <= 0) {
            player.health = 0; logMessage("Defeated! Lose $20."); player.cash = Math.max(0, player.cash - 20); player.health = 10; logMessage("Wake up weak, pockets lighter.");
        } else if (thugCurrentHealth <= 0) {
            logMessage("Thug defeated! Found $10."); player.cash += 10;
        } else { logMessage("Thug disengages for now."); }
    } else if (actionName === "Rob Jewelry Store") {
        logMessage("Preparing to rob Jewelry Store...");
        let successChance = 0.3; let toolLog = [];
        if (player.inventory.includes("Basic Crowbar")) { successChance += 0.1; toolLog.push("Crowbar"); }
        if (player.inventory.includes("Lockpick Kit")) { successChance += 0.15; toolLog.push("Lockpick Kit"); }
        if (toolLog.length > 0) logMessage(`Using: ${toolLog.join(', ')}. Chance: ${Math.round(successChance*100)}%`);
        
        if (Math.random() < successChance) {
            logMessage("Success! Grabbed jewels!"); const items = [];
            if (Math.random() < 0.7) items.push("Diamond Ring"); if (Math.random() < 0.5) items.push("Gold Bracelet");
            if (items.length === 0) items.push("Small Gems");
            items.forEach(i => player.inventory.push(i)); logMessage(`Got: ${items.join(', ')}`);
            player.cash += 50; logMessage("Also pocketed $50.");
        } else {
            logMessage("Alarms blare! Escaped, but police on alert."); player.health -= 5; if(player.health < 0) player.health = 0; logMessage("Lost 5 health from escape.");
        }
    } else if (actionName === "Shoplift Sweet Shop") {
        logMessage("You casually browse the Sweet Shop, looking for an opportunity...");
        const successChance = 0.8; 
        if (Math.random() < successChance) {
            const itemsFound = [];
            if (Math.random() < 0.7) itemsFound.push("Lollipop");
            if (Math.random() < 0.6) itemsFound.push("Chocolate Bar");
            if (itemsFound.length === 0) itemsFound.push("Expired Candy"); 

            itemsFound.forEach(item => player.inventory.push(item));
            logMessage(`Success! You pocketed: ${itemsFound.join(', ')}.`);
        } else {
            logMessage("The owner eyes you suspiciously as you reach for a candy bar. You decide to leave empty-handed.");
        }
    } else {
        logMessage(`Action: ${actionName} selected.`);
    }
    // Final UI update call after any action
    updateUI();
}


function loginWithKeychain() {
    if (typeof window.hive_keychain === 'undefined') {
        displayError("Hive Keychain extension not found. Please install it.");
        return;
    }
    window.hive_keychain.requestSignBuffer(null, "Login to Hive Crime RPG", "Posting", function(response) {
        if (response.success) {
            displayUsername(response.data.username);
        } else {
            displayError("Login failed or cancelled: " + response.message);
        }
    });
}

document.getElementById('loginButton').addEventListener('click', loginWithKeychain);
window.addEventListener('load', loginWithKeychain);

```
