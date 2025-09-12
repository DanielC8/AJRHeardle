// AJR Heardle - Fixed Working Version
// Configuration
const HEARDLE_GLITCH_NAME = "the-ajr-heardle";
const HEARDLE_URL = "https://" + HEARDLE_GLITCH_NAME + ".glitch.me/";
const HEARDLE_ARTIST = "AJR";
const HEARDLE_NAME = "AJR Heardle";
const HEARDLE_START_DATE = "2023-10-1";

const HEARDLE_GAME_COMMENTS = [
    "Unlucky!", // FAILED
    "A virtuoso performance!", // First try
    "An act of genius!",
    "You're a star!",
    "What a pro!",
    "You're a winner!",
    "Good result!" // Sixth try
];

// Game state
let currentSong = null;
let currentGuess = 0;
let maxGuesses = 6;
let gameWon = false;
let gameOver = false;
let widget = null;
let playDurations = [1, 2, 4, 7, 11, 16]; // seconds for each guess
let isPlaying = false;
let audioFallback = false;

// Get today's song based on start date
function getTodaysSong() {
    const startDate = new Date(HEARDLE_START_DATE);
    const today = new Date();
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const songIndex = daysDiff % songs.length;
    return songs[songIndex];
}

// Create SoundCloud player with proper permissions and hidden title
function createPlayer(song, hideTitle = true) {
    const iframe = document.createElement('iframe');
    iframe.id = 'soundcloud-player';
    iframe.width = "100%";
    iframe.height = hideTitle ? "120" : "166";
    iframe.scrolling = "no";
    iframe.frameBorder = "no";
    iframe.allow = "autoplay; encrypted-media";
    iframe.sandbox = "allow-scripts allow-same-origin allow-presentation";
    
    // Hide title and user info to prevent spoilers during gameplay
    const visualParam = hideTitle ? "&visual=true&show_artwork=false&show_playcount=false&show_user=false&show_comments=false&hide_related=true&show_teaser=false" : "&visual=false";
    iframe.src = `https://w.soundcloud.com/player/?url=${song.url}&color=%23ff5500&auto_play=false${visualParam}`;
    
    return iframe;
}

