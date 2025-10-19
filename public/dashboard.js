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
let hamBurgerCollapsed = false;
// hamBurger.addEventListener("click", () => {
//   if (!hamBurgerCollapsed) {
//     hamBurgerCollapsed = true;
//     grid.style.gridTemplateColumns = "0px 1fr";
//     nav.style.width = "95%";
//     logoBox.style.width = "5%";
//     sideBar.style.transform = "translateX(-500px)";
//     logoBox.style.transform = "translateX(-500px)";
//   } else {
//     hamBurgerCollapsed = false;
//     grid.style.gridTemplateColumns = "250px 1fr";
//     nav.style.width = "80%";
//     logoBox.style.width = "20%";
//     sideBar.style.transform = "translateX(0px)";
//     logoBox.style.transform = "translateX(0px)";
//   }
// });

hamBurger.addEventListener("click", () => {
  grid.classList.toggle("collapsed");
  logoBox.classList.toggle("hidden");
  nav.classList.toggle("non-collapsed");
});
