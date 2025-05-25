// Define Player Object
let player = {
    username: null,
    health: 100,
    maxHealth: 100, 
    energy: 50, 
    maxEnergy: 100, 
    nerve: 100, 
    maxNerve: 100, 
    strength: 5, 
    speed: 5,    
    defense: 5,  
    cash: 50,
    location: "Downtown", 
    inventory: [],
    smallJobsCompleted: 0,
    milestone_petty_crime_initiate_sent: false,
    equippedWeapon: null,
    equippedArmor: null,
    job: "Unemployed",
    hasChosenJob: false,
    hasBlackbookAccess: false
};

// Define Locations Array
const locations = [
    { name: "Downtown", description: "The bustling heart of the city...", actions: ["Scout Area", "Shoplift from Convenience Store", "Case the Local Bank", "Rob the Local Bank", "Go to West Side", "Go to Residential Area", "Go to Pawn Shop", "Go to Sweet Shop", "Go to Gym", "Go to Quiet Office Building", "Go to City Hospital", "Go to City Jail"], travel: ["West Side", "Residential Area", "Pawn Shop", "Sweet Shop", "Gym", "Quiet Office Building", "City Hospital", "City Jail"], encounterChance: 0.1 },
    { name: "West Side", description: "A slightly rougher part of town...", actions: ["Look for small jobs", "Go to Downtown", "Go to Old Warehouse", "Go to Residential Area", "Go to Pawn Shop", "Go to Gym"], travel: ["Downtown", "Old Warehouse", "Residential Area", "Pawn Shop", "Gym", "City Hospital", "City Jail"], encounterChance: 0.3 },
    { name: "Residential Area", description: "Quiet streets lined with houses...", actions: ["Scout Area", "Burglarize Suburban Home", "Go to Downtown", "Go to West Side"], travel: ["Downtown", "West Side"], encounterChance: 0.2 },
    { name: "Old Warehouse", description: "A derelict warehouse by the docks...", actions: ["Search for goods", "Meet contact (Not Implemented)", "Go to West Side", "Go to Docks"], travel: ["West Side", "Docks"], encounterChance: 0.5 },
    { name: "Docks", description: "The busy port area...", actions: ["Look for contraband", "Speak to a sailor (Not Implemented)", "Go to Old Warehouse"], travel: ["Old Warehouse"], encounterChance: 0.4 },
    { name: "Pawn Shop", description: "A dimly lit shop...", actions: ["Scout Area", "Buy Leather Jacket", "Buy Old Vest", "Go to Downtown"], travel: ["Downtown", "West Side"], isShop: true, encounterChance: 0.1 },
    { name: "Tools R Us", description: "A hardware store...", actions: ["Scout Area", "Buy Lockpick Kit", "Buy Basic Crowbar", "Buy Pocket Knife", "Buy Baseball Bat", "Buy Stethoscope", "Buy Adrenaline Shot", "Go to West Side"], travel: ["West Side"], isShop: true, encounterChance: 0.1 },
    { name: "Shady Alley", description: "A dark, narrow alley...", actions: ["Scout Area", "Confront Thug", "Go to West Side"], travel: ["West Side"], encounterChance: 0.8 },
    { name: "Jewelry Store", description: "A brightly lit store...", actions: ["Scout Area", "Rob Jewelry Store", "Confront Security Guard", "Go to Downtown"], travel: ["Downtown"], encounterChance: 0.3 },
    { name: "Sweet Shop", description: "A colorful shop filled with sugary treats...", actions: ["Scout Area", "Shoplift Sweet Shop", "Buy Calming Tea", "Go to Downtown"], travel: ["Downtown"], isShop: true, encounterChance: 0.2 },
    { name: "Gym", description: "Sweat and iron. A place to build yourself up.", actions: ["Scout Area", "Light Workout", "Heavy Workout (Strength)", "Cardio Workout (Speed)", "Sparring Practice (Defense)", "Go to Downtown"], travel: ["Downtown", "West Side"], encounterChance: 0.0 },
    { name: "Quiet Office Building", description: "Rows of cubicles and the hum of computers.", actions: ["Scout Area", "Crack Safe at Office", "Confront Security Guard", "Go to Downtown"], travel: ["Downtown"], encounterChance: 0.1},
    { name: "City Hospital", description: "Clean, sterile, and expensive. The gentle beeping of machines is a constant sound.", actions: ["Rest (1 day)", "Attempt to Leave"], travel: [], encounterChance: 0.0 },
    { name: "City Jail", description: "Cold bars, bad food. Freedom seems a distant memory.", actions: ["Serve Time (1 day)"], travel: [], encounterChance: 0.0 }
];

