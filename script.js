

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
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    
    submitBtn.disabled = true;
    btnText.textContent = 'در حال ارسال...';
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim() || 'وارد نشده',
        message: document.getElementById('message').value.trim()
    };
    
    const issueBody = `
## 📞 پیام جدید از وبسایت

**👤 نام:** ${formData.name}
**📧 ایمیل:** ${formData.email}
**📱 تلفن:** ${formData.phone}

**💬 پیام:**
${formData.message}

---
*ارسال شده از: ${window.location.href}*
*زمان: ${new Date().toLocaleString('fa-IR')}*
`;

    try {
        // ایجاد Issue در GitHub (بدون نیاز به توکن!)
        const response = await fetch('https://api.github.com/repos/rozhanyazdani75/rozhanyazdani75.github.io/issues', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `📞 پیام از ${formData.name} - ${new Date().toLocaleDateString('fa-IR')}`,
                body: issueBody,
                labels: ['contact-form', 'website-message']
            })
        });
        
        if (response.status === 201) {
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            this.reset();
            
            setTimeout(() => {
                document.getElementById('formSuccess').style.display = 'none';
                document.getElementById('contactForm').style.display = 'block';
            }, 5000);
        } else {
            throw new Error('Failed to create issue');
        }
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('formError').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('formError').style.display = 'none';
        }, 5000);
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'ارسال پیام';
    }
});