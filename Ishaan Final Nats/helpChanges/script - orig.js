// Variables and placeholders for all HTML divisions and elements
// Using getElementById to store HTML output into variables
// Variables and placeholders for all HTML divisions and elements
// Using getElementById to store HTML output into variables
const storyTitle = document.getElementById('story-title');
const storyText = document.getElementById('story-text');
const beware = document.getElementById('beware');
const survivalImage = document.getElementById('survival-image');
const credentials = document.getElementById('credentials');
const choices = document.getElementById('choices');

// Progress indicator 
const progressIndicator = document.getElementById('progress-indicator');

// Game state elements
const energyDisplay = document.getElementById('energy-display');
const energyValue = document.getElementById('energy-value');
const energyIcon = document.getElementById('energy-icon');

// Floating control buttons
const helpButton = document.getElementById('help-button');
const restartButton = document.getElementById('restart-button');
const voiceButton = document.getElementById('voice-button');
const exportButton = document.getElementById('export-button');

// Modern notification system
const toastNotification = document.getElementById('notification-toast');

// Game messages
const shelterMessage = document.getElementById('shelter-message');
const successMessage = document.getElementById('success-message');
const failureMessage = document.getElementById('failure-message');

// Location images and buttons
const locationContainer = document.getElementById('location-images');
const skullRockImage = document.getElementById('skull-rock-image');
const ghostLightCaveImage = document.getElementById('ghost-light-cave-image');
const forgottenFallsImage = document.getElementById('forgotten-falls-image');
const skullRockButton = document.getElementById('skull-rock-button');
const caveButton = document.getElementById('cave-button');
const fallsButton = document.getElementById('falls-button');

// Audio files for various game sounds, played at specific moments
const levelUpSound1 = new Audio("sounds/levelup1.wav");
const levelUpSound2 = new Audio("sounds/levelup2.mp3");
const levelUpSound3 = new Audio("sounds/levelup3.mp3");
const levelUpSound4 = new Audio("sounds/levelup4.mp3");
const levelUpSound5 = new Audio("sounds/levelup5.mp3");
const levelUpSound6 = new Audio("sounds/levelup6.mp3");
const failureSound = new Audio("sounds/failure.mp3");
const fireSound = new Audio("sounds/fire.mp3");
const nightSound = new Audio("sounds/night.mp3");
const successSound = new Audio("sounds/success.mp3");

// Audio control
let audioEnabled = true;

const storyContainer = document.getElementById('story-container');
const featureList = document.querySelector('.feature-list-horizontal');
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 30;

// Variables to track game state
let count = 0;           // General counter for tracking certain events
let nightCounter = 0;    // Counter to track the number of nights passed
let gameProgress = 0;    // Track game progress for progress bar
let darkMode = false;    // Dark mode state

// Random Numbers for energy drop after user searches locations and does activities
let randomNum1 = Math.floor(Math.random() * 6) + 30;
let randomNum2 = Math.floor(Math.random() * 6) + 20;
let randomNum3 = Math.floor(Math.random() * 6) + 25;
let randomNum4 = Math.floor(Math.random() * 16) + 20;

// To store the current page user is on
let currentPage = 'None';
let isSpeaking = false;
let utterance;


// variables needed to display a report at the end of the game
let reportVariables = {
    helpCount: 0,
    exploreIsland: false,
    buildAFire: false,
    skullLocation: false,
    waterfallLocation: false,
    caveLocation: false,
    energyStart: 50,
    energyAfterLocation1: randomNum1,
    energyAfterLocation2: randomNum2,
    energyAfterFire: randomNum3,
    shelterType: "",
    energyAfterShelter: 0,
    nightCount: 0,
    energyAfterNight: randomNum4,
    shipEscape: false,
    failureCount: 0,
    helpEscape: false,
    success: false,
    energyEnd: 0
}

// Array for data that will be exported from report page
let reportData = [];

// let currentLanguage = 'en'

let translations = {
}

let currentLang = 'en';

