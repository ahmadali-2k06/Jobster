import getAccessToken from "./helpers/getAccessToken.js";
const token = await getAccessToken();
const user = localStorage.getItem("user");
console.log(user);