// Create a completely hidden audio-only player for spoiler-free gameplay
function createHiddenPlayer(song) {
    const container = document.createElement('div');
    container.style.cssText = `
        position: relative;
        width: 100%;
        height: 120px;
        background: #222;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #444;
    `;
    
    const iframe = document.createElement('iframe');
    iframe.id = 'soundcloud-player';
    iframe.width = "100%";
    iframe.height = "120";
    iframe.scrolling = "no";
    iframe.frameBorder = "no";
    iframe.allow = "autoplay; encrypted-media";
    iframe.sandbox = "allow-scripts allow-same-origin allow-presentation";
    iframe.src = `https://w.soundcloud.com/player/?url=${song.url}&color=%23ff5500&auto_play=false&visual=true&show_artwork=false&show_playcount=false&show_user=false&show_comments=false&hide_related=true&show_teaser=false`;
    iframe.style.cssText = 'opacity: 0.1; pointer-events: none;';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #222;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #888;
        font-size: 18px;
        border-radius: 6px;
    `;
    overlay.innerHTML = '🎵 Audio Player Ready';
    
    container.appendChild(iframe);
    container.appendChild(overlay);
    
    return container;
}

// Initialize SoundCloud Widget API with error handling
function initSoundCloudWidget() {
    try {
        if (typeof SC !== 'undefined') {
            widget = SC.Widget('soundcloud-player');
            
            widget.bind(SC.Widget.Events.READY, function() {
                console.log('SoundCloud widget ready');
                audioFallback = false;
            });
            
            widget.bind(SC.Widget.Events.ERROR, function() {
                console.log('SoundCloud widget error - using fallback');
                audioFallback = true;
            });
            
            widget.bind(SC.Widget.Events.FINISH, function() {
                isPlaying = false;
                updatePlayButton();
            });
        } else {
            audioFallback = true;
        }
    } catch (error) {
        console.log('SoundCloud widget initialization failed - using fallback');
        audioFallback = true;
    }
}

// Play audio with fallback for blocked SoundCloud
function playAudio() {
    if (gameOver) return;
    
    const duration = playDurations[currentGuess] * 1000;
    const playButton = document.getElementById('play-button');
    
    if (widget && !audioFallback) {
        try {
            if (isPlaying) {
                widget.pause();
                isPlaying = false;
            } else {
                widget.seekTo(0);
                widget.play();
                isPlaying = true;
                
                setTimeout(() => {
                    if (isPlaying) {
                        widget.pause();
                        isPlaying = false;
                        updatePlayButton();
                    }
                }, duration);
            }
            updatePlayButton();
        } catch (error) {
            audioFallback = true;
            playAudioFallback();
        }
    } else {
        playAudioFallback();
    }
}

// Fallback audio solution when SoundCloud is blocked
function playAudioFallback() {
    const playButton = document.getElementById('play-button');
    const duration = playDurations[currentGuess];
    
    if (isPlaying) {
        isPlaying = false;
        updatePlayButton();
        return;
    }
    
    isPlaying = true;
    playButton.textContent = `♪ Playing ${duration}s...`;
    playButton.style.background = '#ff8800';
    
    // Show the actual SoundCloud player for manual control
    const player = document.getElementById('soundcloud-player');
    if (player) {
        player.style.display = 'block';
        player.style.opacity = '0.7';
    }
    
    // Add instruction text
    const instruction = document.createElement('div');
    instruction.id = 'audio-instruction';
    instruction.style.cssText = 'text-align: center; color: #ff8800; font-size: 14px; margin: 10px 0;';
    instruction.innerHTML = `🎵 Please click play on the SoundCloud player above and stop after ${duration} seconds`;
    
    const existingInstruction = document.getElementById('audio-instruction');
    if (existingInstruction) {
        existingInstruction.remove();
    }
    
    playButton.parentNode.insertBefore(instruction, playButton.nextSibling);
    
    setTimeout(() => {
        isPlaying = false;
        updatePlayButton();
        if (instruction) instruction.remove();
        if (player) {
            player.style.opacity = '1';
        }
    }, duration * 1000);
}

// Update play button text
function updatePlayButton() {
    const playButton = document.getElementById('play-button');
    if (playButton) {
        if (isPlaying) {
            playButton.textContent = '⏸ Stop';
            playButton.style.background = '#ff8800';
        } else {
            playButton.textContent = '▶ Play';
            playButton.style.background = '#ff5500';
        }
    }
}

// Create autocomplete with duplicate prevention
function createAutocomplete() {
    const input = document.getElementById('guess-input');
    const dropdown = document.createElement('div');
    dropdown.id = 'autocomplete-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        background: #222;
        border: 2px solid #444;
        border-top: none;
        border-radius: 0 0 5px 5px;
        max-height: 200px;
        overflow-y: auto;
        width: 100%;
        z-index: 1000;
        display: none;
    `;
    
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(dropdown);
    
    input.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        dropdown.innerHTML = '';
        
        if (query.length < 2) {
            dropdown.style.display = 'none';
            return;
        }
        
        // Remove duplicates using Set with normalized answers
        const uniqueSongs = [];
        const seenAnswers = new Set();
        
        songs.forEach(song => {
            const normalizedAnswer = song.answer.toLowerCase().trim();
            if (normalizedAnswer.includes(query) && !seenAnswers.has(normalizedAnswer)) {
                seenAnswers.add(normalizedAnswer);
                uniqueSongs.push(song);
            }
        });
        
        const matches = uniqueSongs.slice(0, 10);
        
        if (matches.length > 0) {
            matches.forEach(song => {
                const item = document.createElement('div');
                item.style.cssText = `
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #444;
                    color: white;
                `;
                item.textContent = song.answer;
                
                item.addEventListener('mouseenter', () => {
                    item.style.background = '#444';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.background = 'transparent';
                });
                
                item.addEventListener('click', () => {
                    input.value = song.answer;
                    dropdown.style.display = 'none';
                });
                
                dropdown.appendChild(item);
            });
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// Check if guess is correct
function checkGuess(guess) {
    const correct = guess.toLowerCase().trim() === currentSong.answer.toLowerCase().trim();
    
    if (correct) {
        gameWon = true;
        gameOver = true;
        showResult(true);
    } else {
        currentGuess++;
        if (currentGuess >= maxGuesses) {
            gameOver = true;
            showResult(false);
        } else {
            updateUI();
        }
    }
}

// Show game result
function showResult(won) {
    const resultDiv = document.getElementById('result');
    const commentIndex = won ? currentGuess + 1 : 0;
    const comment = HEARDLE_GAME_COMMENTS[commentIndex];
    
    resultDiv.innerHTML = `
        <h2>${won ? 'Congratulations!' : 'Game Over'}</h2>
        <p>${comment}</p>
        <p>The song was: <strong>${currentSong.answer}</strong></p>
        <div id="full-player-container"></div>
        <button onclick="shareResult()" style="background: #1d7e05; color: white; border: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 15px;">
            Share Result
        </button>
    `;
    
    // Show full player
    const playerContainer = document.getElementById('full-player-container');
    const fullPlayer = createPlayer(currentSong, false);
    fullPlayer.style.marginTop = '15px';
    fullPlayer.style.display = 'block';
    playerContainer.appendChild(fullPlayer);
}

// Share result
function shareResult() {
    const squares = gameWon ? '🟩'.repeat(currentGuess + 1) + '⬜'.repeat(maxGuesses - currentGuess - 1) 
                            : '🟥'.repeat(maxGuesses);
    
    const text = `${HEARDLE_NAME}\n${squares}\n${HEARDLE_URL}`;
    
    if (navigator.share) {
        navigator.share({ text });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Result copied to clipboard!');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Result copied to clipboard!');
        });
    }
}

