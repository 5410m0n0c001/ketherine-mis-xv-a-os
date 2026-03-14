// ENVELOPE VIDEO ANIMATION
const envelopeScreen = document.getElementById('envelope-screen');
const envelopeVideo = document.getElementById('envelope-video');
const envelopeHint = document.querySelector('.envelope-hint');

// Force first frame rendering
if (envelopeVideo) {
    envelopeVideo.addEventListener('loadedmetadata', () => {
        envelopeVideo.currentTime = 0.1;
    }, { once: true });
}

const handleEnvelopeClick = () => {
    if (envelopeVideo) {
        // Prevent multiple clicks
        if (!envelopeVideo.paused) return;

        // Hide hint
        if (envelopeHint) envelopeHint.style.display = 'none';
        
        // Ensure video is at start and play
        envelopeVideo.currentTime = 0;
        envelopeVideo.play().then(() => {
            console.log('Video playing...');
        }).catch(e => {
            console.log('Video play failed:', e);
            // Fallback: just open if video fails
            envelopeScreen.classList.add('hidden');
            setTimeout(() => { envelopeScreen.style.display = 'none'; }, 1000);
        });
        
        // When video ends, fade out screen
        envelopeVideo.onended = () => {
            envelopeScreen.classList.add('hidden');
            
            // Start bg music
            const bgMusic = document.getElementById('bg-music');
            const audioBtn = document.getElementById('audio-btn');
            if (bgMusic && audioBtn) {
                const icon = audioBtn.querySelector('i');
                bgMusic.play().then(() => {
                    audioBtn.classList.add('playing');
                    if (icon) {
                        icon.className = 'bx bx-volume-high'; // Standard waves icon
                        icon.style.color = 'white';
                    }
                }).catch(e => console.log('Audio autoplay blocked:', e));
            }

            // Remove from DOM after fade
            setTimeout(() => {
                envelopeScreen.style.display = 'none';
            }, 1600);
        };
    }
};

if (envelopeScreen) {
    envelopeScreen.addEventListener('click', handleEnvelopeClick);
    envelopeScreen.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleEnvelopeClick();
    }, { passive: false });
}

// SCROLL REVEAL & ANIMATIONS UNIFIED
const revealElements = document.querySelectorAll('.reveal, .card-flip-up, .scale-pulse, .text-reveal, .slide-in-left, .slide-in-right, .btn-zoom-pulse, .typing-container');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            
            // Handle Typing Effect
            if (el.classList.contains('typing-container') && !el.dataset.typed) {
                typeEffect(el);
                el.dataset.typed = "true";
            } else {
                el.classList.add('active');
            }
            
            // Optional: unobserve standard reveals to save resources, 
            // but keep for repeatable animations if desired.
            if (!el.classList.contains('typing-container')) {
                // observer.unobserve(el); // Keep observed if we want repeat, but user didn't ask
            }
        }
    });
};

function typeEffect(element) {
    const text = element.textContent.trim();
    element.textContent = "";
    element.style.visibility = "visible";
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
            element.classList.add('done');
        }
    }, 70);
}

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// COUNTDOWN TIMER (1-minute demo mode)
let countdownTime = 60; // 60 seconds
const countdownContainer = document.querySelector('.countdown-container');
const celebrationSound = document.getElementById('celebration-sound');
const balloonsContainer = document.getElementById('balloons-container');

// Sound loop counter
let soundPlayCount = 0;
const maxSoundPlays = 4;

let isCelebrating = false;
function triggerCelebration() {
    if (isCelebrating) return;
    isCelebrating = true;
    
    // Clear and reset to ensure exactly 3 balloons
    if (balloonsContainer) balloonsContainer.innerHTML = '';
    
    if (celebrationSound && soundPlayCount < maxSoundPlays) {
        celebrationSound.play()
            .then(() => {
                soundPlayCount++;
                celebrationSound.onended = () => {
                    if (soundPlayCount < maxSoundPlays) {
                        celebrationSound.play();
                        soundPlayCount++;
                    }
                };
            })
            .catch(e => console.log('Audio error:', e));
    }
    
    if (balloonsContainer) {
        balloonsContainer.style.display = 'block';
        balloonsContainer.classList.add('active');
        spawnBalloons();
    }
}

function spawnBalloons() {
    // Strictly 3 balloons for a clean, premium look, moving ONLY UPward
    balloonsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const balloon = document.createElement('img');
            balloon.src = 'globos.png';
            balloon.className = 'balloon-img';
            balloonsContainer.appendChild(balloon);
        }, i * 3000); // 3-second stagger for a majestic ascending loop
    }
}

