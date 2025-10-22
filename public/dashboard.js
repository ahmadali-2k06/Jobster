// import getAccessToken from "./helpers/getAccessToken.js";
// const token = await getAccessToken();
// const id = localStorage.getItem("user");
// let user;
// async function getUser(id) {
//   const data = await fetch(`http://localhost:5000/user/${id}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   user = await data.json();
// }
// getUser(id);

const hamBurger = document.querySelector(".ham-burger-svg-box ");
const sideBar = document.querySelector(".side-bar");
const logoBox = document.querySelector(".logo-box");
const grid = document.querySelector(".main-grid");
const nav = document.querySelector(".main-nav-box");
const profileButton = document.querySelector(".logout-button");
const logOutButton = document.querySelector(".button-log-out");
let hamBurgerCollapsed = false;

hamBurger.addEventListener("click", () => {
  grid.classList.toggle("collapsed");
  logoBox.classList.toggle("hidden");
  nav.classList.toggle("non-collapsed");
});

profileButton.addEventListener("click", () => {
  logOutButton.classList.toggle("show");
});