const sellableAtPawnShop = { 
    "Stolen Watch": 15, "Diamond Ring": 100, "Gold Bracelet": 75, "Small Gems": 20,
    "Silver Locket": 10, "Old Laptop": 30, "Antique Figurine": 40,
    "Lollipop": 1, "Chocolate Bar": 2, "Expired Candy": 0,
    "Calming Tea": 1, "Adrenaline Shot": 5, "Stethoscope": 15, "Corporate Bonds": 150
};

const xpAwards = {
    "Look for small jobs": 10,
    "Shoplift from Convenience Store": 5,
    "Burglarize Suburban Home": 20,
    "Confront Thug": 30, 
    "Rob Jewelry Store": 100, 
    "Shoplift Sweet Shop": 3,
    "Case the Local Bank": 25,
    "Crack Safe at Office": 75,
    "Confront Security Guard": 50,
    "Rob the Local Bank": 200 
};

const crimeActions = {
    "Look for small jobs": { nerveCost: 5, xp: xpAwards["Look for small jobs"] },
    "Shoplift from Convenience Store": { nerveCost: 3, xp: xpAwards["Shoplift from Convenience Store"] },
    "Burglarize Suburban Home": { nerveCost: 10, xp: xpAwards["Burglarize Suburban Home"] },
    "Rob Jewelry Store": { nerveCost: 20, xp: xpAwards["Rob Jewelry Store"] },
    "Shoplift Sweet Shop": { nerveCost: 2, xp: xpAwards["Shoplift Sweet Shop"] },
    "Confront Thug": { nerveCost: 10, xp: xpAwards["Confront Thug"] },
    "Case the Local Bank": { nerveCost: 10, xp: xpAwards["Case the Local Bank"] },
    "Crack Safe at Office": { nerveCost: 15, xp: xpAwards["Crack Safe at Office"], requiredItem: "Stethoscope", requiredSpeed: 8 },
    "Confront Security Guard": { nerveCost: 15, xp: xpAwards["Confront Security Guard"] },
    "Rob the Local Bank": { 
        nerveCost: 50, energyCost: 30, xp: xpAwards["Rob the Local Bank"], 
        requiredItems: ["Bank Layout Notes", "Security Schedule"]
    }
};

const workoutActions = { 
    "Light Workout": { energyCost: 20, nerveGain: 10 },
    "Heavy Workout (Strength)": { energyCost: 40, stat: "strength", gainChance: 0.25, gainAmount: 1 },
    "Cardio Workout (Speed)": { energyCost: 30, stat: "speed", gainChance: 0.25, gainAmount: 1 },
    "Sparring Practice (Defense)": { energyCost: 30, stat: "defense", gainChance: 0.25, gainAmount: 1 }
};

const knownConsumables = {
    "Lollipop": { type: "energy", amount: 10 },
    "Chocolate Bar": { type: "energy", amount: 20 },
    "Expired Candy": { type: "energy", amount: -5 },
    "Calming Tea": { type: "nerve", amount: 15 },
    "Adrenaline Shot": { type: "nerve", amount: 30, costType: "health", costAmount: 5 }
};

const jobDefinitions = {
    "Courier": { description: "Fast-paced deliveries. Good for Speed & Energy.", bonuses: { speed: 2, maxEnergy: 10 }, actionName: "Deliver Package", actionDetails: { nerveCost: 3, energyCost: 10, rewardLow: 15, rewardHigh: 30, xp: 8 } },
    "Muscle for Hire": { description: "Intimidation and protection. Good for Strength & Health.", bonuses: { strength: 2, maxHealth: 10 }, actionName: "Intimidate Target", actionDetails: { nerveCost: 8, energyCost: 5, rewardLow: 25, rewardHigh: 50, xp: 12 } },
    "Grifter": { description: "Deception and quick wits. Good for Nerve & Speed.", bonuses: { nerve: 2, speed: 1, maxNerve: 10 }, actionName: "Run a Quick Scam", actionDetails: { nerveCost: 10, energyCost: 5, successChance: 0.65, rewardLow: 30, rewardHigh: 70, penaltyLow: 5, penaltyHigh: 15, xp: 15 } }
};

const npcStats = { 
    "Thug": { health: 30, strength: 5, defense: 2, speed: 3, hitChance: 0.7, specialMoveChance: 0.2 },
    "Security Guard": { health: 50, strength: 7, defense: 4, speed: 4, hitChance: 0.75, specialMoveChance: 0.25 }
};

// Define Game State Object
let gameState = {
    currentLocationName: "Downtown",
    messageLog: [],
    showingBlackbookPrompt: false,
    showingJobChoice: false
};

