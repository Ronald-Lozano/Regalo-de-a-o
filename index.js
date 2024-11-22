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