// Initialize dark mode from localStorage
document.addEventListener("DOMContentLoaded", () => {
    // Check for dark mode preference
    const darkModePref = localStorage.getItem('darkMode') === 'true';
    if (darkModePref) {
        document.body.classList.add('dark-mode');
        if (document.getElementById('dark-mode-toggle')) {
            document.getElementById('dark-mode-toggle').checked = true;
        }
        darkMode = true;
    }
    
  const readAloudButton = document.getElementById("readAloud-button");
let isSpeaking = false;

readAloudButton.addEventListener("click", () => {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    return;
  } else {

  const storyTextElement = document.getElementById("story-text");
  const textToRead = storyTextElement?.textContent || storyTextElement?.innerText;
  if (!textToRead) return;

  // Get currentLang from localStorage
  const currentLang = localStorage.getItem('language') || 'en';

  const utterance = new SpeechSynthesisUtterance(textToRead);

  // Match language
  switch (currentLang) {
    case 'hi':
      utterance.lang = 'hi-IN';
      break;
    case 'es':
      utterance.lang = 'es-ES';
      break;
    case 'zh':
      utterance.lang = 'zh-CN';
      break;
    case 'en':
    default:
      utterance.lang = 'en-US';
  }

  // Optional: match best available voice for that language
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang === utterance.lang);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    isSpeaking = false;
  };

  window.speechSynthesis.cancel(); // stop any previous
  window.speechSynthesis.speak(utterance);
  isSpeaking = true;
  }
});


    // Event listener for dark mode toggle
    if (document.getElementById('dark-mode-toggle')) {
        document.getElementById('dark-mode-toggle').addEventListener('change', toggleDarkMode);
    }

    // Event listener for audio toggle
    if (document.getElementById('audio-toggle')) {
        document.getElementById('audio-toggle').addEventListener('change', toggleAudio);
    }

    // Set event listeners for control buttons
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }

    if (helpButton) {
        helpButton.addEventListener('click', helpButtonClick);
    }

    if (voiceButton) {
        voiceButton.addEventListener('click', setupSpeechRecognition);
    }

    if (exportButton) {
        exportButton.addEventListener('click', function () {
            exportToExcel(reportData, "ReportStats.xlsx");
            showToast("Report exported successfully!");
        });
    }
});

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    darkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', darkMode);
    showToast(darkMode ? "Dark mode enabled" : "Light mode enabled");
}

// Function to toggle audio
function toggleAudio() {
    audioEnabled = document.getElementById('audio-toggle').checked;
    showToast(audioEnabled ? "Audio enabled" : "Audio muted");

    // Mute or unmute all audio elements
    const audioElements = [
        levelUpSound1, levelUpSound2, levelUpSound3,
        levelUpSound4, levelUpSound5, levelUpSound6,
        failureSound, fireSound, nightSound, successSound
    ];

    audioElements.forEach(audio => {
        audio.muted = !audioEnabled;
    });
}

// Function to show toast notification
function showToast(message, duration = 3000) {
    toastNotification.textContent = message;
    toastNotification.classList.add('show');

    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, duration);
}

// Function to update progress indicator
function updateProgress(progress) {
    gameProgress = progress;
    progressIndicator.style.width = `${progress}%`;
}

// Play sound function that respects audio toggle
function playSound(sound) {
    if (audioEnabled) {
        sound.play();
    }
}

// Main function that helps user navigate between screens
function choose(option) {
    currentPage = option;
    // If option is:
    switch (option) {
        //The user clicks Instructions
        case 'instruct':
            setupInstructionPage();
            updateProgress(10);
            break;
        // If the button clicked is "Begin"
        case 'begin':
            setupBeginPage();
            updateProgress(20);
            break;
        // If button clicked is continue
        case 'continue':
            setupArrivalPage();
            updateProgress(30);
            break;
        // If button clicked is Explore
        case 'Explore':
            setupExploreIslandPage();
            updateProgress(40);
            break;
        // If the button clicked it Return
        case 'Return':
            setupEveningPage();
            updateProgress(50);
            break;
        // If create a fire button is clicked:
        case 'Fire':
            setupFirePage();
            updateProgress(40);
            break;
        // If the button buildFire is clicked:
        case 'buildFire':
            setupBuildFirePage();
            updateProgress(50);
            break;
        // If user clicks Small Shelter
        case 'smallShelter':
            setupShelter('images/smallshelter.jpeg', "Small Shelter");
            updateProgress(60);
            break;
        // If user clicks Medium Shelter
        case 'mediumShelter':
            setupShelter('images/mediumshelter.jpeg', "Medium Shelter");
            updateProgress(60);
            break;
        // If user to build a large shelter
        case 'largeShelter':
            setupShelter('images/largeImage.jpeg', "Large Shelter");
            updateProgress(60);
            break;
        // If user clicks advance to next day
        case 'nextDay':
            setupNextDayPage();
            updateProgress(70);
            break;
        // If user wants to wave to get ship's attention
        case 'shipAttention':
            setupShipAttentionPage();
            updateProgress(80);
            break;
        // If user has to option to retry:
        case 'reTry':
            // Return back to the rescue page
            choose('nextDay');
            // Hide the failure message
            failureMessage.style.display = 'none';
            break;
        // If the user decides to write help on the sand
        case 'helpOnSand':
            setupSuccessPage();
            updateProgress(100);
            break;
        // If user clicks home to restart game
        case 'report':
            setupReportPage();
            break;
        // If user wants to restart game
        case 'Restart':
            restartGame();
            break;
        // If the user wants to return from help page
        case 'returnFromHelp':
            // Add a sessionStorage variable to know that we are coming from help page
            sessionStorage.setItem("returnFromHelp", "true");
            // going back the first page
            window.location.href = 'index.html';
            break;
    }
}

