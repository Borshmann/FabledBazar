if($(window).width() > 760){
    function startPulseAnimation($element, baseColor = '#9E7ACC') {
        let blurMin = 50;
        let blurMax = 70;
        let brightness = 1;
        let direction = 0.01;

        function animate() {
            brightness += direction;
            if (brightness >= 1.7 || brightness <= 1) {
                direction *= -1;
            }
            const adjustedColor = adjustBrightness(baseColor, brightness);
            const blur = blurMin + (blurMax - blurMin) * ((brightness - 1) / 0.5);
            $element.css('box-shadow', `0 0 ${blur}px 15px ${adjustedColor}`);
            requestAnimationFrame(animate);
        }
        animate();
    }

    // Функция для изменения яркости цвета
    function hexToRgb(hex) {
        let bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            let hex = Math.round(x).toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }).join('');
    }

    function adjustBrightness(hex, factor) {
        const rgb = hexToRgb(hex);
        rgb.r = Math.min(255, Math.max(0, Math.round(rgb.r * factor)));
        rgb.g = Math.min(255, Math.max(0, Math.round(rgb.g * factor)));
        rgb.b = Math.min(255, Math.max(0, Math.round(rgb.b * factor)));
        return rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    function fadeOutShadow($element) {

        // Прерываем текущую анимацию пульса
        const requestID = $element.data('pulseAnimationID');
        if (requestID) {
            cancelAnimationFrame(requestID);
            $element.data('pulseAnimationID', null);
        }

        let blur = parseFloat($element.data('currentBlur') || 40); // текущее размытие
        let brightness = parseFloat($element.data('currentBrightness') || 1.5); // текущая яркость

        function animateFade() {
            let step = 0.05;
            blur -= step * 10;
            brightness -= step;

            if (blur < 0) blur = 0;
            if (brightness < 1) brightness = 1;

            const adjustedColor = adjustBrightness('#9E7ACC', brightness);
            $element.css('box-shadow', `0 0 ${blur}px 5px ${adjustedColor}`);

            if (blur <= 0) {
                $element.css('box-shadow', 'none');
                return;
            }
            requestAnimationFrame(animateFade);
        }
        animateFade();
    }

    $(document).ready(function () {
        const $card = $('#item-card');
        const $thumbnail = $('.card-main-image');
        const $styleTag = $('<style>').appendTo('head');
        const shadowColor = $card.data('collection-color') || '#00ffff';

        let animationId;
        let isActive = false;
        let lastX = 0, lastY = 0;

        // ===== Настройки =====
        const settings = {
        maxRotation: 15,
        liftDistance: 20,
        glareSensitivity: 1.5,
        shadowBlur: 25
        };

        function updateEffects(e) {
        if (!isActive) return;
        cancelAnimationFrame(animationId);

        animationId = requestAnimationFrame(() => {
            const rect = $card[0].getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const w = rect.width;
            const h = rect.height;

            const px = Math.floor((100 / w) * x);
            const py = Math.floor((100 / h) * y);

            // Позиция градиента и блика
            const lp = 50 + (px - 50) / settings.glareSensitivity;
            const tp = 50 + (py - 50) / settings.glareSensitivity;
            const px_spark = 50 + (px - 50) / 7;
            const py_spark = 50 + (py - 50) / 7;
            const p_opc = 20 + Math.abs(50 - px + (50 - py)) * 1.5;

            // 3D-параллакс
            const rotateX = ((tp - 50) / 50) * -10; // от -10 до +10
            const rotateY = ((lp - 50) / 50) * 10;

            // Движение картинки
            const imgShiftX = (px - 50) / 10;
            const imgShiftY = (py - 50) / 10;

            // Обновляем динамические стили для псевдоэлементов
            $styleTag.html(`
            #item-card:hover::before {
                background-position: ${lp}% ${tp}%;
            }
            #item-card:hover::after {
                background-position: ${px_spark}% ${py_spark}%;
                opacity: ${p_opc / 100};
            }
            `);

            // 3D поворот карточки
            $card.css({
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            });

            $thumbnail.css({
            transform: `translate(${imgShiftX}px, ${imgShiftY}px)`,
            zIndex: 55
            });
        });
        }

        function startAnimation(e) {
        isActive = true;
        $card.addClass('active');
        updateEffects(e.type === 'touchmove' ? e.originalEvent.touches[0] : e);
        }

        function stopAnimation() {
        isActive = false;
        cancelAnimationFrame(animationId);
        $card.removeClass('active');
        $styleTag.html('');
        $card.css('transform', '');
        $thumbnail.css({
            transform: '',
            filter: '',
            zIndex: ''
        });
        }

        $card.on('mouseenter touchstart', startAnimation)
            .on('mouseleave touchend touchcancel', stopAnimation)
            .on('mousemove touchmove', function (e) {
                updateEffects(e.type === 'touchmove' ? e.originalEvent.touches[0] : e);
            });

        $('#card_showmore').on('click', function () {
        const $desc = $('#card_description');
        const $btn = $(this);
        const isExpanded = $desc.height() > 105;

        $desc.stop().animate({
            height: isExpanded ? '105px' : $desc[0].scrollHeight + 'px'
        }, 300);

        $btn.css({
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
            bottom: isExpanded ? '' : '-30px'
            });
        });

        $('#item-card').hover(
        function() {
            // При наведении мыши
            startPulseAnimation($(this), '#9E7ACC');
        },
        function() {
            // Когда мышь уходит
            fadeOutShadow($('#item-card'));
        }
        );
    });
};