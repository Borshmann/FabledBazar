$(document).ready(function () {
    const $body = $('body');
    const typingSpeed = 50; // Скорость печатания (в мс)
    let typingTimeout;

    $('.letter').each(function () {
        const $letter = $(this);

        $letter.on('mouseenter', function () {
            const text = $letter.attr('data-collection');

            // Проверяем, что текст существует и содержит хотя бы 2 символа
            if (!text || text.length < 2) return;

            const offset = $letter.offset();
            const width = $letter.outerWidth();
            const height = $letter.outerHeight();

            // Получаем или создаём tooltip
            let $tooltip = $('#dynamic-tooltip');
            if (!$tooltip.length) {
                $tooltip = $('<p>')
                    .attr('id', 'dynamic-tooltip')
                    .addClass('header-coll-name goudy')
                    .appendTo($body);
            }

            // Центрируем tooltip под буквой
            $tooltip.css({
                top: offset.top + height,
                left: offset.left + width / 2
            }).css('opacity', 1).show();

            // Начинаем с второй буквы
            let index = 1;
            const fullText = text.substring(1); // Обрезаем первую букву

            $tooltip.text(''); // Очищаем перед анимацией

            function type() {
                if (index <= fullText.length) {
                    const currentText = fullText.substring(0, index);
                    const verticalText = currentText.split('').join('\n');
                    $tooltip.text(verticalText);
                    index++;
                    typingTimeout = setTimeout(type, typingSpeed);
                }
            }

            type(); // Запускаем анимацию
        });

        $letter.on('mouseleave', function () {
            const $tooltip = $('#dynamic-tooltip');
            if ($tooltip.length) {
                clearTimeout(typingTimeout);
                $tooltip.css('opacity', 0); // Плавное исчезновение
            }
        });
    });
});

$(document).ready(function () {
    const collections_colors = {
        "Exlibris": "#F9F6EC",
        "All Hallows Eve": "#FEF0E1",
        "Zodiac": "#EBF8FF",
        "Lucky items": "#F0FFE1",
        "Alchimia": "#F2F0FF",
        "Baby dream": "#FFEBF2",
        "Futurism": "#ECF8F9",
        "Amore": "#FFEAE5",
        "Beast": "#F9F2EC"
    };

    function serialize(selectedCollection) {
        const $allItems = $('.shop-item');
        const delayStep = 20;

        $allItems.each(function(index) {
            const $item = $(this);
            const itemCollection = $item.data('collection');

            setTimeout(() => {
                if (selectedCollection && itemCollection !== selectedCollection) {
                    $item.hide();
                } else {
                    $item.show();
                }
            }, index * delayStep);
        });
    }

    function deserialize() {
        const $allItems = $('.shop-item');
        const delayStep = 20; // 20 мс между элементами

        $allItems.each(function(index) {
            const $item = $(this);

            setTimeout(() => {
                $item.show(); // Показываем все товары
            }, index * delayStep);
        });
    }

    $('.letter').on('click', function () {
        const $button = $(this);
        const selectedCollection = $(this).data('collection');
        // Проверяем, есть ли уже сохранённый класс (в data)
        const originalClass = $button.data('original-class');

        if (!originalClass) {
            // Это первый клик: сохраняем оригинальный класс и заменяем на X
            const currentClass = $button.attr('class').split(' ')
                .find(cls => cls !== 'letter'); // исключаем общий класс "letter"

            if (currentClass) {
                $button.data('original-class', currentClass);
                $button.removeClass(currentClass).addClass('X');
            }
            serialize(selectedCollection);
        } else {
            // Это повторный клик: возвращаем оригинальный класс
            const savedClass = $button.data('original-class');
            $button.removeClass('X').addClass(savedClass);
            $button.removeData('original-class'); // очищаем сохранённые данные
            deserialize();
        }

        // Твой существующий код
        const collectionName = $button.attr('data-collection');
        const color = collections_colors[collectionName];

        if (color) {
            $('body').css('background-color', color);
            if (window.matchMedia("(max-width: 768px)").matches) {
                $('.gecco').css('background-color', color);
            }
            $(".shop-menu").css('background-image', 'linear-gradient(to bottom, ' + color + ', rgba(147, 112, 231, 0))');
        } else {
            console.warn(`Цвет для "${collectionName}" не найден`);
        }
    });
});


$(document).ready(function () {
    $('#shop_menu').hover(
        function () {
            // При наведении мышью
            // $('.shop-grid').css('opacity', '0.2');
            $(".shop-grid").css('filter', 'blur(8px) saturate(0) brightness(1.5)');
        },
        function () {
            // Когда курсор уходит
            $(".shop-grid").css('filter', 'none');
        }
    );
});