// Function to setup the instruction page
function setupInstructionPage() {
    // Play sound of levelUp 1
    if (featureList) {
        featureList.remove();
    }
    playSound(levelUpSound1);

    // Show control buttons
    helpButton.style.display = 'flex';
    restartButton.style.display = 'flex';
    voiceButton.style.display = 'flex';

    // Hide Image
    survivalImage.style.display = 'none';
    // Credentials are hidden
    credentials.style.display = 'none';

    // Title changed to instructions
    storyTitle.innerText = `${t('instructions')}`;

    storyText.innerHTML = `
    <p>${t('instructionPageMission')}</p>
    <ul id="instruction_list">
        <li class="instruction-card"><i class="fas fa-map-marked-alt"></i> ${t('instructionChoice1')}</li>
        <li class="instruction-card"><i class="fas fa-fire"></i> ${t('instructionChoice2')}</li>
        <li class="instruction-card"><i class="fas fa-home"></i> ${t('instructionChoice3')}</li>
        <li class="instruction-card"><i class="fas fa-ship"></i> ${t('instructionChoice4')}</li>
        <li class="instruction-card"><i class="fas fa-helicopter"></i> ${t('instructionChoice5')}</li>
        <li class="instruction-card instruction-note"><i class="fas fa-info-circle"></i> ${t('instructionNote')}</li>
    </ul>
`;

    // Hide beware text
    beware.style.display = 'none';

    // Creating Begin Button
    choices.innerHTML = `
        <button onclick="choose('begin')"><i class="fas fa-play"></i>${t('beginButton')}</button>
    `;

    // Show toast notification
    showToast(`${t('welcomeToastMsg')}`);

}

// Function to set-up the beginning page
function setupBeginPage() {
    playSound(levelUpSound5);

    storyTitle.innerText = t('beginTitle');

    // Image setup
    survivalImage.src = 'images/plane.webp';
    survivalImage.style.display = 'block';
    survivalImage.className = 'begin-image';

    // Set story text
    storyText.innerText = t('beginText');

    // Reasons for crash (translated)
    const reasonsHTML = `
    <div class="crash-reasons">
      <div class="reason-card">
        <span class="icon">✈️</span>
        <div>
          <div class="reason-title">${t('reasonMechanical')}</div>
          <small>${t('reasonMechanicalDesc')}</small>
        </div>
      </div>

      <div class="reason-card">
        <span class="icon">🌩️</span>
        <div>
          <div class="reason-title">${t('reasonWeather')}</div>
          <small>${t('reasonWeatherDesc')}</small>
        </div>
      </div>

      <div class="reason-card">
        <span class="icon">🛑</span>
        <div>
          <div class="reason-title">${t('reasonPilot')}</div>
          <small>${t('reasonPilotDesc')}</small>
        </div>
      </div>
    </div>
  `;

    storyText.innerHTML += reasonsHTML;

    // Continue button
    choices.innerHTML = `
    <button onclick="choose('continue')" class="begin-btn">
      <i class="fas fa-arrow-right"></i> ${t('continueButton')}
    </button>
  `;

    showToast(t('beginToastMsg'));
}


// Function to setup the arrival page
function setupArrivalPage() {
    // play levelUp 2 sound
    playSound(levelUpSound2);

    // Show energy display    
    energyDisplay.style.display = 'flex';
    energyValue.textContent = "50";
    // Change title to Arrival
    storyTitle.innerText = `${t('arrivalTitle')}`; //Arrival    

    // Changing Text of Story
    storyText.innerHTML = `
  <p>${t('arrivalParagraph')}</p>
  <ul id="names_list">
    <li>${t('char1')}</li>
    <li>${t('char2')}</li>
    <li>${t('char3')}</li>
  </ul>
`;

    // changing image to plane crash
    survivalImage.src = "images/planecrash.webp"; // source of image
    // setting animation of that image
    survivalImage.animate(
        [
            { opacity: 0 },   // Starting state: fully transparent
            { opacity: 1 }    // Ending state: fully opaque
        ],
        {
            duration: 1000,    // Duration in milliseconds
            easing: 'ease-in', // Animation easing type
            fill: 'forwards'   // Keeps the final state after animation
        }
    );

    // Creating Instructions for user to start their experience
    // Creating Instructions for user to start their experience
    const instructions = document.createElement('p');
    instructions.innerText = t('instructionText'); // Set from translation
    storyText.appendChild(instructions);

    // Creating New Buttons with icons and translated labels
    choices.innerHTML = `
    <button style="margin-right: 15px;" onclick="choose('Explore')">
        ${t('choiceExplore')}
    </button>
    <button onclick="choose('Fire')">
        ${t('choiceFire')}
    </button>
`;

    // Show toast message
    showToast(t('toastStranded'));

}

