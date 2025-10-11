

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


// کد JavaScript اصلاح شده
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    submitBtn.disabled = true;
    btnText.textContent = 'در حال ارسال...';
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim() || 'وارد نشده',
        message: document.getElementById('message').value.trim()
    };
    
    try {
        // ساخت یک issue در GitHub که workflow رو trigger کنه
        const issueBody = JSON.stringify(formData);
        
        // ارسال به یک endpoint که خودمون می‌سازیم
        const response = await fetch('/.netlify/functions/send-telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            this.reset();
            
            setTimeout(() => {
                document.getElementById('formSuccess').style.display = 'none';
                document.getElementById('contactForm').style.display = 'block';
            }, 5000);
        } else {
            throw new Error('Failed to send');
        }
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('formError').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('formError').style.display = 'none';
            document.getElementById('contactForm').style.display = 'block';
        }, 5000);
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = originalText;
    }
});