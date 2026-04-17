//SECTION
document.addEventListener("DOMContentLoaded", function () {

    const input = document.querySelector('.search-box input[name="keyword"], .search-box input[type="text"]');
    if (!input) return;

    const suggestionBox = document.createElement("div");
    suggestionBox.className = "suggestion-box";

    const searchBox = input.closest(".search-box");
    if (searchBox) {
        searchBox.appendChild(suggestionBox);
    } else {
        input.parentNode.appendChild(suggestionBox);
    }

    // Chuan hoa chuoi tieng Viet ve dang khong dau de tim goi y //
    function removeVietnamese(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "d")
            .toLowerCase();
    }

    let productNames = [];

    // Xac dinh duong dan trang san pham theo vi tri trang hien tai //
    function getProductsPageUrl() {
        if (window.location.pathname.toLowerCase().includes("/html/")) {
            return "Products.html";
        }
        return "HTML/Products.html";
    }

    // Hien thi toi da 5 goi y san pham phu hop voi tu khoa dang nhap //
    function showSuggestions() {
        const keyword = removeVietnamese(input.value);
        suggestionBox.innerHTML = "";

        if (!keyword) {
            suggestionBox.style.display = "none";
            return;
        }

        let count = 0;

        for (let i = 0; i < productNames.length; i++) {
            const name = productNames[i];
            const normalizedName = removeVietnamese(name);

            if (!normalizedName.includes(keyword)) {
                continue;
            }

            const item = document.createElement("div");
            item.className = "suggestion-item";
            item.textContent = name;

            item.addEventListener("click", function () {
                window.location.href = getProductsPageUrl() + "?keyword=" + encodeURIComponent(name) + "&category=all";
            });

            suggestionBox.appendChild(item);
            count++;

            if (count === 5) {
                break;
            }
        }

        suggestionBox.style.display = count > 0 ? "block" : "none";
    }

    fetch("../data/products.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const discountProducts = data.discountProducts || [];
            const regularProducts = data.regularProducts || [];
            const allProducts = discountProducts.concat(regularProducts);

            for (let i = 0; i < allProducts.length; i++) {
                const name = allProducts[i].name;

                if (name && !productNames.includes(name)) {
                    productNames.push(name);
                }
            }
        })
        .catch(function () {
            console.warn("Không tải được dữ liệu gợi ý sản phẩm.");
        });

    input.addEventListener("input", function () {
        showSuggestions();
    });
    document.addEventListener("click", function (e) {
        if (!suggestionBox.contains(e.target) && e.target !== input) {
            suggestionBox.innerHTML = "";
            suggestionBox.style.display = "none";
        }
    });
});