const countdown = setInterval(() => {
    countdownTime--;
    
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;

    // Update DOM (showing as 00:00:mm:ss for consistency)
    document.getElementById('days').innerText = "00";
    document.getElementById('hours').innerText = "00";
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

    if (countdownTime <= 0) {
        clearInterval(countdown);
        countdownContainer.innerHTML = "<h3>¡El Gran Día ha llegado!</h3>";
        triggerCelebration();
    }
}, 1000);

// FLOATING NAV ACTIVE STATE (Optimized with IntersectionObserver)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.floating-nav ul li a');

// Observe children of reveal containers that might have typing
document.querySelectorAll('.typing-container').forEach(el => {
    revealObserver.observe(el);
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// AUDIO PLAYER
const audioBtn = document.getElementById('audio-btn');
const bgMusic = document.getElementById('bg-music');
const icon = audioBtn.querySelector('i');

if (audioBtn && bgMusic) {
    audioBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const iconElement = audioBtn.querySelector('i');
        
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                audioBtn.classList.add('playing');
                if (iconElement) iconElement.className = 'bx bx-volume-high';
                audioBtn.setAttribute('aria-label', "Pausar música");
            }).catch(err => {
                console.warn("Audio blocked:", err);
                // Forced UI toggle for feedback
                audioBtn.classList.add('playing');
                if (iconElement) iconElement.className = 'bx bx-volume-high';
            });
        } else {
            bgMusic.pause();
            audioBtn.classList.remove('playing');
            if (iconElement) iconElement.className = 'bx bx-volume-mute';
            audioBtn.setAttribute('aria-label', "Reproducir música");
        }
    });
}

// CLIPBOARD COPY
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('¡Número de cuenta copiado!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
// SHARING & CALENDAR INTEGRATION
const calendarBtn = document.getElementById('calendar-btn');
const calendarOptions = document.getElementById('calendar-options');
const shareBtn = document.getElementById('share-btn-sticky');

if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Invitación a la Boda de Carolina & Daniel',
                    text: '¡Acompáñanos a celebrar nuestra unión matrimonial!',
                    url: window.location.href
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback: Copy URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Enlace de invitación copiado al portapapeles.');
            });
        }
    });
}

if (calendarBtn && calendarOptions) {
    calendarBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        calendarOptions.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!calendarOptions.contains(e.target)) {
            calendarOptions.classList.remove('active');
        }
    });

    const eventDetails = {
        title: "Boda de Carolina y Daniel",
        description: "Acompáñanos a celebrar nuestra unión matrimonial. ¡Te esperamos!",
        location: "Hacienda Santa Mónica, Carretera Norte Km 5.5",
        start: "20261115T160000",
        end: "20261116T020000"
    };

    // Google Calendar Link
    document.getElementById('cal-google').addEventListener('click', function(e) {
        e.preventDefault();
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
        window.open(url, '_blank');
    });

    // Outlook Link
    document.getElementById('cal-outlook').addEventListener('click', function(e) {
        e.preventDefault();
        const url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(eventDetails.title)}&startdt=${eventDetails.start}&enddt=${eventDetails.end}&body=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
        window.open(url, '_blank');
    });

    // Apple/iCal Link
    document.getElementById('cal-apple').addEventListener('click', function(e) {
        e.preventDefault();
        const icsData = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "BEGIN:VEVENT",
            `DTSTART:${eventDetails.start}`,
            `DTEND:${eventDetails.end}`,
            `SUMMARY:${eventDetails.title}`,
            `DESCRIPTION:${eventDetails.description}`,
            `LOCATION:${eventDetails.location}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\n");
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'boda-carolina-daniel.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// PHOTO UPLOAD & GLOBAL GALLERY (CLOUDINARY)
const CLOUD_NAME = 'dkozw2kmy';
const UPLOAD_PRESET = 'unsigned_boda';
const PHOTO_TAG = 'boda-fotos';

const btnCamera = document.getElementById('btn-camera');
const photoInput = document.getElementById('photo-input');
const uploadStatus = document.getElementById('upload-status');
const uploadSuccess = document.getElementById('upload-success');
const photoGallery = document.getElementById('photo-gallery');

async function fetchCloudinaryGallery() {
    try {
        const res = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${PHOTO_TAG}.json?t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        renderCloudinaryGallery(data.resources);
    } catch (err) { console.error('Error fetching gallery:', err); }
}

function renderCloudinaryGallery(resources) {
    if (!photoGallery || !resources || resources.length === 0) {
        if (photoGallery) photoGallery.innerHTML = '';
        return;
    }
    resources.sort((a, b) => b.version - a.version);
    let html = '';
    const latest = resources[0];
    const latestUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,q_auto,f_auto/v${latest.version}/${latest.public_id}.${latest.format}`;
    html += '<div class="photo-gallery-latest reveal"><span class="photo-badge">Recién subida</span><img src="' + latestUrl + '" alt="Última foto" onclick="openVisor(\'' + latestUrl + '\')"></div>';
    if (resources.length > 1) {
        html += '<div class="photo-gallery-grid reveal">';
        var limit = Math.min(resources.length, 12);
        for (var i = 1; i < limit; i++) {
            const r = resources[i];
            const fullUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,q_auto,f_auto/v${r.version}/${r.public_id}.${r.format}`;
            const thumbUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_300,h_300,c_fill,q_auto,f_auto/v${r.version}/${r.public_id}.${r.format}`;
            html += '<img src="' + thumbUrl + '" alt="Foto compartida" onclick="openVisor(\'' + fullUrl + '\')">';
        }
        html += '</div>';
    }
    photoGallery.innerHTML = html;
}

// ALBUM VISOR LOGIC
const albumVisor = document.getElementById('album-visor');
const visorImg = document.getElementById('visor-img');
const visorClose = document.getElementById('visor-close');

function openVisor(url) {
    if (albumVisor && visorImg) {
        visorImg.src = url;
        albumVisor.style.display = "block";
    }
}

if (visorClose) {
    visorClose.onclick = () => albumVisor.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == albumVisor) {
        albumVisor.style.display = "none";
    }
};

