// ENVELOPE VIDEO ANIMATION
const envelopeScreen = document.getElementById('envelope-screen');
const envelopeVideo = document.getElementById('envelope-video');
const envelopeHint = document.querySelector('.envelope-hint');

// State control for opening
let isEnvelopeOpened = false;

// Force first frame rendering
if (envelopeVideo) {
    envelopeVideo.addEventListener('loadedmetadata', () => {
        envelopeVideo.currentTime = 0.1;
    }, { once: true });
}

const handleEnvelopeClick = () => {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true; 
    
    // Expand mask and play animation
    if (envelopeScreen) envelopeScreen.classList.add('video-playing');
    // Capture hero video reference for gesture-locked playback
    const heroVideo = document.getElementById('hero-video');

    // Define function BEFORE calling it (Fixes ReferenceError in mobile/safari)
    const openInvitation = () => {
        if (isEnvelopeOpened === 'fully_done') return;
        isEnvelopeOpened = 'fully_done';
        
        if (typeof emergencyTimeout !== 'undefined') clearTimeout(emergencyTimeout);
        if (envelopeScreen) {
            envelopeScreen.classList.add('hidden');
            
            // SAFETY: Re-trigger hero video when envelope fades (in case browser suspended it)
            if (heroVideo && heroVideo.paused) {
                heroVideo.play().catch(() => {});
            }

            // Start secondary visuals after a slight delay to sync with fade
            setTimeout(() => {
                envelopeScreen.style.display = 'none';
                
                // Start Sakura petals
                if (typeof initSakura === 'function') initSakura();

                // Start Butterflies
                if (typeof initButterflies === 'function') initButterflies();
                if (typeof initRandomButterflies === 'function') initRandomButterflies();

                // Start Typing
                if (typeof startHeroTyping === 'function') startHeroTyping();
            }, 1000);
        }
        
        // Start countdown
        if (typeof startCountdown === 'function') startCountdown();
        
        // Final UI visibility check
        document.body.classList.add('ui-visible');
    };

    // VISUAL PRIORITY: Immediately start envelope animation
    if (envelopeVideo) {
        envelopeVideo.play().catch(e => {
            console.log('Envelope animation play failed, opening manually:', e);
            openInvitation();
        });

        // Completion logic
        envelopeVideo.onended = () => {
            openInvitation();
        };
    } else {
        openInvitation();
    }

    // HERO VIDEO: Explicitly play within user gesture to unlock on mobile
    if (heroVideo) {
        heroVideo.play().catch(() => {});
    }

    // AUDIO CONTEXT: Try to play music in parallel after animation starts
    const bgMusic = document.getElementById('bg-music');
    const audioBtn = document.getElementById('audio-btn');
    const bgMusicVideo = document.getElementById('audio-btn-video');

    if (bgMusic) {
        bgMusic.currentTime = 60; // Start at 1 minute
        bgMusic.play().then(() => {
            if (audioBtn) audioBtn.classList.add('playing');
            if (bgMusicVideo) bgMusicVideo.play().catch(e => console.log('Music video play failed:', e));
        }).catch(err => {
            console.log('Background music failed to trigger:', err);
        });
    }

    // Visual feedback: Hide hint immediately
    if (envelopeHint) envelopeHint.style.display = 'none';

    const emergencyTimeout = setTimeout(() => {
        if (envelopeScreen && !envelopeScreen.classList.contains('hidden')) {
            console.log('Emergency fallback triggered');
            openInvitation();
        }
    }, 6000);
};


if (envelopeScreen) {
    const handleInteraction = (e) => {
        // Prevent double fire (touchend followed by click)
        if (e.type === 'touchend') {
            e.preventDefault();
        }
        handleEnvelopeClick();
    };

    envelopeScreen.addEventListener('click', handleInteraction);
    envelopeScreen.addEventListener('touchend', handleInteraction, { passive: false });
}


// SCROLL REVEAL & ANIMATIONS UNIFIED
const revealElements = document.querySelectorAll('.reveal, .card-flip-up, .scale-pulse, .text-reveal, .slide-in-left, .slide-in-right, .btn-zoom-pulse, .typing-container, .timeline-item');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            
            // Handle Typing Effect - Fixed visibility conflict
            if (el.classList.contains('typing-container')) {
                if (!el.dataset.typed) {
                    typeEffect(el);
                    el.dataset.typed = "true";
                }
            }
            
            // ALWAYS add active class for .reveal compatibility and opacity
            el.classList.add('active');
            
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