let nerveRegenInterval = null; 
const NERVE_REGEN_AMOUNT = 1;
const NERVE_REGEN_INTERVAL_MS = 15000; 
const socket = io("http://localhost:3001");

// Function to display username
function displayUsername(username) {
    player.username = username; 
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `Logged in as: ${username}`;
    document.getElementById('loginButton').style.display = 'none';
    connectToSocket(username);
}

function connectToSocket(username) {
    socket.emit('register', { username }); 
    socket.emit('loadPlayerData', { username: username }); 

    socket.on('playerDataLoaded', (data) => {
        if (data) {
            console.log("Player data loaded from server:", data);
            for (const key in data) {
                if (player.hasOwnProperty(key)) {
                    player[key] = data[key];
                }
            }
            if (!player.maxHealth) player.maxHealth = 100;
            if (!player.maxEnergy) player.maxEnergy = 100;
            if (!player.maxNerve) player.maxNerve = 100;
            if (player.level === undefined) player.level = 1; 
            if (player.xp === undefined) player.xp = 0;
            if (player.xpToNextLevel === undefined) player.xpToNextLevel = 100;
            if (player.statPoints === undefined) player.statPoints = 0;


            if (!player.hasBlackbookAccess) {
                gameState.showingBlackbookPrompt = true;
                logMessage("Welcome! Access to the Blackbook network is required. This is a one-time (simulated) fee of 15 SWAP.HBD. Please acknowledge to continue.");
            } else if (!player.hasChosenJob) {
                gameState.showingJobChoice = true;
                logMessage("You have Blackbook access. Now, choose your starting profession.");
            } else {
                gameState.showingBlackbookPrompt = false;
                gameState.showingJobChoice = false;
                gameState.currentLocationName = player.location || "Downtown";
                logMessage(`Welcome back, ${player.username}! Your adventure continues in ${player.location}. Job: ${player.job}`);
            }
        } else { 
            console.log("No player data found on server, treating as new player.");
            player.hasBlackbookAccess = false;
            player.hasChosenJob = false;
            gameState.showingBlackbookPrompt = true;
            logMessage("Welcome to Hive Crime RPG! Access to the Blackbook network is required. This is a one-time (simulated) fee of 15 SWAP.HBD. Please acknowledge to continue.");
        }
        startNerveRegeneration();
        updateUI();
    });

    socket.on('newPlayer', (data) => { 
        console.log("Server confirmed new player:", data.username);
        player.username = data.username; 
        player.hasBlackbookAccess = false;
        player.hasChosenJob = false;
        gameState.showingBlackbookPrompt = true;
        logMessage("Welcome to Hive Crime RPG! Access to the Blackbook network is required. This is a one-time (simulated) fee of 15 SWAP.HBD. Please acknowledge to continue.");
        startNerveRegeneration();
        updateUI();
    });
    
    socket.on('playerStateUpdated', (updatedPlayerState) => {
        console.log('Received playerStateUpdated from server:', updatedPlayerState);
        for (const key in updatedPlayerState) {
            if (player.hasOwnProperty(key)) {
                player[key] = updatedPlayerState[key];
            }
        }
        updateUI(); 
    });
    
    socket.on('logMessageFromServer', (message) => { logMessage(message); });
    socket.on('game-event', (eventData) => { logMessage(`[World Event]: ${eventData.message}`); });
    socket.on('chat-message', (data) => { displayChatMessage(data.username, data.message); });
    socket.on('combat-log', (data) => { logMessage(`[Combat]: ${data.message}`); });
    socket.on('player-joined', (username) => { logMessage(`${username} has joined the game.`); });
}

function displayChatMessage(username, message) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${username}: ${message}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; 
}

function sendChat() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (message) {
        socket.emit('chat-message', { username: player.username, message: message });
        displayChatMessage(player.username, message); 
        chatInput.value = '';
    }
}