function setupExploreIslandPage() {
    playSound(levelUpSound3);

    reportVariables.exploreIsland = true;

    storyTitle.innerText = t("exploration.title");
    storyText.innerText = t("exploration.description");
    survivalImage.style.display = 'none';
    locationContainer.style.display = 'flex';

    // Create stylish location hint
    const locationHint = document.createElement('div');
    locationHint.id = 'locationHint';
    locationHint.innerText = t("exploration.locationHint");
    locationHint.className = 'location-hint';
    storyText.insertAdjacentElement('afterend', locationHint);

    // Handle location selection + hide hint
    const hideLocationHint = () => {
        const hint = document.getElementById('locationHint');
        if (hint) hint.style.display = 'none';
    };

    skullRockButton.onclick = () => {
        //hideLocationHint();
        handleLocationSelect('skull');
    };
    caveButton.onclick = () => {
        //hideLocationHint();
        handleLocationSelect('cave');
    };
    fallsButton.onclick = () => {
        hideLocationHint();
        handleLocationSelect('falls');
    };

    choices.innerHTML = `
        <button id="returnButton" onclick="choose('Return')">
            <i class="fas fa-arrow-left"></i> ${t("exploration.return")}
        </button>
    `;

    showToast(t("exploration.toastChooseTwo"));
}


function handleLocationSelect(location) {
    count++;

    let textKey, color;
    let imageElement, buttonElement;

    if (location === 'skull') {
        reportVariables.skullLocation = true;
        imageElement = skullRockImage;
        buttonElement = skullRockButton;
        textKey = "exploration.skullText";
        color = "purple";
    } else if (location === 'cave') {
        reportVariables.caveLocation = true;
        imageElement = ghostLightCaveImage;
        buttonElement = caveButton;
        textKey = "exploration.caveText";
        color = "blue";
    } else if (location === 'falls') {
        reportVariables.waterfallLocation = true;
        imageElement = forgottenFallsImage;
        buttonElement = fallsButton;
        textKey = "exploration.fallsText";
        color = "green";
    }

    // Disable and fade selected location
    imageElement.src = 'images/cross.jpeg';
    buttonElement.disabled = true;
    buttonElement.style.opacity = "0.5";

    // Show translated text and color
    storyText.innerText = t(textKey);
    storyText.style.color = color;

    // Update energy
    const currentEnergy = count === 1 ? reportVariables.energyAfterLocation1 : reportVariables.energyAfterLocation2;
    energyValue.textContent = currentEnergy;

    // Toast messages
    if (count === 1) {
        showToast(t("exploration.toastOne") + currentEnergy);
    } else if (count === 2) {
        showToast(t("exploration.toastTwo") + currentEnergy);
        beware.style.display = 'block';
        beware.innerText = t("exploration.beware");

        Object.assign(beware.style, {
            position: 'absolute',
            top: '50%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#333',
            color: '#f0f0f0',
            padding: '15px 25px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '500',
            textAlign: 'center',
            zIndex: '10000',
            maxWidth: '90%',
            lineHeight: '1.4',
            userSelect: 'none',
            letterSpacing: '0.03em',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            pointerEvents: 'auto',
        });
    }
}

function setupEveningPage() {
    playSound(levelUpSound4);

    locationContainer.style.display = 'none';
    beware.style.display = 'none';

    storyTitle.innerText = t('eveningTitle');
    storyText.style.color = "var(--text-color)";

    storyText.innerHTML = `
        <p>${t('eveningIntro')}</p>
        <ul id="types_of_shelters">
            <li><i class="fas fa-home"></i> ${t('shelterSmall')}</li>
            <li><i class="fas fa-warehouse"></i> ${t('shelterMedium')}</li>
            <li><i class="fas fa-building"></i> ${t('shelterLarge')}</li>
        </ul>
    `;

    survivalImage.src = 'images/buildingShelter.jpeg';
    survivalImage.style.display = 'block';
    survivalImage.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 1000, easing: 'ease-in', fill: 'forwards' }
    );

    choices.innerHTML = `
        <button onclick="choose('smallShelter')" style="margin-right: 10px;">
            <i class="fas fa-home"></i> ${t('btnSmall')}
        </button>
        <button onclick="choose('mediumShelter')" style="margin-right: 10px;">
            <i class="fas fa-warehouse"></i> ${t('btnMedium')}
        </button>
        <button onclick="choose('largeShelter')">
            <i class="fas fa-building"></i> ${t('btnLarge')}
        </button>
    `;

    showToast(t('toastShelterChoice'));
}

function setupFirePage() {
    reportVariables.buildAFire = true;
    playSound(levelUpSound3);

    storyTitle.innerText = t('fireTitle');
    storyText.innerHTML = `
        <p>${t('fireIntro')}</p>
        <p id="fire-energy" style="color:#ffaa00; font-weight:bold; text-align:center; margin-top:10px;"></p>
    `;

    survivalImage.src = 'images/ignition.jpeg';
    survivalImage.style.display = 'block';
    survivalImage.style.borderRadius = '12px';
    survivalImage.style.boxShadow = '0 0 15px rgba(255, 100, 0, 0.4)';
    survivalImage.style.transition = '0.5s';

    choices.innerHTML = `
        <button onclick="setupBuildFirePage()" class="fire-btn">
            <i class="fas fa-fire"></i> ${t('btnBuildFire')}
        </button>
    `;

    showToast(t('toastReadyFire'));
}

