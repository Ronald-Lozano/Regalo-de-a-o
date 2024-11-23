// Create sunflowers
function createSunflowers() {
    const container = document.getElementById('sunflowerContainer');
    const numSunflowers = 20;

    for (let i = 0; i < numSunflowers; i++) {
        const sunflower = document.createElement('div');
        sunflower.className = 'sunflower';
        sunflower.style.left = `${Math.random() * 100}%`;
        sunflower.style.top = `${Math.random() * 100}%`;
        sunflower.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(sunflower);
    }
}

// Name validation
function validateName() {
    const name = document.getElementById('nameInput').value.trim().toLowerCase();
    const errorElement = document.getElementById('nameError');

    if (name === 'daniela' || name === 'daniela cortez') {
        document.getElementById('namePopup').classList.remove('show');
        document.getElementById('quiz').style.display = 'block';
        errorElement.style.display = 'none';

        // Iniciamos la música cuando el nombre es válido
        startMusicOnInteraction();
    } else {
        errorElement.style.display = 'block';
        document.getElementById('nameInput').value = '';
    }
}

// Enhanced celebration
function showCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.style.display = 'flex';

    // Bajamos gradualmente el volumen de la música
    const fadeOutInterval = setInterval(() => {
        if (backgroundMusic.volume > 0.1) {
            backgroundMusic.volume -= 0.1;
        } else {
            clearInterval(fadeOutInterval);
            backgroundMusic.pause();
            // Aquí podrías iniciar una música diferente para la celebración
        }
    }, 100);

    // Animate photos sequentially
    const photos = document.querySelectorAll('.gallery-image');
    photos.forEach((photo, index) => {
        setTimeout(() => {
            photo.style.display = 'block';
        }, index * 200);
    });

    // Create fireworks
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 50);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createSunflowers();
    initMusic();

    // Evento para el input del nombre
    document.getElementById('nameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validateName();
        }
    });
});

const correctAnswers = {
    1: 'B',
    2: 'B',
    3: 'A',
    4: 'C',
    5: 'B',
    6: 'C',
    7: 'B',
    8: 'A',
    9: 'C',
    10: 'B',
    11: 'B',
    12: 'B'
};

let currentQuestion = 1;
let correctAnswersCount = 0;

function startQuiz() {
    document.getElementById('welcomePopup').classList.remove('show');
    document.getElementById('quiz').style.display = 'block';
}

function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-hearts';
    heart.innerHTML = '❤️';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    document.body.appendChild(heart);

    anime({
        targets: heart,
        translateY: -100,
        opacity: [0, 1, 0],
        duration: 1500,
        easing: 'easeOutExpo',
        complete: () => heart.remove()
    });
}

function showSuccessAnimation() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight - 100;
            createFloatingHeart(x, y);
        }, i * 100);
    }

    const popup = document.getElementById('successPopup');
    popup.classList.add('show');
}

function checkAnswer(question, answer) {
    if (correctAnswers[question] === answer) {
        correctAnswersCount++;
        showSuccessAnimation();
    } else {
        document.getElementById('errorPopup').classList.add('show');
    }
}

function closePopup(popupId) {
    document.getElementById(popupId).classList.remove('show');
    if (popupId === 'successPopup') {
        if (currentQuestion < 12) {
            document.querySelector(`[data-question="${currentQuestion}"]`).classList.remove('active');
            document.querySelector(`[data-question="${currentQuestion + 1}"]`).classList.add('active');
            currentQuestion++;
        } else if (correctAnswersCount === 12) {
            showCelebration();
        }
    }
}

function showCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.style.display = 'flex';

    // Crear más fuegos artificiales
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 50);
    }
}

function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    document.body.appendChild(firework);

    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight;
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = Math.random() * (window.innerHeight * 0.7);

    anime({
        targets: firework,
        left: [startX, endX],
        top: [startY, endY],
        scale: [1, 3, 0],
        opacity: {
            value: [1, 0],
            duration: 2500,
            easing: 'easeOutExpo'
        },
        duration: 2500,
        easing: 'easeOutExpo',
        complete: () => {
            firework.remove();
            if (Math.random() > 0.5) {
                createFirework();
            }
        }
    });
}

