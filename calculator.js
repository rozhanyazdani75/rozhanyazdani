
    // Toggle functions
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

    // Counter functions
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
    
    // Price calculation
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
    
    // ==================== اینجا تابع جدید submitForm ====================
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
    
    function showContactModal(formData) {
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="closeModal()">&times;</span>
                <h2>اطلاعات تماس</h2>
                <p>لطفاً نام و شماره تماس خود را وارد کنید:</p>
                
                <div class="modal-form">
                    <input type="text" id="customerName" placeholder="نام و نام خانوادگی" required>
                    <input type="tel" id="customerPhone" placeholder="شماره تماس (مثال: 09121234567)" 
                           pattern="[0-9]{11}" maxlength="11" required>
                    
                    <div class="modal-buttons">
                        <button onclick="sendToGoogleForm()" class="submit-btn">ارسال درخواست</button>
                        <button onclick="closeModal()" class="cancel-btn">انصراف</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        window.currentFormData = formData;
        
        // فوکوس روی اولین اینپوت
        setTimeout(() => {
            document.getElementById('customerName').focus();
        }, 100);
    }

function sendToGoogleForm() {
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
    submitBtn.textContent = 'در حال آماده‌سازی...';
    submitBtn.disabled = true;
    
    // ذخیره اطلاعات برای پیگیری
    const submissionData = {
        name: name,
        phone: phone,
        userCount: formData.userCount,
        hasVM: formData.hasVM,
        support: formData.support,
        onsiteDays: formData.onsiteDays,
        branchCount: formData.branchCount,
        mikrotikCount: formData.mikrotikCount,
        services: formData.services.join(', '),
        totalPrice: formData.totalPrice,
        timestamp: new Date().toLocaleString('fa-IR')
    };
    
    localStorage.setItem('lastSubmission', JSON.stringify(submissionData));
    
    // ساخت URL کامل
    let googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf_d6Z3r_LGvZvi2tDYoOXuvxOuyn3M5NQedfT5ThGz_hyUIw/viewform?usp=pp_url';
    
    googleFormUrl += '&entry.1456930575=' + encodeURIComponent(name);
    googleFormUrl += '&entry.376352998=' + encodeURIComponent(phone);
    googleFormUrl += '&entry.1135762837=' + encodeURIComponent(formData.userCount);
    googleFormUrl += '&entry.434882034=' + encodeURIComponent(formData.hasVM);
    googleFormUrl += '&entry.1928539094=' + encodeURIComponent(formData.support);
    googleFormUrl += '&entry.1429101457=' + encodeURIComponent(formData.onsiteDays);
    googleFormUrl += '&entry.1047944155=' + encodeURIComponent(formData.branchCount);
    googleFormUrl += '&entry.1203259422=' + encodeURIComponent(formData.mikrotikCount);
    googleFormUrl += '&entry.2102768123=' + encodeURIComponent(formData.totalPrice);
    
    formData.services.forEach(service => {
        googleFormUrl += '&entry.1224865428=' + encodeURIComponent(service);
    });
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        closeModal();
        
        // نمایش مودال تأیید
        showConfirmationModal(googleFormUrl, submissionData);
    }, 800);
}