function setupBuildFirePage() {
    storyTitle.innerText = t('fireTitle');
    playSound(fireSound);

    const energyUsed = 40 - randomNum3;
    reportVariables.energyAfterFire -= energyUsed;

    survivalImage.src = 'images/fire.jpeg';
    survivalImage.style.display = 'block';
    survivalImage.style.boxShadow = '0 0 25px rgba(255, 80, 0, 0.8)';
    survivalImage.style.transition = '0.5s';

    storyText.innerHTML = `
        <p style="text-align:center; font-weight:bold; color:#ffbb33;">
            ${t('fireSuccessText', { energyUsed })}
        </p>
    `;

    choices.innerHTML = `
        <button onclick="choose('Return')" class="return-btn">
            <i class="fas fa-arrow-left"></i> ${t('btnReturn')}
        </button>
    `;

    showToast(t('toastFireBuilt', { energy: reportVariables.energyAfterFire }));
}

// Function to setup the shelter
function setupShelter(shelterImageSrc, shelterType) {
    // play a different sound
    playSound(levelUpSound5);

    // Update the image to an image of a shelter
    survivalImage.src = shelterImageSrc;
    reportVariables.shelterType = shelterType;

    // Animate the image
    survivalImage.animate(
        [
            { opacity: 0 },   // Starting state: fully transparent
            { opacity: 1 }    // Ending state: fully opaque
        ],
        {
            duration: 1000,    // Duration in milliseconds
            easing: 'ease-in', // Animation easing type
            fill: 'forwards'   // Keeps the final state after animation
        }
    );

    // Styling the Image
    survivalImage.style.width = '300px';  // Set the desired width
    survivalImage.style.height = 'auto';  // Maintain aspect ratio            

    // Show shelter message
    shelterMessage.style.display = 'block';

    // Update energy
    energyValue.textContent = '0';

    // Hide choices
    choices.style.display = 'none';

    // Go to Night Time page automatically
    setTimeout(() => {
        nightTime();  // Call the function after 3 seconds
    }, 3000);
}

function nightTime() {
    playSound(nightSound);
    nightCounter++;
    reportVariables.nightCount++;

    storyTitle.innerText = t("night.title") + " #" + nightCounter;

    storyText.innerHTML = `
        <p>${t("night.description")}</p>

        <div class="note-card">
            ${t("night.noteText")}
        </div>

        <div class="thoughts-container">
            <h3 class="thoughts-title">🌙 ${t("night.individualThoughtsTitle")}</h3>
            <div class="thought-card">
                <strong>Ishaan:</strong> 😊 ${t("night.ishaanThought")}
            </div>
            <div class="thought-card">
                <strong>Aryaman:</strong> 🤒 ${t("night.aryamanThought")}
            </div>
            <div class="thought-card">
                <strong>Mikail:</strong> 🚨 ${t("night.mikailThought")}
            </div>
        </div>
    `;

    shelterMessage.style.display = 'none';

    survivalImage.src = 'images/betternight.png';
    survivalImage.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 1000,
        easing: 'ease-in',
        fill: 'forwards'
    });
    survivalImage.style.width = '55%';
    survivalImage.style.maxWidth = '600px';
    survivalImage.style.margin = '25px auto';
    survivalImage.style.borderRadius = '14px';
    survivalImage.style.display = 'block';
    survivalImage.style.boxShadow = '0 0 18px rgba(255, 180, 80, 0.25)';

    choices.style.display = 'flex';
    choices.innerHTML = `
        <button id="nextDayBtn">
            <i class="fas fa-sun"></i> ${t("night.button")}
        </button>
    `;

    document.getElementById('nextDayBtn').addEventListener('click', () => choose('nextDay'));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showToast(t("night.toast"));
}


function setupNextDayPage() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound(levelUpSound6);

    storyTitle.innerText = t("nextDay.title");
    storyText.innerText = t("nextDay.description").replace("{energy}", randomNum4);

    // ⚠️ Add warning box below description
    const warningBox = document.createElement('div');
    warningBox.className = 'warning-box';
    warningBox.textContent = t("nextDay.warning"); // Add translation key
    storyText.appendChild(warningBox);

    survivalImage.src = 'images/shipPassing.jpeg';
    survivalImage.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 1000,
        easing: 'ease-in',
        fill: 'forwards'
    });

    energyValue.textContent = reportVariables.energyAfterNight;

    choices.innerHTML = `
        <button style="margin-right: 15px;" onclick="choose('shipAttention')">
            <i class="fas fa-flag-checkered"></i> ${t("nextDay.button1")}
        </button> 
        <button onclick="choose('helpOnSand')">
            <i class="fas fa-pen"></i> ${t("nextDay.button2")}
        </button> 
    `;

    showToast(t("nextDay.toast"));
}


