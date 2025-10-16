// ==================== تنظیمات EmailJS ====================
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'hTDxofA4zAchLRAvY',      // کلید عمومی از EmailJS
    SERVICE_ID: 'service_hsseq3j',      // شناسه سرویس
    TEMPLATE_ID: 'template_gvaccco'     // شناسه قالب
};

// راه‌اندازی EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

// ==================== Toggle functions ====================
function toggleSupport() {
    document.getElementById('supportSection').style.display = 
        document.getElementById('supportNeeded').checked ? 'block' : 'none';
}

function toggleOnsite() {
    document.getElementById('onsiteSection').style.display = 
        document.getElementById('onsiteSupport').checked ? 'block' : 'none';
}

function toggleBranch() {
    document.getElementById('branchSection').style.display = 
        document.getElementById('branchConnection').checked ? 'block' : 'none';
}

function toggleMikrotik() {
    document.getElementById('mikrotikSection').style.display = 
        document.getElementById('mikrotik').checked ? 'block' : 'none';
    calculatePrice();
}

// ==================== Counter functions ====================
function incrementCounter(id) {
    const input = document.getElementById(id);
    input.value = parseInt(input.value) + 1;
    calculatePrice();
}

function decrementCounter(id) {
    const input = document.getElementById(id);
    let minValue = 1;
    
    if (id === 'userCount') minValue = 6;
    if (id === 'branchCount') minValue = 2;
    
    if (parseInt(input.value) > minValue) {
        input.value = parseInt(input.value) - 1;
        calculatePrice();
    }
}

// ==================== Price calculation ====================
function calculatePrice() {
    let totalPrice = 0;
    let breakdown = [];
    
    // 1. Base installation price
    const userCount = parseInt(document.getElementById('userCount').value) || 6;
    const hasVM = document.querySelector('input[name="vmOption"]:checked').value === 'yes';
    
    let baseInstallPrice = hasVM ? 22500000 : 32800000;
    let extraUserFee = 0;
    
    if (userCount > 6) {
        extraUserFee = (userCount - 6) * 500000;
    }
    
    totalPrice += baseInstallPrice + extraUserFee;
    
    breakdown.push({
        title: `نصب و راه‌اندازی مرکز تماس (${userCount} کاربر)`,
        price: baseInstallPrice + extraUserFee
    });
    
    // 2. Support
    if (document.getElementById('supportNeeded').checked) {
        const supportUsers = userCount;
        const supportMonths = document.querySelector('input[name="supportDuration"]:checked').value === '6' ? 6 : 12;
        
        let supportBasePrice = supportMonths === 6 ? 20000000 : 35000000;
        let extraSupportUserFee = 0;
        
        if (supportUsers > 6) {
            extraSupportUserFee = (supportUsers - 6) * (supportMonths === 6 ? 500000 : 1000000);
        }
        
        totalPrice += supportBasePrice + extraSupportUserFee;
        
        breakdown.push({
            title: `پشتیبانی ${supportMonths} ماهه (${supportUsers} کاربر)`,
            price: supportBasePrice + extraSupportUserFee
        });
    }
    
    // 3. Onsite support
    if (document.getElementById('onsiteSupport').checked) {
        const onsiteDays = parseInt(document.getElementById('onsiteDays').value) || 1;
        const onsitePrice = onsiteDays * 3000000;
        
        totalPrice += onsitePrice;
        
        breakdown.push({
            title: `پشتیبانی حضوری (${onsiteDays} روز)`,
            price: onsitePrice
        });
    }
    
    // 4. Branch connection
    if (document.getElementById('branchConnection').checked) {
        const branchCount = parseInt(document.getElementById('branchCount').value) || 2;
        const branchPrice = (branchCount - 1) * 2000000;
        
        totalPrice += branchPrice;
        
        breakdown.push({
            title: `ارتباط بین شعب (${branchCount} شعبه)`,
            price: branchPrice
        });
    }
    
    // 5. Mikrotik
    if (document.getElementById('mikrotik').checked) {
        const mikrotikCount = parseInt(document.getElementById('mikrotikCount').value) || 1;
        const mikrotikPrice = mikrotikCount * 8000000;
        
        totalPrice += mikrotikPrice;
        
        breakdown.push({
            title: `راه اندازی کامل روتر میکروتیک (${mikrotikCount} دستگاه)`,
            price: mikrotikPrice
        });
    }
    
    // 6. Additional services
    const additionalServices = [
        { id: 'gateway', title: 'راه اندازی گیت وی', price: 3500000 },
        { id: 'crm', title: 'اتصال به CRM', price: 7000000 },
        { id: 'sms', title: 'اتصال به سامانه پیامکی', price: 7000000 }
    ];
    
    additionalServices.forEach(service => {
        if (document.getElementById(service.id).checked) {
            totalPrice += service.price;
            breakdown.push({
                title: service.title,
                price: service.price
            });
        }
    });
    
    // Update UI
    updatePriceBreakdown(breakdown);
    document.getElementById('totalPrice').textContent = formatPrice(totalPrice) + ' تومان';
}