// SCROLL HANDLER: Toggle body class for conditional styling (e.g., laterals)
window.addEventListener('scroll', () => {
    const heroHeight = document.getElementById('hero')?.offsetHeight || window.innerHeight;
    if (window.scrollY > heroHeight * 0.8) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

// COUNTDOWN TIMER (Live mode targeting July 04, 2026)
const targetDate = new Date("2026-06-04T15:00:00").getTime();
const countdownContainer = document.querySelector('.countdown-container');
const celebrationSound = document.getElementById('celebration-sound');
const balloonsContainer = document.getElementById('balloons-container');

function startCountdown() {
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            clearInterval(countdown);
            if (countdownContainer) countdownContainer.innerHTML = "<h3>¡El gran día ha llegado!</h3>";
            triggerCelebration();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (document.getElementById('days')) document.getElementById('days').innerText = days.toString().padStart(2, '0');
        if (document.getElementById('hours')) document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        if (document.getElementById('minutes')) document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        if (document.getElementById('seconds')) document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }, 1000);
}

// SAKURA ANIMATION
function initSakura() {
    const container = document.getElementById('sakura-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        createPetal(container);
    }
}

function createPetal(container) {
    const el = document.createElement('div');
    const isStar = Math.random() > 0.6; // Mix of petals and stars
    el.className = isStar ? 'falling-star' : 'petal';
    
    const sizeValue = isStar ? (Math.random() * 12 + 20) : (Math.random() * 10 + 12);
    const size = sizeValue + 'px';
    el.style.width = size;
    el.style.height = size;
    
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = Math.random() * 4 + 4 + 's';
    el.style.animationDelay = Math.random() * 8 + 's';
    
    container.appendChild(el);
    
    el.addEventListener('animationiteration', () => {
        el.style.left = Math.random() * 100 + '%';
        // Randomly change type on each reset for dynamic feel
        const newIsStar = Math.random() > 0.6;
        el.className = newIsStar ? 'falling-star' : 'petal';
    });
}

// HERO TYPING ANIMATION
async function startHeroTyping() {
    const nameText = "Zoé Roque Díaz";
    const line2 = "Te invito a celebrar conmigo este día tan especial";

    const namesEl = document.querySelector('.names-cursive');
    if (namesEl) {
        namesEl.style.opacity = "1"; // Ensure it's visible before typing
    }

    try {
        await typeWriter("type-name", nameText, 60);
        await typeWriter("type-line-2", line2, 40);
    } catch (e) {
        console.log("Typing animation interrupted or element missing", e);
    }
}

/* BUTTERFLIES LOGIC (Randomized & Natural) */
function initButterflies() {
    const container = document.getElementById('butterflies-container');
    if (!container) return;

    // Initial batch randomly distributed
    for (let i = 0; i < 6; i++) {
        setTimeout(() => createButterfly(container, true), i * 1500);
    }
    
    // Continuous random spawn with variable timing
    const spawnLoop = () => {
        createButterfly(container, false);
        const nextSpawn = 3000 + Math.random() * 6000;
        setTimeout(spawnLoop, nextSpawn);
    };
    spawnLoop();

    // Intersection Observer for Section Corners
    const cornerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const corners = entry.target.querySelectorAll('.section-corner');
                corners.forEach(c => c.classList.add('reveal-corner'));
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        cornerObserver.observe(section);
    });
}

function createButterfly(container, initial = false) {
    const butterfly = document.createElement('img');
    butterfly.src = 'mariposa.png';
    butterfly.className = 'butterfly';
    
    // Spawn across the whole screen width, including edges
    const startX = Math.random() * 100; 
    const startY = initial 
        ? Math.random() * 100 
        : -20; 
        
    const duration = 15 + Math.random() * 15; 
    const translateX = (Math.random() - 0.5) * 500;
    const rotate = (Math.random() - 0.5) * 360; // More rotation freedom
    const size = 12 + Math.random() * 15; 
    const opacity = 0.35 + Math.random() * 0.4;

    butterfly.style.left = startX + '%';
    butterfly.style.top = initial ? startY + '%' : '110%'; 
    butterfly.style.width = size + 'px';
    butterfly.style.opacity = opacity;
    butterfly.style.setProperty('--translateX', translateX + 'px');
    butterfly.style.setProperty('--rotate', rotate + 'deg');
    
    // Smooth flying animation with flapping
    butterfly.style.animation = `flyNatural ${duration}s ease-in-out forwards, wingFlap 0.6s ease-in-out infinite`;

    container.appendChild(butterfly);
    
    setTimeout(() => butterfly.remove(), duration * 1000);
}

