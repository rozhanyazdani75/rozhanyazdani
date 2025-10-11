

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


// Contact Form Handler - هماهنگ با طراحی شما
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // عناصر فرم
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const successDiv = document.getElementById('formSuccess');
    const errorDiv = document.getElementById('formError');
    
    // مخفی کردن پیام‌های قبلی
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    
    // نمایش لودینگ
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    btnText.textContent = 'در حال ارسال...';
    btnIcon.style.animation = 'spin 1s linear infinite';
    
    // جمع‌آوری اطلاعات فرم
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    try {
        // ارسال به GitHub Actions
        const response = await fetch('https://api.github.com/repos/rozhanyazdani75/rozhanyazdani75.github.io/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${getGitHubToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_type: 'contact_form_submit',
                client_payload: formData
            })
        });
        
        if (response.ok) {
            // نمایش پیام موفقیت
            form.style.display = 'none';
            successDiv.style.display = 'block';
            
            // پاک کردن فرم
            form.reset();
            
            // بازگرداندن فرم بعد از 5 ثانیه
            setTimeout(() => {
                successDiv.style.display = 'none';
                form.style.display = 'block';
            }, 5000);
            
        } else {
            throw new Error('خطا در ارسال به سرور');
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        
        // نمایش پیام خطا
        form.style.display = 'none';
        errorDiv.style.display = 'block';
        
        // بازگرداندن فرم بعد از 5 ثانیه
        setTimeout(() => {
            errorDiv.style.display = 'none';
            form.style.display = 'block';
        }, 5000);
        
    } finally {
        // بازگرداندن دکمه به حالت عادی
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        btnText.textContent = 'ارسال پیام';
        btnIcon.style.animation = 'none';
    }
});

// تابع دریافت توکن GitHub (امن)
function getGitHubToken() {
    // اینجا توکن شما قرار می‌گیره (از GitHub Secrets)
    return 'ghp_YOUR_TOKEN_HERE'; // این رو با توکن واقعی جایگزین کنید
}

// انیمیشن چرخش آیکون
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);