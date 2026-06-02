/* ============================================
   BOOKING.JS — WhatsApp Quick Booking
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initBookingBar();
    initServiceCardBooking();
    initAllServiceCardBooking();
    initPackageBooking();
});

/* --------------------------------------------
   Configuration
   -------------------------------------------- */
const WHATSAPP_CONFIG = {
    phoneNumber: '254712345678',
    greeting: 'Hi! I would like to book an appointment:'
};

const BUSINESS_HOURS = {
    open: 9,   // 9:00 AM
    close: 17  // 5:00 PM (17:00)
};

/* --------------------------------------------
   Kenyan Public Holidays 2026
   -------------------------------------------- */
const KENYAN_HOLIDAYS_2026 = [
    '2026-01-01', // New Year's Day
    '2026-04-03', // Good Friday
    '2026-04-04', // Easter Saturday
    '2026-04-05', // Easter Sunday
    '2026-04-06', // Easter Monday
    '2026-05-01', // Labour Day
    '2026-05-13', // Eid-ul-Fitr
    '2026-06-01', // Madaraka Day
    '2026-07-20', // Eid-ul-Adha
    '2026-10-10', // Moi Day
    '2026-10-20', // Mashujaa Day
    '2026-12-12', // Jamhuri Day
    '2026-12-25', // Christmas Day
    '2026-12-26', // Boxing Day
];

/* --------------------------------------------
   Service Name Map
   -------------------------------------------- */
const SERVICE_NAMES = {
    'haircut': 'Haircut',
    'color': 'Hair Coloring',
    'styling': 'Hair Styling',
    'facial': 'Facial Treatment',
    'manicure': 'Manicure',
    'beard': 'Beard Grooming',
    'braiding': 'Braiding',
    'treatment': 'Hair Treatment',
    'extensions': 'Hair Extensions',
    'silkpress': 'Silk Press',
    'makeup': 'Makeup',
    'lashes': 'Lashes',
    'eyebrow': 'Eyebrow Shaping',
    'bridal': 'Bridal Makeup',
    'facials': 'Facials',
    'pedicure': 'Pedicure',
    'gel': 'Gel Polish',
    'nailart': 'Nail Art',
    'barber-haircut': 'Barber Haircut',
    'shave': 'Luxury Shave',
    'hottowel': 'Hot Towel Treatment'
};

/* --------------------------------------------
   Booking Bar Initialization
   -------------------------------------------- */
function initBookingBar() {
    const bookingBar = document.querySelector('.booking-bar');
    if (!bookingBar) return;

    const fields = {
        service: bookingBar.querySelector('.booking-field:nth-child(1) .booking-select'),
        stylist: bookingBar.querySelector('.booking-field:nth-child(3) .booking-select'),
        date: bookingBar.querySelector('.booking-field:nth-child(5) .booking-input'),
        time: bookingBar.querySelector('.booking-field:nth-child(7) .booking-select'),
        btn: bookingBar.querySelector('.booking-btn')
    };

    // Set minimum date to today
    if (fields.date) {
        const today = new Date().toISOString().split('T')[0];
        fields.date.min = today;
        fields.date.value = today;
    }

    // Initialize real-time clock check for time validation
    initRealTimeValidation(fields);

    // Initialize stylist availability
    initStylistAvailability(fields);

    // Initialize WhatsApp booking
    initWhatsAppBooking(fields, bookingBar);
}

/* --------------------------------------------
   Real-Time Validation
   -------------------------------------------- */
function initRealTimeValidation(fields) {
    const now = new Date();
    const currentHour = now.getHours();

    // If it's already past 5 PM, block today entirely
    if (currentHour >= BUSINESS_HOURS.close) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        if (fields.date) {
            fields.date.min = tomorrowStr;
            fields.date.value = tomorrowStr;
        }
    }

    // Update available times based on current time (for today only)
    fields.date?.addEventListener('change', () => {
        applyAllTimeRestrictions(fields);
        validateDateRestrictions(fields.date.value, fields);
    });
}

/* --------------------------------------------
   Apply ALL Time Restrictions (Business Hours + Stylist + Past Time)
   -------------------------------------------- */
