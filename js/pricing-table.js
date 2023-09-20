(function ($) {
    const table = $('#vm-pricing-table');

    if(!isMobile()){
        $(document).ready(function () {
            updateTotalUnitsCount();
            updateSubtotalPrice();
            updateTotalPrice();
        })

        $(document).on('click', '#vm-pricing-table .calc-buttons button', function (e) {
            const button = e.target;
            calculateRow(button);
            updateSubtotalPrice();
            updateTotalUnitsCount();
            updateTotalPrice();
        })
        $(document).on('keyup change', '.units-qty', function () {
            if($(this).val() === null || $(this).val() === undefined || $(this).val() === ''){
                $(this).val($(this).attr('min'));
            }

            if($(this).val().length > 1 && $(this).val().charAt(0) === '0'){
                $(this).val($(this).val().substring(1));
            }

            updateSubtotalPrice();
            updateTotalUnitsCount();
            updateTotalPrice();
        });
    }

    $(document).ready(function () {
        if (isMobile()) {
            rebuildOnMobile();

            $('.pricing-calc .tab').on('click', function () {
                let tab = $(this).attr('data-tab');
                $('[data-tab]').removeClass('-active');
                $('[data-tab="' + tab + '"]').addClass('-active')

                if(tab == 0){
                    $('.vm-pricing-table .slider-nav').find('svg').remove();
                    $('.vm-pricing-table .slider-nav').find('.dots').empty();
                    $('.price-slider').slick('reinit');
                    console.log('reinited')
                }
            })

            $(document).ready(function () {
                updateTotalUnitsCount();
                updateSubtotalPrice();
                updateTotalPrice();
            })

            $(document).on('click', '#vm-pricing-table .calc-buttons button', function (e) {
                const button = e.target;
                calculateRow(button);
                updateSubtotalPrice();
                updateTotalUnitsCount();
                updateTotalPrice();
            })
            $(document).on('keyup change', '.units-qty', function () {
                if($(this).val() === null || $(this).val() === undefined || $(this).val() === ''){
                    $(this).val($(this).attr('min'));
                }

                if($(this).val().length > 1 && $(this).val().charAt(0) === '0'){
                    $(this).val($(this).val().substring(1));
                }

                updateSubtotalPrice();
                updateTotalUnitsCount();
                updateTotalPrice();
            });
        }
    })


    $('[data-unit-level]').hover(function () {
        const unitLevel = $(this).attr('data-unit-level');
        $('[data-unit-level="' + unitLevel + '"]').addClass('hovered');
    }, function () {
        const unitLevel = $(this).attr('data-unit-level');
        $('[data-unit-level="' + unitLevel + '"]').removeClass('hovered');
    })


    function calculateRow(button) {
        const calcRow = $(button).closest('.calc-row');
        const input = $(calcRow).find('input[type="number"]');
        const action = $(button).attr('data-action');

        updateRowInput(action, input);
    }

    function updateRowInput(action, input) {
        switch (action) {
            case "-":
                decrementUnitsCount(input)
                break;
            case "+":
                incrementUnitsCount(input)
                break;
        }
    }

    function incrementUnitsCount(input) {
        $(input).val(parseInt($(input).val()) + 1)
    }

    function decrementUnitsCount(input) {
        if (parseInt($(input).val()) > $(input).attr('min')) {
            $(input).val(parseInt($(input).val()) - 1)
        }
    }

    function updateSubtotalPrice() {
        $('.calc-row').each(function () {
            const unitLevel = $(this).attr('data-unit-level');
            const priceValue = $(this).find('.subtotal-price .value');
            const unitsCount = parseInt($(this).find('.units-qty').val());
            const tariff = getPriceTariffByUnitsCount();
            let priceByUnit = convertToFloat($(table).find('[data-unit-level="' + unitLevel + '"]').find('[data-units-count="' + tariff + '"] .value').text());



            if (isMobile()) {
                let price = $(".price-by-count[data-unit-level='" + unitLevel + "'][data-units-count='" + tariff + "']").find('.value').text();
                priceByUnit = convertToFloat(price);
            }


            $(priceValue).text(unitsCount * priceByUnit);
        })
    }

    function getPriceTariffByUnitsCount() {
        const unitsCount = calcCount();

        if (unitsCount <= 10) {
            return '0';
        } else if (unitsCount > 10 && unitsCount <= 50) {
            return '1';
        } else if (unitsCount > 50 && unitsCount <= 100) {
            return '2';
        } else if (unitsCount > 100 && unitsCount <= 500) {
            return '3';
        } else if (unitsCount > 500) {
            return '4';
        }
    }

    function convertToFloat(string) {
        string = string.replace(/[^0-9.]/g, '');

        return parseFloat(string.replace(/[^0-9.]/g, ''));
    }

    function updateTotalUnitsCount() {
        $(table).find('.total-units .value .count').text(calcCount());
    }

    function updateTotalPrice() {
        const oldPrice = parseInt($('#vm-pricing-table .total-price .value').text());

        let totalPrice = 0;

        $('#vm-pricing-table .calc-row').each(function () {
            totalPrice += parseInt($(this).find('.subtotal-price .value').text());
        })

        counterAnim('#vm-pricing-table .total-price .value', oldPrice, totalPrice);
    }

    const calcCount = () => {
        let count = 0;

        $('#vm-pricing-table .units-qty').each(function () {
            count += parseInt($(this).val());
        })

        return count;
    }
    const counterAnim = (qSelector, start = 0, end, duration = 1000) => {
        if (end - start <= 10) {
            duration = 100
        }

        const target = document.querySelector(qSelector);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            target.innerText = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    function rebuildOnMobile() {
        let cols = collectCols('.vm-pricing-table [data-col]');
        $('.vm-pricing-table').prepend(cols.col1);
        $('.vm-pricing-table .table-values').html("<div class='slider-col'><div class='price-slider'>" + cols.col2 + cols.col3 + cols.col4 + cols.col5 + cols.col6 + "</div><div class='slider-nav'><div class='dots'></div></div></div>")
        $('.vm-pricing-table .calc-interface').wrap('<div class="interface-wrapper" data-tab="1"></div>')
        $('.vm-pricing-table .calc-interface .totals').detach().appendTo('.vm-pricing-table .interface-wrapper')
        $('.vm-pricing-table .notes').detach().appendTo('.vm-pricing-table');

        $(document).find('.price-slider').slick({
            slidesToShow: 2,
            slidesToScroll: 2,
            appendArrows: $(document).find('.vm-pricing-table .slider-nav'),
            appendDots: $(document).find('.vm-pricing-table .slider-nav .dots'),
            // variableWidth: true,
            dots: true,
            infinite: false,
            prevArrow: "<svg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                "<circle opacity=\"0.2\" cx=\"16\" cy=\"16\" r=\"16\" fill=\"#4A5A6A\"/>\n" +
                "<path d=\"M18 10L12 16L18 22\" stroke=\"#8296AA\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
                "</svg>\n",
            nextArrow: "<svg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                "<circle opacity=\"0.2\" cx=\"16\" cy=\"16\" r=\"16\" transform=\"rotate(-180 16 16)\" fill=\"#4A5A6A\"/>\n" +
                "<path d=\"M14 22L20 16L14 10\" stroke=\"#8296AA\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
                "</svg>\n"
        });
    }

    function collectCols(el) {
        let cols = {
            col1: '',
            col2: '',
            col3: '',
            col4: '',
            col5: '',
            col6: '',
        }

        $unitLevel = 0;

        $(el).each(function () {
            $(this).attr('data-unit-level', $(this).closest('.price-row').attr('data-unit-level'));

            switch (parseInt($(this).attr('data-col'))) {
                case 1:
                    cols.col1 += $(this).prop('outerHTML');
                    break;
                case 2:
                    cols.col2 += $(this).prop('outerHTML');
                    break;
                case 3:
                    cols.col3 += $(this).prop('outerHTML');
                    break;
                case 4:
                    cols.col4 += $(this).prop('outerHTML');
                    break;
                case 5:
                    cols.col5 += $(this).prop('outerHTML');
                    break;
                case 6:
                    cols.col6 += $(this).prop('outerHTML');
                    break;
            }
        })

        return wrapCols(cols);
    }

    function wrapCols(cols) {
        return {
            col1: "<div class='units-info'>" + cols.col1 + "</div>",
            col2: "<div class='price-col' data-units-count='0'>" + cols.col2 + "</div>",
            col3: "<div class='price-col' data-units-count='1'>" + cols.col3 + "</div>",
            col4: "<div class='price-col' data-units-count='2'>" + cols.col4 + "</div>",
            col5: "<div class='price-col' data-units-count='3'>" + cols.col5 + "</div>",
            col6: "<div class='price-col' data-units-count='4'>" + cols.col6 + "</div>",
        }
    }

    function isMobile() {
        return $(window).width() <= 1200;
    }

})(jQuery);