const nav = document.querySelector("nav.main-nav"),
  openNavButton = document.querySelector(".main-nav__burger-button"),
  closeNavButton = document.querySelector(".main-nav__close-button");

openNavButton.onclick = function () {
  if (nav.classList.contains("main-nav--closed")) {
    nav.classList.remove("main-nav--closed");
    nav.classList.add("main-nav--opened");
  } else {
    nav.classList.remove("main-nav--opened");
    nav.classList.add("main-nav--closed");
  }
};

closeNavButton.onclick = function () {
  if (nav.classList.contains("main-nav--opened")) {
    nav.classList.remove("main-nav--opened");
    nav.classList.add("main-nav--closed");
  }
};
