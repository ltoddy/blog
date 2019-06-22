window.onload = function () {
  const closeBtn = document.getElementById("close");

  if (closeBtn) {
    closeBtn.onclick = function (event) {
      const navs = document.getElementsByClassName("flash-content");

      for (let i = 0; i < navs.length; i++) {
        navs[i].style.display = "none";
      }
    };
  }
};