function applyAllTimeRestrictions(fields) {
    if (!fields.time || !fields.date) return;

    const selectedDate = fields.date.value;
    const selectedStylist = fields.stylist?.value || 'any';

    const availabilityMap = {
        'any': ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
        'sarah': ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        'james': ['10:00', '11:00', '12:00', '13:00', '15:00', '16:00'],
        'maria': ['9:00', '11:00', '13:00', '14:00', '16:00'],
        'david': ['9:00', '10:00', '12:00', '13:00', '14:00', '15:00']
    };

    const stylistAvailableTimes = availabilityMap[selectedStylist] || availabilityMap['any'];

    const selected = new Date(selectedDate);
    const today = new Date();
    const isToday = selected.toDateString() === today.toDateString();
    const currentHour = today.getHours();

    const options = fields.time.querySelectorAll('option');

    options.forEach(option => {
        if (!option.value) return; // Skip placeholder

        const hour = parseInt(option.value.split(':')[0], 10);

        // Rule 1: Must be within business hours (9 AM - 5 PM)
        if (hour < BUSINESS_HOURS.open || hour >= BUSINESS_HOURS.close) {
            option.disabled = true;
            option.style.opacity = '0.3';
            return;
        }

        // Rule 2: If today, must be in the future (not past)
        if (isToday && currentHour >= hour) {
            option.disabled = true;
            option.style.opacity = '0.3';
            return;
        }

        // Rule 3: Must match stylist availability
        if (!stylistAvailableTimes.includes(option.value)) {
            option.disabled = true;
            option.style.opacity = '0.3';
            return;
        }

        // All rules passed — enable
        option.disabled = false;
        option.style.opacity = '1';
    });

    // Reset selection if current value is now invalid
    if (fields.time.value) {
        const selectedOption = fields.time.querySelector(`option[value="${fields.time.value}"]`);
        if (!selectedOption || selectedOption.disabled) {
            fields.time.value = '';
        }
    }
}

/* --------------------------------------------
   Validate Date Restrictions (Sunday + Holidays)
   -------------------------------------------- */
function validateDateRestrictions(dateString, fields) {
    if (!dateString) return true;

    const selected = new Date(dateString);
    const dayOfWeek = selected.getDay(); // 0 = Sunday

    // Check Sunday
    if (dayOfWeek === 0) {
        showBookingMessage(fields.btn.closest('.booking-bar'), 'Sorry, we are closed on Sundays. Please select another day.', 'error');
        fields.date.value = '';
        return false;
    }

    // Check Kenyan public holiday
    if (isPublicHoliday(dateString)) {
        const holidayName = getHolidayName(dateString);
        showBookingMessage(fields.btn.closest('.booking-bar'), `Sorry, we are closed on ${holidayName}. Please select another day.`, 'error');
        fields.date.value = '';
        return false;
    }

    return true;
}

/* --------------------------------------------
   Check if Date is Kenyan Public Holiday
   -------------------------------------------- */
function isPublicHoliday(dateString) {
    return KENYAN_HOLIDAYS_2026.includes(dateString);
}

/* --------------------------------------------
   Get Holiday Name
   -------------------------------------------- */
function getHolidayName(dateString) {
    const holidayNames = {
        '2026-01-01': 'New Year\'s Day',
        '2026-04-03': 'Good Friday',
        '2026-04-04': 'Easter Saturday',
        '2026-04-05': 'Easter Sunday',
        '2026-04-06': 'Easter Monday',
        '2026-05-01': 'Labour Day',
        '2026-05-13': 'Eid-ul-Fitr',
        '2026-06-01': 'Madaraka Day',
        '2026-07-20': 'Eid-ul-Adha',
        '2026-10-10': 'Moi Day',
        '2026-10-20': 'Mashujaa Day',
        '2026-12-12': 'Jamhuri Day',
        '2026-12-25': 'Christmas Day',
        '2026-12-26': 'Boxing Day'
    };
    return holidayNames[dateString] || 'a public holiday';
}

/* --------------------------------------------
   Stylist Availability Logic
   -------------------------------------------- */
function initStylistAvailability(fields) {
    fields.stylist?.addEventListener('change', () => {
        applyAllTimeRestrictions(fields);
    });

    fields.service?.addEventListener('change', () => {
        filterStylistsByService(fields.stylist, fields.service.value);
    });
}

/* --------------------------------------------
   Filter Stylists by Service
   -------------------------------------------- */
