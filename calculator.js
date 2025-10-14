// calculator.js

// قیمت‌های پایه
const PRICES = {
    baseInstallWithVM: 22500000,      // تا 10 کاربر با ماشین مجازی
    baseInstallNoVM: 32800000,        // تا 10 کاربر بدون ماشین مجازی
    perUserAfter10: 500000,           // هر کاربر بعد از 10 نفر
    mikrotik: 8000000,
    gateway: 3500000,
    crm: 7000000,
    sms: 7000000,
    perBranch: 1300000,
    support6MonthBase: 20000000,      // 6 ماهه برای 6 کاربر
    support12MonthBase: 35000000,     // سالانه برای 6 کاربر
    perUserSupport6Month: 500000,     // هر کاربر اضافی بعد از 6 برای پشتیبانی 6 ماهه
    perUserSupport12Month: 1000000,   // هر کاربر اضافی بعد از 6 برای پشتیبانی سالانه
    onsitePerDay: 3000000
};

// تبدیل اعداد به فارسی با جداکننده
function formatNumber(num) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formatted.split('').map(char => {
        if (char >= '0' && char <= '9') {
            return persianDigits[parseInt(char)];
        }
        return char;
    }).join('');
}

// نمایش/مخفی کردن بخش شعب
function toggleBranches() {
    const branchSection = document.getElementById('branchSection');
    const branchesEnabled = document.getElementById('branchesEnabled').checked;
    branchSection.style.display = branchesEnabled ? 'block' : 'none';
    calculateTotal();
}

// نمایش/مخفی کردن بخش پشتیبانی
function toggleSupport() {
    const supportSection = document.getElementById('supportSection');
    const supportEnabled = document.getElementById('supportEnabled').checked;
    supportSection.style.display = supportEnabled ? 'block' : 'none';
    calculateTotal();
}

// نمایش/مخفی کردن پشتیبانی حضوری
function toggleOnsite() {
    const onsiteSection = document.getElementById('onsiteSection');
    const onsiteEnabled = document.getElementById('onsiteEnabled').checked;
    onsiteSection.style.display = onsiteEnabled ? 'block' : 'none';
    calculateTotal();
}