function broadcastAction(actionName, params = {}) {
    if (!socket) {
        console.error("Socket not connected. Cannot broadcast action.");
        return;
    }
    console.log(`Broadcasting action: ${actionName} with params:`, params);
    socket.emit('playerAction', { username: player.username, action: actionName, params: params });
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

function startNerveRegeneration() {
    if (nerveRegenInterval) {
        clearInterval(nerveRegenInterval); 
    }
    nerveRegenInterval = setInterval(() => {
        if (player.nerve < player.maxNerve) {
            player.nerve += NERVE_REGEN_AMOUNT;
            if (player.nerve > player.maxNerve) {
                player.nerve = player.maxNerve;
            }
            console.log(`Nerve regenerated to ${player.nerve}`); 
            if (typeof updateUI === "function") { 
                updateUI();
            }
        }
    }, NERVE_REGEN_INTERVAL_MS);
}


// Function to update all UI elements
function updateUI() {
    const playerStatsDiv = document.getElementById('playerStats');
    playerStatsDiv.innerHTML = 
        `Level: ${player.level} | XP: ${player.xp}/${player.xpToNextLevel} | Stat Points: ${player.statPoints}<br>` +
        `Health: ${player.health}/${player.maxHealth} | Energy: ${player.energy}/${player.maxEnergy} | Nerve: ${player.nerve}/${player.maxNerve}<br>` +
        `Str: ${player.strength} | Spd: ${player.speed} | Def: ${player.defense} | Cash: $${player.cash} ${player.debt > 0 ? `<span style="color:red;">(Debt: $${player.debt})</span>` : ''}<br>` +
        `Job: ${player.job} | Equipped Weapon: ${player.equippedWeapon ? player.equippedWeapon : 'None'} | Equipped Armor: ${player.equippedArmor ? player.equippedArmor : 'None'}`;


    const healthBar = document.getElementById('healthBar');
    if (healthBar) { 
        const healthPercent = Math.max(0, (player.health / player.maxHealth) * 100); 
        healthBar.style.width = healthPercent + '%';
        healthBar.textContent = player.health + '/' + player.maxHealth;
        if (healthPercent <= 0) { healthBar.style.backgroundColor = '#f44336'; healthBar.style.color = 'white';}
        else if (healthPercent < 30) { healthBar.style.backgroundColor = '#f44336'; healthBar.style.color = 'white';}
        else if (healthPercent < 60) { healthBar.style.backgroundColor = '#ffeb3b'; healthBar.style.color = '#000'; }
        else { healthBar.style.backgroundColor = '#4CAF50'; healthBar.style.color = 'white';}
    }

    const nerveBar = document.getElementById('nerveBar');
    if (nerveBar) {
        const nervePercent = Math.max(0, (player.nerve / player.maxNerve) * 100);
        nerveBar.style.width = nervePercent + '%';
        nerveBar.textContent = player.nerve + '/' + player.maxNerve;
        nerveBar.style.backgroundColor = '#2196F3'; 
        nerveBar.style.color = 'white';
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
    
    const dynamicActionsDiv = document.getElementById('dynamicActions');
    dynamicActionsDiv.innerHTML = ''; 
    if (!currentLocation) currentLocation = getCurrentLocation(); 

    if (gameState.showingBlackbookPrompt) {
        document.getElementById('leftPanel').style.display = 'none';
        document.getElementById('rightPanel').style.display = 'none';
        locationInfoDiv.innerHTML = "<h2>Blackbook Access Required</h2><p>To proceed in the Hive Crime RPG, you must acknowledge the terms of using the Blackbook network. This is a one-time (simulated) fee of 15 SWAP.HBD, which has been automatically processed for demonstration purposes.</p>";
        const ackButton = document.createElement('button');
        ackButton.textContent = "Acknowledge Blackbook / Simulate Verification";
        ackButton.addEventListener('click', () => handleActionClick("Acknowledge Blackbook / Simulate Verification"));
        dynamicActionsDiv.appendChild(ackButton);
        return; 
    } else {
        document.getElementById('leftPanel').style.display = 'flex';
        document.getElementById('leftPanel').style.flexDirection = 'column';
        document.getElementById('rightPanel').style.display = 'block';
    }

    if (gameState.showingJobChoice) {
        locationInfoDiv.innerHTML = "<h2>Choose Your Starting Job</h2>";
        for (const jobName in jobDefinitions) {
            const job = jobDefinitions[jobName];
            const jobButton = document.createElement('button');
            jobButton.textContent = `${jobName}: ${job.description}`;
            jobButton.addEventListener('click', () => handleActionClick(`Choose Job: ${jobName}`));
            dynamicActionsDiv.appendChild(jobButton);
        }
        return;
    }
    
    if (player.location === "City Jail" && player.jailTime > 0) {
        const serveTimeButton = document.createElement('button');
        serveTimeButton.textContent = "Serve Time (1 day)";
        serveTimeButton.addEventListener('click', () => handleActionClick("Serve Time (1 day)"));
        dynamicActionsDiv.appendChild(serveTimeButton);
    } else if (player.location === "City Hospital" && player.health < player.maxHealth) {
         const restButton = document.createElement('button');
        restButton.textContent = "Rest (1 day)";
        restButton.addEventListener('click', () => handleActionClick("Rest (1 day)"));
        dynamicActionsDiv.appendChild(restButton);

        const leaveButton = document.createElement('button');
        leaveButton.textContent = "Attempt to Leave";
        leaveButton.addEventListener('click', () => handleActionClick("Attempt to Leave"));
        dynamicActionsDiv.appendChild(leaveButton);
    } else {
        // Regular view rendering
        switch (gameState.currentView) {
            case "Travel":
                locationInfoDiv.innerHTML = `<h3>Travel Options from ${player.location}</h3>`;
                const currentLocData = locations.find(l => l.name === player.location);
                if (currentLocData && currentLocData.travel) {
                    currentLocData.travel.forEach(destinationName => {
                        const button = document.createElement('button');
                        button.textContent = `Go to ${destinationName}`;
                        button.addEventListener('click', () => handleActionClick(`Go to ${destinationName}`));
                        dynamicActionsDiv.appendChild(button);
                    });
                } else {
                    dynamicActionsDiv.innerHTML = "<p>No travel options from here or location data missing.</p>";
                }
                break;
            case "Actions":
                locationInfoDiv.innerHTML = `<h3>${currentLocation.name}</h3><p>${currentLocation.description}</p>`; 
                if (currentLocation && currentLocation.actions && currentLocation.actions.length > 0) {
                    currentLocation.actions.forEach(actionName => {
                        const button = document.createElement('button');
                        button.textContent = actionName;
                        button.addEventListener('click', () => handleActionClick(actionName));
                        dynamicActionsDiv.appendChild(button);
                    });
                }
                // Append general player actions
                const knownWeapons = ["Pocket Knife", "Baseball Bat"]; 
                knownWeapons.forEach(weaponName => { if (player.inventory.includes(weaponName) && player.equippedWeapon !== weaponName) { const btn = document.createElement('button'); btn.textContent = `Equip ${weaponName}`; btn.onclick = () => handleActionClick(`Equip ${weaponName}`); dynamicActionsDiv.appendChild(btn);}});
                if (player.equippedWeapon) { const btn = document.createElement('button'); btn.textContent = `Unequip ${player.equippedWeapon}`; btn.onclick = () => handleActionClick(`Unequip ${player.equippedWeapon}`); dynamicActionsDiv.appendChild(btn);}
                const knownArmor = ["Leather Jacket", "Old Vest"];
                knownArmor.forEach(armorName => { if (player.inventory.includes(armorName) && player.equippedArmor !== armorName) { const btn = document.createElement('button'); btn.textContent = `Equip ${armorName}`; btn.onclick = () => handleActionClick(`Equip ${armorName}`); dynamicActionsDiv.appendChild(btn);}});
                if (player.equippedArmor) { const btn = document.createElement('button'); btn.textContent = `Unequip ${player.equippedArmor}`; btn.onclick = () => handleActionClick(`Unequip ${player.equippedArmor}`); dynamicActionsDiv.appendChild(btn);}
                const knownSweets = {"Lollipop": 10, "Chocolate Bar": 20, "Expired Candy": -5};
                for (const sweetName in knownSweets) { if (player.inventory.includes(sweetName)) { const btn = document.createElement('button'); btn.textContent = `Use ${sweetName}`; btn.onclick = () => handleActionClick(`Use ${sweetName}`); dynamicActionsDiv.appendChild(btn);}}
                if (player.statPoints > 0) { ["Strength", "Speed", "Defense"].forEach(stat => { const btn = document.createElement('button'); btn.textContent = `Increase ${stat} (Cost: 1 SP)`; btn.onclick = () => handleActionClick(`Increase ${stat}`); dynamicActionsDiv.appendChild(btn);});}
                if (player.job && player.job !== "Unemployed" && jobDefinitions[player.job]) { const jobAction = jobDefinitions[player.job].actionName; const btn = document.createElement('button'); btn.textContent = `${jobAction} (Job)`; btn.style.backgroundColor = "darkgreen"; btn.onclick = () => handleActionClick(jobAction); dynamicActionsDiv.appendChild(btn); }
                break;
            case "Player":
                locationInfoDiv.innerHTML = "<h3>Character Information</h3>";
                dynamicActionsDiv.innerHTML = "<p>Manage your character here (future implementation).</p>";
                break;
            case "Shops":
                locationInfoDiv.innerHTML = `<h3>Shops at ${player.location}</h3>`;
                let shopFound = false;
                const sellableAtPawnShop = { "Stolen Watch": 15, "Diamond Ring": 100, "Gold Bracelet": 75, "Small Gems": 20, "Silver Locket": 10, "Old Laptop": 30, "Antique Figurine": 40, "Lollipop": 1, "Chocolate Bar": 2, "Expired Candy": 0, "Corporate Bonds": 150, "Stethoscope": 15 };
                if (currentLocation.isShop) {
                    currentLocation.actions.forEach(actionName => {
                        if (actionName.startsWith("Buy ")) {
                            const button = document.createElement('button');
                            button.textContent = actionName;
                            button.addEventListener('click', () => handleActionClick(actionName));
                            dynamicActionsDiv.appendChild(button);
                            shopFound = true;
                        }
                    });
                }
                if (player.location === "Pawn Shop") { 
                    player.inventory.forEach(item => {
                        if (sellableAtPawnShop[item] !== undefined) { 
                            let buttonExists = false;
                            dynamicActionsDiv.querySelectorAll('button').forEach(btn => {
                                if (btn.textContent.startsWith(`Sell ${item}`)) { buttonExists = true; }
                            });
                            if (!buttonExists) {
                                const button = document.createElement('button');
                                button.textContent = `Sell ${item} ($${sellableAtPawnShop[item]})`;
                                button.addEventListener('click', () => handleActionClick(`Sell ${item}`));
                                dynamicActionsDiv.appendChild(button);
                                shopFound = true;
                            }
                        }
                    });
                }
                if (!shopFound) {
                    dynamicActionsDiv.innerHTML = "<p>No shop actions available at this location.</p>";
                }
                break;
            case "Jobs":
                locationInfoDiv.innerHTML = "<h3>Available Jobs</h3>";
                dynamicActionsDiv.innerHTML = "<p>The Jobs system is coming soon...</p>";
                break;
            default:
                dynamicActionsDiv.innerHTML = "<p>Select a category from the menu.</p>";
        }
    }
}

function handleActionClick(actionName) {
    console.log("Action clicked:", actionName);
    performAction(actionName);
}

// Define crime and workout actions with their costs and rewards
const crimeActions = {
    "Look for small jobs": { nerveCost: 5, xp: xpAwards["Look for small jobs"] },
    "Shoplift from Convenience Store": { nerveCost: 3, xp: xpAwards["Shoplift from Convenience Store"] },
    "Burglarize Suburban Home": { nerveCost: 10, xp: xpAwards["Burglarize Suburban Home"] },
    "Rob Jewelry Store": { nerveCost: 20, xp: xpAwards["Rob Jewelry Store"] },
    "Shoplift Sweet Shop": { nerveCost: 2, xp: xpAwards["Shoplift Sweet Shop"] },
    "Confront Thug": { nerveCost: 10, xp: xpAwards["Confront Thug"] },
    "Case the Local Bank": { nerveCost: 10, xp: xpAwards["Case the Local Bank"] },
    "Crack Safe at Office": { nerveCost: 15, xp: xpAwards["Crack Safe at Office"], requiredItem: "Stethoscope", requiredSpeed: 8 },
    "Confront Security Guard": { nerveCost: 15, xp: xpAwards["Confront Security Guard"] },
    "Rob the Local Bank": { 
        nerveCost: 50, energyCost: 30, xp: xpAwards["Rob the Local Bank"], 
        requiredItems: ["Bank Layout Notes", "Security Schedule"]
    }
};

const workoutActions = { 
    "Light Workout": { energyCost: 20, nerveGain: 10 },
    "Heavy Workout (Strength)": { energyCost: 40, stat: "strength", gainChance: 0.25, gainAmount: 1 },
    "Cardio Workout (Speed)": { energyCost: 30, stat: "speed", gainChance: 0.25, gainAmount: 1 },
    "Sparring Practice (Defense)": { energyCost: 30, stat: "defense", gainChance: 0.25, gainAmount: 1 }
};


function performAction(actionName) {
    console.log("performAction called for:", actionName);
    let params = {};
    if (crimeActions[actionName]) {
        params = { crimeName: actionName, nerveCost: crimeActions[actionName].nerveCost };
        if(crimeActions[actionName].requiredItem) params.requiredItem = crimeActions[actionName].requiredItem;
        if(crimeActions[actionName].requiredSpeed) params.requiredSpeed = crimeActions[actionName].requiredSpeed;
        if(crimeActions[actionName].requiredItems) params.requiredItems = crimeActions[actionName].requiredItems;
        if(crimeActions[actionName].energyCost) params.energyCost = crimeActions[actionName].energyCost;
    } else if (workoutActions[actionName]) {
        params = { workoutName: actionName, energyCost: workoutActions[actionName].energyCost };
    } else if (actionName.startsWith("Use ") && knownConsumables[actionName.substring(4)]) { 
        params = { itemName: actionName.substring(4) };
    } else if (actionName.startsWith("Buy ")) {
        const itemName = actionName.substring(4);
        let itemPrice = 0; 
        if (itemName === "Leather Jacket") itemPrice = 30; else if (itemName === "Old Vest") itemPrice = 20;
        else if (itemName === "Lockpick Kit") itemPrice = 30; else if (itemName === "Pocket Knife") itemPrice = 15;
        else if (itemName === "Baseball Bat") itemPrice = 25; else if (itemName === "Basic Crowbar") itemPrice = 20;
        else if (itemName === "Stethoscope") itemPrice = 40; else if (itemName === "Calming Tea") itemPrice = 5;
        else if (itemName === "Adrenaline Shot") itemPrice = 20;
        params = { itemName: itemName, itemPrice: itemPrice };
    } else if (actionName.startsWith("Sell ")) {
        const itemName = actionName.substring(5);
        params = { itemName: itemName, itemPrice: sellableAtPawnShop[itemName] || 0 }; 
    } else if (actionName.startsWith("Equip ") || actionName.startsWith("Unequip ")) { 
        params = { itemName: actionName.substring(actionName.startsWith("Equip ") ? 6 : 8) };
    } else if (actionName.startsWith("Increase ")) { // <<< MODIFIED FOR STAT INCREASE >>>
        params = { statName: actionName.substring("Increase ".length).toLowerCase() };
    }
    
    broadcastAction(actionName, params);

    if (gameState.showingBlackbookPrompt && actionName !== "Acknowledge Blackbook / Simulate Verification") {
        logMessage("Please acknowledge the Blackbook prompt first."); return;
    }
    if (gameState.showingJobChoice && !actionName.startsWith("Choose Job:")) {
        logMessage("Please choose your starting job first."); return;
    }
    
    // Client-side PREDICTIONS / IMMEDIATE FEEDBACK for actions NOT YET fully server-authoritative
    // (This section is now empty as all listed actions are server-authoritative or client-only)

    if (actionName === "Acknowledge Blackbook / Simulate Verification") {
        player.hasBlackbookAccess = true; gameState.showingBlackbookPrompt = false;
        logMessage("Blackbook access acknowledged. Simulated verification complete.");
        if (!player.hasChosenJob) { gameState.showingJobChoice = true; logMessage("Now, choose your starting profession."); }
        else { gameState.currentLocationName = player.location || "Downtown"; logMessage(`Welcome back, ${player.username}! Your adventure continues in ${player.location}. Job: ${player.job}`); startNerveRegeneration(); }
        savePlayerStateToHive(); updateUI(); return;
    }

    if (actionName.startsWith("Choose Job:")) {
        if (!player.hasChosenJob) {
            const chosenJobName = actionName.substring("Choose Job: ".length);
            if (jobDefinitions[chosenJobName]) {
                player.job = chosenJobName; player.hasChosenJob = true; gameState.showingJobChoice = false;
                const bonuses = jobDefinitions[chosenJobName].bonuses; let bonusMessages = [];
                for(const stat in bonuses){ if(player.hasOwnProperty(stat)){ player[stat] += bonuses[stat]; bonusMessages.push(`+${bonuses[stat]} ${stat.replace("max", "Max ")}`); } if(stat.startsWith("max") && player.hasOwnProperty(stat.substring(3).toLowerCase())){ player[stat.substring(3).toLowerCase()] = player[stat]; }}
                logMessage(`You've chosen to be a ${chosenJobName}. ${bonusMessages.join(', ')}.`);
                gameState.currentLocationName = player.location || "Downtown"; startNerveRegeneration(); savePlayerStateToHive();
            } else { logMessage("Invalid job choice."); }
        } else { logMessage("You have already chosen your job."); }
        updateUI(); return;
    }
    
    if (player.location === "City Jail" && actionName === "Serve Time (1 day)") {
        if (player.jailTime > 0) {
            player.jailTime--; player.energy = Math.max(0, player.energy - 10); player.nerve = Math.max(0, player.nerve - 5);
            logMessage(`You serve a day in jail. ${player.jailTime} days remaining. Energy and nerve slightly decreased.`);
            if (player.jailTime === 0) { logMessage("Your sentence is up! You are released back to Downtown."); player.location = "Downtown"; gameState.currentLocationName = "Downtown"; gameState.currentView = "Actions"; savePlayerStateToHive(); }
        } updateUI(); return;
    }

    if (player.location === "City Hospital") {
        if (actionName === "Rest (1 day)") {
            player.daysInHospital++; player.health = Math.min(player.maxHealth, player.health + 20); player.energy = Math.min(player.maxEnergy, player.energy + 20);
            let restMessage = `You rest for a day. Health: ${player.health}/${player.maxHealth}, Energy: ${player.energy}/${player.maxEnergy}.`;
            if (player.debt > 0) { const interest = Math.ceil(player.debt * 0.05); player.debt += interest; restMessage += ` 5% interest added to your debt, new debt: $${player.debt}.`;}
            logMessage(restMessage);
        } else if (actionName === "Attempt to Leave") {
            if (player.health < player.maxHealth * 0.5) { logMessage("You're too weak to leave. Rest more."); }
            else { const billToPay = player.debt > 0 ? player.debt : 50; if (player.cash >= billToPay) { player.cash -= billToPay; logMessage(`You paid your bill of $${billToPay}. You are discharged.`); player.debt = 0; player.daysInHospital = 0; player.location = "Downtown"; gameState.currentLocationName = "Downtown"; gameState.currentView = "Actions"; savePlayerStateToHive(); }
            else { logMessage(`You cannot afford the bill of $${billToPay}. Your debt is $${player.debt}. Cash: $${player.cash}.`); } }
        } updateUI(); return;
    }

    // Server-Authoritative Actions (Client just logs intent)
    const serverAuthActions = [
        "Look for small jobs", "Light Workout", "Shoplift from Convenience Store",
        "Heavy Workout (Strength)", "Burglarize Suburban Home", "Rob Jewelry Store",
        "Crack Safe at Office", "Case the Local Bank", "Rob the Local Bank",
        "Cardio Workout (Speed)", "Sparring Practice (Defense)",
        "Confront Thug", "Confront Security Guard"
    ];

    if (serverAuthActions.includes(actionName) || 
        (player.job && jobDefinitions[player.job] && actionName === jobDefinitions[player.job].actionName) ||
        actionName.startsWith("Use ") || actionName.startsWith("Buy ") || actionName.startsWith("Sell ") ||
        actionName.startsWith("Equip ") || actionName.startsWith("Unequip ") || actionName.startsWith("Increase ")
        ) {
        if (actionName === "Rob the Local Bank") { 
            const crime = crimeActions[actionName];
            let missingItems = crime.requiredItems.filter(item => !player.inventory.includes(item));
            if (missingItems.length > 0) { logMessage(`You're missing intel: ${missingItems.join(', ')}.`); return; }
            if (player.energy < crime.energyCost) { logMessage(`Not enough energy. Need ${crime.energyCost}.`); return; }
        }
        logMessage(`Attempting ${actionName}... (Waiting for server response)`);
    } 
    // Client-Side Only Actions 
    else if (actionName === "Scout Area") {
        const scoutMessages = ["The area seems quiet.","You spot a few locals.","A stray cat darts by.","Nothing of interest.","The wind whistles."];
        logMessage(scoutMessages[Math.floor(Math.random() * scoutMessages.length)]);
    } else if (actionName.startsWith("Go to ")) {
        const destinationName = actionName.substring("Go to ".length);
        if (locations.some(loc => loc.name === destinationName)) {
            player.location = destinationName;
            gameState.currentLocationName = destinationName; 
            logMessage(`You travel to ${destinationName}.`);
        } else { logMessage(`Error: Unknown location: ${destinationName}.`); }
    } 
    else {
        // Fallback for actions not fitting any other category
        logMessage(`Action: ${actionName} selected (no specific client logic before server response).`);
    }
    updateUI();
}


function awardXP(amount) {
    if (!amount || amount <= 0) return;
    player.xp += amount;
    logMessage(`You gained ${amount} XP!`);
    if (player.xp >= player.xpToNextLevel) {
        levelUp();
    }
}

function levelUp() {
    player.level++;
    player.xp -= player.xpToNextLevel; 
    player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);
    player.statPoints += 3;
    
    const healthGain = 10;
    const energyGain = 5;
    const nerveGain = 5;

    player.maxHealth += healthGain;
    player.health = player.maxHealth; 
    player.maxEnergy += energyGain;
    player.energy = player.maxEnergy;
    player.maxNerve += nerveGain;
    player.nerve = player.maxNerve;

    logMessage(`Congratulations! You've reached Level ${player.level}!`);
    logMessage(`Max Health, Energy, and Nerve increased. All stats refilled. You have ${player.statPoints} stat points to spend.`);
    savePlayerStateToHive();
}

function initializeGame() {
    document.getElementById('navTravel').addEventListener('click', () => setView('Travel'));
    document.getElementById('navActions').addEventListener('click', () => setView('Actions'));
    document.getElementById('navPlayer').addEventListener('click', () => setView('Player'));
    document.getElementById('navShops').addEventListener('click', () => setView('Shops'));
    document.getElementById('navJobs').addEventListener('click', () => setView('Jobs'));
    document.getElementById('sendChatButton').addEventListener('click', sendChat);
    document.getElementById('chatInput').addEventListener('keypress', function(e) { if (e.key === 'Enter') sendChat(); });
}

function setView(viewName) {
    gameState.currentView = viewName;
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
window.addEventListener('load', initializeGame);

```
