$(document).ready(function () {
    const $cursor = $('#custom-cursor');
    let mouseX = 0, mouseY = 0;

    // Отслеживаем движение указателя
    $(document).on('pointermove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Плавное обновление позиции
    function updateCursor() {
        $cursor.css({
            'transform': `translate(${mouseX}px, ${mouseY}px)`
        });
        requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Элементы, которые требуют специальный курсор
    const pointerElements = 'a, button, .btn, .carousel-img, .card-thumbnail, .card-share, .letter';

    // При наведении — меняем класс
    $(document).on('mouseenter', pointerElements, function () {
        $cursor.removeClass('cursor-default').addClass('cursor-pointer');
    });

    $(document).on('mouseleave', pointerElements, function () {
        $cursor.removeClass('cursor-pointer').addClass('cursor-default');
    });

});