function setupShipAttentionPage() {
    playSound(failureSound);

    storyTitle.innerText = t("shipFail.title");
    reportVariables.shipEscape = true;
    reportVariables.failureCount++;

    storyText.innerText = t("shipFail.description");

    survivalImage.src = 'images/shipFailure.jpeg';
    survivalImage.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 1000,
        easing: 'ease-in',
        fill: 'forwards'
    });

    // Create reflection container
    const reflectionBox = document.createElement('div');
    reflectionBox.className = 'reflection-box';
    reflectionBox.innerHTML = `
    <label for="reflection-input">${t("shipFail.prompt")}</label>
    <textarea id="reflection-input" placeholder="${t("shipFail.placeholder")}" rows="3"></textarea>
    <button onclick="submitReflection()">${t("shipFail.submitButton")}</button>
`;
    storyText.appendChild(reflectionBox);

    energyValue.textContent = '0';

    showToast(t("shipFail.toast"));

    setTimeout(() => {
        failureMessage.style.display = 'block';
    }, 3000);

    choices.innerHTML = `
        <button onclick="choose('reTry')">
            <i class="fas fa-redo"></i> ${t("shipFail.retryButton")}
        </button>
    `;
}

function setupSuccessPage() {
    playSound(successSound);

    storyTitle.innerText = t("success.title");
    reportVariables.helpEscape = true;
    reportVariables.success = true;

    storyText.innerText = t("success.description");

    survivalImage.src = 'images/helicopter.jpeg';
    survivalImage.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 1000,
        easing: 'ease-in',
        fill: 'forwards'
    });

    energyValue.textContent = '0';

    showToast(t("success.toast"));

    setTimeout(() => {
        successMessage.style.display = 'block';
    }, 3000);

    choices.innerHTML = `
        <button onclick="choose('report')">
            <i class="fas fa-file-alt"></i> ${t("success.reportButton")}
        </button>
    `;
}

// Function to setup the report page
function setupReportPage() {
    storyTitle.innerText = t("report.title");

    energyDisplay.style.display = 'none';
    successMessage.style.display = 'none';
    survivalImage.style.display = 'none';
    choices.style.display = 'none';
    helpButton.style.display = 'none';

    playSound(levelUpSound1);
    exportButton.style.display = 'flex';

    let locationReportMessage = "";
    let buildFireReportMessage = "";
    let shelterReportMessage = "";
    let nightReportMessage = "";
    let shipEscapeReportMessage = "";
    let helpEscapeReportMessage = "";

    nightReportMessage = `${t("report.nightEnergy")}: ${reportVariables.energyAfterNight}`;

    if (reportVariables.exploreIsland) {
        if (reportVariables.skullLocation && reportVariables.waterfallLocation) {
            locationReportMessage = `${t("report.exploredTrue")}\n${t("report.visitedSW")}\n\t${t("report.energy1")}: ${reportVariables.energyAfterLocation1}\n\t${t("report.energy2")}: ${reportVariables.energyAfterLocation2}`;
        } else if (reportVariables.waterfallLocation && reportVariables.caveLocation) {
            locationReportMessage = `${t("report.exploredTrue")}\n${t("report.visitedWC")}\n\t${t("report.energy1")}: ${reportVariables.energyAfterLocation1}\n\t${t("report.energy2")}: ${reportVariables.energyAfterLocation2}`;
        } else {
            locationReportMessage = `${t("report.exploredTrue")}\n${t("report.visitedSC")}\n\t${t("report.energy1")}: ${reportVariables.energyAfterLocation1}\n\t${t("report.energy2")}: ${reportVariables.energyAfterLocation2}`;
        }
    } else {
        locationReportMessage = `${t("report.exploredFalse")}`;
    }

    if (reportVariables.buildAFire) {
        buildFireReportMessage = `${t("report.builtFireTrue")}\n\t${t("report.fireEnergy")}: ${reportVariables.energyAfterFire}`;
    } else {
        buildFireReportMessage = `${t("report.builtFireFalse")}`;
    }

    if (reportVariables.shelterType === "Small Shelter") {
        shelterReportMessage = `${t("report.shelterSmall")}`;
    } else if (reportVariables.shelterType === "Medium Shelter") {
        shelterReportMessage = `${t("report.shelterMedium")}`;
    } else {
        shelterReportMessage = `${t("report.shelterLarge")}`;
    }

    if (reportVariables.shipEscape) {
        shipEscapeReportMessage = `${t("report.shipEscapeTrue")}\n\t${t("report.failCount")}: ${reportVariables.failureCount}`;
    } else {
        shipEscapeReportMessage = `${t("report.shipEscapeFalse")}`;
    }

    if (reportVariables.helpEscape) {
        helpEscapeReportMessage = `${t("report.escapedHelp")}`;
    }

    storyText.innerHTML = `
    <div class="report-container">
        <ul class="report-list">
            <li><pre><i class="fas fa-bolt"></i> ${t("report.energyStart")}</pre></li>
            <li><pre><i class="fas fa-compass"></i> ${locationReportMessage}</pre></li>
            <li><pre><i class="fas fa-fire"></i> ${buildFireReportMessage}</pre></li>
            <li><pre><i class="fas fa-home"></i> ${shelterReportMessage}</pre></li>
            <li><pre><i class="fas fa-moon"></i> ${nightReportMessage}</pre></li>
            <li><pre><i class="fas fa-ship"></i> ${shipEscapeReportMessage}</pre></li>
            <li><pre><i class="fas fa-helicopter"></i> ${helpEscapeReportMessage}</pre></li>
            <li><pre><i class="fas fa-battery-empty"></i> ${t("report.energyEnd")}</pre></li>
        </ul>
        <div id="choices" style="display: block; margin-top: 20px;">
            <button onclick="choose('Restart')">
                <i class="fas fa-redo"></i> ${t("report.playAgain")}
            </button>
        </div>
    </div>`;

    showToast(t("report.toast"));
}