function showConfirmationModal(googleFormUrl, submissionData) {
    const confirmModal = document.createElement('div');
    confirmModal.className = 'contact-modal';
    confirmModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <h2 style="color: #4CAF50; margin-bottom: 1rem;">✅ درخواست شما آماده ارسال است!</h2>
            
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; text-align: right;">
                <h3 style="margin-bottom: 1rem; color: #333;">خلاصه درخواست شما:</h3>
                <div style="display: grid; gap: 0.5rem; font-size: 0.95rem;">
                    <div><strong>نام:</strong> ${submissionData.name}</div>
                    <div><strong>تلفن:</strong> ${submissionData.phone}</div>
                    <div><strong>تعداد کاربران:</strong> ${submissionData.userCount}</div>
                    <div><strong>ماشین مجازی:</strong> ${submissionData.hasVM}</div>
                    <div><strong>پشتیبانی:</strong> ${submissionData.support}</div>
                    ${submissionData.onsiteDays !== '0' ? `<div><strong>روزهای حضوری:</strong> ${submissionData.onsiteDays}</div>` : ''}
                    ${submissionData.branchCount !== '0' ? `<div><strong>تعداد شعب:</strong> ${submissionData.branchCount}</div>` : ''}
                    ${submissionData.mikrotikCount !== '0' ? `<div><strong>روتر میکروتیک:</strong> ${submissionData.mikrotikCount}</div>` : ''}
                    ${submissionData.services !== 'هیچکدام' ? `<div><strong>خدمات تکمیلی:</strong> ${submissionData.services}</div>` : ''}
                    <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 2px solid #ddd;">
                        <strong style="color: #1f3079; font-size: 1.1rem;">مبلغ کل: ${submissionData.totalPrice}</strong>
                    </div>
                </div>
            </div>
            
            <p style="margin-bottom: 2rem; color: #555;">
                برای تکمیل فرآیند درخواست، روی دکمه زیر کلیک کنید.<br>
                <small style="color: #888;">تمام اطلاعات شما از قبل در فرم وارد شده است.</small>
            </p>
            
            <div style="display: flex; gap: 1rem; flex-direction: column;">
                <button onclick="window.open('${googleFormUrl}', '_blank'); trackSubmission();" 
                        class="submit-btn" 
                        style="width: 100%; padding: 1.2rem; font-size: 1.1rem; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);">
                    🚀 ارسال نهایی درخواست
                </button>
                
                <div style="display: flex; gap: 1rem;">
                    <button onclick="copyToClipboard('${googleFormUrl}')" 
                            class="cancel-btn" 
                            style="flex: 1; background: #2196F3; color: white;">
                        📋 کپی لینک
                    </button>
                    <button onclick="closeModal()" 
                            class="cancel-btn" 
                            style="flex: 1;">
                        بستن
                    </button>
                </div>
            </div>
            
            <div style="margin-top: 2rem; padding: 1rem; background: #e3f2fd; border-radius: 8px; font-size: 0.9rem; color: #1565c0;">
                💡 <strong>راهنمایی:</strong> بعد از کلیک روی دکمه بالا، در صفحه باز شده فقط روی "ارسال" کلیک کنید.
            </div>
        </div>
    `;
    document.body.appendChild(confirmModal);
}

function trackSubmission() {
    // ثبت آمار کلیک
    const stats = JSON.parse(localStorage.getItem('submissionStats') || '{"count": 0}');
    stats.count++;
    stats.lastSubmission = new Date().toISOString();
    localStorage.setItem('submissionStats', JSON.stringify(stats));
    
    // بستن مودال بعد از 2 ثانیه
    setTimeout(() => {
        closeModal();
        
        // نمایش پیام تشکر
        const thankYouModal = document.createElement('div');
        thankYouModal.className = 'contact-modal';
        thankYouModal.innerHTML = `
            <div class="modal-content success">
                <div class="success-icon">🙏</div>
                <h2>متشکریم!</h2>
                <p>درخواست شما در حال بررسی است.<br>در اسرع وقت با شما تماس خواهیم گرفت.</p>
                <button onclick="closeModal()" class="submit-btn">متوجه شدم</button>
            </div>
        `;
        document.body.appendChild(thankYouModal);
        
        // بستن خودکار بعد از 4 ثانیه
        setTimeout(closeModal, 4000);
    }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ لینک کپی شد!');
    }).catch(() => {
        // Fallback برای مرورگرهای قدیمی
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ لینک کپی شد!');
    });
}
    function closeModal() {
        const modal = document.querySelector('.contact-modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    function showSuccessMessage() {
        const successModal = document.createElement('div');
        successModal.className = 'contact-modal';
        successModal.innerHTML = `
            <div class="modal-content success">
                <div class="success-icon">✓</div>
                <h2>درخواست شما با موفقیت ثبت شد!</h2>
                <p>در اسرع وقت کارشناسان ما با شما تماس خواهند گرفت.</p>
                <button onclick="closeModal()" class="submit-btn">متوجه شدم</button>
            </div>
        `;
        document.body.appendChild(successModal);
        
        setTimeout(closeModal, 4000);
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        calculatePrice();
        
        // اجازه ارسال فرم با Enter
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && document.querySelector('.contact-modal')) {
                sendToGoogleForm();
            }
        });
    });
