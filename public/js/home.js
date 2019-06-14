const menu = document.getElementById("menu");
const dropdown = document.getElementById("dropdown");
const container = document.getElementById("container");

if (menu && dropdown) {
  menu.onclick = function () {
    if (dropdown.style.top === "0px") {
      dropdown.style.top = "-100%";
      container.classList.remove("mu");
      menu.innerText = "menu";
    } else {
      dropdown.style.top = 0;
      container.classList.add("mu");
      menu.innerText = "×"
    }
  }
}