// Variables para el control de música
let isMusicPlaying = false;
const backgroundMusic = document.getElementById('backgroundMusic');
const toggleMusicButton = document.getElementById('toggleMusic');
const volumeSlider = document.getElementById('volumeSlider');

// Función para iniciar la música
function initMusic() {
    backgroundMusic.volume = volumeSlider.value;

    toggleMusicButton.addEventListener('click', () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            toggleMusicButton.textContent = '🔈';
            toggleMusicButton.classList.add('muted');
        } else {
            backgroundMusic.play();
            toggleMusicButton.textContent = '🔊';
            toggleMusicButton.classList.remove('muted');
        }
        isMusicPlaying = !isMusicPlaying;
    });

    volumeSlider.addEventListener('input', (e) => {
        backgroundMusic.volume = e.target.value;
    });
}

// Función para iniciar la música cuando el usuario interactúe
function startMusicOnInteraction() {
    backgroundMusic.play()
        .then(() => {
            isMusicPlaying = true;
            toggleMusicButton.textContent = '🔊';
            document.removeEventListener('click', startMusicOnInteraction);
        })
        .catch(error => {
            console.log("Error al reproducir música:", error);
        });
}

// Modificar la función closePopup para mostrar el mensaje después del quiz
function closePopup(popupId) {
    document.getElementById(popupId).classList.remove('show');
    if (popupId === 'successPopup') {
        if (currentQuestion < 12) {
            document.querySelector(`[data-question="${currentQuestion}"]`).classList.remove('active');
            document.querySelector(`[data-question="${currentQuestion + 1}"]`).classList.add('active');
            currentQuestion++;
        } else if (correctAnswersCount === 12) {
            showLoveMessage();
        }
    }
}

// Función para mostrar el mensaje
function showLoveMessage() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('loveMessage').style.display = 'flex';
}

// Función para mostrar las fotos después del mensaje
function showPhotos() {
    document.getElementById('loveMessage').style.display = 'none';
    showCelebration();
}

// Love languages typing effect
const loveMessages = [
    "Te amo ❤️", "I love you ❤️", "Je t'aime ❤️",
    "Ti amo ❤️", "Ich liebe dich ❤️", "愛してる ❤️"
];
let currentMessageIndex = 0;

function typeLoveMessage() {
    const element = document.getElementById('loveLanguages');
    const message = loveMessages[currentMessageIndex];
    let charIndex = 0;

    element.textContent = '';

    const typing = setInterval(() => {
        if (charIndex < message.length) {
            element.textContent += message[charIndex];
            charIndex++;
        } else {
            clearInterval(typing);
            setTimeout(() => {
                currentMessageIndex = (currentMessageIndex + 1) % loveMessages.length;
                typeLoveMessage();
            }, 2000);
        }
    }, 100);
}

// Together counter
function updateCounter() {
    const startDate = new Date('2023-11-30');
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('togetherCounter').innerHTML =
        `Juntos por: ${days} días, ${hours} horas y ${minutes} minutos ❤️`;
}

// Rose petals animation
function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.body.appendChild(petal);

    petal.addEventListener('animationend', () => petal.remove());
}

// Shooting stars
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.animationDuration = (Math.random() * 2 + 1) + 's';
    document.body.appendChild(star);

    star.addEventListener('animationend', () => star.remove());
}

// Confetti
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.body.appendChild(confetti);

    confetti.addEventListener('animationend', () => confetti.remove());
}

// Background color transition
function updateBackground(progress) {
    const hue = 340 + (progress * 20); // Varying shades of pink/red
    document.body.style.background = `linear-gradient(135deg, hsl(${hue}, 100%, 80%), hsl(${hue - 20}, 100%, 70%))`;
}

