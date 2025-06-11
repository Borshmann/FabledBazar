
$(document).ready(function () {
    // === 1. Tooltip анимация "печатания" для .letter ===
    const $body = $('body');
    const typingSpeed = 50; // Скорость печатания (в мс)
    let typingTimeout;

    function initLetterTooltips() {
        $('.letter').each(function () {
            const $letter = $(this);

            $letter.on('mouseenter.tooltip', function () {
                const text = $letter.attr('data-collection');

                if (!text || text.length < 2) return;

                const offset = $letter.offset();
                const width = $letter.outerWidth();
                const height = $letter.outerHeight();

                let $tooltip = $('#dynamic-tooltip');
                if (!$tooltip.length) {
                    $tooltip = $('<p>')
                        .attr('id', 'dynamic-tooltip')
                        .addClass('header-coll-name goudy')
                        .appendTo($body);
                }

                $tooltip.css({
                    top: offset.top + height,
                    left: offset.left + width / 2
                }).css('opacity', 1).show();

                let index = 1;
                const fullText = text.substring(1);

                $tooltip.text('');

                function type() {
                    if (index <= fullText.length) {
                        const currentText = fullText.substring(0, index);
                        const verticalText = currentText.split('').join('\n');
                        $tooltip.text(verticalText);
                        index++;
                        typingTimeout = setTimeout(type, typingSpeed);
                    }
                }

                type();
            });

            $letter.on('mouseleave.tooltip', function () {
                const $tooltip = $('#dynamic-tooltip');
                if ($tooltip.length) {
                    clearTimeout(typingTimeout);
                    $tooltip.css('opacity', 0);
                }
            });
        });
    }

    // === 2. Логика фильтрации коллекций ===
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
        const delayStep = 20;

        $allItems.each(function(index) {
            const $item = $(this);

            setTimeout(() => {
                $item.show(); // Показываем все товары
            }, index * delayStep);
        });
    }

    let is_colored = false;

    // === 3. Клик по букве (с делегированием) ===
    $(document).on('click', '.letter', function () {
        const $button = $(this);
        const selectedCollection = $button.data('collection');
        const originalClass = $button.data('original-class');

        if (!originalClass) {
            const currentClass = $button.attr('class').split(' ')
                .find(cls => cls !== 'letter');

            if (currentClass) {
                $button.data('original-class', currentClass);
                $button.removeClass(currentClass).addClass('X');
            }
            serialize(selectedCollection);
        } else {
            const savedClass = $button.data('original-class');
            $button.removeClass('X').addClass(savedClass);
            $button.removeData('original-class');
            deserialize();
        }

        const collectionName = $button.attr('data-collection');
        const color = collections_colors[collectionName];
        const defaultBgColor = '#F7F5F3';

        if (is_colored == false) {
            $('body').css('background-color', color);
            if (window.matchMedia("(max-width: 768px)").matches) {
                $('.gecco').css('background-color', color);
            }
            $(".shop-menu").css('background-image', 'linear-gradient(to bottom, ' + color + ', rgba(147, 112, 231, 0))');
            is_colored = true;
        } else {
           $('body').css('background-color', defaultBgColor);
            if (window.matchMedia("(max-width: 768px)").matches) {
                $('.gecco').css('background-color', defaultBgColor);
            }
            $(".shop-menu").css('background-image', '');
            is_colored = false;
        }
    });

    // === 4. Ховер на #menu_btn (с делегированием) ===
    $(document).on({
        mouseenter: function () {
            $(".shop-grid").css('filter', 'blur(8px) saturate(0) brightness(1.5)');
            $("#menu").css('filter', 'blur(8px) saturate(0) brightness(1.5)');
        },
        mouseleave: function () {
            $(".shop-grid").css('filter', 'none');
            $("#menu").css('filter', 'none');
        }
    }, '#shop_menu');

    // === 5. Запуск tooltip'ов при загрузке ===
    initLetterTooltips();
});