function updatePriceBreakdown(breakdown) {
    const container = document.getElementById('priceBreakdown');
    container.innerHTML = '';
    
    breakdown.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `<span>${item.title}</span><strong>${formatPrice(item.price)} تومان</strong>`;
        container.appendChild(div);
    });
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ==================== Form submission ====================
function submitForm() {
    const formData = collectFormData();
    showContactModal(formData);
}

function collectFormData() {
    const userCount = document.getElementById('userCount').value;
    const hasVM = document.querySelector('input[name="vmOption"]:checked').value === 'yes' ? 'دارم' : 'ندارم';
    
    let support = 'نمی‌خواهم';
    if (document.getElementById('supportNeeded').checked) {
        const supportDuration = document.querySelector('input[name="supportDuration"]:checked').value;
        support = supportDuration === '6' ? 'شش‌ماهه' : 'یکساله';
    }
    
    let onsiteDays = '0';
    if (document.getElementById('onsiteSupport').checked) {
        onsiteDays = document.getElementById('onsiteDays').value;
    }
    
    let branchCount = '0';
    if (document.getElementById('branchConnection').checked) {
        branchCount = document.getElementById('branchCount').value;
    }
    
    let mikrotikCount = '0';
    if (document.getElementById('mikrotik').checked) {
        mikrotikCount = document.getElementById('mikrotikCount').value;
    }
    
    const services = [];
    if (document.getElementById('sms').checked) services.push('SMS');
    if (document.getElementById('crm').checked) services.push('CRM');
    if (document.getElementById('gateway').checked) services.push('Gateway');
    
    const totalPrice = document.getElementById('totalPrice').textContent;
    
    return {
        userCount,
        hasVM,
        support,
        onsiteDays,
        branchCount,
        mikrotikCount,
        services,
        totalPrice
    };
}

// ==================== Contact Modal ====================
function showContactModal(formData) {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            <h2>🔸 اطلاعات تماس</h2>
            <p>لطفاً نام و شماره تماس خود را وارد کنید:</p>
            
            <div class="modal-form">
                <div class="input-group">
                    <label for="customerName">👤 نام و نام خانوادگی:</label>
                    <input type="text" id="customerName" placeholder="مثال: احمد محمدی" required>
                </div>
                
                <div class="input-group">
                    <label for="customerPhone">📱 شماره تماس:</label>
                    <input type="tel" id="customerPhone" placeholder="09121234567" 
                           pattern="09[0-9]{9}" maxlength="11" required>
                    <small>شماره باید با 09 شروع شود</small>
                </div>
                
                <div class="price-summary">
                    <h3>💰 خلاصه درخواست:</h3>
                    <div class="summary-item">
                        <span>👥 تعداد کاربران:</span>
                        <strong>${formData.userCount}</strong>
                    </div>
                    <div class="summary-item">
                        <span>💻 ماشین مجازی:</span>
                        <strong>${formData.hasVM}</strong>
                    </div>
                    <div class="summary-item total">
                        <span>مبلغ کل:</span>
                        <strong>${formData.totalPrice}</strong>
                    </div>
                </div>
                
                <div class="modal-buttons">
                    <button onclick="sendViaEmailJS()" class="submit-btn">
                        📧 ارسال درخواست
                    </button>
                    <button onclick="closeModal()" class="cancel-btn">انصراف</button>
                </div>
                
                <div class="security-note">
                    🔐 اطلاعات شما با امنیت کامل ارسال می‌شود
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentFormData = formData;
    
    setTimeout(() => {
        document.getElementById('customerName').focus();
    }, 100);
    
    // اجازه ارسال با Enter
    modal.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendViaEmailJS();
        }
    });
}