function filterStylistsByService(stylistSelect, service) {
    if (!stylistSelect) return;

    const serviceSpecialists = {
        'haircut': ['any', 'sarah', 'james', 'maria', 'david'],
        'color': ['any', 'sarah', 'maria'],
        'styling': ['any', 'james', 'david'],
        'facial': ['any', 'maria'],
        'manicure': ['any', 'sarah', 'david'],
        'beard': ['any', 'james', 'david'],
        'braiding': ['any', 'sarah', 'maria'],
        'treatment': ['any', 'maria', 'sarah'],
        'extensions': ['any', 'sarah', 'maria'],
        'silkpress': ['any', 'sarah', 'maria'],
        'makeup': ['any', 'maria'],
        'lashes': ['any', 'maria', 'sarah'],
        'eyebrow': ['any', 'maria', 'sarah'],
        'bridal': ['any', 'maria'],
        'facials': ['any', 'maria'],
        'pedicure': ['any', 'sarah', 'david'],
        'gel': ['any', 'sarah', 'david'],
        'nailart': ['any', 'sarah', 'david'],
        'barber-haircut': ['any', 'james', 'david'],
        'shave': ['any', 'james', 'david'],
        'hottowel': ['any', 'james', 'david']
    };

    const allowed = serviceSpecialists[service] || serviceSpecialists['haircut'];
    const options = stylistSelect.querySelectorAll('option');

    options.forEach(option => {
        if (!option.value) return;
        const isAllowed = allowed.includes(option.value);
        option.disabled = !isAllowed;
        option.style.display = isAllowed ? '' : 'none';
    });

    if (!allowed.includes(stylistSelect.value)) {
        stylistSelect.value = 'any';
        stylistSelect.dispatchEvent(new Event('change'));
    }
}

/* --------------------------------------------
   WhatsApp Booking
   -------------------------------------------- */
function initWhatsAppBooking(fields, bookingBar) {
    fields.btn?.addEventListener('click', () => {
        const booking = {
            service: fields.service?.value,
            stylist: fields.stylist?.value,
            date: fields.date?.value,
            time: fields.time?.value
        };

        // Validate all fields filled
        const errors = validateBooking(booking);
        if (errors.length > 0) {
            showBookingMessage(bookingBar, errors[0], 'error');
            return;
        }

        // Validate date restrictions (Sunday, holidays)
        const dateValid = validateDateRestrictions(booking.date, fields);
        if (!dateValid) {
            return;
        }

        // Validate business hours
        const hourValidation = validateBusinessHours(booking.time);
        if (!hourValidation.valid) {
            showBookingMessage(bookingBar, hourValidation.message, 'error');
            return;
        }

        const whatsappUrl = buildWhatsAppUrl(booking);
        window.open(whatsappUrl, '_blank');

        // Reset form after successful redirect
        resetBookingForm(fields);
    });
}

/* --------------------------------------------
   Validate Business Hours
   -------------------------------------------- */
function validateBusinessHours(timeString) {
    if (!timeString) return { valid: false, message: 'Please select a time' };

    const hour = parseInt(timeString.split(':')[0], 10);

    if (hour < BUSINESS_HOURS.open) {
        return {
            valid: false,
            message: `Sorry, we open at 9:00 AM. Please select a time between 9:00 AM and 5:00 PM.`
        };
    }

    if (hour >= BUSINESS_HOURS.close) {
        return {
            valid: false,
            message: `Sorry, we close at 5:00 PM. Please select a time between 9:00 AM and 5:00 PM.`
        };
    }

    return { valid: true };
}

/* --------------------------------------------
   Validate Booking
   -------------------------------------------- */
function validateBooking(booking) {
    const errors = [];
    const fieldNames = {
        service: 'Service',
        stylist: 'Stylist',
        date: 'Date',
        time: 'Time'
    };

    Object.entries(booking).forEach(([key, value]) => {
        if (!value) {
            errors.push(`Please select a ${fieldNames[key]}`);
        }
    });

    if (booking.date) {
        const selected = new Date(booking.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
            errors.push('Please select a future date');
        }
    }

    return errors;
}

/* --------------------------------------------
   Build WhatsApp URL with Pre-filled Message
   -------------------------------------------- */
function buildWhatsAppUrl(booking) {
    const stylistName = formatStylistName(booking.stylist);
    const serviceName = formatServiceName(booking.service);
    const formattedDate = formatDate(booking.date);
    const formattedTime = formatTime(booking.time);

    const messageLines = [
        WHATSAPP_CONFIG.greeting,
        '',
        `*Service:* ${serviceName}`,
        `*Stylist:* ${stylistName}`,
        `*Date:* ${formattedDate}`,
        `*Time:* ${formattedTime}`,
        '',
        'Please confirm my booking. Thank you!'
    ];

    const message = messageLines.join('\n');
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
}

