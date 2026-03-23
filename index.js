// WoodCraft Premium Interactivity — Fixed & Enhanced

document.addEventListener('DOMContentLoaded', () => {

    // ── 0. Lenis Smooth Scroll ──────────────────────────────────
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    // ── 0.25 Header Scroll Effect ───────────────────────────────
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ── 0.5 Smooth Anchor Scroll ────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(target, { offset: -80, duration: 1.4 });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Close mobile nav if open
            closeMobileNav();
        });
    });

    // ── 1. Mobile Hamburger Nav ─────────────────────────────────
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('mobileNavOverlay');

    function openMobileNav() {
        navLinks && navLinks.classList.add('open');
        hamburgerBtn && hamburgerBtn.classList.add('open');
        navOverlay && navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        navLinks && navLinks.classList.remove('open');
        hamburgerBtn && hamburgerBtn.classList.remove('open');
        navOverlay && navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('open')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });
    }

    if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);

    // ── 2. Hero Slide Carousel ──────────────────────────────────
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.slider-indicators .indicator');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0 && indicators.length === slides.length) {
        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }
        slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide(i);
                slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
            });
        });
    }

    // ── 3. Odometer ─────────────────────────────────────────────
    document.querySelectorAll('.odometer').forEach(odo => {
        const targetString = odo.getAttribute('data-target') || '0';
        const digits = targetString.split('');
        odo.innerHTML = '';
        digits.forEach((digit, index) => {
            const digitEl = document.createElement('div');
            digitEl.className = 'odometer-digit';
            for (let i = 0; i <= 9; i++) {
                const span = document.createElement('span');
                span.innerText = i;
                digitEl.appendChild(span);
            }
            odo.appendChild(digitEl);
            const height = window.innerWidth <= 768 ? 40 : 60;
            setTimeout(() => {
                digitEl.style.transform = `translateY(${-digit * height}px)`;
            }, 800 + (index * 120));
        });
    });

    // ── 4. Scroll Reveal ────────────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-center, .divider');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    // ── 5. Custom Cursor (desktop only) ─────────────────────────
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if (dot && outline && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;
            outline.animate(
                { left: `${e.clientX}px`, top: `${e.clientY}px` },
                { duration: 500, fill: 'forwards' }
            );
        });
        document.querySelectorAll('a, button, .card, .premium-card, .bento-item, .marquee-item, input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => {
                outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                outline.style.background = 'rgba(37, 99, 235, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                outline.style.transform = 'translate(-50%, -50%) scale(1)';
                outline.style.background = 'transparent';
            });
        });
    }

    // ── 6. Parallax ─────────────────────────────────────────────
    if (window.innerWidth > 768) {
        const parallaxImages = document.querySelectorAll('.parallax-img, .hero-video-bg');
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxImages.forEach(img => {
                const rect = img.parentElement.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.top > -rect.height) {
                    img.style.transform = `translateY(${(scrolled - img.parentElement.offsetTop) * 0.4}px)`;
                }
            });
        });
    }

    // ── 7. Product Modal ─────────────────────────────────────────
    const productData = {
        'plywood': { tag: 'Premium', title: 'Plywood', description: 'Our premium plywood is manufactured using the finest hardwood veneers, bonded together with high-grade phenol formaldehyde resin. This multi-layered construction provides exceptional strength, durability, and resistance to moisture and termites.', material: 'Multiple layers of hardwood veneers cross-laminated and bonded with phenol formaldehyde or melamine resin under high pressure.', uses: 'Furniture frames, kitchen cabinets, wardrobes, partition walls, door panels, false ceilings, and load-bearing structural work.', features: ['Moisture Resistant', 'Termite Proof', 'High Load Capacity', 'Multi-Layer Strength', 'ISI Certified'] },
        'mdf': { tag: 'Industrial', title: 'MDF (Medium Density Fiberboard)', description: 'MDF is engineered from fine wood fibers bonded with synthetic resin under extreme heat and pressure. The result is an ultra-smooth, uniform board ideal for CNC routing and achieving flawless painted finishes.', material: 'Fine wood fibers combined with urea-formaldehyde resin, compressed at high temperature.', uses: 'CNC-cut decorative panels, shelving units, speaker cabinets, display fixtures, modular furniture, wall cladding.', features: ['Ultra-Smooth Surface', 'CNC Compatible', 'Uniform Density', 'No Grain Pattern', 'Easy to Paint'] },
        'particle-boards': { tag: 'Modern', title: 'Particle Boards', description: 'Particle boards are economical yet effective boards made by compressing wood chips and sawmill residues with adhesive resin. They offer a lightweight and cost-effective solution for interior furnishing.', material: 'Wood chips, sawdust, and wood shavings bonded with urea-formaldehyde resin, pressed into dense uniform sheets.', uses: 'Ready-to-assemble furniture, office partitions, countertops, TV units, shoe racks, storage cabinets.', features: ['Lightweight', 'Cost-Effective', 'Smooth Finish', 'Easy Lamination', 'Eco-Friendly'] },
        'liner-mica': { tag: 'Finish', title: 'Liner Mica', description: 'Liner mica is a high-pressure laminate made from multiple layers of kraft paper impregnated with melamine resin. It serves as a clean, protective internal lining for furniture.', material: 'Kraft paper layers saturated with melamine resin, compressed under high temperature and pressure.', uses: 'Internal lining of wardrobes, kitchen cabinets, drawer interiors, shoe racks.', features: ['Moisture Protection', 'Scratch Resistant', 'Clean Finish', 'Anti-Bacterial', 'Easy to Maintain'] },
        'color-mica': { tag: 'Decor', title: 'Color Mica (Decorative Laminate)', description: 'Color mica is a decorative high-pressure laminate that combines stunning surface aesthetics with exceptional durability. Available in hundreds of colors, patterns, and wood-grain textures.', material: 'Decorative printed paper with a melamine resin overlay, backed by multiple kraft paper layers bonded with phenolic resin under high pressure.', uses: 'Countertops, dining tables, wardrobe shutters, study tables, reception desks, wall panels.', features: ['Vibrant Colors', 'Scratch Resistant', 'Heat Resistant', 'UV Stable', 'Wide Range of Designs'] },
        'painting': { tag: 'Service', title: 'Professional Painting', description: 'Expert spray painting, PU finishing, and wood staining. Using industrial-grade spray booths and precision equipment, we deliver mirror-smooth finishes.', material: 'PU coatings, NC lacquers, acrylic paints, wood stains applied with professional HVLP spray guns.', uses: 'Furniture finishing, kitchen shutter painting, door refinishing, antique restoration, custom color matching.', features: ['Mirror Finish', 'Spray Booth Process', 'Custom Colors', 'Durable Coating', 'Fast Turnaround'] },
        'cutting': { tag: 'Precision', title: 'Precision Cutting', description: 'Computerized panel processing using state-of-the-art beam saws and sliding table saws for dimensionally accurate cuts every time.', material: 'Industrial beam saws and sliding table panel saws with tungsten carbide blades and digital measurement systems.', uses: 'Custom panel sizing for furniture production, kitchen module cutting, wardrobe component processing.', features: ['Computerized Accuracy', 'Zero Chipping', 'Batch Processing', 'Custom Dimensions', 'Minimal Waste'] },
        'edge-banding': { tag: 'Finish', title: 'Edge Banding', description: 'Edge banding seals exposed board edges with a smooth, protective strip — creating a clean finished look while preventing moisture ingress and delamination.', material: 'PVC or ABS edge strips applied with hot-melt EVA adhesive using automated edge banding machines.', uses: 'Finishing exposed edges of plywood, MDF, and particle board in kitchen cabinets, office desks, shelving.', features: ['Seamless Finish', 'Moisture Seal', 'Color Matched', 'Anti-Delamination', 'Automated Process'] },
        'cnc-work': { tag: 'CNC', title: 'CNC Routing & Carving', description: 'CNC routing transforms digital designs into precision-carved physical panels. From intricate jali patterns and 3D relief carvings to clean letter-cutting.', material: 'CNC router machines with multi-axis cutting heads, carbide end mills and ball-nose bits.', uses: 'Decorative wall panels, partition screens, signage, 3D lettering, furniture detailing, temple carvings.', features: ['Digital Precision', '3D Carving', 'Complex Patterns', 'Repeatable Quality', 'Fast Production'] },
        'home-interiors': { tag: 'Residential', title: 'Home Interiors', description: 'Complete residential interior solutions that transform your house into a personalized dream home. From concept to completion.', material: 'Premium marine plywood, BWR plywood, HDHMR boards, laminates, glass, acrylic, PU-finished panels.', uses: 'Living room TV units, master bedroom wardrobes, kids rooms, pooja rooms, dining areas, modular kitchens.', features: ['Custom Design', 'Space Optimization', '3D Visualization', 'Premium Finish', 'End-to-End Execution'] },
        'office-spaces': { tag: 'Corporate', title: 'Office Interiors', description: 'Commercial interior solutions create productive, modern workspaces that inspire collaboration and efficiency.', material: 'Commercial-grade plywood, HDHMR boards, laminated MDF, frosted glass partitions, acoustic panels.', uses: 'Open-plan workstations, private cabins, conference rooms, reception counters, break rooms.', features: ['Brand Integration', 'Ergonomic Design', 'Acoustic Planning', 'Cable Management', 'Scalable Layout'] },
        'school-interiors': { tag: 'Education', title: 'School & Educational Interiors', description: 'Safe, stimulating learning environments that enhance focus, creativity, and well-being.', material: 'High-durability laminated plywood, rounded-edge MDF panels, anti-bacterial laminates, non-toxic paints.', uses: 'Classrooms, science labs, libraries, activity rooms, staff rooms, corridors, auditoriums.', features: ['Child-Safe Materials', 'Colorful Design', 'Durable Build', 'Easy Maintenance', 'Interactive Zones'] },
        'modular-kitchens': { tag: 'Modular', title: 'Modular Kitchens', description: 'Modular kitchen systems combine sleek aesthetics with maximum functionality. Every cabinet factory-built for precision fit.', material: 'BWR marine plywood carcass, laminated or acrylic shutters, granite or quartz countertops, soft-close hardware.', uses: 'Complete kitchen cabinetry, island counters, breakfast bars, pantry units, built-in appliance enclosures.', features: ['Factory Precision', 'Soft-Close Hardware', 'Water Resistant', 'Multiple Layouts', '10-Year Warranty'] }
    };

    const modalOverlay = document.getElementById('productModal');
    const modalCard = modalOverlay ? modalOverlay.querySelector('.product-modal') : null;
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalMaterial = document.getElementById('modalMaterial');
    const modalUses = document.getElementById('modalUses');
    const modalFeatures = document.getElementById('modalFeatures');

    if (modalCard) {
        modalCard.addEventListener('wheel', e => e.stopPropagation(), { passive: true });
        modalCard.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });
    }

    document.querySelectorAll('.premium-card[data-product]').forEach(card => {
        card.addEventListener('click', () => {
            const data = productData[card.getAttribute('data-product')];
            if (!data) return;
            const cardImg = card.querySelector('.card-img');
            modalImage.src = cardImg ? cardImg.src : '';
            modalImage.alt = data.title;
            modalTag.textContent = data.tag;
            modalTitle.textContent = data.title;
            modalDesc.textContent = data.description;
            modalMaterial.textContent = data.material;
            modalUses.textContent = data.uses;
            modalFeatures.innerHTML = '';
            data.features.forEach(feat => {
                const li = document.createElement('li');
                li.textContent = feat;
                modalFeatures.appendChild(li);
            });
            if (modalCard) modalCard.scrollTop = 0;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        });
    });

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
    }
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // ── 8. Reviews Scroll Stack ─────────────────────────────────
    const stackCards = Array.from(document.querySelectorAll('.scroll-stack-card'));
    const stackEndElement = document.querySelector('.scroll-stack-end');

    if (stackCards.length > 0 && stackEndElement && lenis && window.innerWidth > 768) {
        const itemStackDistance = 30;
        const baseScale = 0.85;
        const itemScale = 0.03;
        let cardData = [];
        let stackEndTop = 0;
        let isUpdating = false;

        const getAbsoluteTop = (el) => {
            let top = 0;
            while (el) { top += el.offsetTop; el = el.offsetParent; }
            return top;
        };

        const calculateProgress = (scrollTop, start, end) => {
            if (scrollTop < start) return 0;
            if (scrollTop > end) return 1;
            return (scrollTop - start) / (end - start);
        };

        const updateCachedPositions = () => {
            const oldTransforms = stackCards.map(c => c.style.transform);
            stackCards.forEach(c => c.style.transform = 'none');
            cardData = stackCards.map(card => ({ el: card, originalTop: getAbsoluteTop(card) }));
            stackEndTop = getAbsoluteTop(stackEndElement);
            stackCards.forEach((c, i) => c.style.transform = oldTransforms[i]);
            updateCardTransforms();
        };

        const updateCardTransforms = () => {
            if (isUpdating) return;
            isUpdating = true;
            if (window.innerWidth <= 768) {
                cardData.forEach(d => d.el.style.transform = '');
                isUpdating = false;
                return;
            }
            const scrollTop = window.scrollY;
            const containerHeight = window.innerHeight;
            const stackPositionPx = 0.2 * containerHeight;
            const scaleEndPositionPx = 0.1 * containerHeight;

            cardData.forEach((data, i) => {
                const cardTop = data.originalTop;
                const triggerStart = cardTop - stackPositionPx - (itemStackDistance * i);
                const triggerEnd = cardTop - scaleEndPositionPx;
                const pinStart = triggerStart;
                const pinEnd = stackEndTop - containerHeight / 2;
                const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
                const targetScale = baseScale + (i * itemScale);
                const scale = 1 - (scaleProgress * (1 - targetScale));
                let translateY = 0;
                if (scrollTop >= pinStart && scrollTop <= pinEnd) {
                    translateY = scrollTop - cardTop + stackPositionPx + (itemStackDistance * i);
                } else if (scrollTop > pinEnd) {
                    translateY = pinEnd - cardTop + stackPositionPx + (itemStackDistance * i);
                }
                data.el.style.transform = `translate3d(0, ${Math.round(translateY * 100) / 100}px, 0) scale(${Math.round(scale * 1000) / 1000})`;
            });
            isUpdating = false;
        };

        updateCachedPositions();
        lenis.on('scroll', updateCardTransforms);
        window.addEventListener('resize', updateCachedPositions);
        setTimeout(updateCachedPositions, 500);
    }

    // ── 9. Gallery Filter ────────────────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                masonryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        item.classList.add('reveal');
                        setTimeout(() => item.classList.add('visible'), 50);
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('visible');
                    }
                });
            });
        });
    }

    // ── 10. Lightbox ─────────────────────────────────────────────
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightboxOverlay) {
        document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                lightboxImage.src = trigger.getAttribute('data-src');
                lightboxCaption.textContent = trigger.getAttribute('data-caption');
                lightboxOverlay.classList.add('active');
                if (lenis) lenis.stop();
            });
        });
        const closeLightbox = () => {
            lightboxOverlay.classList.remove('active');
            if (lenis) lenis.start();
        };
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', e => { if (e.target === lightboxOverlay) closeLightbox(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) closeLightbox();
        });
    }

    // ── 11. Product Carousel (Mobile only) ──────────────────────
    const MOBILE_BP = 768;
    const AUTO_DELAY = 3200;

    function initCarousel(wrapper) {
        const track = wrapper.querySelector('.carousel-track');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        if (!track || !dotsContainer) return;

        const cards = Array.from(track.children);
        const total = cards.length;
        if (total < 2) return;

        let current = 0;
        let autoTimer = null;
        let isDragging = false;
        let startX = 0;
        let dragDelta = 0;
        let currentOffset = 0;

        // Prev / Next buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn prev';
        prevBtn.innerHTML = '&#8592;';
        prevBtn.setAttribute('aria-label', 'Previous');

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn next';
        nextBtn.innerHTML = '&#8594;';
        nextBtn.setAttribute('aria-label', 'Next');

        wrapper.appendChild(prevBtn);
        wrapper.appendChild(nextBtn);

        // Build dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

        function getOffset(index) {
            let offset = 0;
            const gap = parseFloat(getComputedStyle(track).gap) || 16;
            // Account for track's left padding (20px on mobile)
            const trackPaddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
            if (index === 0) return 0; // first card — no offset, stay at padding start
            for (let i = 0; i < index; i++) {
                offset += cards[i].getBoundingClientRect().width + gap;
            }
            return offset;
        }

        function goTo(index, animate = true) {
            current = Math.max(0, Math.min(index, total - 1));
            currentOffset = getOffset(current);
            track.style.transition = animate
                ? 'transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                : 'none';
            track.style.transform = `translateX(-${currentOffset}px)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === total - 1;
        }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => goTo(current >= total - 1 ? 0 : current + 1), AUTO_DELAY);
        }
        function stopAuto() { clearInterval(autoTimer); autoTimer = null; }

        prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
        nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

        // Touch / Mouse drag
        function dragStart(x) {
            isDragging = true; startX = x; dragDelta = 0;
            track.classList.add('dragging'); stopAuto();
        }
        function dragMove(x) {
            if (!isDragging) return;
            dragDelta = x - startX;
            track.style.transition = 'none';
            track.style.transform = `translateX(${-currentOffset + dragDelta}px)`;
        }
        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('dragging');
            if (dragDelta < -50) goTo(current + 1);
            else if (dragDelta > 50) goTo(current - 1);
            else goTo(current);
            startAuto();
        }

        track.addEventListener('touchstart', e => dragStart(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchmove', e => dragMove(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchend', dragEnd);
        track.addEventListener('mousedown', e => dragStart(e.clientX));
        track.addEventListener('mousemove', e => dragMove(e.clientX));
        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('mouseleave', dragEnd);

        wrapper.addEventListener('mouseenter', stopAuto);
        wrapper.addEventListener('mouseleave', startAuto);
        document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());

        goTo(0, false);
        startAuto();
    }

    // Only init carousels on mobile
    if (window.innerWidth <= MOBILE_BP) {
        document.querySelectorAll('.carousel-wrapper').forEach(initCarousel);
    }

});