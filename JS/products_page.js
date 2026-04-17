//SECTION
document.addEventListener("DOMContentLoaded", function () {
    var DATA_URL = "../data/products.json";
    var ITEMS_PER_PAGE = 12;

    var allProducts = [];
    var currentPage = 1;

    var activeCategory = "all";
    var activeCategoryName = "Tất cả danh mục";

    var sliderMin = 0;
    var sliderMax = 100000000;
    var minPrice = 0;
    var maxPrice = 100000000;

    var grid = document.getElementById("productsGrid");
    var pagination = document.getElementById("productsPagination");
    var toolbarMeta = document.querySelector(".toolbar-meta");
    var sectionTitle = document.querySelector(".shop-toolbar .section-title");
    var sortSelect = document.querySelector(".toolbar-select");

    var categoryLinks = document.querySelectorAll(".filter-links a");
    var ratingCheckboxes = document.querySelectorAll(".rating-filter input[type='checkbox']");

    var priceSlider = document.querySelector(".price-range-slider");
    var priceResetLink = document.querySelector(".reset-link");
    var priceChips = document.querySelectorAll(".price-chips .chip-btn");
    var priceBubbleInput = null;

    var searchInput = null;
    var searchButton = null;
    var searchBox = document.querySelector(".search-box");
    if (searchBox) {
        searchInput = searchBox.querySelector("input");
        searchButton = searchBox.querySelector("button");
    }

    // Chuyen gia tri bat ky ve so, neu khong hop le thi tra ve fallback //
    function toNumber(value, fallback) {
        var n = Number(value);
        if (isNaN(n)) {
            return fallback;
        }
        return n;
    }

    // Gioi han gia tri trong khoang min-max //
    function clamp(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    // Dinh dang so theo chuan hien thi Viet Nam //
    function formatNumber(value) {
        return toNumber(value, 0).toLocaleString("vi-VN");
    }

    // Dinh dang gia tien kem don vi VNĐ //
    function formatPrice(value) {
        return formatNumber(value) + " VNĐ";
    }

    // Chuan hoa chuoi de so sanh tim kiem/phan loai khong dau //
    function normalizeText(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .trim();
    }

    // Anh xa nhan hien thi danh muc sang key xu ly noi bo //
    function getCategoryKeyFromLabel(labelText) {
        var text = normalizeText(labelText).replace(/\s+/g, " ");

        if (text === "tat ca danh muc") return "all";
        if (text === "vi dieu khien") return "vi_dieu_khien";
        if (text === "ic nguon - ic logic") return "ic_nguon_ic_logic";
        if (text === "cam bien") return "cam_bien";
        if (text === "diode - transistor") return "diode_transistor";
        if (text === "dien tro - tu dien") return "dien_tro_tu_dien";
        if (text === "module nguon dc-dc") return "module_nguon_dc_dc";
        if (text === "mach nap - debug") return "mach_nap_debug";

        return "all";
    }

    // Cap nhat tieu de khu vuc san pham theo danh muc dang chon //
    function updateSectionTitle() {
        if (!sectionTitle) return;

        if (activeCategory === "all") {
            sectionTitle.textContent = "TẤT CẢ SẢN PHẨM";
        } else {
            sectionTitle.textContent = "DANH MỤC: " + activeCategoryName.toUpperCase();
        }
    }

    // Danh dau danh muc dang active va dong bo bo loc hien tai //
    function setActiveCategory(link) {
        var i;

        if (!link) return;

        for (i = 0; i < categoryLinks.length; i += 1) {
            categoryLinks[i].classList.remove("active");
        }

        link.classList.add("active");
        activeCategoryName = String(link.textContent || "").trim() || "Tất cả danh mục";
        activeCategory = getCategoryKeyFromLabel(activeCategoryName);
        updateSectionTitle();
    }

    // Kiem tra san pham co thuoc danh muc dang loc hay khong //
    function productPassCategory(product) {
        if (activeCategory === "all") return true;
        if (activeCategory === "vi_dieu_khien") return product.categoryId === "vi_dieu_khien";
        if (activeCategory === "ic_nguon_ic_logic") return product.type === "ic_nguon" || product.type === "ic_logic";
        if (activeCategory === "cam_bien") return product.categoryId === "cam_bien";
        if (activeCategory === "diode_transistor") return product.type === "diode" || product.type === "transistor";
        if (activeCategory === "dien_tro_tu_dien") return product.type === "dien_tro" || product.type === "tu_dien";
        if (activeCategory === "module_nguon_dc_dc") return product.type === "buck" || product.type === "boost" || product.type === "buck_boost";
        if (activeCategory === "mach_nap_debug") return product.categoryId === "ket_noi_phu_kien";
        return true;
    }

    // Chuan hoa diem danh gia ve khoang 0-5 voi 1 chu so thap phan //
    function normalizeRating(value) {
        var r = toNumber(value, 0);
        if (r < 0) r = 0;
        if (r > 5) r = 5;
        return Math.round(r * 10) / 10;
    }

    // Tao HTML hien thi sao danh gia va diem trung binh //
    function createRatingHtml(value) {
        var rating = normalizeRating(value);
        var text = rating.toFixed(1);
        var stars = "";
        var i;
        var level;

        for (i = 0; i < 5; i += 1) {
            level = rating - i;
            if (level >= 0.75) {
                stars += '<i class="fa-solid fa-star" aria-hidden="true"></i>';
            } else if (level >= 0.25) {
                stars += '<i class="fa-solid fa-star-half-stroke" aria-hidden="true"></i>';
            } else {
                stars += '<i class="fa-regular fa-star" aria-hidden="true"></i>';
            }
        }

        return '<div class="catalog-rating" aria-label="Đánh giá ' + text + ' trên 5">'
            + '<span class="catalog-rating-stars">' + stars + '</span>'
            + '<span class="catalog-rating-value">' + text + '/5</span>'
            + '</div>';
    }

    // Chuyen ma trang thai ton kho sang noi dung hien thi //
    function getStockText(status) {
        if (status === "in_stock") return "Còn hàng";
        if (status === "low_stock") return "Sắp hết hàng";
        if (status === "pre_order") return "Đặt trước";
        if (status === "out_of_stock") return "Hết hàng";
        return "Liên hệ";
    }

    // Lay che do sap xep tu dropdown cong cu //
    function getSortMode() {
        if (!sortSelect) return "default";
        if (sortSelect.selectedIndex === 1) return "price-asc";
        if (sortSelect.selectedIndex === 2) return "price-desc";
        return "default";
    }

    // Lay tu khoa tim kiem hien tai trong o search //
    function getKeyword() {
        if (!searchInput) return "";
        return normalizeText(searchInput.value);
    }

    // Doc cac checkbox rating va tao tap quy tac loc danh gia //
    function getRatingRules() {
        var rules = [];
        var i;
        var label;
        var text;

        for (i = 0; i < ratingCheckboxes.length; i += 1) {
            if (!ratingCheckboxes[i].checked) continue;

            label = ratingCheckboxes[i].closest("label");
            text = normalizeText(label ? label.textContent : "").replace(/\s+/g, " ");

            if (text.indexOf("3") !== -1 && text.indexOf("tro xuong") !== -1) {
                rules.push("3-down");
            } else if (text.indexOf("5") !== -1 && text.indexOf("tro len") === -1) {
                rules.push("5");
            } else if (text.indexOf("4") !== -1) {
                rules.push("4-up");
            } else if (text.indexOf("3") !== -1) {
                rules.push("3-up");
            }
        }

        return rules;
    }

    // Kiem tra san pham co dat bo quy tac loc rating hay khong //
    function productPassRating(product, rules) {
        var rating;
        var i;
        var rule;

        if (!rules || rules.length === 0) return true;

        rating = normalizeRating(product.rating);

        for (i = 0; i < rules.length; i += 1) {
            rule = rules[i];
            if (rule === "5" && rating >= 5) return true;
            if (rule === "4-up" && rating >= 4) return true;
            if (rule === "3-up" && rating >= 3) return true;
            if (rule === "3-down" && rating <= 3) return true;
        }

        return false;
    }

    // Bo trang thai active cua tat ca nut chip gia //
    function clearActivePriceChip() {
        var i;
        for (i = 0; i < priceChips.length; i += 1) {
            priceChips[i].classList.remove("active");
        }
    }

    // Cap nhat o bubble hien thi gia tri toi da cua slider gia //
    function updatePriceBubble() {
        var value;
        var percent;
        var range;

        if (!priceSlider || !priceBubbleInput) return;

        value = clamp(toNumber(priceSlider.value, sliderMax), sliderMin, sliderMax);
        priceSlider.value = value;
        priceBubbleInput.value = formatNumber(value);

        range = sliderMax - sliderMin;
        if (range <= 0) {
            percent = 0;
        } else {
            percent = ((value - sliderMin) / range) * 100;
        }

        priceBubbleInput.style.left = percent + "%";
    }

    // Ap dung gia tu slider vao bo loc va render neu duoc yeu cau //
    function applyPriceFromSlider(shouldRender) {
        var value;

        if (!priceSlider) return;

        value = clamp(toNumber(priceSlider.value, sliderMax), sliderMin, sliderMax);
        priceSlider.value = value;

        minPrice = 0;
        maxPrice = value;

        clearActivePriceChip();
        updatePriceBubble();

        if (shouldRender) {
            currentPage = 1;
            renderProducts();
        }
    }

    // Ap dung gia tri duoc nhap truc tiep tren bubble vao slider //
    function applyPriceFromBubble() {
        var raw;
        var value;

        if (!priceBubbleInput || !priceSlider) return;

        raw = String(priceBubbleInput.value || "").replace(/[^0-9]/g, "");
        if (raw === "") {
            value = toNumber(priceSlider.value, sliderMax);
        } else {
            value = toNumber(raw, sliderMax);
        }

        value = clamp(value, sliderMin, sliderMax);
        priceSlider.value = value;
        applyPriceFromSlider(true);
    }

    // Ap dung bo loc gia nhanh khi bam cac chip moc gia //
    function applyPriceChip(button) {
        var text = normalizeText(button.textContent).replace(/\s+/g, " ");

        clearActivePriceChip();
        button.classList.add("active");

        if (text === "duoi 100k") {
            minPrice = 0;
            maxPrice = 100000;
        } else if (text === "100k - 500k") {
            minPrice = 100000;
            maxPrice = 500000;
        } else if (text === "500k - 1tr") {
            minPrice = 500000;
            maxPrice = 1000000;
        } else if (text === "tren 1tr") {
            minPrice = 1000000;
            maxPrice = sliderMax;
        } else {
            minPrice = sliderMin;
            maxPrice = sliderMax;
        }

        if (priceSlider) {
            priceSlider.value = maxPrice;
            updatePriceBubble();
        }

        currentPage = 1;
        renderProducts();
    }

    // Dat lai bo loc gia ve mac dinh toan khoang //
    function resetPriceFilter(shouldRender) {
        minPrice = sliderMin;
        maxPrice = sliderMax;

        clearActivePriceChip();

        if (priceSlider) {
            priceSlider.value = sliderMax;
            updatePriceBubble();
        }

        if (shouldRender) {
            currentPage = 1;
            renderProducts();
        }
    }

    // Tong hop danh sach san pham sau khi loc va sap xep //
    function getFilteredProducts() {
        var result = [];
        var keyword = getKeyword();
        var sortMode = getSortMode();
        var ratingRules = getRatingRules();
        var i;
        var item;

        for (i = 0; i < allProducts.length; i += 1) {
            item = allProducts[i];

            if (!productPassCategory(item)) continue;
            if (item.price < minPrice || item.price > maxPrice) continue;

            if (keyword !== "" && normalizeText(item.name).indexOf(keyword) === -1) {
                continue;
            }

            if (!productPassRating(item, ratingRules)) continue;

            result.push(item);
        }

        if (sortMode === "price-asc") {
            result.sort(function (a, b) {
                return a.price - b.price;
            });
        } else if (sortMode === "price-desc") {
            result.sort(function (a, b) {
                return b.price - a.price;
            });
        }

        return result;
    }

    // Tao HTML card hien thi thong tin mot san pham //
    function createCardHtml(product) {
        var oldPriceHtml = "";

        if (product.oldPrice > product.price) {
            oldPriceHtml = " <span>" + formatPrice(product.oldPrice) + "</span>";
        }

        return ""
            + '<div class="col">'
            + '<a href="ProductDetail.html?id=' + encodeURIComponent(product.id) + '" class="catalog-card">'
            + '<div class="catalog-img"><img src="' + product.image + '" alt="' + product.name + '"></div>'
            + '<h6>' + product.name + '</h6>'
            + createRatingHtml(product.rating)
            + '<p class="catalog-price">' + formatPrice(product.price) + oldPriceHtml + '</p>'
            + '<small>' + getStockText(product.stockStatus) + '</small>'
            + '</a>'
            + '</div>';
    }

    // Render phan trang dua tren tong so trang hien tai //
    function renderPagination(totalPages) {
        var html = "";
        var i;

        if (!pagination) return;

        if (totalPages <= 0) {
            pagination.innerHTML = "";
            return;
        }

        html += '<li class="page-item' + (currentPage === 1 ? ' disabled' : '') + '">'
            + '<a class="page-link" href="#" data-page="' + (currentPage - 1) + '">&lt;</a></li>';

        for (i = 1; i <= totalPages; i += 1) {
            html += '<li class="page-item' + (i === currentPage ? ' active' : '') + '">'
                + '<a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>';
        }

        html += '<li class="page-item' + (currentPage === totalPages ? ' disabled' : '') + '">'
            + '<a class="page-link" href="#" data-page="' + (currentPage + 1) + '">&gt;</a></li>';

        pagination.innerHTML = html;
    }

    // Render luoi san pham va metadata ket qua hien thi //
    function renderProducts() {
        var list;
        var total;
        var totalPages;
        var start;
        var end;
        var html;
        var i;

        if (!grid || !pagination) return;

        list = getFilteredProducts();
        total = list.length;
        totalPages = Math.ceil(total / ITEMS_PER_PAGE);

        if (totalPages === 0) {
            currentPage = 1;
            grid.innerHTML = '<div class="col-12"><div class="text-center py-4" style="color: var(--chu-mo);">Không tìm thấy sản phẩm phù hợp.</div></div>';
            pagination.innerHTML = "";
            if (toolbarMeta) toolbarMeta.textContent = "0 kết quả";
            return;
        }

        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        start = (currentPage - 1) * ITEMS_PER_PAGE;
        end = start + ITEMS_PER_PAGE;
        if (end > total) end = total;

        html = "";
        for (i = start; i < end; i += 1) {
            html += createCardHtml(list[i]);
        }

        grid.innerHTML = html;

        if (toolbarMeta) {
            toolbarMeta.textContent = (start + 1) + "-" + end + " / " + total + " kết quả";
        }

        renderPagination(totalPages);
    }

    // Gan toan bo su kien tuong tac cho bo loc, tim kiem va phan trang //
    function bindEvents() {
        var i;

        if (pagination) {
            pagination.addEventListener("click", function (event) {
                var link = event.target.closest("a.page-link[data-page]");
                var page;

                if (!link) return;

                event.preventDefault();
                page = toNumber(link.getAttribute("data-page"), 1);
                currentPage = page;
                renderProducts();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", function () {
                currentPage = 1;
                renderProducts();
            });
        }

        if (searchButton) {
            searchButton.addEventListener("click", function (event) {
                event.preventDefault();
                currentPage = 1;
                renderProducts();
            });
        }

        if (searchInput) {
            searchInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    currentPage = 1;
                    renderProducts();
                }
            });
        }

        for (i = 0; i < categoryLinks.length; i += 1) {
            categoryLinks[i].addEventListener("click", function (event) {
                event.preventDefault();
                setActiveCategory(this);
                currentPage = 1;
                renderProducts();
            });
        }

        for (i = 0; i < ratingCheckboxes.length; i += 1) {
            ratingCheckboxes[i].addEventListener("change", function () {
                currentPage = 1;
                renderProducts();
            });
        }

        for (i = 0; i < priceChips.length; i += 1) {
            priceChips[i].addEventListener("click", function (event) {
                event.preventDefault();
                applyPriceChip(this);
            });
        }

        if (priceResetLink) {
            priceResetLink.addEventListener("click", function (event) {
                event.preventDefault();
                resetPriceFilter(true);
            });
        }

        if (priceSlider) {
            priceSlider.addEventListener("input", function () {
                applyPriceFromSlider(true);
            });

            priceSlider.addEventListener("change", function () {
                applyPriceFromSlider(true);
            });
        }

        if (priceBubbleInput) {
            priceBubbleInput.addEventListener("focus", function () {
                this.select();
            });

            priceBubbleInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    applyPriceFromBubble();
                    this.blur();
                }
            });

            priceBubbleInput.addEventListener("blur", function () {
                applyPriceFromBubble();
            });
        }

        window.addEventListener("resize", function () {
            updatePriceBubble();
        });
    }

    // Khoi tao slider gia va bubble input di kem //
    function setupPriceSlider() {
        var sliderParent;
        var sliderWrap;

        if (!priceSlider) return;

        sliderMin = toNumber(priceSlider.min, 0);
        sliderMax = toNumber(priceSlider.max, 100000000);

        priceSlider.step = "1";

        sliderParent = priceSlider.parentElement;
        sliderWrap = document.createElement("div");
        sliderWrap.className = "price-slider-wrap";

        sliderParent.insertBefore(sliderWrap, priceSlider);
        sliderWrap.appendChild(priceSlider);

        priceBubbleInput = document.createElement("input");
        priceBubbleInput.type = "text";
        priceBubbleInput.className = "price-bubble-input";
        priceBubbleInput.setAttribute("inputmode", "numeric");
        priceBubbleInput.setAttribute("aria-label", "Giá tối đa");
        sliderWrap.appendChild(priceBubbleInput);

        minPrice = sliderMin;
        maxPrice = sliderMax;
        priceSlider.value = sliderMax;
        updatePriceBubble();
    }

    // Tai du lieu san pham tu JSON va chuan hoa ve mang allProducts //
    function loadProducts() {
        fetch(DATA_URL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Không tải được dữ liệu");
                }
                return response.json();
            })
            .then(function (data) {
                var source = [];
                var i;

                if (Array.isArray(data.discountProducts)) {
                    for (i = 0; i < data.discountProducts.length; i += 1) {
                        source.push(data.discountProducts[i]);
                    }
                }

                if (Array.isArray(data.regularProducts)) {
                    for (i = 0; i < data.regularProducts.length; i += 1) {
                        source.push(data.regularProducts[i]);
                    }
                }

                allProducts = [];
                for (i = 0; i < source.length; i += 1) {
                    allProducts.push({
                        id: String(source[i].id || ""),
                        name: String(source[i].name || "Sản phẩm"),
                        categoryId: String(source[i].categoryId || ""),
                        type: String(source[i].type || ""),
                        price: toNumber(source[i].price, 0),
                        rating: normalizeRating(source[i].rating),
                        oldPrice: toNumber(source[i].oldPrice, 0),
                        stockStatus: String(source[i].stockStatus || ""),
                        image: String(source[i].image || "").trim() || "../IMG/N001.jpg"
                    });
                }

                currentPage = 1;
                renderProducts();
            })
            .catch(function () {
                if (grid) {
                    grid.innerHTML = '<div class="col-12"><div class="text-center py-4" style="color: var(--chu-mo);">Không thể tải dữ liệu sản phẩm</div></div>';
                }
                if (pagination) {
                    pagination.innerHTML = "";
                }
                if (toolbarMeta) {
                    toolbarMeta.textContent = "0 kết quả";
                }
            });
    }

    // Doc keyword tren URL va dua vao o tim kiem ban dau //
    function initSearchFromUrl() {
        var params;
        var keyword;

        if (!searchInput) return;

        params = new URLSearchParams(window.location.search);
        keyword = params.get("keyword");

        if (keyword) {
            searchInput.value = keyword;
        }
    }

    // Khoi tao toan bo trang danh sach san pham //
    function init() {
        if (!grid || !pagination) {
            return;
        }

        if (categoryLinks.length > 0) {
            setActiveCategory(document.querySelector(".filter-links a.active") || categoryLinks[0]);
        }

        setupPriceSlider();
        initSearchFromUrl();
        bindEvents();
        loadProducts();
    }

    init();
});
