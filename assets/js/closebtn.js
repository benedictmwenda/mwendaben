// Portfolio detail modals (demo items): delegated so it also works for items added by script
document.addEventListener("DOMContentLoaded", function () {
  function closeAll() {
    document.querySelectorAll(".portfolio-modal").forEach(function (m) { m.style.display = "none"; });
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest(".popup-trigger");
    if (trigger) {
      var item = trigger.closest("li");
      var modal = item && item.querySelector(".portfolio-modal");
      if (modal) { event.preventDefault(); modal.style.display = "flex"; }
      return;
    }
    if (event.target.closest(".close-btn")) {
      var m = event.target.closest(".portfolio-modal");
      if (m) m.style.display = "none";
      return;
    }
    if (event.target.classList && event.target.classList.contains("portfolio-modal")) {
      event.target.style.display = "none";
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAll();
  });
});
