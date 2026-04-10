//SECTION
document.addEventListener("DOMContentLoaded", () => {

    const createNavBtn = (direction, customStyles) => {
        const btn = document.createElement('div');
        btn.innerHTML = direction === 'next' ? '&#10095;' : '&#10094;';
        const defaultStyles = {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            color: '#38bdf8',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '10',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            fontSize: '14px',
            transition: '0.3s'
        };
        Object.assign(btn.style, defaultStyles, customStyles);

        btn.onmouseover = () => { btn.style.backgroundColor = '#38bdf8'; btn.style.color = '#000'; };
        btn.onmouseout = () => { btn.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'; btn.style.color = '#38bdf8'; };
        return btn;
    };

    const setupMainBanner = () => {
        const container = document.querySelector('.main-banner');
        const photo = document.querySelector('.banner-photo');
        const counter = document.querySelector('.banner-counter');
        const photos = ['link_anh_1.jpg', 'link_anh_2.jpg', 'link_anh_3.jpg'];
        let currentIndex = 0;

        const updateBanner = (index) => {
            currentIndex = (index + photos.length) % photos.length;
            photo.style.opacity = 0;
            setTimeout(() => {
                photo.src = photos[currentIndex];
                if (counter) counter.innerText = `${currentIndex + 1}/${photos.length}`;
                photo.style.opacity = 1;
            }, 300);
        };

        setInterval(() => updateBanner(currentIndex + 1), 4000);
        photo.style.transition = 'opacity 0.5s ease';
    };

    const setupDealCarousel = () => {
        const container = document.querySelector('.deal-img-col');
        const mainImg = document.querySelector('.deal-main-img');
        const dots = document.querySelectorAll('.ddot');
        const thumbs = document.querySelectorAll('.deal-thumb');

        const dealImages = ['anh_deal_1.jpg', 'anh_deal_2.jpg', 'anh_deal_3.jpg'];
        let dealIndex = 0;

        const updateDealUI = (index) => {
            dealIndex = (index + dealImages.length) % dealImages.length;
            mainImg.style.transition = 'all 0.4s ease';
            mainImg.src = dealImages[dealIndex];

            dots.forEach((dot, i) => {
                dot.style.backgroundColor = (i === dealIndex) ? '#38bdf8' : '#cbd5e1';
            });
            thumbs.forEach((thumb, i) => {
                thumb.style.borderColor = (i === dealIndex) ? '#38bdf8' : 'transparent';
                thumb.style.borderStyle = 'solid';
                thumb.style.borderWidth = '2px';
            });
        };

        const prev = createNavBtn('prev', { left: '5px', width: '28px', height: '28px' });
        const next = createNavBtn('next', { right: '5px', width: '28px', height: '28px' });

        prev.onclick = (e) => { e.preventDefault(); updateDealUI(dealIndex - 1); };
        next.onclick = (e) => { e.preventDefault(); updateDealUI(dealIndex + 1); };

        if (container) container.append(prev, next);

        dots.forEach((dot, i) => {
            dot.style.cursor = 'pointer';
            dot.onclick = () => updateDealUI(i);
        });

        setInterval(() => updateDealUI(dealIndex + 1), 5000);
    };

    if (document.querySelector('.main-banner')) setupMainBanner();
    if (document.querySelector('.deal-img-col')) setupDealCarousel();
});