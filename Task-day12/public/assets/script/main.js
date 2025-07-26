
  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("user-toggle");
    const menu = document.getElementById("dropdown-menu");

    toggle.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });

    // Tutup menu saat klik di luar
    document.addEventListener("click", function (event) {
      if (!toggle.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.add("hidden");
      }
    });
  });
