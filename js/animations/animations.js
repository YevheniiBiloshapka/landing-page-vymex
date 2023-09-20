(function ($) {
    if ($(window).width() > 560) {
        $('[data-animation="bf"]').each(function () {
            $(this).html($(this).text().replace(/(^|<\/?[^>]+>|\s+)([^\s<]+)/g, '$1<span class="bf">$2</span>'));
        })


        $.fn.isInViewport = function () {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();

            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            return elementBottom > viewportTop && elementTop < viewportBottom;
        };

        $.fn.b2Animate = function () {
            $('.b2-anim').each(function () {
                let element = $(this);
                let animation = $(this).attr('data-animation');
                if ($(element).isInViewport()) {
                    if ($(element).attr('data-delay') && !$(element).attr('data-device')) {
                        setTimeout(function () {
                            $(element).addClass(animation);
                            $(element).removeClass('b2-anim');
                        }, $(element).attr('data-delay'));
                    } else if (element.attr('data-delay') && element.attr('data-device') <= $(window).width()) {
                        setTimeout(function () {
                            $(element).addClass(animation);
                            $(element).removeClass('b2-anim');
                        }, element.attr('data-delay'));
                    } else {
                        $(element).addClass(animation);
                        $(element).removeClass('b2-anim');
                    }
                }
            })
        };

        $.fn.b2AnimateIteration = function () {
            $('.b2-anim-iteration').each(function () {
                let element = $(this);

                if (!$(element).hasClass('triggered')) {
                    $(element).children().each(function () {
                        $(this).find('img').addClass('b2-anim-item');
                    });

                    if ($(element).isInViewport()) {
                        let animation = $(element).attr('data-animation');
                        $(element).find('.slick-slide').children().each(function () {
                            let children = $(this);
                            let delay = $(children).find('.b2-anim-item').attr('data-delay');
                            console.log(delay);
                            setTimeout(function () {
                                $(children).find('.b2-anim-item').addClass(animation);
                                $(children).find('.b2-anim-item').removeClass('b2-anim-item');
                            }, delay);
                        });
                        $(element).addClass('triggered');
                    }
                }
            })
        };


        function mobileAdaptation() {
            if ($(window).width() <= 560) {
                $('.main-screen .subtitle .b2-anim').attr('data-animation', 'fade-up').unwrap();
                $('.types-of-work .title .b2-anim').attr('data-animation', 'fade-up').unwrap();
            }
        }

        function smoothScroll() {

        }


        $(document).ready(function () {
            mobileAdaptation();
            // loadAnimations();
            $('.b2-anim').b2Animate();
            smoothScroll();

            $(document).on('click', 'a[href^="#"]', function (event) {
                event.preventDefault();

                $('.mobile-menu').removeClass('active');
                $('.menu-cover').removeClass('active')

                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset().top - 104
                }, 500);
            });
        });

        $(window).on('resize scroll load', function () {
            $('.b2-anim-iteration').b2AnimateIteration();
            $('.b2-anim').b2Animate();
        });
    }
})(jQuery);