/* ============================================
   STYLIST-PROFILE.JS — Dynamic Profile Data
   ============================================ */

(function () {
    'use strict';

    /* ----------------------------------------
       Stylist Data
       ---------------------------------------- */
    const stylistsData = {
        'sarah-mitchell': {
            name: 'Sarah Mitchell',
            title: 'Senior Stylist & Colorist',
            image: 'https://i.pinimg.com/736x/7b/03/5a/7b035adcae897be97f944cd0c8220440.jpg',
            badge: { text: 'Top Rated', class: 'profile-badge--accent' },
            rating: { stars: '★★★★★', score: '4.9', count: '342 reviews' },
            bio: '12 years of precision cutting and balayage mastery. Sarah\'s clients travel across Nairobi for her signature layered cuts and natural-looking color work. She specializes in creating low-maintenance styles that grow out beautifully.',
            specialties: ['Haircuts', 'Color', 'Balayage', 'Highlights'],
            meta: [
                { icon: 'fas fa-briefcase', text: '12 years experience' },
                { icon: 'fas fa-calendar-check', text: 'Next available: Today 2PM' }
            ],
            stats: { experience: '12', clients: '2,400+', reviews: '342', rating: '4.9' },
            services: [
                { name: 'Precision Haircut', duration: '45 min', price: '$45', desc: 'Custom cut tailored to your face shape and hair texture.' },
                { name: 'Balayage', duration: '120 min', price: '$120', desc: 'Hand-painted highlights for a natural, sun-kissed look.' },
                { name: 'Root Touch-Up', duration: '60 min', price: '$65', desc: 'Seamless color refresh for grown-out roots.' }
            ],
            reviews: [
                { name: 'Amanda K.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '2 weeks ago', text: 'Sarah understood exactly what I wanted and delivered beyond my expectations. My hair has never looked better!', service: 'Precision Haircut' },
                { name: 'Leila N.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '1 week ago', text: 'My balayage looks absolutely stunning. Sarah is a true artist with color. Already booked my next appointment.', service: 'Balayage' }
            ]
        },
        'james-kimani': {
            name: 'James Kimani',
            title: 'Master Barber & Grooming',
            image: 'https://i.pinimg.com/736x/8d/b8/b1/8db8b1198600984ac455f10b041f2fb3.jpg',
            badge: null,
            rating: { stars: '★★★★★', score: '4.9', count: '287 reviews' },
            bio: 'The fade specialist. James combines classic barbering with modern techniques for the cleanest cuts in the city. His attention to detail and relaxing chair-side manner keeps clients coming back every time.',
            specialties: ['Fades', 'Beard', 'Texture', 'Hot Towel'],
            meta: [
                { icon: 'fas fa-briefcase', text: '10 years experience' },
                { icon: 'fas fa-calendar-check', text: 'Next available: Tomorrow 10AM' }
            ],
            stats: { experience: '10', clients: '1,800+', reviews: '287', rating: '4.9' },
            services: [
                { name: 'Classic Fade', duration: '30 min', price: '$35', desc: 'Clean fade with precision lineup and neck shave.' },
                { name: 'Beard Grooming', duration: '25 min', price: '$30', desc: 'Shape, trim, and condition for a polished look.' },
                { name: 'Full Service', duration: '60 min', price: '$55', desc: 'Haircut, beard, hot towel, and facial massage.' }
            ],
            reviews: [
                { name: 'Brian O.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '3 days ago', text: 'Finally found a barber who understands fades. James gave me the cleanest cut I\'ve had in years. Five stars all the way.', service: 'Classic Fade' },
                { name: 'Marcus T.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '1 month ago', text: 'James is my go-to stylist — he knows exactly how to handle my hair type. The hot towel treatment is the best part.', service: 'Full Service' }
            ]
        },
        'maria-lopez': {
            name: 'Maria Lopez',
            title: 'Creative Color Director',
            image: 'https://i.pinimg.com/736x/29/d7/d2/29d7d26db9ae3de70d1b196b4f6cc138.jpg',
            badge: { text: 'Color Expert', class: 'profile-badge--color' },
            rating: { stars: '★★★★★', score: '5.0', count: '198 reviews' },
            bio: 'From subtle highlights to full transformations, Maria\'s color work is artistry. Trained in London and Milan, she brings international techniques to Nairobi. Her creative color work has been featured in local fashion magazines.',
            specialties: ['Color', 'Highlights', 'Creative', 'Correction'],
            meta: [
                { icon: 'fas fa-briefcase', text: '15 years experience' },
                { icon: 'fas fa-calendar-check', text: 'Next available: Today 4PM' }
            ],
            stats: { experience: '15', clients: '3,100+', reviews: '198', rating: '5.0' },
            services: [
                { name: 'Full Color', duration: '90 min', price: '$85', desc: 'Complete color transformation with premium products.' },
                { name: 'Highlights', duration: '75 min', price: '$75', desc: 'Dimensional highlights for depth and movement.' },
                { name: 'Color Correction', duration: '180 min', price: '$180', desc: 'Fix color mishaps and restore hair health.' }
            ],
            reviews: [
                { name: 'Priya S.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '3 weeks ago', text: 'Maria transformed my hair color completely. I was nervous about going blonde but she walked me through every step.', service: 'Full Color' },
                { name: 'Chloe W.', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '2 months ago', text: 'Maria took my brassy blonde to a gorgeous ash tone. Worth every shilling.', service: 'Color Correction' }
            ]
        },
        'david-reynolds': {
            name: 'David Reynolds',
            title: 'Skin & Facial Specialist',
            image: 'https://i.pinimg.com/1200x/af/81/40/af8140c23e95c734c640b03d40f1fc25.jpg',
            badge: null,
            rating: { stars: '★★★★★', score: '4.8', count: '156 reviews' },
            bio: 'Certified esthetician with a focus on anti-aging treatments and personalized skincare routines. David creates bespoke facial experiences that address your unique skin concerns while providing deep relaxation.',
            specialties: ['Facial', 'Anti-Aging', 'Peels', 'Acne'],
            meta: [
                { icon: 'fas fa-briefcase', text: '8 years experience' },
                { icon: 'fas fa-calendar-check', text: 'Next available: Wed 11AM' }
            ],
            stats: { experience: '8', clients: '1,200+', reviews: '156', rating: '4.8' },
            services: [
                { name: 'Anti-Aging Facial', duration: '75 min', price: '$85', desc: 'Targeted treatment to reduce fine lines and restore elasticity.' },
                { name: 'Deep Cleanse', duration: '60 min', price: '$70', desc: 'Thorough pore cleansing with extractions and mask.' },
                { name: 'Chemical Peel', duration: '45 min', price: '$95', desc: 'Professional-grade peel for skin renewal and glow.' }
            ],
            reviews: [
                { name: 'Zara M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '5 days ago', text: 'My skin has never looked clearer. David customized the treatment perfectly.', service: 'Deep Cleanse' },
                { name: 'Amina H.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '6 days ago', text: 'The anti-aging facial is a game changer. My skin is glowing and fine lines have visibly reduced.', service: 'Anti-Aging Facial' }
            ]
        },
        'amina-hassan': {
            name: 'Amina Hassan',
            title: 'Nail Artist & Manicurist',
            image: 'https://i.pinimg.com/1200x/fc/22/a8/fc22a838dbad7251f1569bdbbe26143b.jpg',
            badge: null,
            rating: { stars: '★★★★★', score: '4.9', count: '210 reviews' },
            bio: 'Precision nail art and long-lasting manicures. Amina\'s gel work lasts weeks without a single chip. She stays on top of global nail trends and brings the latest techniques to every appointment.',
            specialties: ['Manicure', 'Gel', 'Nail Art', 'Extensions'],
            meta: [
                { icon: 'fas fa-briefcase', text: '7 years experience' },
                { icon: 'fas fa-calendar-check', text: 'Next available: Today 3PM' }
            ],
            stats: { experience: '7', clients: '1,500+', reviews: '210', rating: '4.9' },
            services: [
                { name: 'Gel Manicure', duration: '45 min', price: '$40', desc: 'Long-lasting gel polish with cuticle care.' },
                { name: 'Nail Art', duration: '60 min', price: '$55', desc: 'Custom designs with premium pigments and gems.' },
                { name: 'Acrylic Extensions', duration: '90 min', price: '$70', desc: 'Full set with shaping and polish of your choice.' }
            ],
            reviews: [
                { name: 'Leila N.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '1 week ago', text: 'My manicure lasted three weeks without a single chip. Amina\'s attention to detail is unmatched.', service: 'Gel Manicure' },
                { name: 'Zara M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '2 weeks ago', text: 'The nail art was incredible. Amina recreated a design I found online perfectly.', service: 'Nail Art' }
            ]
        },
        'zara-mensah': {
            name: 'Zara Mensah',
            title: 'Event & Bridal Stylist',
            image: 'https://i.pinimg.com/1200x/c9/bc/e6/c9bce6753a72c19c7ab3177d21a737f8.jpg',
            badge: { text: 'Rising Star', class: 'profile-badge--new' },
            rating: { stars: '★★★★★', score: '4.8', count: '89 reviews' },
            bio: 'Up-and-coming talent specializing in bridal and event styling. Zara\'s updos and braids are already booked months ahead. She brings fresh creativity and meticulous attention to every special occasion.',
            specialties: ['Styling', 'Bridal', 'Braids', 'Updos'],
            meta: [
                { icon: 'fas fa-briefcase', text: '4 years experience' },
                { icon: 'fas fa-calendar-check', text: 'Next available: Fri 9AM' }
            ],
            stats: { experience: '4', clients: '600+', reviews: '89', rating: '4.8' },
            services: [
                { name: 'Bridal Styling', duration: '120 min', price: '$150', desc: 'Complete bridal hair with trial session included.' },
                { name: 'Event Updo', duration: '75 min', price: '$85', desc: 'Elegant updo for any special occasion.' },
                { name: 'Braid Styling', duration: '60 min', price: '$65', desc: 'Intricate braids from classic to contemporary.' }
            ],
            reviews: [
                { name: 'Daniel K.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '4 weeks ago', text: 'Had my wedding styling done here. The team went above and beyond. I felt like a million bucks.', service: 'Bridal Styling' },
                { name: 'Chloe W.', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '2 months ago', text: 'Zara created the most beautiful braided updo for my graduation. I got so many compliments.', service: 'Braid Styling' }
            ]
        },
        'brian-ochieng': {
            name: 'Brian Ochieng',
            title: 'Men\'s Grooming Specialist',
            image: 'https://i.pinimg.com/736x/87/6f/17/876f17717e949338a6518af501d9498c.jpg',
            badge: null,
            rating: { stars: '★★★★★', score: '4.7', count: '134 reviews' },
            bio: 'Classic cuts with a modern edge. Brian\'s attention to detail and relaxing chair-side manner keeps clients coming back. He specializes in textured cuts and beard sculpting for the modern gentleman.',
            specialties: ['Haircuts', 'Beard', 'Hot Towel', 'Texture'],
            meta: [
                { icon: 'fas fa-briefcase', text: '6 years experience' },
                { icon: 'fas fa-calendar-check', text: 'Next available: Thu 2PM' }
            ],
            stats: { experience: '6', clients: '900+', reviews: '134', rating: '4.7' },
            services: [
                { name: 'Classic Cut', duration: '30 min', price: '$35', desc: 'Timeless haircut with modern finishing.' },
                { name: 'Beard Sculpt', duration: '20 min', price: '$25', desc: 'Precision beard shaping and conditioning.' },
                { name: 'Grooming Package', duration: '50 min', price: '$50', desc: 'Cut, beard, and hot towel treatment.' }
            ],
            reviews: [
                { name: 'Brian O.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '1 week ago', text: 'Brian knows exactly how to work with my hair texture. Best barber in Nairobi.', service: 'Classic Cut' },
                { name: 'James K.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '3 weeks ago', text: 'The grooming package is incredible value. Hot towel treatment is pure luxury.', service: 'Grooming Package' }
            ]
        },
        'priya-sharma': {
            name: 'Priya Sharma',
            title: 'Texture & Curl Specialist',
            image: 'https://i.pinimg.com/736x/0b/64/84/0b6484744eb95d207a8434e6beb1740d.jpg',
            badge: null,
            rating: { stars: '★★★★★', score: '4.9', count: '176 reviews' },
            bio: 'Curly hair is her canvas. Priya\'s cutting techniques enhance natural texture while keeping curls healthy and defined. She educates every client on how to maintain their curls between visits.',
            specialties: ['Curls', 'Color', 'Treatments', 'Cuts'],
            meta: [
                { icon: 'fas fa-briefcase', text: '9 years experience' },
                { icon: 'fas fa-calendar-check', text: 'Next available: Tue 1PM' }
            ],
            stats: { experience: '9', clients: '1,700+', reviews: '176', rating: '4.9' },
            services: [
                { name: 'Curly Cut', duration: '50 min', price: '$50', desc: 'Dry cut technique for perfectly shaped curls.' },
                { name: 'Curl Treatment', duration: '45 min', price: '$55', desc: 'Deep conditioning and curl definition treatment.' },
                { name: 'Color for Curls', duration: '105 min', price: '$95', desc: 'Gentle color that respects curl integrity.' }
            ],
            reviews: [
                { name: 'Amanda K.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '2 weeks ago', text: 'Priya transformed my curls. They\'re bouncier and healthier than ever. She taught me a whole new routine.', service: 'Curly Cut' },
                { name: 'Amina H.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face', stars: '★★★★★', date: '1 month ago', text: 'The curl treatment is amazing. My hair was so soft and the definition lasted for weeks.', service: 'Curl Treatment' }
            ]
        }
    };

    /* ----------------------------------------
       Get URL parameter
       ---------------------------------------- */
    function getStylistId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || 'sarah-mitchell';
    }

    /* ----------------------------------------
       Render Profile
       ---------------------------------------- */
    function renderProfile() {
        const id = getStylistId();
        const stylist = stylistsData[id];

        if (!stylist) {
            document.querySelector('.profile-hero-content').innerHTML = '<p style="text-align:center;color:var(--color-text-muted);padding:var(--space-3xl)">Stylist not found. <a href="stylists.html" style="color:var(--color-accent)">View all stylists</a></p>';
            return;
        }

        /* Image & Badge */
        document.getElementById('profile-image').src = stylist.image;
        document.getElementById('profile-image').alt = stylist.name;
        const badgeEl = document.getElementById('profile-badge');
        if (stylist.badge) {
            badgeEl.style.display = '';
            badgeEl.className = 'profile-badge ' + stylist.badge.class;
            document.getElementById('badge-text').textContent = stylist.badge.text;
        } else {
            badgeEl.style.display = 'none';
        }

        /* Name & Rating */
        document.getElementById('profile-name').textContent = stylist.name;
        document.getElementById('profile-rating').innerHTML = `
            <span class="profile-rating-stars">${stylist.rating.stars}</span>
            <span class="profile-rating-score">${stylist.rating.score}</span>
            <span class="profile-rating-count">(${stylist.rating.count})</span>
        `;

        /* Title & Bio */
        document.getElementById('profile-title').textContent = stylist.title;
        document.getElementById('profile-bio').textContent = stylist.bio;

        /* Specialties */
        document.getElementById('profile-specialties').innerHTML = stylist.specialties.map(s =>
            `<span class="profile-specialty-tag">${s}</span>`
        ).join('');

        /* Meta */
        document.getElementById('profile-meta').innerHTML = stylist.meta.map(m =>
            `<div class="profile-meta-item"><i class="${m.icon}"></i><span>${m.text}</span></div>`
        ).join('');

        /* Stats */
        document.getElementById('stat-experience').textContent = stylist.stats.experience;
        document.getElementById('stat-clients').textContent = stylist.stats.clients;
        document.getElementById('stat-reviews').textContent = stylist.stats.reviews;
        document.getElementById('stat-rating').textContent = stylist.stats.rating;

        /* Services */
        document.getElementById('services-name').textContent = stylist.name.split(' ')[0];
        document.getElementById('profile-services-grid').innerHTML = stylist.services.map(s => `
            <div class="profile-service-card">
                <h3 class="profile-service-name">${s.name}</h3>
                <div class="profile-service-duration"><i class="far fa-clock"></i> ${s.duration}</div>
                <div class="profile-service-price">${s.price}</div>
                <p class="profile-service-desc">${s.desc}</p>

                <a href="https://wa.me/254712345678?text=Hi, ${id}. I want to book; %20Service%3A%20${s.name.toLowerCase().replace(/\s+/g, '-')}" class="btn btn-service-book" target="blank">Book This Service</a>
            </div>
        `).join('');

        /* Reviews */
        document.getElementById('profile-reviews-grid').innerHTML = stylist.reviews.map(r => `
            <div class="profile-review-card">
                <div class="profile-review-header">
                    <div class="profile-review-avatar">
                        <img src="${r.avatar}" alt="${r.name}">
                    </div>
                    <div class="profile-review-meta">
                        <div class="profile-review-name">${r.name}</div>
                        <div class="profile-review-rating">
                            <span class="profile-review-stars">${r.stars}</span>
                            <span class="profile-review-date">${r.date}</span>
                        </div>
                    </div>
                </div>
                <div class="profile-review-body">
                    <p>"${r.text}"</p>
                </div>
                <div class="profile-review-service">
                    <span>Service:</span> ${r.service}
                </div>
            </div>
        `).join('');

        /* CTA Name */
        document.getElementById('cta-name').textContent = stylist.name.split(' ')[0];

        /* Update page title */
        document.title = `${stylist.name} — SalonBook`;
    }

    /* ----------------------------------------
       Init
       ---------------------------------------- */
    renderProfile();

})();
