/* ============================================
   MEMBERSHIP.JS — WhatsApp Plan Enrollment
   ============================================ */

const MembershipJS = (function () {
    'use strict';

    // WhatsApp business number (Kenya format)
    const WHATSAPP_NUMBER = '254712345678';

    /* ----------------------------------------
       Public API
       ---------------------------------------- */
    return {
        init
    };

    /* ----------------------------------------
       Initialize
       ---------------------------------------- */
    function init() {
        const planButtons = document.querySelectorAll('[data-plan]');

        planButtons.forEach(button => {
            button.addEventListener('click', handlePlanClick);
        });
    }

    /* ----------------------------------------
       Handle Plan Button Click
       ---------------------------------------- */
    function handlePlanClick(event) {
        const button = event.currentTarget;
        const plan = button.dataset.plan;
        const price = button.dataset.price;

        const message = buildWhatsAppMessage(plan, price);
        const whatsappUrl = buildWhatsAppUrl(message);

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
    }

    /* ----------------------------------------
       Build Pre-filled WhatsApp Message
       ---------------------------------------- */
    function buildWhatsAppMessage(plan, price) {
        const planName = plan === 'monthly' ? 'Beauty Club Monthly' : 'Beauty Club Annual';

        const message = `Hello SalonBook! 👋

I'd like to join the ${planName} membership plan.

Plan Details:
• Plan: ${planName}
• Price: ${price}
• Enquiry Date: ${getCurrentDate()}

Please send me the payment details and next steps to complete my enrollment.

Thank you!`;

        return message;
    }

    /* ----------------------------------------
       Build WhatsApp URL
       ---------------------------------------- */
    function buildWhatsAppUrl(message) {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    }

    /* ----------------------------------------
       Get Current Date
       ---------------------------------------- */
    function getCurrentDate() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return now.toLocaleDateString('en-KE', options);
    }

})();

/* Auto-init on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
    MembershipJS.init();
});

window.MembershipJS = MembershipJS;
