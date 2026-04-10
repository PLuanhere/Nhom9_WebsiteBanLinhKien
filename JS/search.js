//SECTION
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".search-box form");

    if (form) {
        const input = form.querySelector('input[name="keyword"]');
        const categoryInput = document.getElementById("categoryInput");

        form.addEventListener("submit", function (e) {
            const keyword = input.value.trim();

            if (keyword === "") {
                e.preventDefault();
                alert("Vui lòng nhập từ khóa!");
                return;
            }

            if (!categoryInput.value) {
                categoryInput.value = "all";
            }
        });
    }
    const productCards = document.querySelectorAll(".catalog-card");

    if (productCards.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword") || "";
    const category = params.get("category") || "all";

    function removeVietnamese(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .toLowerCase();
    }

    function levenshtein(a, b) {
        const matrix = [];

        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                matrix[i][j] = (b[i - 1] === a[j - 1])
                    ? matrix[i - 1][j - 1]
                    : Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
            }
        }
        return matrix[b.length][a.length];
    }

    function isMatch(name, keyword) {
        const n = removeVietnamese(name);
        const k = removeVietnamese(keyword);

        if (n.includes(k)) return true;

        return levenshtein(n, k) <= 3;
    }

    let hasResult = false;

    productCards.forEach(card => {
        const name = card.querySelector("h6").textContent.trim();
        const cat = card.dataset.category;

        const matchName = isMatch(name, keyword);
        const matchCategory = category === "all" || cat === category;

        if (matchName && matchCategory) {
            card.parentElement.style.display = "block";
            hasResult = true;
        } else {
            card.parentElement.style.display = "none";
        }
    });
    if (!hasResult) {
        const container = document.querySelector(".row");
        if (container) {
            container.innerHTML = "<p>Không tìm thấy sản phẩm</p>";
        }
    }
});