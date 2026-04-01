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
            
            // Start countdown only after opening
            startCountdown();

            // Start bg music
            const bgMusic = document.getElementById('bg-music');
            const audioBtn = document.getElementById('audio-btn');
            const bgMusicVideo = document.getElementById('audio-btn-video');
            
            // Show UI elements (Nav and Audio button)
            document.body.classList.add('ui-visible');

            if (bgMusic && audioBtn) {
                bgMusic.play().then(() => {
                    audioBtn.classList.add('playing');
                    if (bgMusicVideo) {
                        bgMusicVideo.currentTime = 0;
                        bgMusicVideo.play();
                    }
                }).catch(e => console.log('Audio autoplay blocked:', e));
            }

            // Remove from DOM after fade
            setTimeout(() => {
                envelopeScreen.style.display = 'none';
                
                // Start Sakura petals
                initSakura();

                // Start Guided Tour after card is visible
                startGuidedTour();
            }, 1600);
        };
    }
};

// GUIDED TOUR LOGIC (Driver.js)
function startGuidedTour() {
    // Check if Driver.js is loaded
    if (!window.driver || !window.driver.js) return;
    
    const driver = window.driver.js.driver;
    
    // Check if tour was already shown (optional, usually you only want to show it once per user)
    // if (localStorage.getItem('tourCompleted') === 'true') return;

    const driverObj = driver({
        showProgress: true,
        nextBtnText: 'Siguiente ➔',
        prevBtnText: '⬅ Anterior',
        doneBtnText: '¡Comenzar!',
        allowClose: true,
        animate: true,
        popoverClass: 'custom-driver-popover',
        stagePadding: 5,
        popoverOffset: 15,
        scrollIntoViewOptions: { behavior: 'smooth', block: 'center' },
        onHighlightStarted: (element) => {
            // Auto-play music when tour starts if not playing
            if (bgMusic && bgMusic.paused) {
                bgMusic.play().then(() => {
                    if (audioBtn) audioBtn.classList.add('playing');
                    if (bgMusicVideo) bgMusicVideo.play();
                }).catch(e => console.log("Audio auto-play blocked:", e));
            }
        },
        steps: [
            {
                popover: {
                    title: '¡Bienvenida a mis XV Años!',
                    description: 'Esta invitación es interactiva. Te guiaré rápidamente para que no te pierdas ningún detalle de mi gran día. <br><br><i>Puedes saltar este paso en cualquier momento tocando la "X" o "¡Comenzar!".</i>',
                    side: "center",
                    align: 'center'
                }
            },
            {
                element: '#hero',
                popover: {
                    title: 'Portada',
                    description: 'Aquí encontrarás mi nombre y la fecha de la celebración.',
                    side: "bottom",
                    align: 'center'
                }
            },
            {
                element: '.floating-nav',
                popover: {
                    title: 'Navegación Rápida',
                    description: '<b>Toca aquí</b> en cualquier momento para saltar directamente a la sección que te interese (Ubicación, Regalos, Fotos, etc.) sin tener que deslizar.',
                    side: "left",
                    align: 'center'
                }
            },
            {
                element: '#audio-btn',
                popover: {
                    title: 'Música de Fondo',
                    description: '<b>Toca aquí</b> si deseas pausar o reanudar la música que preparamos para ti.',
                    side: "left",
                    align: 'center'
                }
            },
            {
                element: '#share-btn-sticky',
                popover: {
                    title: 'Compartir',
                    description: '<b>Toca aquí</b> para compartir esta invitación con tus familiares o amigos fácilmente por WhatsApp u otros medios.',
                    side: "left",
                    align: 'center'
                }
            },
            {
                element: '.countdown-container',
                popover: {
                    title: 'Contador Regresivo',
                    description: 'Falta muy poco para que llegue el gran momento de celebrar juntos.',
                    side: "left",
                    align: 'center'
                }
            },
            {
                element: '#fecha',
                popover: {
                    title: 'Calendario',
                    description: '<b>Toca el botón</b> para agendar el evento directamente en tu calendario.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#calendar-btn',
                popover: {
                    title: 'Agendar Día',
                    description: '<b>Toca este botón</b> para añadir el evento automáticamente a tu calendario y así no olvides acompañarnos.',
                    side: window.innerWidth < 768 ? "bottom" : "right",
                    align: 'center'
                }
            },
            {
                element: '#clima',
                popover: {
                    title: 'Pronóstico del Tiempo',
                    description: 'Haz clic en el botón para ver el <b>mapa interactivo de Windy</b> en pantalla completa y conocer el pronóstico exacto.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#itinerario',
                popover: {
                    title: 'Minuto a Minuto',
                    description: 'No te pierdas ningún momento especial. Aquí podrás ver el horario detallado de cada actividad.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#ubicacion',
                popover: {
                    title: 'Dónde y Cuándo',
                    description: '¡No te pierdas de nada! <b>Toca los botones de mapas</b> para abrir la ruta exacta hacia la ceremonia y recepción.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'start'
                }
            },
            {
                element: 'a[href="mapa.html"]',
                popover: {
                    title: 'Ubica tu Mesa',
                    description: 'Este botón te llevará a un modelo 3D de la locación que te permitirá ubicar tu mesa y cada área destinada para cada momento.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#menus',
                popover: {
                    title: 'Menús Desplegables',
                    description: '<b>Toca los botones</b> para alternar entre el menú del banquete y nuestra selección de bebidas y coctelería.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#codigo-vestimenta',
                popover: {
                    title: 'Código de Vestimenta',
                    description: 'Aquí te sugerimos la paleta de colores. Te agradecemos seguirla para que la armonía del evento sea perfecta.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#padrinos',
                popover: {
                    title: 'Padrinos',
                    description: 'Donde van a poder dar las gracias a los patrocinadores de tu evento o a los padrinos por acompañarlos.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#mesa-regalos',
                popover: {
                    title: 'Mesa de Regalos',
                    description: 'Si gustas tener un detalle, aquí encuentras opciones. <b>Toca el botón "Copiar N° Cuenta"</b>, o los logos de las tiendas departamentales.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#hospedaje',
                popover: {
                    title: 'Hospedaje Sugerido',
                    description: 'Hemos seleccionado algunas opciones cercanas para que tu estancia sea placentera. ¡Recuerda reservar con tiempo!',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#fotos',
                popover: {
                    title: 'Comparte tu Foto',
                    description: 'Este álbum es dinámico. Las fotos que se tomen en el evento se mostrarán automáticamente tanto en la invitación como en una pantalla el día del evento.',
                    side: window.innerWidth < 768 ? "bottom" : "top",
                    align: 'center'
                }
            },
            {
                element: '#btn-share-qr',
                popover: {
                    title: 'Compartir QR',
                    description: 'Permite que otros invitados colaboren subiendo sus fotos escaneando este código.',
                    side: "top",
                    align: 'center'
                }
            },
            {
                element: '#rsvp',
                popover: {
                    title: 'Confirma tu Asistencia',
                    description: 'El paso más importante: <b>Haz clic en el botón</b> para asegurar tu lugar. ¡Esperamos contar contigo!',
                    side: "top",
                    align: 'center'
                }
            },
            {
                popover: {
                    title: '¡Grandes Noticias!',
                    description: 'Esta invitación <b>no tiene fecha de caducidad</b> y permanecerá en línea con todas tus fotos y recuerdos.',
                    side: "center",
                    align: 'center'
                }
            }
        ],
        onDestroyStarted: () => {
            // Se usa setTimeout para evitar bloqueos si Driver.js está procesando
            setTimeout(() => {
                if (!driverObj.hasNextStep() || confirm("¿Estás listo para explorar la invitación por ti mismo?")) {
                    driverObj.destroy();
                    // localStorage.setItem('tourCompleted', 'true');
                }
            }, 0);
        },
    });

    // Pequeño retardo para asegurar que la UI se pintó completamente
    setTimeout(() => {
        driverObj.drive();
    }, 500);
}

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

// COUNTDOWN TIMER (Live mode targeting July 18, 2026)
const targetDate = new Date("July 18, 2026 15:00:00").getTime();
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
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    const size = Math.random() * 10 + 10 + 'px';
    petal.style.width = size;
    petal.style.height = size;
    
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = Math.random() * 3 + 4 + 's';
    petal.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(petal);
    
    petal.addEventListener('animationiteration', () => {
        petal.style.left = Math.random() * 100 + '%';
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
            title: 'Invitación a los XV Años de Angela Alegría',
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
        title: "XV Años de Angela Alegría",
        description: "Te invito a celebrar mis XV años en este sueño hecho realidad.",
        location: "Jardín Villa Leona, C. San Luis 100, 62555 Jiutepec, Mor.",
        start: "20260718T150000",
        end: "20260719T010000"
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