// Success sound effect
function playSuccessSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVK3n77BdGAg+ltryxnMpBSl+zPDajz0IFmW57OihUBELTKPh8bllHgU2jdTzzn4vBSF6yu/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEgODlGq5O+zYBoGPJPY88p2KwUme8rx3ZJACBVhtunto1ITCkmi4PK8aB8GM4nS89GBMQYfccjv45ZEDBFYr+ftrVoXBkCY3PLEcSYELIHO8diJOQgZaLvt559NEAxQqOPwtmIdBjiS1/PMeS0GI3fH8N2RQAoUXrTp66hWFApGnt/yvmwhBTCG0fPTgjQGHW/A7eSaRQ0PVK3m77BeGQc+ltrzxnUoBSh+zPDajz0IFmW57OihUBELTKPh8bllHgU1jdTyzn4vBSF6yu/glEILElyx6OyrWRYIQ5vd8sFuJAUug8/z1oU2Bhxqv+7mnEgODlGq5O+zYRsGPJPY88p3KwUme8rx3ZJACBVhtuv+o1ITCkmi4PG8ah8GMonR89GBMQYfccjv45ZEDBFYr+ftrVwWBj+Y3PLEcSYGLIDP8diJOQgZab3t559NEAxQqOPwtmIdBjiS1/PMeS0GI3fH8N2RQAoUXrTp66hWFApGnt/yv2wiBTCG0fPTgzQGHW/A7eSaRQ0PVa3m77BeGQc+ltvzxnUoBSh+zPDajz0IFmW57OihUBELTKPh8blmHgU1jdTyzn4vBSF6yu/glEILElyx6OyrWRYIQ5vd8sFuJAUug8/z1oU2Bhxqv+7mnEgODlGq5O+zYRsGPJPY88p3KwUmfMrx3ZJACBVhtuv+o1ITCkmi4PG8ah8GMonR89GBMQYfccjv45ZEDBFYr+ftrVwWBj+Y3PLEcSYGLIDP8diJOQgZab3t559NEAxQqOPwtmIdBjiS1/PMeS0GI3fH8N2RQAoUXrTp66hWFApGnt/yv2wiBTCG0fPTgzQGHW/A7eSaRQ0PVa3m77BeGQc+ltvzxnUoBSh+zPDajz0IFmW57OihUBELTKPh8blmHgU1jdTyzn4vBSF6yu/glEILElyx6OyrWRYIQ5vd8sFuJAUug8/z1oU2Bhxqv+7mnEgODlGq5O+zYRsGPJPY88p3KwUmfMrx3ZJACBVhtuv+o1ITCkmi4PG8ah8GMorS89GBMQYfccjv45ZEDBFYr+ftrVwWBj+Y3PLEcSYGLIDP8diJOQgZab3t559NEAxQqOPwtmIdBjiS1/PMeS0GI3fH8N2RQAoUXrTp66hWFApGnt/yv2wiBTCG0fPTgzQGHW/A7eSaRQ0PVa3m77BeGQc+ltvzxnUoBSh+zPDajz0IFmW57OihUBELTKPh8blmHgU1jdTyzn4vBSF6yu/glEILElyx6OyrWRYIQ5vd8sFuJAUug8/z1oU2Bhxqv+7mnEgODlGq5O+zYRsGPJPY88p3KwUmfMrx3ZJACBVhtuv+o1ITCkmi4PG8ah8GMorS89GBMQYfccjv45ZEDBFYr+ftrVwWBj+Y3PLEcSYGLIDP8diJOQgZab3t559NEAxQqOPwtmIdBjiS1/PMeS0GI3fH8N2RQAoUXrTp66hWFApGnt/yv2wiBTCG0fPTgzQGHW/A7eSaRQ0PVa3m77BeGQc+ltvzxnUoBSh+zPDajz0IFmW57OihUBELTKPh8blmHgU1jdTyzn4vBSF6yu/glEILE');
    audio.play();
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Start love messages
    typeLoveMessage();

    // Start counter
    updateCounter();
    setInterval(updateCounter, 60000);

    // Start rose petals
    setInterval(createPetal, 300);

    // Original initialization code here
});

// Enhanced checkAnswer function
const originalCheckAnswer = window.checkAnswer;
window.checkAnswer = function (question, answer) {
    if (correctAnswers[question] === answer) {
        playSuccessSound();
        for (let i = 0; i < 50; i++) {
            setTimeout(createConfetti, i * 50);
        }
        updateBackground((question - 1) / 11);
    }
    originalCheckAnswer(question, answer);
};

// Enhanced showCelebration function
const originalShowCelebration = window.showCelebration;
window.showCelebration = function () {
    // Start shooting stars
    setInterval(createStar, 200);

    // Enable heartbeat background
    document.querySelector('.heartbeat-bg').style.display = 'block';

    originalShowCelebration();
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registrado exitosamente:', registration.scope);
            })
            .catch(error => {
                console.log('Error al registrar el ServiceWorker:', error);
            });
    });
}