// Update UI
function updateUI() {
    const guessCountEl = document.getElementById('guess-count');
    const progressEl = document.getElementById('progress');
    const playButtonEl = document.getElementById('play-button');
    
    if (guessCountEl) guessCountEl.textContent = `Guess ${currentGuess + 1}/${maxGuesses}`;
    if (playButtonEl) playButtonEl.disabled = false;
    
    // Update progress bar
    if (progressEl) {
        const progress = ((currentGuess + 1) / maxGuesses) * 100;
        progressEl.style.width = progress + '%';
    }
}

// Initialize game
function initGame() {
    currentSong = getTodaysSong();
    
    // Update page title
    document.title = HEARDLE_NAME;
    
    document.body.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: #121212; color: #ffffff; min-height: 100vh;">
            <h1 style="text-align: center; color: #ff5500;">${HEARDLE_NAME}</h1>
            <p style="text-align: center;">Listen to the intro, then find the correct AJR song!</p>
            
            <div style="margin: 20px 0;">
                <div style="background: #333; height: 10px; border-radius: 5px;">
                    <div id="progress" style="background: #ff5500; height: 100%; border-radius: 5px; width: 16.67%; transition: width 0.3s;"></div>
                </div>
                <p id="guess-count" style="text-align: center; margin: 10px 0;">Guess 1/${maxGuesses}</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <div id="player-container" style="margin-bottom: 15px;"></div>
                <button id="play-button" onclick="playAudio()" style="background: #ff5500; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; cursor: pointer;">
                    ▶ Play
                </button>
            </div>
            
            <div style="margin: 20px 0;">
                <input type="text" id="guess-input" placeholder="Start typing an AJR song..." style="width: 100%; padding: 15px; border: 2px solid #444; border-radius: 5px; background: #222; color: white; font-size: 16px; box-sizing: border-box;">
                <button onclick="submitGuess()" style="width: 100%; margin-top: 10px; background: #1d7e05; color: white; border: none; padding: 15px; border-radius: 5px; font-size: 16px; cursor: pointer;">
                    Submit Guess
                </button>
            </div>
            
            <div id="guesses" style="margin: 20px 0;"></div>
            <div id="result"></div>
        </div>
    `;
    
    // Create and add the SoundCloud player (initially hidden)
    const playerContainer = document.getElementById('player-container');
    const player = createHiddenPlayer(currentSong);
    playerContainer.appendChild(player);
    
    updateUI();
    createAutocomplete();
    
    // Initialize SoundCloud Widget API after a delay
    setTimeout(() => {
        initSoundCloudWidget();
    }, 1000);
    
    // Add enter key support
    document.getElementById('guess-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitGuess();
        }
    });
}

// Submit guess
function submitGuess() {
    const input = document.getElementById('guess-input');
    const guess = input.value.trim();
    
    if (!guess || gameOver) return;
    
    // Hide autocomplete
    const dropdown = document.getElementById('autocomplete-dropdown');
    if (dropdown) dropdown.style.display = 'none';
    
    // Add guess to list
    const guessesDiv = document.getElementById('guesses');
    const guessDiv = document.createElement('div');
    const isCorrect = guess.toLowerCase() === currentSong.answer.toLowerCase();
    const borderColor = isCorrect ? '#1d7e05' : '#ff0000';
    
    guessDiv.style.cssText = `padding: 10px; margin: 5px 0; background: #333; border-radius: 5px; border-left: 4px solid ${borderColor};`;
    guessDiv.textContent = guess;
    guessesDiv.appendChild(guessDiv);
    
    input.value = '';
    checkGuess(guess);
}

// Load SoundCloud Widget API
function loadSoundCloudAPI() {
    if (typeof SC === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://w.soundcloud.com/player/api.js';
        script.onload = () => {
            console.log('SoundCloud API loaded');
        };
        script.onerror = () => {
            console.log('SoundCloud API failed to load - using fallback');
            audioFallback = true;
        };
        document.head.appendChild(script);
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof songs === 'undefined') {
        document.body.innerHTML = '<div style="text-align: center; padding: 50px; color: red;">Error: Songs not loaded</div>';
        return;
    }
    
    loadSoundCloudAPI();
    initGame();
});

// Export for debugging
window.app = { initGame, getTodaysSong, currentSong, playAudio, submitGuess };