// Function to restart the game
function restartGame() {
    // Hide success message
    successMessage.style.display = 'none';
    // Play a sound
    playSound(levelUpSound1);
    // Reset game state
    count = 0;
    nightCounter = 0;
    gameProgress = 0;

    // Reset report variables
    reportVariables = {
        helpCount: 0,
        exploreIsland: false,
        buildAFire: false,
        skullLocation: false,
        waterfallLocation: false,
        caveLocation: false,
        energyStart: 50,
        energyAfterLocation1: Math.floor(Math.random() * 6) + 30,
        energyAfterLocation2: Math.floor(Math.random() * 6) + 20,
        energyAfterFire: Math.floor(Math.random() * 6) + 25,
        shelterType: "",
        energyAfterShelter: 0,
        nightCount: 0,
        energyAfterNight: Math.floor(Math.random() * 16) + 20,
        shipEscape: false,
        failureCount: 0,
        helpEscape: false,
        success: false,
        energyEnd: 0
    };

    // Reset report data
    reportData = [];

    // Show toast message
    showToast("Restarting game...");

    // Go back to the first page of the program
    window.location.href = 'index.html';
}

// Function to handle help button click
function helpButtonClick() {
    reportVariables.helpCount++;

    // Store current game state in session storage
    sessionStorage.setItem("currentPage", currentPage);
    sessionStorage.setItem("darkMode", darkMode);
    sessionStorage.setItem("audioEnabled", audioEnabled);
    sessionStorage.setItem("energyValue", energyValue.textContent);
    sessionStorage.setItem("reportVariables", JSON.stringify(reportVariables));

    // Hide UI elements
    energyDisplay.style.display = 'none';

    // Show toast message
    showToast("Going to help page...");

    // Navigate to help page
    window.location.href = 'helpPage.html';
}

// Event Listener to load the instructions page when back is clicked from help page
window.addEventListener("load", function () {
    // Check for dark mode preference
    const darkModePref = localStorage.getItem('darkMode') === 'true';
    if (darkModePref) {
        document.body.classList.add('dark-mode');
        if (document.getElementById('dark-mode-toggle')) {
            document.getElementById('dark-mode-toggle').checked = true;
        }
        darkMode = true;
    }

    // Check for audio preference
    if (document.getElementById('audio-toggle')) {
        document.getElementById('audio-toggle').checked = audioEnabled;
    }

    // Check if returning from help page
    if (sessionStorage.getItem("returnFromHelp") === "true") {
        // Restore game state
        currentPage = sessionStorage.getItem("currentPage");
        darkMode = sessionStorage.getItem("darkMode") === "true";
        audioEnabled = sessionStorage.getItem("audioEnabled") === "true";

        // Update energy value if it exists
        if (sessionStorage.getItem("energyValue")) {
            energyValue.textContent = sessionStorage.getItem("energyValue");
        }

        // Restore report variables
        if (sessionStorage.getItem("reportVariables")) {
            reportVariables = JSON.parse(sessionStorage.getItem("reportVariables"));
        }

        // Remove temporary session data
        sessionStorage.removeItem("returnFromHelp");
        sessionStorage.removeItem("currentPage");
        sessionStorage.removeItem("darkMode");
        sessionStorage.removeItem("audioEnabled");
        sessionStorage.removeItem("energyValue");
        sessionStorage.removeItem("reportVariables");

        // Go back to the page from where help was clicked
        choose(currentPage);
    }
});

// Function to setup speech recognition for voice commands
function setupSpeechRecognition() {
    // Show toast message
    showToast("Voice recognition activated. Speak a command...");

    // Get the SpeechRecognition interface
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // Create a new recognition instance
    const recognition = new SpeechRecognition();

    // Set properties
    recognition.lang = 'en-US'; // Language
    recognition.continuous = false; // Stop after one command
    recognition.interimResults = false; // Final results only

    // Start recognition
    recognition.start();

    // Handle recognition results
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        const command = transcript.trim().toLowerCase();
        console.log("Voice command detected: " + command);

        // Show detected command
        showToast("Command detected: " + command);

        // Process different voice commands
        processVoiceCommand(command);
    };

    // Handle errors
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        showToast("Voice recognition error: " + event.error);
    };

    // Cleanup when recognition ends
    recognition.onend = () => {
        console.log("Voice recognition ended");
    };
}

