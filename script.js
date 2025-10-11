

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


// مدیریت ارسال فرم
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    // غیرفعال کردن دکمه و نمایش وضعیت بارگذاری
    submitBtn.disabled = true;
    btnText.textContent = 'در حال ارسال...';
    
    // دریافت اطلاعات فرم
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim() || 'وارد نشده',
        message: document.getElementById('message').value.trim()
    };
    
    try {
        // ارسال به GitHub Actions
        const response = await fetch('https://api.github.com/repos/rozhanyazdani75/rozhanyazdani75.github.io/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'Bearer ${{ secrets.GH_PAT }}',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_type: 'send-telegram',
                client_payload: formData
            })
        });
        
        if (response.status === 204 || response.ok) {
            // موفقیت‌آمیز
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            
            // ریست کردن فرم
            this.reset();
            
            // بازگشت به فرم بعد از 5 ثانیه
            setTimeout(() => {
                document.getElementById('formSuccess').style.display = 'none';
                document.getElementById('contactForm').style.display = 'block';
            }, 5000);
        } else {
            throw new Error('Failed to trigger workflow');
        }
        
    } catch (error) {
        console.error('Error:', error);
        
        // نمایش پیام خطا
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('formError').style.display = 'block';
        
        // بازگشت به فرم بعد از 5 ثانیه
        setTimeout(() => {
            document.getElementById('formError').style.display = 'none';
            document.getElementById('contactForm').style.display = 'block';
        }, 5000);
    } finally {
        // بازنشانی دکمه
        submitBtn.disabled = false;
        btnText.textContent = originalText;
    }
});

// اعتبارسنجی شماره تلفن ایرانی
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    e.target.value = value;
});