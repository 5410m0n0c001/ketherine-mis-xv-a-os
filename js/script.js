// ENVELOPE OPEN ANIMATION
const envelopeScreen = document.getElementById('envelope-screen');
const envelopeSvg = document.getElementById('envelope-svg');

envelopeScreen.addEventListener('click', () => {
    // Trigger the opening animation via CSS class
    envelopeSvg.classList.add('opening');

    // After flap opens, promote card to top layer so it slides ABOVE folds
    setTimeout(() => {
        const cardGroup = document.getElementById('card-group');
        const sealGroup = document.getElementById('seal-group');
        envelopeSvg.insertBefore(cardGroup, sealGroup);
    }, 1900);
    
    // After full animation plays, fade out the entire envelope screen
    setTimeout(() => {
        envelopeScreen.classList.add('hidden');

        // Start music after envelope opens (click satisfies autoplay policy)
        const bgMusic = document.getElementById('bg-music');
        const audioBtn = document.getElementById('audio-btn');
        const icon = audioBtn.querySelector('i');
        bgMusic.play().then(() => {
            audioBtn.classList.add('playing');
            icon.classList.remove('bx-volume-full');
            icon.classList.add('bx-volume-mute');
        }).catch(e => console.log('Audio autoplay blocked:', e));
    }, 4200);

    // Remove from DOM after transition completes
    setTimeout(() => {
        envelopeScreen.style.display = 'none';
    }, 5000);
});

// SCROLL REVEAL ANIMATION
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // observer.unobserve(entry.target); // Uncomment to hide again on scroll up
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// COUNTDOWN TIMER
const weddingDateList = new Date('Nov 15, 2026 16:00:00').getTime();

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDateList - now;

    // Calculate time left
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

    // Upon expiration
    if (distance < 0) {
        clearInterval(countdown);
        document.querySelector('.countdown-container').innerHTML = "<h3>¡El Gran Día ha llegado!</h3>";
    }
}, 1000);

// FLOATING NAV ACTIVE STATE
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.floating-nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    
    // Add small offset to correctly detect current section
    const scrollY = window.pageYOffset + window.innerHeight / 3;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// AUDIO PLAYER
const audioBtn = document.getElementById('audio-btn');
const bgMusic = document.getElementById('bg-music');
const icon = audioBtn.querySelector('i');

audioBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Can't play audio automatically without user interaction."));
        audioBtn.classList.add('playing');
        icon.classList.remove('bx-volume-full');
        icon.classList.add('bx-volume-mute');
    } else {
        bgMusic.pause();
        audioBtn.classList.remove('playing');
        icon.classList.remove('bx-volume-mute');
        icon.classList.add('bx-volume-full');
    }
});

// CLIPBOARD COPY
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('¡Número de cuenta copiado!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