/* --------------------------------------------
   Reset Booking Form
   -------------------------------------------- */
function resetBookingForm(fields) {
    if (fields.service) {
        fields.service.value = '';
    }

    if (fields.stylist) {
        fields.stylist.value = '';
        const stylistOptions = fields.stylist.querySelectorAll('option');
        stylistOptions.forEach(opt => {
            opt.disabled = false;
            opt.style.display = '';
        });
    }

    if (fields.date) {
        const today = new Date().toISOString().split('T')[0];
        fields.date.value = today;
    }

    if (fields.time) {
        fields.time.value = '';
        const timeOptions = fields.time.querySelectorAll('option');
        timeOptions.forEach(opt => {
            opt.disabled = false;
            opt.style.opacity = '1';
        });
    }
}

/* --------------------------------------------
   Format Helpers
   -------------------------------------------- */
function formatStylistName(value) {
    const names = {
        'any': 'Any Available Stylist',
        'sarah': 'Sarah M.',
        'james': 'James K.',
        'maria': 'Maria L.',
        'david': 'David R.'
    };
    return names[value] || value;
}

function formatServiceName(value) {
    return SERVICE_NAMES[value] || value;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes || '00'} ${ampm}`;
}

/* --------------------------------------------
   UI Feedback
   -------------------------------------------- */
function showBookingMessage(container, text, type) {
    const existing = container.querySelector('.booking-message');
    if (existing) existing.remove();

    const message = document.createElement('div');
    message.className = `booking-message booking-message--${type}`;
    message.textContent = text;
    container.appendChild(message);

    setTimeout(() => message.remove(), 4000);
}

/* --------------------------------------------
   Homepage Service Card Booking
   -------------------------------------------- */
function initServiceCardBooking() {
    const cardButtons = document.querySelectorAll('.service-card-btn');
    if (!cardButtons.length) return;

    cardButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const price = btn.dataset.price;
            const duration = btn.dataset.duration;
            const serviceName = btn.closest('.service-card').querySelector('.service-card-name').textContent;

            const messageLines = [
                WHATSAPP_CONFIG.greeting,
                '',
                `*Service:* ${serviceName}`,
                `*Price:* ${price}`,
                `*Duration:* ${duration}`,
                '',
                'I would like to book this service. Please let me know your availability. Thank you!'
            ];

            const message = messageLines.join('\n');
            const encodedMessage = encodeURIComponent(message);

            const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    });
}

/* --------------------------------------------
   Services Page All-Service Card Booking
   -------------------------------------------- */
function initAllServiceCardBooking() {
    const cardButtons = document.querySelectorAll('.all-service-btn');
    if (!cardButtons.length) return;

    cardButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const price = btn.dataset.price;
            const duration = btn.dataset.duration;
            const serviceName = btn.closest('.all-service-card').querySelector('.all-service-name').textContent;

            const messageLines = [
                WHATSAPP_CONFIG.greeting,
                '',
                `*Service:* ${serviceName}`,
                `*Price:* ${price}`,
                `*Duration:* ${duration}`,
                '',
                'I would like to book this service. Please let me know your availability. Thank you!'
            ];

            const message = messageLines.join('\n');
            const encodedMessage = encodeURIComponent(message);

            const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    });
}

/* --------------------------------------------
   Package Card Booking
   -------------------------------------------- */
function initPackageBooking() {
    const packageButtons = document.querySelectorAll('.package-btn');
    if (!packageButtons.length) return;

    packageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const price = btn.dataset.price;
            const packageName = btn.closest('.package-card').querySelector('.package-name').textContent;

            const messageLines = [
                WHATSAPP_CONFIG.greeting,
                '',
                `*Package:* ${packageName}`,
                `*Price:* ${price}`,
                '',
                'I would like to book this package. Please let me know your availability. Thank you!'
            ];

            const message = messageLines.join('\n');
            const encodedMessage = encodeURIComponent(message);

            const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    });
}


/* ============================================
   BOOKING FORM — WhatsApp Submission
   ============================================ */

(function () {
    const form = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('bookingSubmitBtn');
    if (!form || !submitBtn) return;

    const KENYAN_HOLIDAYS_2026 = [
        '2026-01-01', '2026-04-03', '2026-04-04', '2026-04-05', '2026-04-06',
        '2026-05-01', '2026-05-13', '2026-06-01', '2026-07-20', '2026-10-10',
        '2026-10-20', '2026-12-12', '2026-12-25', '2026-12-26'
    ];

    const HOLIDAY_NAMES = {
        '2026-01-01': 'New Year\'s Day',
        '2026-04-03': 'Good Friday',
        '2026-04-04': 'Easter Saturday',
        '2026-04-05': 'Easter Sunday',
        '2026-04-06': 'Easter Monday',
        '2026-05-01': 'Labour Day',
        '2026-05-13': 'Eid-ul-Fitr',
        '2026-06-01': 'Madaraka Day',
        '2026-07-20': 'Eid-ul-Adha',
        '2026-10-10': 'Moi Day',
        '2026-10-20': 'Mashujaa Day',
        '2026-12-12': 'Jamhuri Day',
        '2026-12-25': 'Christmas Day',
        '2026-12-26': 'Boxing Day'
    };

    const BUSINESS_HOURS = {
        open: 9,
        close: 17
    };

    function getSelectedTime() {
        const selected = form.querySelector('input[name="time"]:checked');
        return selected ? selected.value : '';
    }

    function buildMessage() {
        const service = document.getElementById('bookingService').value;
        const stylist = document.getElementById('bookingStylist').value;
        const date = document.getElementById('bookingDate').value;
        const time = getSelectedTime();
        const name = document.getElementById('bookingName').value.trim();
        const phone = document.getElementById('bookingPhone').value.trim();
        const email = document.getElementById('bookingEmail').value.trim();
        const notes = document.getElementById('bookingNotes').value.trim();

        let message = WHATSAPP_CONFIG.greeting + '\n\n';
        message += '*Service:* ' + service + '\n';
        message += '*Stylist:* ' + stylist + '\n';
        message += '*Date:* ' + date + '\n';
        message += '*Time:* ' + time + '\n\n';
        message += '*Name:* ' + name + '\n';
        message += '*Phone:* ' + phone + '\n';
        message += '*Email:* ' + email;

        if (notes) {
            message += '\n\n*Notes:* ' + notes;
        }

        return encodeURIComponent(message);
    }

    function isFormComplete() {
        const service = document.getElementById('bookingService').value;
        const stylist = document.getElementById('bookingStylist').value;
        const date = document.getElementById('bookingDate').value;
        const time = getSelectedTime();
        const name = document.getElementById('bookingName').value.trim();
        const phone = document.getElementById('bookingPhone').value.trim();
        const email = document.getElementById('bookingEmail').value.trim();

        return service && stylist && date && time && name && phone && email;
    }

    function isSunday(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString + 'T00:00:00');
        return date.getDay() === 0;
    }

    function isHoliday(dateString) {
        return KENYAN_HOLIDAYS_2026.includes(dateString);
    }

    function getHolidayName(dateString) {
        return HOLIDAY_NAMES[dateString] || 'a public holiday';
    }

    function isWithinBusinessHours(timeValue) {
        if (!timeValue) return false;
        const hour = parseInt(timeValue.split(':')[0], 10);
        const ampm = timeValue.includes('PM') && hour !== 12 ? hour + 12 : hour;
        const finalHour = timeValue.includes('AM') && hour === 12 ? 0 : ampm;
        return finalHour >= BUSINESS_HOURS.open && finalHour < BUSINESS_HOURS.close;
    }

    function showToast(message) {
        let toast = document.getElementById('bookingToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'bookingToast';
            toast.className = 'booking-toast';
            toast.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span class="booking-toast-message"></span>';
            document.body.appendChild(toast);
        }

        toast.querySelector('.booking-toast-message').textContent = message;
        toast.classList.add('show');

        setTimeout(function () {
            toast.classList.remove('show');
        }, 4000);
    }

    function clearForm() {
        form.reset();

        document.querySelectorAll('.form-error').forEach(function (el) {
            el.classList.remove('is-visible');
        });

        document.querySelectorAll('.form-group').forEach(function (el) {
            el.classList.remove('has-error');
        });

        document.querySelectorAll('.step-indicator').forEach(function (el) {
            el.classList.remove('active', 'completed');
        });

        const firstStep = document.getElementById('stepIndicator1');
        if (firstStep) firstStep.classList.add('active');
    }

    submitBtn.addEventListener('click', function (e) {
        const dateValue = document.getElementById('bookingDate').value;
        const timeValue = getSelectedTime();

        if (isSunday(dateValue)) {
            e.preventDefault();
            showToast('We are closed on Sundays. Please select a different day.');
            return;
        }

        if (isHoliday(dateValue)) {
            e.preventDefault();
            showToast('We are closed on ' + getHolidayName(dateValue) + '. Please select a different day.');
            return;
        }

        if (timeValue && !isWithinBusinessHours(timeValue)) {
            e.preventDefault();
            showToast('Please select a time between 9:00 AM and 5:00 PM.');
            return;
        }

        if (!isFormComplete()) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        const message = buildMessage();
        const whatsappUrl = 'https://wa.me/' + WHATSAPP_CONFIG.phoneNumber + '?text=' + message;
        window.open(whatsappUrl, '_blank');

        clearForm();
    });
})();



/* ============================================
APPOINTMENT SUMMARY — Live Updates
============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Form inputs
    var serviceSelect = document.getElementById('bookingService');
    var stylistSelect = document.getElementById('bookingStylist');
    var dateInput = document.getElementById('bookingDate');

    // Summary value elements
    var summaryValueService = document.getElementById('summaryValueService');
    var summaryValueStylist = document.getElementById('summaryValueStylist');
    var summaryValueDate = document.getElementById('summaryValueDate');
    var summaryValueTime = document.getElementById('summaryValueTime');
    var summaryValuePrice = document.getElementById('summaryValuePrice');

    // Summary item containers
    var summaryItemService = document.getElementById('summaryItemService');
    var summaryItemStylist = document.getElementById('summaryItemStylist');
    var summaryItemDate = document.getElementById('summaryItemDate');
    var summaryItemTime = document.getElementById('summaryItemTime');
    var summaryItemPrice = document.getElementById('summaryItemPrice');

    // Exit if summary not on this page
    if (!summaryValueService) return;

    // Service prices
    var SERVICE_PRICES = {
        'Haircut': 'KSh 1,000',
        'Hair Coloring': 'KSh 3,500',
        'Braiding': 'KSh 2,500',
        'Hair Treatment': 'KSh 2,000',
        'Makeup': 'KSh 2,500',
        'Lashes': 'KSh 3,000',
        'Manicure': 'KSh 1,200',
        'Pedicure': 'KSh 1,500',
        'Luxury Shave': 'KSh 1,200',
        'Beard Grooming': 'KSh 800'
    };

    function formatDate(dateString) {
        if (!dateString) return 'Pick a date';
        var date = new Date(dateString + 'T00:00:00');
        var options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function updateItem(itemEl, valueEl, value, defaultText) {
        if (!itemEl || !valueEl) return;
        if (value && value !== '') {
            valueEl.textContent = value;
            itemEl.classList.add('is-populated');
        } else {
            valueEl.textContent = defaultText;
            itemEl.classList.remove('is-populated');
        }
    }

    function getSelectedTime() {
        var selected = document.querySelector('input[name="time"]:checked');
        return selected ? selected.value : '';
    }

    function updateSummary() {
        var service = serviceSelect ? serviceSelect.value : '';
        var stylist = stylistSelect ? stylistSelect.value : '';
        var date = dateInput ? dateInput.value : '';
        var time = getSelectedTime();

        updateItem(summaryItemService, summaryValueService, service, 'Select a service');
        updateItem(summaryItemStylist, summaryValueStylist, stylist, 'Select a stylist');
        updateItem(summaryItemDate, summaryValueDate, formatDate(date), 'Pick a date');
        updateItem(summaryItemTime, summaryValueTime, time, 'Select time');

        var price = service ? (SERVICE_PRICES[service] || 'KSh 0') : '';
        if (price && summaryValuePrice && summaryItemPrice) {
            summaryValuePrice.textContent = price;
            summaryItemPrice.classList.add('is-populated');
        } else if (summaryValuePrice && summaryItemPrice) {
            summaryValuePrice.textContent = '—';
            summaryItemPrice.classList.remove('is-populated');
        }
    }

    // Attach event listeners
    if (serviceSelect) {
        serviceSelect.addEventListener('change', updateSummary);
    }
    if (stylistSelect) {
        stylistSelect.addEventListener('change', updateSummary);
    }
    if (dateInput) {
        dateInput.addEventListener('change', updateSummary);
    }

    var timeInputs = document.querySelectorAll('input[name="time"]');
    for (var i = 0; i < timeInputs.length; i++) {
        timeInputs[i].addEventListener('change', updateSummary);
    }

    // Run once on load
    updateSummary();
});