function typeWriter(elementId, text, speed) {
    return new Promise((resolve) => {
        const element = document.getElementById(elementId);
        if (!element) return resolve();
        
        // Add cursor
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        element.parentNode.appendChild(cursor);

        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Remove cursor after typing is done
                if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
                setTimeout(resolve, 500); // Wait bit before next line
            }
        }, speed);
    });
}
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
    if (!balloonsContainer) return;
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

// FLOATING NAV ACTIVE STATE (Optimized with IntersectionObserver)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.floating-nav ul li a');

const sectionOptions = {
    threshold: 0.4,
    rootMargin: "0px"
};

const sectionCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            // Check if there's already an active link to avoid double highlights
            const currentActive = document.querySelector('.floating-nav ul li a.active');
            if (currentActive && currentActive.getAttribute('href') === `#${id}`) return;

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

const sectionObserver = new IntersectionObserver(sectionCallback, sectionOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// AUDIO PLAYER
const audioBtn = document.getElementById('audio-btn');
const bgMusic = document.getElementById('bg-music');
const bgMusicVideo = document.getElementById('audio-btn-video');

if (audioBtn && bgMusic) {
    audioBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                audioBtn.classList.add('playing');
                if (bgMusicVideo) bgMusicVideo.play();
                audioBtn.setAttribute('aria-label', "Pausar música");
            }).catch(err => {
                console.warn("Audio blocked:", err);
                // Even if audio fails, toggle the UI for user feedback
                audioBtn.classList.add('playing');
                if (bgMusicVideo) bgMusicVideo.play();
            });
        } else {
            bgMusic.pause();
            audioBtn.classList.remove('playing');
            if (bgMusicVideo) bgMusicVideo.pause();
            audioBtn.setAttribute('aria-label', "Reproducir música");
        }
    });
    
    // Safety sync: Ensure video matches audio state if changed programmatically
    bgMusic.onplay = () => {
        audioBtn.classList.add('playing');
        if (bgMusicVideo) bgMusicVideo.play();
    };
    bgMusic.onpause = () => {
        audioBtn.classList.remove('playing');
        if (bgMusicVideo) bgMusicVideo.pause();
    };
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
        const shareData = {
            title: 'Invitación a los XV Años de Zoé Roque Díaz',
            text: '¡Acompáñame a celebrar mis XV años! Te espero con mucha ilusión.',
            url: window.location.href.split('?')[0] // Clean URL
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Error sharing:', err);
            }
        } else {
            // Fallback: Copy URL to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('Enlace de invitación copiado al portapapeles.');
            } catch (err) {
                console.error('Clipboard error:', err);
            }
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
        title: "XV Años de Zoé Roque Díaz",
        description: "Te invito a celebrar mis XV años en este sueño hecho realidad.",
        location: "Jardín Villa Leona, C. San Luis 100, 62555 Jiutepec, Mor.",
        start: "20260604T150000",
        end: "20260605T000000"
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
        link.setAttribute('download', 'xv-angela-alegria.ics');
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
    
    // Feature the latest photo as the "visor" entry
    const latest = resources[0];
    const latestUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,q_auto,f_auto/v${latest.version}/${latest.public_id}.${latest.format}`;
    
    html += `
        <div class="photo-gallery-latest reveal active">
            <span class="photo-badge">Última Foto</span>
            <img src="${latestUrl}" alt="Última foto subida" onclick="openVisor('${latestUrl}')" style="cursor: pointer;">
        </div>
    `;

    if (resources.length > 1) {
        html += '<div class="photo-gallery-grid reveal active">';
        const limit = Math.min(resources.length, 13); // Show more thumbnails
        for (let i = 1; i < limit; i++) {
            const r = resources[i];
            const fullUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,q_auto,f_auto/v${r.version}/${r.public_id}.${r.format}`;
            const thumbUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_300,h_300,c_fill,q_auto,f_auto/v${r.version}/${r.public_id}.${r.format}`;
            html += `<img src="${thumbUrl}" alt="Foto del evento" onclick="openVisor('${fullUrl}')" style="cursor: pointer;">`;
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
        albumVisor.style.display = "flex"; // Changed to flex for centering
        document.body.style.overflow = "hidden"; // Prevent background scroll
    }
}

if (visorClose) {
    visorClose.onclick = () => {
        albumVisor.style.display = "none";
        document.body.style.overflow = "auto";
    };
}

window.addEventListener('click', (event) => {
    if (event.target == albumVisor) {
        albumVisor.style.display = "none";
        document.body.style.overflow = "auto";
    }
});

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
        formData.append('folder', 'xv-angela-alegria');
        formData.append('tags', 'xv-angela');
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
    if (!btnShareQr) return;

    btnShareQr.addEventListener('click', async () => {
        try {
            // Use the absolute path for the QR image
            const qrUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'qr.png';
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const file = new File([blob], "codigo-qr-xv-angela.png", { type: "image/png" });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Código QR de mis XV Años',
                    text: 'Escanea este código para compartir tus fotos conmigo.',
                    url: window.location.href // Also include URL for context
                });
            } else if (navigator.share) {
                await navigator.share({
                    title: 'Código QR de mis XV Años',
                    text: 'Escanea este código para compartir tus fotos conmigo.',
                    url: qrUrl
                });
            } else {
                // Fallback for desktop or non-sharing browsers: open in new tab
                window.open(qrUrl, '_blank');
            }
        } catch (err) {
            console.error('Error sharing QR:', err);
            // Simple link fallback
            if (navigator.share) {
                await navigator.share({
                    title: 'Álbum de Fotos de los XV Años',
                    text: '¡Sube tus fotos aquí!',
                    url: window.location.origin + window.location.pathname.replace('index.html', '') + 'smartlanding.html'
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

// Global Scroll Effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax for k.jpeg (Location Photo)
    const photo = document.querySelector('.location-photo');
    if (photo) {
        const rect = photo.parentElement.getBoundingClientRect();
        const winHeight = window.innerHeight;
        // Only animate if visible
        if (rect.top < winHeight && rect.bottom > 0) {
            const shift = (rect.top - winHeight / 2) * 0.15;
            photo.style.transform = `scale(1.1) translateY(${shift}px)`;
        }
    }

    const speed = 0.08;
    // Drift every section slightly horizontally
    document.querySelectorAll('section').forEach(section => {
        const xPos = (scrolled * speed) % 100;
        section.style.backgroundPosition = `${50 + (xPos * 0.2)}% 50%`;
    });
});

// RANDOM BUTTERFLY SPAWNING
function spawnRandomButterfly() {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly-random';
    
    const randomDuration = 8 + Math.random() * 12;
    const randomX = Math.random() * 100;
    const randomRotate = (Math.random() - 0.5) * 360;
    
    butterfly.style.setProperty('--random-duration', `${randomDuration}s`);
    butterfly.style.setProperty('--random-x', randomX);
    butterfly.style.setProperty('--random-rotate', randomRotate);
    butterfly.style.left = `${Math.random() * 100}%`;
    
    const img = document.createElement('img');
    img.src = 'mariposa.png';
    butterfly.appendChild(img);
    
    document.body.appendChild(butterfly);
    
    setTimeout(() => butterfly.remove(), randomDuration * 1000);
}

// Start random butterflies after initial intro
function initRandomButterflies() {
    setInterval(spawnRandomButterfly, 4000);
}

// TIMELINE ANIMATION (IntersectionObserver)
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.5 });

timelineItems.forEach(item => timelineObserver.observe(item));

// MENU TOGGLE LOGIC
const btnFoods = document.getElementById('btn-menu-foods');
const btnDrinks = document.getElementById('btn-menu-drinks');
const menuFoods = document.getElementById('menu-foods');
const menuDrinks = document.getElementById('menu-drinks');

if (btnFoods && btnDrinks) {
    btnFoods.addEventListener('click', () => {
        btnFoods.classList.add('active');
        btnDrinks.classList.remove('active');
        menuFoods.classList.add('active');
        menuDrinks.classList.remove('active');
    });

    btnDrinks.addEventListener('click', () => {
        btnDrinks.classList.add('active');
        btnFoods.classList.remove('active');
        menuDrinks.classList.add('active');
        menuFoods.classList.remove('active');
    });
}
