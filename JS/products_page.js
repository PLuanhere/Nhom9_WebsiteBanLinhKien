//SECTION
(function (window, document) {
    'use strict';

    var DATA_URL = '../data/products.json';
    var ITEMS_PER_PAGE = 12;

    var allProducts = [];
    var currentPage = 1;

    var grid = null;
    var pagination = null;
    var toolbarMeta = null;
    var sortSelect = null;
    var searchInput = null;
    var searchButton = null;

    function formatPrice(value) {
        return (Number(value) || 0).toLocaleString('vi-VN') + ' VNĐ';
    }

    function normalizeRating(value) {
        var rating = Number(value);

        if (isNaN(rating)) {
            return 0;
        }

        if (rating < 0) {
            return 0;
        }

        if (rating > 5) {
            return 5;
        }

        return Math.round(rating * 10) / 10;
    }

    function createRatingHtml(value) {
        var rating = normalizeRating(value);
        var label = rating.toFixed(1);
        var i = 0;
        var starLevel = 0;
        var starsHtml = '';

        for (i = 0; i < 5; i += 1) {
            starLevel = rating - i;

            if (starLevel >= 0.75) {
                starsHtml += '<i class="fa-solid fa-star" aria-hidden="true"></i>';
            } else if (starLevel >= 0.25) {
                starsHtml += '<i class="fa-solid fa-star-half-stroke" aria-hidden="true"></i>';
            } else {
                starsHtml += '<i class="fa-regular fa-star" aria-hidden="true"></i>';
            }
        }

        return [
            '<div class="catalog-rating" aria-label="Đánh giá ' + label + ' trên 5">',
            '<span class="catalog-rating-stars">' + starsHtml + '</span>',
            '<span class="catalog-rating-value">' + label + '/5</span>',
            '</div>'
        ].join('');
    }

    function getStockText(status) {
        if (status === 'in_stock') return 'Còn hàng';
        if (status === 'low_stock') return 'Sắp hết hàng';
        if (status === 'pre_order') return 'Đặt trước';
        if (status === 'out_of_stock') return 'Hết hàng';
        return 'Liên hệ';
    }

    function getSortMode() {
        if (!sortSelect) {
            return 'default';
        }

        if (sortSelect.selectedIndex === 1) {
            return 'price-asc';
        }
        if (sortSelect.selectedIndex === 2) {
            return 'price-desc';
        }
        return 'default';
    }

    function getKeyword() {
        if (!searchInput) {
            return '';
        }
        return String(searchInput.value || '').trim().toLowerCase();
    }

    function getFilteredProducts() {
        var list = allProducts.slice();
        var keyword = getKeyword();
        var sortMode = getSortMode();

        if (keyword) {
            list = list.filter(function (item) {
                return item.name.toLowerCase().indexOf(keyword) !== -1;
            });
        }

        if (sortMode === 'price-asc') {
            list.sort(function (a, b) {
                return a.price - b.price;
            });
        }

        if (sortMode === 'price-desc') {
            list.sort(function (a, b) {
                return b.price - a.price;
            });
        }

        return list;
    }

    function createCardHtml(product) {
        var oldPrice = '';

        if (product.oldPrice > product.price) {
            oldPrice = ' <span>' + formatPrice(product.oldPrice) + '</span>';
        }

        return [
            '<div class="col">',
            '<a href="ProductDetail.html?id=' + encodeURIComponent(product.id) + '" class="catalog-card">',
            '<div class="catalog-img"><img src="' + product.image + '" alt="' + product.name + '"></div>',
            '<h6>' + product.name + '</h6>',
            createRatingHtml(product.rating),
            '<p class="catalog-price">' + formatPrice(product.price) + oldPrice + '</p>',
            '<small>' + getStockText(product.stockStatus) + '</small>',
            '</a>',
            '</div>'
        ].join('');
    }

    function renderPagination(totalPages) {
        var html = '';
        var i = 1;

        if (totalPages <= 0) {
            pagination.innerHTML = '';
            return;
        }

        html += '<li class="page-item' + (currentPage === 1 ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage - 1) + '">&lt;</a></li>';

        for (i = 1; i <= totalPages; i += 1) {
            html += '<li class="page-item' + (i === currentPage ? ' active' : '') + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>';
        }

        html += '<li class="page-item' + (currentPage === totalPages ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage + 1) + '">&gt;</a></li>';
        pagination.innerHTML = html;
    }

    function render() {
        var list = getFilteredProducts();
        var total = list.length;
        var totalPages = Math.ceil(total / ITEMS_PER_PAGE);
        var start = 0;
        var pageItems = [];

        if (totalPages === 0) {
            currentPage = 1;
            grid.innerHTML = '<div class="col-12"><div class="text-center py-4" style="color: var(--chu-mo);">Không tìm thấy sản phẩm phù hợp.</div></div>';
            pagination.innerHTML = '';
            if (toolbarMeta) {
                toolbarMeta.textContent = '0 kết quả';
            }
            return;
        }

        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        start = (currentPage - 1) * ITEMS_PER_PAGE;
        pageItems = list.slice(start, start + ITEMS_PER_PAGE);

        grid.innerHTML = pageItems.map(createCardHtml).join('');

        if (toolbarMeta) {
            toolbarMeta.textContent = (start + 1) + '-' + (start + pageItems.length) + ' / ' + total + ' kết quả';
        }

        renderPagination(totalPages);
    }

    function loadProducts() {
        fetch(DATA_URL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Không tải được dữ liệu');
                }
                return response.json();
            })
            .then(function (data) {
                var source = Array.isArray(data.regularProducts) ? data.regularProducts : [];

                allProducts = source.map(function (item) {
                    return {
                        id: String(item.id || ''),
                        name: String(item.name || 'Sản phẩm'),
                        price: Number(item.price) || 0,
                        rating: normalizeRating(item.rating),
                        oldPrice: Number(item.oldPrice) || 0,
                        stockStatus: String(item.stockStatus || ''),
                        image: String(item.image || '').trim() || '../IMG/N001.jpg'
                    };
                });

                currentPage = 1;
                render();
            })
            .catch(function () {
                grid.innerHTML = '<div class="col-12"><div class="text-center py-4" style="color: var(--chu-mo);">Không thể tải dữ liệu sản phẩm</div></div>';
                pagination.innerHTML = '';
                if (toolbarMeta) {
                    toolbarMeta.textContent = '0 kết quả';
                }
            });
    }

    function bindEvents() {
        pagination.addEventListener('click', function (event) {
            var link = event.target.closest('a.page-link[data-page]');
            var page = 1;

            if (!link) {
                return;
            }

            event.preventDefault();
            page = Number(link.getAttribute('data-page')) || 1;
            currentPage = page;
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                currentPage = 1;
                render();
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', function (event) {
                event.preventDefault();
                currentPage = 1;
                render();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    currentPage = 1;
                    render();
                }
            });
        }
    }

    function init() {
        var searchBox = null;

        grid = document.getElementById('productsGrid');
        pagination = document.getElementById('productsPagination');
        toolbarMeta = document.querySelector('.toolbar-meta');
        sortSelect = document.querySelector('.toolbar-select');

        searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchInput = searchBox.querySelector('input');
            searchButton = searchBox.querySelector('button');
        }

        if (!grid || !pagination) {
            return;
        }

        bindEvents();
        loadProducts();
    }

    document.addEventListener('DOMContentLoaded', init);
})(window, document);
