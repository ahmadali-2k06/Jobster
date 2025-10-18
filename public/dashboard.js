import getAccessToken from "./helpers/getAccessToken.js";
const token = await getAccessToken();

const payload = jwt_decode(token);
console.log(payload);
