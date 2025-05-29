$(document).ready(function () {
    $('.shop-item').on('click', function () {
        const productId = $(this).data('id'); // Получаем data-id

        console.log('Кликнут ID:', productId); // Для проверки
        const $detailContainer = $('#product-detail');
        $detailContainer.empty();

        $detailContainer.html('<p>Загрузка...</p>');

        $.ajax({
            url: `/api/product-card/${productId}`,
            method: 'GET',
            success: function (html) {
                $detailContainer.empty().append(html);
                $detailContainer.addClass('card-forward');
                $('.shop-grid').css("filter", "opacity(0.5)");
            },
            error: function (xhr, status, error) {
                console.error("Ошибка загрузки карточки:", error);
                $detailContainer.html('<p>Не удалось загрузить карточку товара.</p>');
            }
        });
    });
});