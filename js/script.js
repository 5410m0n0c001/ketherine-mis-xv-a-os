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

// PHOTO UPLOAD TO CLOUDINARY
const CLOUD_NAME = 'dkozw2kmy';
const UPLOAD_PRESET = 'unsigned_boda';

const btnCamera = document.getElementById('btn-camera');
const photoInput = document.getElementById('photo-input');
const uploadStatus = document.getElementById('upload-status');
const uploadSuccess = document.getElementById('upload-success');
const photoGallery = document.getElementById('photo-gallery');

// Load saved photos from localStorage
function getSavedPhotos() {
    try {
        return JSON.parse(localStorage.getItem('boda_photos') || '[]');
    } catch { return []; }
}

function savePhoto(url) {
    const photos = getSavedPhotos();
    photos.unshift(url); // newest first
    if (photos.length > 20) photos.pop(); // keep max 20
    localStorage.setItem('boda_photos', JSON.stringify(photos));
}

function renderGallery() {
    const photos = getSavedPhotos();
    if (photos.length === 0) {
        photoGallery.innerHTML = '';
        return;
    }

    let html = '';

    // Latest photo - large
    html += `<div class="photo-gallery-latest">
        <span class="photo-badge">Recién subida</span>
        <img src="${photos[0]}" alt="Última foto compartida" loading="lazy">
    </div>`;

    // Older photos - small grid
    if (photos.length > 1) {
        html += '<div class="photo-gallery-grid">';
        for (let i = 1; i < Math.min(photos.length, 9); i++) {
            html += `<img src="${photos[i]}" alt="Foto compartida" loading="lazy">`;
        }
        html += '</div>';
    }

    photoGallery.innerHTML = html;
}

// Render gallery on page load
renderGallery();

btnCamera.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show spinner, hide button
    btnCamera.style.display = 'none';
    uploadStatus.style.display = 'flex';
    uploadSuccess.style.display = 'none';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'boda-carolina-daniel');

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            // Use Cloudinary auto-optimized URL
            const photoUrl = data.secure_url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');

            // Save and render in gallery
            savePhoto(photoUrl);
            renderGallery();

            // Show success
            uploadStatus.style.display = 'none';
            uploadSuccess.style.display = 'flex';

            setTimeout(() => {
                uploadSuccess.style.display = 'none';
                btnCamera.style.display = 'flex';
                photoInput.value = '';
            }, 3000);
        } else {
            throw new Error('Upload failed');
        }
    } catch (err) {
        console.error('Upload error:', err);
        uploadStatus.style.display = 'none';
        btnCamera.style.display = 'flex';
        photoInput.value = '';
        alert('Error al subir la foto. Intenta de nuevo.');
    }
});