fetchCloudinaryGallery();

if (btnCamera) {
    btnCamera.addEventListener('click', () => photoInput.click());
}

if (photoInput) {
    photoInput.addEventListener('change', async function(e) {
        var file = e.target.files[0];
        if (!file) return;
        btnCamera.style.display = 'none';
        uploadStatus.style.display = 'flex';
        var formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'boda-carolina-daniel');
        formData.append('tags', PHOTO_TAG);
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');
            uploadStatus.style.display = 'none';
            uploadSuccess.style.display = 'flex';
            setTimeout(() => { fetchCloudinaryGallery(); }, 1500);
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
            alert('Error al subir la foto.');
        }
    });
}
// QR CODE SHARING (Using static image)
function initQRCode() {
    const btnShareQr = document.getElementById('btn-share-qr');
    const qrImage = document.getElementById('qr-image');
    
    if (!btnShareQr || !qrImage) return;

    // Share QR Button
    btnShareQr.addEventListener('click', async () => {
        try {
            // Fetch the image to share as a file
            const response = await fetch('qr.png');
            const blob = await response.blob();
            const file = new File([blob], "codigo-qr-boda.png", { type: "image/png" });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Código QR de Nuestra Boda',
                    text: 'Escanea este código para compartir tus fotos con nosotros.'
                });
            } else if (navigator.share) {
                // Fallback for browsers that don't support file sharing but do support text/url
                await navigator.share({
                    title: 'Código QR de Nuestra Boda',
                    text: 'Escanea este código para compartir tus fotos con nosotros.',
                    url: window.location.origin + window.location.pathname + 'qr.png'
                });
            } else {
                alert('Tu navegador no soporta la función de compartir.');
            }
        } catch (err) {
            console.error('Error sharing QR:', err);
            // Fallback for sharing the link if fetching the image fails
            if (navigator.share) {
                await navigator.share({
                    title: 'Comparte tus momentos',
                    text: 'Usa este código para subir tus fotos a nuestro álbum.',
                    url: window.location.origin + window.location.pathname + 'smartlanding.html'
                });
            }
        }
    });
}

// HANDLE URL ACTIONS (Like auto-triggering camera)
function handleUrlActions() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    if (action === 'take-photo') {
        const overlay = document.getElementById('qr-camera-overlay');
        const btnTakePhoto = document.getElementById('btn-qr-take-photo');
        const btnSkip = document.getElementById('btn-qr-skip');
        const btnCameraReal = document.getElementById('btn-camera');

        if (overlay) {
            overlay.style.display = 'flex';
            
            // If they want to take the photo
            btnTakePhoto.addEventListener('click', () => {
                overlay.style.display = 'none';
                const fotosSection = document.getElementById('fotos');
                if (fotosSection) {
                    fotosSection.scrollIntoView({ behavior: 'auto' });
                    if (btnCameraReal) btnCameraReal.click();
                }
            });

            // If they just want to see the invitation
            btnSkip.addEventListener('click', () => {
                overlay.style.display = 'none';
            });
        }
    }
}

// Initialize on Load
window.addEventListener('load', () => {
    initQRCode();
    handleUrlActions();
});

// Horizontal Background Drift on Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const speed = 0.08;
    // Drift every section slightly horizontally
    document.querySelectorAll('section').forEach(section => {
        const xPos = (scrolled * speed) % 100;
        section.style.backgroundPosition = `${50 + (xPos * 0.2)}% 50%`;
    });
});
