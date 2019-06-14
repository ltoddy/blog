const navigatorSubtitle = document.getElementById("navigator-subtitle");
const navigatorLoader = document.getElementById("navigator-loader");

window.onscroll = function () {
  const totalHeight = document.body.scrollHeight - window.screen.availHeight;
  const distance = document.documentElement.scrollTop || document.body.scrollTop;

  if (distance > 100) {
    navigatorSubtitle.style.display = "block";
  } else {
    navigatorSubtitle.style.display = "none";
  }

  const width = distance / totalHeight;
  navigatorLoader.style.width = 100 * width + "%";
};