// Function to process voice commands
function processVoiceCommand(command) {
    // For each text detected, it would transition to that page
    switch (command) {
        case 'stop':
        case 'restart':
        case 'reset':
            restartGame();
            break;
        case 'begin':
        case 'start':
        case 'start game':
            choose('begin');
            break;
        case 'continue':
        case 'next':
            choose('continue')
            break;
        case 'explore':
        case 'explore the island':
        case 'explore island':
            choose('Explore');
            break;
        case 'fire':
        case 'build fire':
        case 'make fire':
            choose('Fire');
            break;
        case 'build fire':
        case 'ignite':
        case 'light fire':
            choose('buildFire');
            break;
        case 'return':
        case 'return back':
        case 'go back':
            choose('Return');
            break;
        case 'small':
        case 'small shelter':
            choose('smallShelter');
            break;
        case 'medium':
        case 'medium shelter':
            choose('mediumShelter');
            break;
        case 'large':
        case 'large shelter':
            choose('largeShelter');
            break;
        case 'next day':
        case 'morning':
        case 'wake up':
            choose('nextDay');
            break;
        case 'ship':
        case 'signal ship':
        case 'get ship attention':
        case 'wave':
            choose('shipAttention');
            break;
        case 'try again':
        case 'retry':
            choose('reTry');
            break;
        case 'help':
        case 'help page':
            helpButtonClick();
            break;
        case 'write help':
        case 'write help on sand':
        case 'write in sand':
        case 'sand message':
            choose('helpOnSand');
            break;
        case 'report':
        case 'show report':
        case 'view report':
            choose('report');
            break;
        case 'dark mode':
        case 'toggle dark mode':
            toggleDarkMode();
            break;
        case 'mute':
        case 'toggle audio':
        case 'turn off sound':
            if (document.getElementById('audio-toggle')) {
                document.getElementById('audio-toggle').checked = !audioEnabled;
                toggleAudio();
            }
            break;
        default:
            showToast("Command not recognized. Try again.");
    }
}

// Function to export data to Excel
function exportToExcel(data, fileName) {
    console.log("Exporting data to Excel:", data);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert input data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the sheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survival Report");

    // Style the worksheet (headers, etc.)
    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4CAF50" } }
    };

    // Apply formatting (basic version since full styling requires more complex code)
    const colWidths = [{ wch: 30 }, { wch: 10 }];
    worksheet['!cols'] = colWidths;

    // Export the workbook to a file
    XLSX.writeFile(workbook, fileName);
}

// Load translation file based on selected language
function loadLanguageFile(lang) {
    fetch(`languages/${lang}.json`)
        .then(res => res.json())
        .then(data => {
            translations = data;
            updateStaticText(); // Apply text after load
        })
        .catch(err => {
            console.error(`Error loading language file "${lang}.json":`, err);
        });
}

// Get translated text
function t(key) {
    return translations[key] || `[MISSING: ${key}]`;
}

function updateStaticText(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = t(key);
    });
}

// Handle dropdown changes
document.getElementById("language-select").addEventListener("change", (e) => {
    const lang = e.target.value;
    localStorage.setItem('language', lang);
    currentLang = lang;
    loadLanguageFile(lang);
});

// Initial load
loadLanguageFile(currentLang);

document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
        // your button logic...

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

document.body.addEventListener('click', (e) => {
    const excludedIds = ['btnSmall', 'btnMedium', 'btnLarge'];

    if (
        e.target.tagName === 'BUTTON' &&
        !excludedIds.includes(e.target.id)
    ) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Helper to get current font size of container
function getFontSize() {
    const style = window.getComputedStyle(storyContainer);
    return parseFloat(style.fontSize);
}

// Apply and save new size
function updateFontSize(size) {
    storyContainer.style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
}

// Load saved size on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) {
        updateFontSize(savedSize);
    }
});

// Increase
document.getElementById('font-increase').addEventListener('click', () => {
    let current = getFontSize();
    if (current < MAX_FONT_SIZE) updateFontSize(current + 2);
});

// Decrease
document.getElementById('font-decrease').addEventListener('click', () => {
    let current = getFontSize();
    if (current > MIN_FONT_SIZE) updateFontSize(current - 2);
});

function submitReflection() {
    const input = document.getElementById('reflection-input').value;
    if (input.trim()) {
        showToast(t("shipFail.thankYou")); // A little confirmation toast
        console.log("User reflection:", input); // For debugging or saving
        document.getElementById('reflection-input').disabled = true;
    } else {
        showToast(t("shipFail.emptyWarning"));
    }

    
}