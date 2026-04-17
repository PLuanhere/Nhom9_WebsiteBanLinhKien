//SECTION
document.addEventListener("DOMContentLoaded", function () {
    const mainImg = document.querySelector('.main-img');
    const thumbContainer = document.querySelector('.thumbs');
    const thumbnails = document.querySelectorAll('.thumbs img');

    if (!mainImg || thumbnails.length === 0) return;

    let currentIndex = 0;
    let autoPlayTimer;

    const galleryWrapper = document.querySelector('.product-gallery');
    galleryWrapper.style.position = 'relative';

    const controls = document.createElement('div');
    controls.style.cssText = `
        position: absolute;
        top: 40%;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
        padding: 0 10px;
        z-index: 10;
    `;

    const btnStyle = `
        background: rgba(0, 209, 255, 0.6);
        color: white;
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.3s;
    `;

    controls.innerHTML = `
        <button id="prevBtn" style="${btnStyle}">❮</button>
        <button id="nextBtn" style="${btnStyle}">❯</button>
    `;
    galleryWrapper.appendChild(controls);

    // Bat tu dong chay carousel anh chi tiet san pham //
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(() => {
            updateActiveSlide(currentIndex + 1);
        }, 3000);
    }

    // Dung tu dong chay carousel khi can tam ngung //
    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }

    // Cap nhat slide dang active va trang thai thumbnail //
    function updateActiveSlide(index) {
        if (index < 0) index = thumbnails.length - 1;
        if (index >= thumbnails.length) index = 0;

        currentIndex = index;
        mainImg.src = thumbnails[currentIndex].src;

        thumbnails.forEach((img, i) => {
            if (i === currentIndex) {
                img.style.borderColor = "var(--mau-nhan)";
                img.style.transform = "translateY(-2px)";
                img.style.opacity = "1";
            } else {
                img.style.borderColor = "var(--vien)";
                img.style.transform = "translateY(0)";
                img.style.opacity = "0.6";
            }
        });
    }

    document.getElementById('nextBtn').addEventListener('click', function (e) {
        e.preventDefault();
        updateActiveSlide(currentIndex + 1);
        startAutoPlay();
    });

    document.getElementById('prevBtn').addEventListener('click', function (e) {
        e.preventDefault();
        updateActiveSlide(currentIndex - 1);
        startAutoPlay();
    });

    thumbnails.forEach((img, i) => {
        img.addEventListener('click', function () {
            updateActiveSlide(i);
            startAutoPlay();
        });
    });

    galleryWrapper.addEventListener('mouseenter', stopAutoPlay);
    galleryWrapper.addEventListener('mouseleave', startAutoPlay);

    updateActiveSlide(0);
    startAutoPlay();
});