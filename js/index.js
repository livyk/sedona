const nav = document.querySelector("nav.main-nav"),
  openNavButton = document.querySelector(".main-nav__burger-button"),
  closeNavButton = document.querySelector(".main-nav__close-button");


openNavButton.onclick = function () {
  if (nav.classList.contains("main-nav--closed")) {
    nav.classList.remove("main-nav--closed");
    nav.classList.add("main-nav--showing");
    document.querySelector('.main-nav__list-item > a[href]').focus();
  } else {
    nav.classList.add("main-nav--hidding");
  }
};

document.querySelector('.main-nav')
.addEventListener("animationend", function() {
  if(nav.classList.contains("main-nav--hidding")) {
    nav.classList.remove("main-nav--hidding");
    nav.classList.add("main-nav--closed");
  } else {
    nav.classList.remove("main-nav--showing");
  }
}, false);

closeNavButton.onclick = function () {
  nav.classList.add("main-nav--hidding");
};
