(function ($) {
  let selectedContainer = $(".vm-calc .pick-bar .selected-items");
  let cashCounter = $(".sidebar__total .cash");
  let percentsCounter = $(".sidebar__total .percents");
  let totalCounter = $(".results .end-total-cost");
  let incomeCounter = $(".results .dividends");
  let endCost = 28560000;
  let dividends = 54980;
  let maxShares = 10;

  function calculateCashSum() {
    let sum = 0;
    $(document)
      .find(".selected-items .selected-position")
      .each(function () {
        let cash = parseInt($(this).find(".cash").html().replace("$", ""));
        sum += cash;
      });
    $(cashCounter).html("$" + sum.toLocaleString());
  }

  function calculatePercentSum() {
    let sum = 0;
    $(document)
      .find(".selected-items .selected-position")
      .each(function () {
        let percents = parseFloat(
          $(this).find(".percent").html().replace("%", "")
        );
        sum += percents;
      });

    return sum;
  }

  function isCartNotEmpty() {
    if ($(document).find(".selected-items .selected-position").length) {
      return true;
    }
  }

  function refreshStats() {
    calculateCashSum();
    redrawPercentsBar(calculatePercentSum());

    if (isCartNotEmpty()) {
      if ($(window).width() > 1199) {
        $(".sidebar").addClass("active");
      }
      $(".sidebar .pick-bar").removeClass("hidden");
      $(".sidebar .sidebar__instruction").addClass("hidden");
      $(".vm-calc .pos-counter").html($(".selected-items").children().length);
    } else {
      $(".sidebar").removeClass("active");
      $(".sidebar .pick-bar").addClass("hidden");
      $(".sidebar .sidebar__instruction").removeClass("hidden");
    }
  }

  function createSelectedComponent(el) {
    let cash = $(el).find(".cash").html();
    let id = $(el).attr("data-position");
    let percentage = parseFloat($(el).find(".percent").html());
    let component =
      "<li data-id='" +
      id +
      "' class='selected-position'><span class='cash'>" +
      cash +
      " / </span> <span class='percent'>" +
      percentage +
      "%</span><span class='delete'>&#215;</span></li>";

    if (percentage + calculatePercentSum() <= maxShares) {
      $(selectedContainer).append(component);
      refreshStats();
      return true;
    } else {
      return false;
    }
  }

  function deleteItem(el) {
    let position = $(el).closest(".selected-position");
    let id = $(position).attr("data-id");
    $(position).remove();
    $('[data-position = "' + id + '"]').removeClass("-selected");
    refreshStats();
  }

  function redrawPercentsBar(sum) {
    $(percentsCounter).html(sum.toFixed(2) + "%");
    $(totalCounter).html(
      "$" + ((endCost / 100) * sum.toFixed(1)).toLocaleString()
    );
    let income = (dividends * sum.toFixed(1)).toFixed(0);
    $(incomeCounter).html("$" + numberWithSpaces(income));
  }

  $(document).on("click", ".selected-position .delete", function () {
    deleteItem($(this));
  });

  function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }

  $(".position.-available").click(function () {
    if (!$(this).hasClass("-selected")) {
      if (createSelectedComponent($(this))) {
        $(this).addClass("-selected");
      }
    } else {
      let id = $(this).attr("data-position");
      let el = $(".sidebar .selected-items [data-id=" + id + "] .delete");
      deleteItem($(el));
    }
  });

  $(window).on("load", function () {
    $(".work-area .-available").addClass("scroll-to");

    let coef = 1;

    if ($(window).width() <= 567) {
      coef = 0.1;
    }

    if ($(".vm-calc .work-area").length) {
      $(".work-area").animate({
        scrollLeft: $(document).find(".scroll-to").offset().left - 856 * coef,
      });
    }
  });
})(jQuery);
