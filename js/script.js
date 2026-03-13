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
const PHOTO_TAG = 'boda-fotos';

const btnCamera = document.getElementById('btn-camera');
const photoInput = document.getElementById('photo-input');
const uploadStatus = document.getElementById('upload-status');
const uploadSuccess = document.getElementById('upload-success');
const photoGallery = document.getElementById('photo-gallery');

// Robust fetching from Cloudinary Resource List
async function fetchCloudinaryGallery() {
    try {
        console.log('Fetching Cloudinary gallery...');
        // The Resource List JSON is cached by Cloudinary for a short time, 
        // add a timestamp to force fresh data if needed, or rely on normal TTL
        const res = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${PHOTO_TAG}.json?t=${Date.now()}`);
        if (!res.ok) {
            console.log('No photos found or listing disabled yet');
            return;
        }
        const data = await res.json();
        renderCloudinaryGallery(data.resources);
    } catch (err) {
        console.error('Error fetching gallery:', err);
    }
}

function renderCloudinaryGallery(resources) {
    if (!photoGallery || !resources || resources.length === 0) {
        if (photoGallery) photoGallery.innerHTML = '';
        return;
    }

    // Sort by version (newest first)
    resources.sort((a, b) => b.version - a.version);

    let html = '';

    // Latest photo - large with badge
    const latest = resources[0];
    const latestUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,q_auto,f_auto/v${latest.version}/${latest.public_id}.${latest.format}`;
    
    html += '<div class="photo-gallery-latest">';
    html += '  <span class="photo-badge">Recién subida</span>';
    html += '  <img src="' + latestUrl + '" alt="Última foto">';
    html += '</div>';

    // Older photos - small grid
    if (resources.length > 1) {
        html += '<div class="photo-gallery-grid">';
        var limit = Math.min(resources.length, 9);
        for (var i = 1; i < limit; i++) {
            const r = resources[i];
            const thumbUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_200,h_200,c_fill,q_auto,f_auto/v${r.version}/${r.public_id}.${r.format}`;
            html += '<img src="' + thumbUrl + '" alt="Foto compartida">';
        }
        html += '</div>';
    }

    photoGallery.innerHTML = html;
}

// Render on page load
fetchCloudinaryGallery();

btnCamera.addEventListener('click', function() {
    photoInput.click();
});

photoInput.addEventListener('change', async function(e) {
    var file = e.target.files[0];
    if (!file) return;

    btnCamera.style.display = 'none';
    uploadStatus.style.display = 'flex';
    uploadSuccess.style.display = 'none';

    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'boda-carolina-daniel');
    formData.append('tags', PHOTO_TAG); // Ensure new uploads have the tag

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        console.log('Upload success:', data);

        // Show success
        uploadStatus.style.display = 'none';
        uploadSuccess.style.display = 'flex';

        // Refresh gallery after a small delay to let Cloudinary update the JSON list
        setTimeout(() => {
            fetchCloudinaryGallery();
        }, 1500);

        setTimeout(function() {
            uploadSuccess.style.display = 'none';
            btnCamera.style.display = 'flex';
            photoInput.value = '';
        }, 3000);

    } catch (err) {
        console.error('Upload error:', err);
        uploadStatus.style.display = 'none';
        btnCamera.style.display = 'flex';
        photoInput.value = '';
        alert('Error al subir la foto. Intenta de nuevo.');
    }
});
