// Immersive 3D Canvas Background Animation orchestrator
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    let bgGradient;
    function fillOpaqueBackground() {
        bgGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.sqrt(w * w + h * h) / 2);
        bgGradient.addColorStop(0, '#08080c');
        bgGradient.addColorStop(1, '#010102');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);
    }
    
    fillOpaqueBackground();
    
    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        fillOpaqueBackground();
    });
    
    // Instantiate background theme
    let spaceTheme;
    try {
        spaceTheme = new window.SpaceTheme(w, h, 1000);
    } catch (e) {
        console.error("Failed to initialize Space theme:", e);
    }
    
    // --- Animation loop variables ---
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;
    let targetSpeed = 0;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    
    window.addEventListener('scroll', () => {
        const cur = window.scrollY;
        const diff = cur - lastScrollY;
        targetSpeed = diff * 0.45;
        lastScrollY = cur;
    });
    
    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - w / 2) * 0.1;
        targetMouseY = (e.clientY - h / 2) * 0.1;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        try {
        
        targetSpeed *= 0.92;
        scrollSpeed += (targetSpeed - scrollSpeed) * 0.1;
        
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        // Clear background completely on every frame with the opaque radial gradient to avoid any trails
        ctx.fillStyle = bgGradient || '#08080c';
        ctx.fillRect(0, 0, w, h);
        
        const depthChange = 1.0 + scrollSpeed;
        
        if (spaceTheme) {
            // Update and draw Celestial Space
            spaceTheme.update(depthChange, mouseX, mouseY, w, h);
            spaceTheme.draw(ctx, w, h, 1.0, scrollSpeed);
            
            // Calculate & Apply Gravitational Distortion from Gargantua
            const bh = spaceTheme.getBlackHole();
            const app = document.getElementById('app-container');
            const displacement = document.getElementById('lens-displacement');
            
            if (bh && app && displacement) {
                let distortion = 0;
                if (bh.z < 280) {
                    const closeFactor = (280 - bh.z) / 280;
                    distortion = Math.pow(closeFactor, 1.8);
                }
                
                if (distortion > 0.02) {
                    app.style.filter = 'url(#gravitational-lens)';
                    const factor = 250 / bh.z;
                    const px = bh.x * factor + w / 2;
                    const py = bh.y * factor + h / 2;
                    
                    const pullX = (px - w / 2) * distortion * 0.12;
                    const pullY = (py - h / 2) * distortion * 0.12;
                    const skewX = -(px - w / 2) * distortion * 0.025;
                    const scale = 1 - (distortion * 0.03);
                    
                    app.style.transform = `translate3d(${pullX}px, ${pullY}px, 0) skewX(${skewX}deg) scale(${scale})`;
                    displacement.setAttribute('scale', distortion * 48);
                } else {
                    app.style.filter = 'none';
                    app.style.transform = 'none';
                }
            }
        }
        
        } catch(err) { console.error('Canvas animate error:', err); }
    }
    
    try { animate(); } catch(e) { console.error('Initial animate error:', e); }
})();

// IntersectionObservers for section reveals
const obs = new IntersectionObserver(e => {
    e.forEach(el => {
        if(el.isIntersecting){
            el.target.classList.add('active');
            obs.unobserve(el.target);
        }
    });
}, {threshold:.15});

document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));

// IntersectionObservers for skill bar widths
const barObs = new IntersectionObserver(e => {
    e.forEach(el => {
        if(el.isIntersecting){
            el.target.querySelectorAll('.skill-bar').forEach(b => b.style.width = b.dataset.width);
            barObs.unobserve(el.target);
        }
    });
}, {threshold:.3});

const skillsSection = document.getElementById('skills');
if (skillsSection) barObs.observe(skillsSection);

// Navbar styling scroll triggers
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const scrollTop = document.getElementById('scrollTop');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollTop) scrollTop.classList.toggle('show', window.scrollY > 500);
});

// Mail send function
function sendMail(){
    var n = document.getElementById('cName').value.trim();
    var e = document.getElementById('cEmail').value.trim();
    var s = document.getElementById('cSubject').value.trim();
    var m = document.getElementById('cMessage').value.trim();
    if(!n || !e || !s || !m){
        alert('Please fill in all fields.');
        return;
    }
    window.location.href = 'mailto:giordanotubeo@gmail.com?subject=' + encodeURIComponent(s) + '&body=' + encodeURIComponent('Name: ' + n + '\nEmail: ' + e + '\n\n' + m);
}
window.sendMail = sendMail;

// Preview Modal Functions
function openImagePreview(src) {
    const modal = document.getElementById('preview-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;
    content.textContent = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Preview';
    content.appendChild(img);
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('open'), 10);
}
window.openImagePreview = openImagePreview;

function openVideoPreview(src) {
    const modal = document.getElementById('preview-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;
    content.textContent = '';
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.style.width = '100%';
    content.appendChild(video);
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('open'), 10);
}
window.openVideoPreview = openVideoPreview;

function closePreviewModal() {
    const modal = document.getElementById('preview-modal');
    const content = document.getElementById('modal-content');
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(() => {
        modal.style.display = 'none';
        if (content) content.textContent = '';
    }, 280);
}
window.closePreviewModal = closePreviewModal;

// Attach card click handlers for image and video previews
(function initMediaPreviews() {
    // Project card clicks
    document.querySelectorAll('.project-card').forEach(card => {
        const video = card.querySelector('video');
        const imgDiv = card.querySelector('.project-img');
        
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
            const modal = document.getElementById('preview-modal');
            if (modal && modal.contains(e.target)) return;
            
            if (video) {
                // Autoplay/toggle the card's inline video
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                // Open full video in modal
                openVideoPreview(video.src);
            } else if (imgDiv) {
                // Extract bg url
                const bg = window.getComputedStyle(imgDiv).backgroundImage;
                const match = bg.match(/url\((['"]?)(.*?)\1\)/);
                if (match && match[2]) {
                    openImagePreview(match[2]);
                }
            }
        });
    });

    // Cert card clicks
    document.querySelectorAll('.cert-item').forEach(item => {
        const content = item.querySelector('.cert-content');
        if (content) {
            content.style.cursor = 'pointer';
            content.addEventListener('click', (e) => {
                const modal = document.getElementById('preview-modal');
                if (modal && modal.contains(e.target)) return;
                
                const bg = window.getComputedStyle(content).backgroundImage;
                const match = bg.match(/url\((['"]?)(.*?)\1\)/);
                if (match && match[2]) {
                    openImagePreview(match[2]);
                }
            });
        }
    });

    // Close on clicking backdrop
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('preview-modal');
        if (e.target === modal) {
            closePreviewModal();
        }
    });
})();

// Scroll-Spy for Active Navigation Link Highlighting
(function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    function spy() {
        let currentSectionId = 'intro';
        const scrollPos = window.scrollY + 160;

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${currentSectionId}`);
        });
    }

    window.addEventListener('scroll', spy);
    window.addEventListener('resize', spy);
    spy(); // run once on load
})();
