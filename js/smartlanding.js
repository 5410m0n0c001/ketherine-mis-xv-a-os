// Cloudinary Config (Same as main page)
const CLOUD_NAME = 'dkozw2kmy';
const UPLOAD_PRESET = 'unsigned_boda';
const PHOTO_TAG = 'boda-fotos';

const btnCamera = document.getElementById('btn-camera');
const photoInput = document.getElementById('photo-input');
const uploadStatus = document.getElementById('upload-status');
const uploadSuccess = document.getElementById('upload-success');
const photoGallery = document.getElementById('photo-gallery');

// Handle Camera Button
if (btnCamera) {
    btnCamera.addEventListener('click', () => photoInput.click());
}

// Handle Upload
if (photoInput) {
    photoInput.addEventListener('change', async function(e) {
        var file = e.target.files[0];
        if (!file) return;

        // UI State: Uploading
        btnCamera.style.display = 'none';
        uploadStatus.style.display = 'block';
        uploadSuccess.style.display = 'none';

        var formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'boda-carolina-daniel');
        formData.append('tags', PHOTO_TAG);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { 
                method: 'POST', 
                body: formData 
            });
            
            if (!res.ok) throw new Error('Upload failed');
            
            // UI State: Success
            uploadStatus.style.display = 'none';
            uploadSuccess.style.display = 'block';
            
            // Refresh gallery after a short delay
            setTimeout(() => { fetchGallery(); }, 1500);
            
            // Reset after 3 seconds
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
            alert('Error al subir la foto. Por favor intenta de nuevo.');
        }
    });
}

// Fetch Gallery
async function fetchGallery() {
    try {
        const res = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${PHOTO_TAG}.json?t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        renderGallery(data.resources);
    } catch (err) { 
        console.error('Error fetching gallery:', err); 
    }
}

function renderGallery(resources) {
    if (!photoGallery || !resources || resources.length === 0) return;
    
    // Sort by version (newest first)
    resources.sort((a, b) => b.version - a.version);
    
    // Take first 6 for preview
    const limit = Math.min(resources.length, 6);
    let html = '';
    
    for (let i = 0; i < limit; i++) {
        const r = resources[i];
        const thumbUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_200,h_200,c_fill,q_auto,f_auto/v${r.version}/${r.public_id}.${r.format}`;
        html += `<img src="${thumbUrl}" alt="Recuerdo" style="animation-delay: ${i * 0.1}s">`;
    }
    
    photoGallery.innerHTML = html;
}

// Initial Load
fetchGallery();
