import { ClientJS } from "clientjs";
import tab from "bootstrap/js/src/tab";

(function ($) {
  const client = new ClientJS();
  const fp = client.getFingerprint();

  $(window).on("load", function () {
    $(".main-page").addClass("active");
    $("[type=tel]").mask("+00 (000) 000 00 00");
  });

  $(window).on("scroll", function () {
    if (window.scrollY != 0) {
      $(".header-nav").addClass("in-scroll");
    } else {
      $(".header-nav").removeClass("in-scroll");
    }
  });

  $("[data-clb]").click(function (e) {
    e.preventDefault();
    let subject = $('.vm-modal [name="subject"]');

    if ($(".selected-position").length) {
      $(".vm-modal").addClass("active");
      $("body").css("overflow-y", "hidden");
      $(".vm-modal .modal__total-selected")
        .removeClass("hidden")
        .find(".positions")
        .html($(".vm-calc .total__values").html());
    } else {
      $(".vm-modal .modal__total-selected")
        .addClass("hidden")
        .find(".positions")
        .html("");
      $(".vm-modal").addClass("active");
      $("body").css("overflow-y", "hidden");
    }

    $(subject).attr("data-event", $(this).attr("data-event"));
    $(subject).val($(this).attr("data-btn"));
    $(subject).attr("data-cid", $(this).attr("data-cid"));
  });

  $("[data-modal]").click(function (e) {
    e.preventDefault();
    $(".vm-modal-agreement").addClass("active");
    $("body").css("overflow-y", "hidden");
  });

  $(".vm-modal").click(function (e) {
    e.preventDefault();
    if (e.target.classList.contains("vm-modal")) {
      $(".vm-modal").removeClass("active");
      $("body").css("overflow-y", "visible");
    }
  });

  $(".vm-modal-agreement").click(function (e) {
    e.preventDefault();
    if (e.target.classList.contains("vm-modal")) {
      $(".vm-modal-agreement").removeClass("active");
    }
  });

  $(".vm-modal-agreement .close").click(function (e) {
    e.preventDefault();
    $(".vm-modal-agreement").removeClass("active");
    $("body").css("overflow-y", "visible");
  });

  $(".vm-modal .close").click(function (e) {
    e.preventDefault();
    $(".vm-modal").removeClass("active");
    $("body").css("overflow-y", "visible");
  });

  $(".tym").click(function (e) {
    e.preventDefault();
    if (e.target.classList.contains("tym")) {
      $(".tym").removeClass("active");
      $("body").css("overflow-y", "visible");
    }
  });

  $(".tym .close").click(function (e) {
    e.preventDefault();
    $(".tym").removeClass("active");
    $("body").css("overflow-y", "visible");
  });

  function validateField(el, type) {
    if ($(el).val() <= 0) {
      $(el).addClass("error");
      return false;
    }

    if (type === "email") {
      if ($(el).val().indexOf("@") < 0) {
        $(el).addClass("error");
        return false;
      }
    }

    if (type === "tel" && $(el).val().length < 19) {
      $(el).addClass("error");
      return false;
    }

    $(el).removeClass("error");
    return true;
  }

  function submitCallbackForm(formSubmit) {
    let form = $(formSubmit).closest("form");
    let tel = $(form).find('[type="tel"]');
    let name = $(form).find('[type="text"]');
    let email = $(form).find('[type="email"]');
    let subject = $(form).find('[name="subject"]').val();
    let cid = $(form).find('[name="subject"]').attr("data-cid");

    if (
      validateField(name) &&
      validateField(tel, "tel") &&
      validateField(email, "email")
    ) {
      let cash, percents;
      let data = $(form).serialize();
      if ($(".selected-position").length) {
        cash = $(form).closest(".vm-modal").find(".cash").text();
        percents = $(form).closest(".vm-modal").find(".percents").text();
      }

      $.ajax({
        url: "/api/send-form",
        method: "POST",
        data: {
          data: data,
          percents: percents,
          cash: cash,
          subject: subject,
          cid: cid,
          fp: fp,
        },
        success: function (result) {
          $(tel).val("");
          $(email).val("");
          $(name).val("");
          $(".vm-modal").removeClass("active");
          if ($(document).find("[data-tym]")) {
            $(".tym .text").text($("[data-tym]").attr("data-tym"));
          }
          $(".tym").addClass("active");

          if ($(form).find("[data-event]")) {
            let event = $(form).find("[data-event]").attr("data-event");
            // window.dataLayer.push({'event': event});
            console.log("pushed event: " + event);
          }
          if (
            subject === "Узнать условия инвестирования" ||
            subject === "Договориться о встрече" ||
            subject === "Запрос на фин. модель"
          ) {
            fbq("track", "SubmitApplication");
          } else {
            fbq("track", "Lead");
          }
        },
      });
    }
  }

  function submitEventForm(formSubmit) {
    let form = $(formSubmit).closest("form");
    let name = $(form).find('[type="text"]');
    let email = $(form).find('[type="email"]');
    let subject = $(form).find('[name="subject"]').val();
    let cid = $(form).find('[name="subject"]').attr("data-cid");

    if (validateField(name) && validateField(email, "email")) {
      let data = $(form).serialize();

      $.ajax({
        url: "/api/send-event-form",
        method: "POST",
        data: {
          data: data,
          subject: subject,
          cid: cid,
        },
        success: function (result) {
          $(email).val("");
          $(name).val("");
          if ($(document).find("[data-tym-event]")) {
            $(".tym .text").text($("[data-tym-event]").attr("data-tym-event"));
          }
          $(".tym").addClass("active");

          if ($(form).find("[data-event]")) {
            let event = $(form).find("[data-event]").attr("data-event");
            window.dataLayer.push({ event: event });
            console.log("pushed event: " + event);
          }
        },
      });
    }
  }

  function fileValidation(inputField) {
    var filePath = inputField.value;
    // Allowing file type
    if (filePath.length) {
      var allowedExtensions = /(\.png|\.jpg|\.jpeg)$/i;

      if (!allowedExtensions.exec(filePath)) {
        inputField.value = "";
        $(inputField).closest(".type-file").addClass("error");
        return false;
      }
    }

    return true;
  }

  function cvFileValidation(inputField) {
    var filePath = inputField.value;
    // Allowing file type
    if (filePath.length) {
      var allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;

      if (!allowedExtensions.exec(filePath)) {
        inputField.value = "";
        $(inputField).closest(".type-file").addClass("error");
        return false;
      }
    }

    return true;
  }

  function submitCVForm(formSubmit) {
    let form = $(formSubmit).closest("form");
    let tel = $(form).find('[type="tel"]');
    let name = $(form).find('[type="text"]');
    let cid = $(form).find('[name="subject"]').attr("data-cid");
    let file = $(form).find("[type=file]")[0];

    if (validateField(name) && validateField(tel) && cvFileValidation(file)) {
      let fd = new FormData($(form)[0]);
      fd.append("cid", cid);
      fd.append("fp", fp);

      $.ajax({
        url: "/api/send-cv-form",
        type: "POST",
        data: fd,
        async: false,
        cache: false,
        contentType: false,
        enctype: "multipart/form-data",
        processData: false,

        success: function (result) {
          console.log(fd);
          $(tel).val("");
          $(name).val("");
          file.value = "";
          $(form)
            .find(".type-file .input-placeholder")
            .html($(form).find(".type-file button").attr("data-placeholder"));
          $(".vm-modal").removeClass("active");
          if ($(document).find("[data-job-tym]").length) {
            $(".tym .text").text($("[data-job-tym]").attr("data-job-tym"));
          }
          $(".tym").addClass("active");

          if ($(form).find("[data-event]")) {
            window.dataLayer.push({
              event: $(form).find("[data-event]").attr("data-event"),
            });
            console.log("pushed event");
          }
        },
      });
    }
  }

  function submitSupportForm(formSubmit) {
    let form = $(formSubmit).closest("form");
    let tel = $(form).find('[type="tel"]');
    let email = $(form).find('[type="email"]');
    let message = $(form).find('[name="text"]');
    let cid = $(form).find('[name="subject"]').attr("data-cid");
    let file = $(form).find("[type=file]")[0];

    if (
      validateField(tel) &&
      validateField(email) &&
      validateField(message) &&
      fileValidation(file)
    ) {
      let fd = new FormData($(form)[0]);
      fd.append("cid", cid);
      fd.append("fp", fp);

      $.ajax({
        url: "/api/send-support-form",
        type: "POST",
        data: fd,
        async: false,
        cache: false,
        contentType: false,
        enctype: "multipart/form-data",
        processData: false,

        success: function (result) {
          $(tel).val("");
          $(email).val("");
          file.value = "";
          $(form)
            .find(".support__attachment .input-placeholder")
            .html($(form).find(".type-file button").attr("data-placeholder"));

          $(form).closest(".support__fields").remove();
          $(".support__caption").html(
            $(".vm-support").attr("data-support-heading")
          );
          $(".support__text").html($(".vm-support").attr("data-support-text"));
          $(
            '<button class="vm-button support__close" style="margin-top: 48px;">' +
              $(".vm-support").attr("data-support-button") +
              "</button>"
          ).insertAfter(".support__text");

          if ($(form).find("[data-event]")) {
            window.dataLayer.push({
              event: $(form).find("[data-event]").attr("data-event"),
            });
            console.log("pushed event");
          }
        },
      });
    }
  }

  $("[type=submit]").click(function (e) {
    e.preventDefault();
    let cid = $(this).closest("form").find('[name="subject"]').attr("data-cid");
    switch (cid) {
      case "1":
      case "2":
        submitCallbackForm($(this));
        break;
      case "3":
        submitCVForm($(this));
        break;

      case "4":
        submitEventForm($(this));
        break;

      case "5":
      case "6":
      case "7":
      case "8":
        submitSupportForm($(this));
        break;
    }
  });

  if ($(window).width() <= 1199) {
    $(".calculator .button-container")
      .detach()
      .appendTo(".calculator .side-text");
    $(".vm-calc .pick-bar").detach().insertAfter(".vm-calc .window");
    $(".vm-calc .note-area").detach().insertAfter(".sidebar__footer");
    $(".vm-calc .window").addClass("active");

    $(".template-investors .main-screen .inv-release-date")
      .detach()
      .appendTo(".template-investors .main-screen .photo-column");
    $(".template-investors .main-screen .info-button")
      .detach()
      .appendTo(".template-investors .main-screen .photo-column");
  }

  if ($(window).width() <= 1199) {
    $(".mob-nav .tab").click(function () {
      let index = $(this).attr("data-tab");
      $("[data-tab]").removeClass("active");
      $('[data-tab="' + index + '"]')
        .removeClass("hidden")
        .addClass("active");
    });

    $("header .langs").detach().appendTo("header .mob-nav");
    $("header .mob-nav").append('<div class="ready-status"></div>');
    $("header .ready").detach().appendTo("header .mob-nav .ready-status");
  }

  $(window).on("resize, load", function () {
    if ($(window).width() <= 1199) {
      $(".mob-nav .tab").click(function () {
        let index = $(this).attr("data-tab");
        $("[data-tab]").removeClass("active");
        $('[data-tab="' + index + '"]')
          .removeClass("hidden")
          .addClass("active");
      });

      $("header .langs").detach().appendTo("header .mob-nav");
      $("header .mob-nav").append('<div class="ready-status"></div>');
      $("header .ready").detach().appendTo("header .mob-nav .ready-status");
    }
  });

  $(".burger").click(function () {
    $(this).toggleClass("active");
    $("header .mob-nav").toggleClass("opened");
    $(".header-nav").toggleClass("menu-opened");
  });

  $(".mob-nav .with-children").click(function (e) {
    e.preventDefault();
    let submenu = $(this).find(".submenu");
    let height = $(submenu)[0].scrollHeight;

    if (!$(this).hasClass("active")) {
      $(this).addClass("active");
      $(submenu).animate(
        {
          height: 176,
        },
        300
      );
    } else {
      $(this).removeClass("active");
      $(submenu).animate(
        {
          height: 0,
        },
        300
      );
    }
  });

  $(".mob-nav .submenu a").click(function (e) {
    e.stopPropagation();
  });

  if ($(window).width() <= 567) {
    $(".offers__item").each(function () {
      const item = $(this);
      const date = $(item).find(".offers__item-date");
      const button = $(item).find(".expand-button");
      const meta = $(this).find(".offers__item-meta");
      const sidebar = $(this).find(".offers__item-sidebar");

      $(date).detach().prependTo(sidebar);
      $(button).detach().appendTo(meta);
    });
  }

  $("header .language-switcher .active").click(function (e) {
    e.preventDefault();
  });

  $("header .langs .active-lang").hover(function () {
    $(this).addClass("active");
    $("header .language-switcher").animate(
      {
        opacity: 1,
      },
      300,
      "swing",
      function () {
        $("header .language-switcher").addClass("opened");
      }
    );
  });

  $("header #vm-sup").hover(function () {
    $(this).addClass("hovered");
    $("#vm-sup .notice").animate(
      {
        opacity: 1,
      },
      300
    );
  });

  $("header .release").hover(function () {
    $(this).addClass("hovered");
    $(".release .notice").animate(
      {
        opacity: 1,
      },
      300
    );
  });

  $("header .release").mouseleave(function () {
    setTimeout(function () {
      if (
        $("header .release:hover").length == 0 &&
        $("header .release .notice:hover").length == 0
      ) {
        $(".release .notice").animate(
          {
            opacity: 0,
          },
          300,
          "linear",
          function () {
            $("header .release").removeClass("hovered");
          }
        );
      }
    }, 500);
  });

  $("#vm-sup").mouseleave(function () {
    setTimeout(function () {
      if (
        $("#vm-sup:hover").length == 0 &&
        $("#vm-sup .notice:hover").length == 0
      ) {
        $("#vm-sup .notice").animate(
          {
            opacity: 0,
          },
          300,
          "linear",
          function () {
            $("#vm-sup").removeClass("hovered");
          }
        );
      }
    }, 500);
  });

  $(document).click(function (e) {
    if (
      $(".language-switcher").hasClass("opened") &&
      !e.target.classList.contains("active-lang")
    ) {
      const switcher = $("header .language-switcher");
      $("header .langs .active-lang").removeClass("active");
      $(switcher).animate(
        {
          opacity: 0,
        },
        300,
        "swing",
        function () {
          $(switcher).removeClass("opened");
        }
      );
    }
  });

  $("#to-top").each(function () {
    $(this).click(function () {
      $("html,body").animate({ scrollTop: 0 }, "slow");
      return false;
    });
  });

  $(".team-widget-v2 .slider").slick({
    slidesToShow: 3,
    lazyLoad: "ondemand",
    dots: true,
    appendDots: $(".team-widget-v2 .slider-nav .dots"),
    nextArrow: $(".team-widget-v2 .slider-next"),
    prevArrow: $(".team-widget-v2 .slider-prev"),
    infinite: false,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          lazyLoad: "progressive",
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
          focusOnSelect: true,
        },
      },
    ],
  });

  $(".team-widget-v2 .slider").on(
    "lazyLoaded",
    function (event, slick, image, imageSource) {
      setTimeout(function () {
        $(image).closest(".team-item").animate({
          opacity: 1,
        });
      }, 300);
    }
  );

  $(".watch-button").click(function (e) {
    e.preventDefault();
    $(".team-video").addClass("active");
    $(".team-video iframe")[0].src += "&autoplay=1";
    $("body").css("overflow-y", "hidden");
  });

  $(".team-video .close").click(function () {
    $(".team-video").removeClass("active");
    $("body").css("overflow-y", "visible");
    $(".team-video iframe").each(function () {
      $(".team-video iframe")[0].src = $(this).attr("data-stop");
    });
  });

  $(".nav .with-children").hover(function () {
    $(this).find(".submenu").addClass("active").finish().animate(
      {
        opacity: 1,
      },
      300
    );
    $(this).addClass("hovered");
  });

  $(".nav .with-children").mouseleave(function () {
    setTimeout(function () {
      if (
        $(".submenu.active:hover").length == 0 &&
        $(".nav .with-children.hovered:hover").length == 0
      ) {
        $(".submenu.active").animate(
          {
            opacity: 0,
          },
          300,
          "linear",
          function () {
            $(".submenu.active").removeClass("active");
            $(".nav .with-children.hovered").removeClass("hovered");
          }
        );
      }
    }, 1000);
  });

  $(".submenu.active").click(function (e) {
    e.stopPropagation();
  });

  $(document).on("click", function () {
    $(".submenu.active").removeClass("active");
  });

  $(".vm-cta .radio").click(function () {
    $(".vm-cta .radio").removeClass("active");
    $(".vm-cta .radio input").prop("checked", false);
    $(this).addClass("active");
    $(this).find("input").prop("checked", true);
  });

  $(".vm-cta [data-qty]").click(function () {
    const mathOperation = $(this).attr("data-qty");
    const input = $(".vm-cta .quantity-input");
    let inputVal = parseInt($(input).val());

    switch (mathOperation) {
      case "-":
        if ($(input).val() > 1) {
          $(input).val(--inputVal);
        }
        break;

      case "+":
        $(input).val(++inputVal);
        break;
    }
  });

  $(".vm-cta .quantity-input").on("change", function () {
    if ($(this).val() < 1) {
      $(this).val(1);
    }
  });

  $(".vm-company-values .accordion-item").each(function () {
    const item = $(this);
    const itemInner = $(item).find(".item-inner");
    const heading = $(item).find(".controls");
    const text = $(item).find(".text");

    if ($(window).width() > 1199) {
      if (text.innerHeight() > heading.innerHeight() + 20) {
        $(itemInner).height(heading.innerHeight() + 20);
      } else {
        $(item).find(".accordion-button").remove();
        $(item).addClass("disabled");
      }
    } else {
      $(itemInner).height(heading.innerHeight());
    }
  });

  $(".vm-company-values .accordion-item").click(function () {
    const item = $(this);
    const heading = $(item).find(".heading");
    const text = $(item).find(".text");

    if (text.innerHeight() > heading.innerHeight()) {
      $(this).vCardion(
        ".item-inner",
        ".accordion-item",
        $(this).find(".controls").innerHeight() + 20
      );
    }
  });

  $(".langs").mouseleave(function () {
    setTimeout(function () {
      if ($(".langs:hover").length == 0) {
        const switcher = $("header .language-switcher");
        $("header .langs .active-lang").removeClass("active");
        $(switcher).animate(
          {
            opacity: 0,
          },
          300,
          "swing",
          function () {
            $(switcher).removeClass("opened");
          }
        );
      }
    }, 1000);
  });

  $(".team-video-background").on("ended", function () {
    this.load();
    this.play();
  });

  $.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
  };

  let isBarLoaded = false;

  $(window).on("resize scroll load", function () {
    if ($(".counter-1").length) {
      if (isBarLoaded === false && $(".counter-1").isInViewport()) {
        isBarLoaded = true;
        const bar = new ldBar(".counter-1", {
          value: 0,
          precision: "0.01",
        });

        const bar2 = new ldBar(".counter-2", {
          value: 0,
          precision: "0.01",
        });

        setTimeout(function () {
          bar.set($(".counter-1").attr("data-bar-value"));
        }, 400);

        setTimeout(function () {
          bar2.set($(".counter-2").attr("data-bar-value"));
        }, 600);
      }
    }
  });

  if ($(window).width() > 1023) {
    $(".core .hover-group").mouseenter(function (e) {
      $(".core .hover-group")
        .removeClass("hover")
        .removeClass("present-animation");
      breakInterval = true;

      if ($(this).attr("data-text")) {
        renderNotice($(this));
      }

      if ($(this).attr("data-image")) {
        renderImageNotice($(this));
      }

      $(this).addClass("hover");
    });

    $(".core .hover-group").on("mouseleave", function (e) {
      $(this).removeClass("hover");
      $(".core .notice").stop().fadeOut(300);
      $(".core .image-notice").stop().fadeOut(300);
    });
  }

  function renderNotice(el) {
    const params = $(el)[0].getBBox();
    const offsetTop =
      $(el).offset().top - $(".core").offset().top + params.height + 20;
    const offsetLeft =
      $(el).offset().left - $(".core").offset().left - 167 + params.width / 2;
    $(".core .notice")
      .css("left", offsetLeft + "px")
      .css("top", offsetTop + "px");
    $(".core .notice")
      .text($(el).attr("data-text"))
      .css("opacity", 1)
      .stop()
      .fadeIn(300);
  }

  function renderImageNotice(el) {
    const params = $(el)[0].getBBox();
    const offsetTop =
      $(el).offset().top -
      $(".core").offset().top +
      params.height +
      20 +
      $(".core .notice").outerHeight() +
      4;
    const offsetLeft =
      $(el).offset().left - $(".core").offset().left - 167 + params.width / 2;
    $(".core .image-notice")
      .css("left", offsetLeft + "px")
      .css("top", offsetTop + "px");
    $(".core .image-notice").css("opacity", 1).stop().fadeIn(300);
    $(".core .image-notice img").attr("src", $(el).attr("data-image"));
  }

  let breakInterval = false;
  const params = new URLSearchParams(window.location.search);
  if (params.has("girlyanda")) {
    setInterval(function () {
      if (breakInterval === false) {
        $(".hover-group").removeClass("present-animation");
        var n_elements = $(".hover-group").length;
        var random = Math.floor(Math.random() * n_elements);
        $(".hover-group").eq(random).addClass("present-animation");
      }
    }, 3000);
  }
})(jQuery);
