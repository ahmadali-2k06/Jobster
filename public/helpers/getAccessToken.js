export default async function getAccessToken() {
  let token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log(payload.exp);

  const isExpired = payload.exp * 1000 < Date.now();
  if (isExpired) {
    const res = await fetch("http://localhost:5000/auth/refreshToken", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } else {
      localStorage.removeItem("accessToken");
      window.location.href = "/public/login.html";
    }
  }
  return token;
}


