const navigatorSubtitle = document.getElementById("navigator-subtitle");
const navigatorLoader = document.getElementById("navigator-loader");
const post = document.getElementById("post");

window.onscroll = function () {
  const totalHeight = post.scrollHeight;
  const distance = document.documentElement.scrollTop || document.body.scrollTop;

  if (distance > 100) {
    navigatorSubtitle.style.display = "block";
  } else {
    navigatorSubtitle.style.display = "none";
  }

  const width = distance / totalHeight;
  navigatorLoader.style.width = 100 * width + "%";
};