// محاسبه جمع کل
function calculateTotal() {
    let breakdown = [];
    let totalCost = 0;

    // ۱. محاسبه هزینه نصب و راه‌اندازی
    const userCount = parseInt(document.getElementById('userCount').value) || 6;
    const vmType = document.querySelector('input[name="vmType"]:checked').value;
    
    let installCost = 0;
    let installDetail = '';
    
    if (vmType === 'hasVM') {
        installCost = PRICES.baseInstallWithVM;
        installDetail = 'نصب و راه‌اندازی با ماشین مجازی (تا ۱۰ کاربر): ' + formatNumber(PRICES.baseInstallWithVM);
    } else {
        installCost = PRICES.baseInstallNoVM;
        installDetail = 'نصب و راه‌اندازی بدون ماشین مجازی (تا ۱۰ کاربر): ' + formatNumber(PRICES.baseInstallNoVM);
    }
    
    // اضافه کردن هزینه کاربران بیش از ۱۰ نفر
    if (userCount > 10) {
        const extraUsers = userCount - 10;
        const extraCost = extraUsers * PRICES.perUserAfter10;
        installCost += extraCost;
        installDetail += '<br>└─ ' + extraUsers + ' کاربر اضافی × ' + formatNumber(PRICES.perUserAfter10) + ' = ' + formatNumber(extraCost);
    }
    
    breakdown.push(installDetail + '<br><strong>جمع نصب: ' + formatNumber(installCost) + ' تومان</strong>');
    totalCost += installCost;

    // ۲. خدمات شبکه
    let networkCost = 0;
    let networkDetails = [];
    
    if (document.getElementById('mikrotik').checked) {
        networkCost += PRICES.mikrotik;
        networkDetails.push('راه‌اندازی روتر میکروتیک: ' + formatNumber(PRICES.mikrotik));
    }
    
    if (document.getElementById('gateway').checked) {
        networkCost += PRICES.gateway;
        networkDetails.push('راه‌اندازی گیت‌وی: ' + formatNumber(PRICES.gateway));
    }
    
    if (document.getElementById('crm').checked) {
        networkCost += PRICES.crm;
        networkDetails.push('اتصال به CRM: ' + formatNumber(PRICES.crm));
    }
    
    if (document.getElementById('sms').checked) {
        networkCost += PRICES.sms;
        networkDetails.push('اتصال به سامانه پیامکی: ' + formatNumber(PRICES.sms));
    }
    
    if (document.getElementById('branchesEnabled').checked) {
        const branchCount = parseInt(document.getElementById('branchCount').value) || 1;
        const branchCost = branchCount * PRICES.perBranch;
        networkCost += branchCost;
        networkDetails.push('ارتباط بین شعب (' + branchCount + ' شعبه × ' + formatNumber(PRICES.perBranch) + '): ' + formatNumber(branchCost));
    }
    
    if (networkDetails.length > 0) {
        breakdown.push('<strong>خدمات شبکه و یکپارچه‌سازی:</strong><br>' + networkDetails.join('<br>') + '<br><strong>جمع خدمات: ' + formatNumber(networkCost) + ' تومان</strong>');
        totalCost += networkCost;
    }

    // ۳. پشتیبانی
    if (document.getElementById('supportEnabled').checked) {
        let supportCost = 0;
        let supportDetails = [];
        
        const supportType = document.querySelector('input[name="supportType"]:checked').value;
        
        if (supportType === '6month') {
            supportCost = PRICES.support6MonthBase;
            supportDetails.push('پشتیبانی ۶ ماهه (بیس ۶ کاربر): ' + formatNumber(PRICES.support6MonthBase));
            
            // کاربران اضافی بعد از ۶ نفر
            if (userCount > 6) {
                const extraUsers = userCount - 6;
                const extraCost = extraUsers * PRICES.perUserSupport6Month;
                supportCost += extraCost;
                supportDetails.push('└─ ' + extraUsers + ' کاربر اضافی × ' + formatNumber(PRICES.perUserSupport6Month) + ' = ' + formatNumber(extraCost));
            }
        } else {
            supportCost = PRICES.support12MonthBase;
            supportDetails.push('پشتیبانی ۱ ساله (بیس ۶ کاربر): ' + formatNumber(PRICES.support12MonthBase));
            
            // کاربران اضافی بعد از ۶ نفر
            if (userCount > 6) {
                const extraUsers = userCount - 6;
                const extraCost = extraUsers * PRICES.perUserSupport12Month;
                supportCost += extraCost;
                supportDetails.push('└─ ' + extraUsers + ' کاربر اضافی × ' + formatNumber(PRICES.perUserSupport12Month) + ' = ' + formatNumber(extraCost));
            }
        }
        
        // پشتیبانی حضوری
        if (document.getElementById('onsiteEnabled').checked) {
            const onsiteDays = parseInt(document.getElementById('onsiteDays').value) || 1;
            const onsiteCost = onsiteDays * PRICES.onsitePerDay;
            supportCost += onsiteCost;
            supportDetails.push('پشتیبانی حضوری (' + onsiteDays + ' روز × ' + formatNumber(PRICES.onsitePerDay) + '): ' + formatNumber(onsiteCost));
        }
        
        breakdown.push('<strong>پشتیبانی:</strong><br>' + supportDetails.join('<br>') + '<br><strong>جمع پشتیبانی: ' + formatNumber(supportCost) + ' تومان</strong>');
        totalCost += supportCost;
    }

    // نمایش جزئیات
    const breakdownHTML = breakdown.join('<br><br>');
    document.getElementById('priceBreakdown').innerHTML = breakdownHTML;
    document.getElementById('totalPrice').textContent = formatNumber(totalCost);
}

// ارسال پیش‌فاکتور
function submitQuote() {
    const totalPrice = document.getElementById('totalPrice').textContent;
    const userCount = document.getElementById('userCount').value;
    
    alert('پیش‌فاکتور شما:\n\nتعداد کاربران: ' + userCount + '\nجمع کل: ' + totalPrice + ' تومان\n\nپیش‌فاکتور با موفقیت ثبت شد!');
    
    // اینجا می‌توانید کد ارسال به سرور را اضافه کنید
    console.log('پیش‌فاکتور ثبت شد');
}

// محاسبه اولیه هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    calculateTotal();
});