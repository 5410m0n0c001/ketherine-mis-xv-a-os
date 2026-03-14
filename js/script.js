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
                        icon.classList.remove('bx-volume-full');
                        icon.classList.add('bx-volume-mute');
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

// SCROLL REVEAL ANIMATION
const revealElements = document.querySelectorAll('.reveal, .card-flip-up, .scale-pulse, .text-reveal, .slide-left, .slide-right, .btn-bounce');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Re-enable staggering for internal elements
            const subElements = entry.target.querySelectorAll('.reveal, .text-reveal, .scale-pulse, .card-flip-up, .venue-card, .gift-card, .padrino-item, .color-swatch');
            if (subElements.length > 0) {
                subElements.forEach((el, index) => {
                    setTimeout(() => el.classList.add('active'), index * 150);
                });
            }

            observer.unobserve(entry.target);
        }
    });
};

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

function triggerCelebration() {
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
        balloonsContainer.classList.add('active');
        spawnBalloons();
    }
}

function spawnBalloons() {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const balloon = document.createElement('img');
            balloon.src = 'globos.png';
            balloon.className = 'balloon-img';
            balloon.style.left = Math.random() * 80 + '%';
            balloon.style.animationDelay = (Math.random() * 8) + 's';
            balloon.style.width = (180 + Math.random() * 120) + 'px';
            balloonsContainer.appendChild(balloon);
        }, i * 600);
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
const sectionObserverOptions = {
    threshold: 0.3, // 30% of the section visible
    rootMargin: "-20% 0px -20% 0px" // Focus on the middle of the screen
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const current = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        }
    });
}, sectionObserverOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
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
// SHARING & CALENDAR INTEGRATION
const calendarBtn = document.getElementById('calendar-btn');
const calendarOptions = document.getElementById('calendar-options');
const shareBtn = document.getElementById('share-btn');

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
    const latestUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,q_auto,f_auto/v${latest.version}/${latest.public_id}.${latest.format}`;
    html += '<div class="photo-gallery-latest"><span class="photo-badge">Recién subida</span><img src="' + latestUrl + '" alt="Última foto"></div>';
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
