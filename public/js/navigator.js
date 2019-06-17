const navigatorLoader = document.getElementById("navigator-loader");
const post = document.getElementById("post");

window.onscroll = function () {
  if (post) {
    const totalHeight = post.scrollHeight;
    const distance = document.documentElement.scrollTop || document.body.scrollTop;

    const width = distance / totalHeight;
    navigatorLoader.style.width = 100 * width + "%";
  }
};
