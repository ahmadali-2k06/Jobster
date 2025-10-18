import getAccessToken from "./helpers/getAccessToken.js";
const token = await getAccessToken();
const id = localStorage.getItem("user");

async function getUser(id) {
  const data = await fetch(`http://localhost:5000/user:${id}`, {
    method: "GET",
    Authorization: `Bearer ${token}`,
  });
  console.log(data);
}
getUser(id);