// ==================== Send via EmailJS ====================
async function sendViaEmailJS() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    
    // اعتبارسنجی
    if (!name || !phone) {
        alert('❌ لطفاً تمام فیلدها را پر کنید');
        return;
    }
    
    if (!/^09[0-9]{9}$/.test(phone)) {
        alert('❌ شماره تماس باید با 09 شروع شود و 11 رقم باشد');
        return;
    }
    
    const formData = window.currentFormData;
    
    // نمایش لودینگ
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ در حال ارسال...';
    submitBtn.disabled = true;
    
    // آماده‌سازی داده‌ها
    const templateParams = {
        customer_name: name,
        customer_phone: phone,
        user_count: formData.userCount,
        has_vm: formData.hasVM,
        support: formData.support,
        onsite_days: formData.onsiteDays || 'ندارد',
        branch_count: formData.branchCount || 'ندارد',
        mikrotik_count: formData.mikrotikCount || 'ندارد',
        services: formData.services.length > 0 ? formData.services.join(', ') : 'هیچکدام',
        total_price: formData.totalPrice,
        submission_time: new Date().toLocaleString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        submission_id: generateUniqueId()
    };
    
    try {
        // ارسال ایمیل
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ ایمیل ارسال شد:', response);
        
        // ذخیره محلی
        saveSubmissionLocal(templateParams);
        
        // بستن مودال و نمایش موفقیت
        closeModal();
        showSuccessMessage(templateParams.submission_id);
        
    } catch (error) {
        console.error('❌ خطا در ارسال:', error);
        
        let errorMessage = 'خطا در ارسال درخواست. ';
        
        if (error.status === 400) {
            errorMessage += 'اطلاعات نامعتبر است.';
        } else if (error.status === 429) {
            errorMessage += 'تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید.';
        } else if (!navigator.onLine) {
            errorMessage += 'اتصال اینترنت را بررسی کنید.';
        } else {
            errorMessage += 'لطفاً دوباره تلاش کنید.';
        }
        
        alert('❌ ' + errorMessage);
        
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ==================== Helper Functions ====================
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveSubmissionLocal(data) {
    const submission = {
        id: data.submission_id,
        timestamp: new Date().toISOString(),
        status: 'sent',
        data: data
    };
    
    let submissions = JSON.parse(localStorage.getItem('email_submissions') || '[]');
    submissions.push(submission);
    
    if (submissions.length > 50) {
        submissions = submissions.slice(-50);
    }
    
    localStorage.setItem('email_submissions', JSON.stringify(submissions));
}

function showSuccessMessage(submissionId) {
    const successModal = document.createElement('div');
    successModal.className = 'contact-modal';
    successModal.innerHTML = `
        <div class="modal-content success">
            <div class="success-icon">✅</div>
            <h2>درخواست شما ارسال شد!</h2>
            <p>درخواست شما با موفقیت به ایمیل ما ارسال شد</p>
            
            <div class="submission-details">
                <p><strong>شناسه پیگیری:</strong></p>
                <code>${submissionId}</code>
                <small>این شناسه را برای پیگیری نگه دارید</small>
            </div>
            
            <div class="next-steps">
                <h4>مراحل بعدی:</h4>
                <ul>
                    <li>✓ درخواست شما دریافت شد</li>
                    <li>⏳ بررسی توسط کارشناسان (1-2 ساعت)</li>
                    <li>📞 تماس برای هماهنگی</li>
                </ul>
            </div>
            
            <button onclick="closeModal(); resetForm();" class="submit-btn">متوجه شدم</button>
        </div>
    `;
    document.body.appendChild(successModal);
    
    setTimeout(() => {
        if (document.querySelector('.contact-modal')) {
            closeModal();
            resetForm();
        }
    }, 8000);
}

function closeModal() {
    const modals = document.querySelectorAll('.contact-modal');
    modals.forEach(modal => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    });
}

function resetForm() {
    document.getElementById('userCount').value = '6';
    document.querySelector('input[name="vmOption"][value="no"]').checked = true;
    document.getElementById('supportNeeded').checked = false;
    document.getElementById('onsiteSupport').checked = false;
    document.getElementById('branchConnection').checked = false;
    document.getElementById('mikrotik').checked = false;
    document.getElementById('gateway').checked = false;
    document.getElementById('crm').checked = false;
    document.getElementById('sms').checked = false;
    
    document.getElementById('supportSection').style.display = 'none';
    document.getElementById('onsiteSection').style.display = 'none';
    document.getElementById('branchSection').style.display = 'none';
    document.getElementById('mikrotikSection').style.display = 'none';
    
    calculatePrice();
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
    calculatePrice();
});