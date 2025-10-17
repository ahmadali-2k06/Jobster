const loginForm = document.querySelector(".login-form-box");
const registerForm = document.querySelector(".register-form-box");
const registerLink = document.querySelector(".register-link");
const loginLink = document.querySelector(".login-link");
const loadingBar = document.querySelector(".loading-bar");
const notificationBox = document.querySelector(".notification-box");
const notificationClosebtn = document.querySelector(".close-button");

let interval;
let width = 0;

let errorSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.5-5.009c0-.867.659-1.491 1.491-1.491.85 0 1.509.624 1.509 1.491 0 .867-.659 1.509-1.509 1.509-.832 0-1.491-.642-1.491-1.509zM11.172 6a.5.5 0 0 0-.499.522l.306 7a.5.5 0 0 0 .5.478h1.043a.5.5 0 0 0 .5-.478l.305-7a.5.5 0 0 0-.5-.522h-1.655z" fill="#e74c3c"></path></g></svg>`;
let successSvg = `  <svg  viewBox="0 0 512 512"  version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" > <g id="SVGRepo_bgCarrier" stroke-width="0"></g> <g  id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" ></g> <g id="SVGRepo_iconCarrier">  <title>success-filled</title> <g  id="Page-1" stroke="none" stroke-width="1"  fill="none"  fill-rule="evenodd" >  <g id="add-copy-2" fill="#07bc0c" transform="translate(42.666667, 42.666667)"  >  <path d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51296 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.153707,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51296 331.153707,3.55271368e-14 213.333333,3.55271368e-14 Z M293.669333,137.114453 L323.835947,167.281067 L192,299.66912 L112.916693,220.585813 L143.083307,190.4192 L192,239.335893 L293.669333,137.114453 Z" id="Shape" ></path></g></g>  </g>  </svg>`;
registerLink.addEventListener("click", () => {
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
});

loginLink.addEventListener("click", () => {
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
});

registerForm.addEventListener("submit", async (e) => {
  const text = registerForm.querySelector(".submit-text-register");
  const loader = registerForm.querySelector(".loader-register");
  e.preventDefault();
  text.style.display = "none";
  loader.style.display = "block";
  const formData = new FormData(e.target);
  const body = Object.fromEntries(formData);
  try {
    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      sendNotification("error", data.msg);
    } else {
      sendNotification("success", "Registered Successfully!");
    }
  } catch (err) {
    sendNotification("error", err.message);
  } finally {
    text.style.display = "inline";
    loader.style.display = "none";
  }
  const credentials = await response.json();
  localStorage.setItem("token", credentials.accessToken);
  getAccesToken();
});

loginForm.addEventListener("submit", async (e) => {
  const text = loginForm.querySelector(".submit-text-login");
  const loader = loginForm.querySelector(".loader-login");
  e.preventDefault();
  text.style.display = "none";
  loader.style.display = "block";
  const formData = new FormData(e.target);
  const body = Object.fromEntries(formData);
  try {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      sendNotification("error", data.msg);
    } else {
      sendNotification("success", "Login Succeed!");
    }
  } catch (err) {
    sendNotification("error", err.message);
  } finally {
    text.style.display = "inline";
    loader.style.display = "none";
  }
});

async function getAccesToken() {
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
      window.location.href = "/login";
    }
  }
  return token;
}

notificationClosebtn.addEventListener("click", () => {
  notificationBox.style.transform = "translateY(-1000px)";
});

function stratLoading(bar) {
  interval = setInterval(() => {
    if (width > 99) {
      clearInterval(interval);
      notificationBox.style.transform = "translateY(-1000px)";
    } else {
      width += 1;
      bar.style.width = width + "%";
    }
  }, 70);
}

async function sendNotification(type = "success", message) {
  clearInterval(interval);
  width = 0;
  loadingBar.style.width = "0%";
  const messageContent = notificationBox.querySelector(".message-box");
  const svgBox = notificationBox.querySelector(".notification-icon-box");
  if (type === "success") {
    svgBox.innerHTML = `${successSvg}`;
    loadingBar.style.background = `#07bc0c`;
  } else {
    svgBox.innerHTML = `${errorSvg}`;
    loadingBar.style.background = `#e74c3c`;
  }
  messageContent.innerText = `${message}`;
  notificationBox.style.transform = "translateY(-44vh)";
  setTimeout(() => {
    stratLoading(loadingBar);
  }, 300);
}

notificationBox.addEventListener("mouseenter", () => {
  clearInterval(interval);
});

notificationBox.addEventListener("mouseleave", () => {
  stratLoading(loadingBar);
});
