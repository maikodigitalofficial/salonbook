
/* --------------------------------------------
   Referral Link Copy
   -------------------------------------------- */
function copyReferralLink() {
    const referralLink = 'https://salonbook.com/ref/' + generateReferralCode();

    navigator.clipboard.writeText(referralLink).then(() => {
        showReferralToast('Link copied! Share it with friends.');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = referralLink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showReferralToast('Link copied! Share it with friends.');
    });
}

function generateReferralCode() {
    return 'USER' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function showReferralToast(message) {
    const existing = document.querySelector('.referral-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'referral-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
