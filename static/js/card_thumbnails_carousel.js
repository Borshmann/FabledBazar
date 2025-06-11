
$(document).ready(function () {
    const $thumbs = $('.thumbnails-inner');
    const content = $thumbs.html();
    $thumbs.append(content); // Бесконечная прокрутка миниатюр

    let currentIndex = 0;
    let modalImages = [];

    // Заполняем массив URL всех фото товара
    $('.carousel-img').each(function () {
        modalImages.push($(this).attr('src'));
    });

    // Открытие фото в модальном окне
    $(document).on('click', '.carousel-img', function () {
        const imgSrc = $(this).attr('src');
        currentIndex = modalImages.indexOf(imgSrc);
        $('#modal-image').attr('src', imgSrc);
        $('#modal-overlay').fadeIn();
    });

    // Переключение влево
    $('#prev-modal').on('click', function (e) {
        e.stopPropagation(); // Чтобы не закрывалось модальное окно
        if (modalImages.length === 0) return;
        currentIndex = (currentIndex - 1 + modalImages.length) % modalImages.length;
        $('#modal-image').attr('src', modalImages[currentIndex]);
    });

    // Переключение вправо
    $('#next-modal').on('click', function (e) {
        e.stopPropagation(); // Чтобы не закрывалось модальное окно
        if (modalImages.length === 0) return;
        currentIndex = (currentIndex + 1) % modalImages.length;
        $('#modal-image').attr('src', modalImages[currentIndex]);
    });

    // Закрытие по клику вне картинки или на крестик
    $('#modal-close, #modal-overlay').on('click', function (e) {
        if ($(e.target).is('#modal-overlay') || $(e.target).is('#modal-close')) {
            $('#modal-overlay').fadeOut();
            $('#modal-image').attr('src', '');
        }
    });
});