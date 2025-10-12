

// Hamburger Menu Functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});
// Biography tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    const yearTabs = document.querySelectorAll('.year-tab');
    const yearContents = document.querySelectorAll('.year-content');

    yearTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetYear = this.getAttribute('data-year');
            
            // Remove active class from all tabs
            yearTabs.forEach(t => t.classList.remove('active'));
            
            // Remove active class from all contents
            yearContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.querySelector(`[data-content="${targetYear}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});


// Fullscreen Modal Functions
function openFullscreen(button) {
    const modal = document.getElementById('fullscreenModal');
    const modalImg = document.getElementById('fullscreenImage');
    const caption = document.getElementById('fullscreenCaption');
    
    const card = button.closest('.endorsement-card');
    const img = card.querySelector('.endorsement-image');
    const title = card.querySelector('.endorsement-title').textContent;
    const description = card.querySelector('.endorsement-description').textContent;
    
    modal.style.display = 'block';
    modalImg.src = img.src;
    caption.textContent = title + ' - ' + description;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal on click outside
window.onclick = function(event) {
    const modal = document.getElementById('fullscreenModal');
    if (event.target === modal) {
        closeFullscreen();
    }
}

// Close modal on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeFullscreen();
    }
});