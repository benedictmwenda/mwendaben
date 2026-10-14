// Portfolio detail modals (demo items): delegated so it also works for items added by script
document.addEventListener("DOMContentLoaded", function () {
  function closeAll() {
    document.querySelectorAll(".portfolio-modal").forEach(function (m) { m.style.display = "none"; });
    closeModalBox();
  }

  // Main popup (portfolio details, services, blog): close it and clear its content
  function closeModalBox() {
    var box = document.querySelector(".aali_tm_modalbox");
    if (!box || !box.classList.contains("opened")) return;
    box.classList.remove("opened");
    var wrap = box.querySelector(".description_wrap");
    if (wrap) wrap.innerHTML = "";
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
    // click on the dark area around the popup closes it
    if (event.target.classList && event.target.classList.contains("aali_tm_modalbox")) {
      closeModalBox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAll();
  });
});
