import getAccessToken from "./helpers/getAccessToken.js";
const hamBurger = document.querySelector(".ham-burger-svg-box ");
const logoBox = document.querySelector(".logo-box");
const grid = document.querySelector(".main-grid");
const nav = document.querySelector(".main-nav-box");
const profileButton = document.querySelector(".logout-button");
const logOutButton = document.querySelector(".button-log-out");
const chartButton = document.querySelector(".chart-name");
const barChart = document.querySelector("#jobsBarChart");
const areaChart = document.querySelector("#jobsAreaChart");
const pendingCount = document.querySelector(".pending-jobs-count");
const interviewCount = document.querySelector(".interview-jobs-count");
const declinedCount = document.querySelector(".declined-jobs-count");
const asideButtons = document.querySelectorAll(".side-bar-item");
const mainBoxes = document.querySelectorAll(".main-box");
const jobsBox = document.querySelector(".jobs-cards-box");
const jobsCount = document.querySelector(".total-jobs-count");
const pageList = document.querySelector(".page-list");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const jobsLoader = document.querySelector(".loader");
const searchFieldJob = document.querySelector("#search");
const paginationBox = document.querySelector(".pagination-box");
const statusSelect = document.querySelector("#status");
const typeSelect = document.querySelector("#type");
const sortSelect = document.querySelector("#sort");
const clearFilterbtn = document.querySelector(".clear-btn");
const noJobsBox = document.querySelector(".no-jobs-container");
const backJobsbtn = document.querySelector(".back-jobs-btn");
const confirmBox = document.getElementById("confirmBox");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const notificationBox = document.querySelector(".notification-box");
const notificationClosebtn = document.querySelector(".close-button");
const loadingBar = document.querySelector(".loading-bar");
const positionField = document.querySelector("#position");
const companyField = document.querySelector("#company");
const locationField = document.querySelector("#location");
const statusSelectAddJob = document.querySelector("#statusAddJob");
const typeSelectAddJob = document.querySelector("#jobType");
const clearbtnAddJob = document.querySelector(".btn-clear");
const submitbtn = document.querySelector(".btn-submit ");
const allJobsSectionButton = document.querySelector(
  `[data-target="AddJob-BOX"]`
);
const nameField = document.querySelector("#name");
const emailField = document.querySelector("#email");
const locationFieldUser = document.querySelector("#locationUser");
const saveProfileButton = document.querySelector(".save-profile-btn");
const userNameNav = document.querySelector(".user-name");
let addjobFields = document.querySelectorAll(".form-group input");
let errorSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.5-5.009c0-.867.659-1.491 1.491-1.491.85 0 1.509.624 1.509 1.491 0 .867-.659 1.509-1.509 1.509-.832 0-1.491-.642-1.491-1.509zM11.172 6a.5.5 0 0 0-.499.522l.306 7a.5.5 0 0 0 .5.478h1.043a.5.5 0 0 0 .5-.478l.305-7a.5.5 0 0 0-.5-.522h-1.655z" fill="#e74c3c"></path></g></svg>`;
let successSvg = `  <svg  viewBox="0 0 512 512"  version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" > <g id="SVGRepo_bgCarrier" stroke-width="0"></g> <g  id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" ></g> <g id="SVGRepo_iconCarrier">  <title>success-filled</title> <g  id="Page-1" stroke="none" stroke-width="1"  fill="none"  fill-rule="evenodd" >  <g id="add-copy-2" fill="#07bc0c" transform="translate(42.666667, 42.666667)"  >  <path d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51296 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.153707,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51296 331.153707,3.55271368e-14 213.333333,3.55271368e-14 Z M293.669333,137.114453 L323.835947,167.281067 L192,299.66912 L112.916693,220.585813 L143.083307,190.4192 L192,239.335893 L293.669333,137.114453 Z" id="Shape" ></path></g></g>  </g>  </svg>`;
const token = await getAccessToken();
const id = localStorage.getItem("user");
let user;
let currentPage = 1;
let totalPages = 1;
let jobIdToDelete = null;
let jobIdtoUpdate = null;
let interval;
let width = 0;
const maxVisible = 5;
async function getUser(id) {
  const data = await fetch(`http://localhost:5000/user/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  user = await data.json();
}
await getUser(id);
populateUserFields();
hamBurger.addEventListener("click", () => {
  grid.classList.toggle("collapsed");
  logoBox.classList.toggle("hidden");
  nav.classList.toggle("non-collapsed");
});

profileButton.addEventListener("click", () => {
  logOutButton.classList.toggle("active");
});

prevButton.addEventListener("click", () => goToPage(currentPage - 1));
nextButton.addEventListener("click", () => goToPage(currentPage + 1));

async function loadChart() {
  const chartLoader = document.querySelector(".loader-charts");
  barChart.style.display = "none";
  areaChart.style.display = "none";
  chartLoader.style.display = "block";
  try {
    const userId = `${id}`;
    const res = await fetch(`/jobs/count/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    declinedCount.innerText = `${data.statusdistributed.declined}`;
    interviewCount.innerText = `${data.statusdistributed.interviewScheduled}`;
    pendingCount.innerText = `${data.statusdistributed.pending}`;

    const months = Object.keys(data.monthCounts);
    const counts = Object.values(data.monthCounts);

    const barsChartCanvas = document
      .getElementById("jobsBarChart")
      .getContext("2d");
    const areaChartCanvas = document
      .getElementById("jobsAreaChart")
      .getContext("2d");

    new Chart(barsChartCanvas, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Jobs Created",
            data: counts,
            backgroundColor: "#3b82f6",
            borderRadius: 6,
            barThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e3a8a",
            titleColor: "#fff",
            bodyColor: "#fff",
          },
        },
        scales: {
          x: {
            grid: { borderDash: [4, 4], color: "#e5e7eb" },
            ticks: { color: "#374151", font: { size: 14 } },
          },
          y: {
            beginAtZero: true,
            grid: { borderDash: [4, 4], color: "#e5e7eb" },
            ticks: { stepSize: 2, color: "#374151", font: { size: 14 } },
          },
        },
        animation: {
          duration: 1200,
          easing: "easeOutQuart",
        },
      },
    });

    new Chart(areaChartCanvas, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Jobs Created",
            data: counts,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.25)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "#3b82f6",
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#1e3a8a",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e3a8a",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderWidth: 1,
            borderColor: "#3b82f6",
          },
        },
        scales: {
          x: {
            grid: { borderDash: [4, 4], color: "#e5e7eb" },
            ticks: { color: "#374151", font: { size: 14 } },
          },
          y: {
            beginAtZero: true,
            grid: { borderDash: [4, 4], color: "#e5e7eb" },
            ticks: { stepSize: 2, color: "#374151", font: { size: 14 } },
          },
        },
        animation: {
          duration: 1200,
          easing: "easeOutQuart",
        },
      },
    });
    chartLoader.style.display = "none";
    areaChart.style.display = "none";
    barChart.style.display = "block";
  } catch (err) {
    console.error("Error loading chart:", err);
    chartLoader.style.display = "none";
  }
}
chartButton.addEventListener("click", () => {
  if (chartButton.innerText === "Area Chart") {
    chartButton.innerText = "Bar Chart";
    areaChart.style.display = "block";
    barChart.style.display = "none";
  } else if (chartButton.innerText === "Bar Chart") {
    chartButton.innerText = "Area Chart";
    areaChart.style.display = "none";
    barChart.style.display = "block";
  }
});

asideButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    asideButtons.forEach((btn) => btn.classList.remove("active-button-side"));
    e.currentTarget.classList.add("active-button-side");
    const name = e.currentTarget.getAttribute("data-target");
    mainBoxes.forEach((box) => {
      box.classList.add("non-active");
      if (box.getAttribute("data-name") === name) {
        box.classList.remove("non-active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const clearBtn = document.querySelector(".clear-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchForm.reset();
    });
  }
});

async function loadJobs(page = 1) {
  paginationBox.classList.add("non-active");
  noJobsBox.classList.add("non-active");
  const search = searchFieldJob.value;
  const status = statusSelect.value;
  const type = typeSelect.value;
  const sort = sortSelect.value;
  jobsBox.innerHTML = "";
  jobsLoader.classList.remove("non-active");
  const params = new URLSearchParams();
  params.set("page", page);
  if (search) {
    params.set("search", search);
  }
  if (status && status !== "all") {
    params.set("status", status);
  }
  if (type && type !== "all") {
    params.set("type", type);
  }
  if (sort) {
    params.set("sort", sort);
  }
  const res = await fetch(`/jobs?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  currentPage = page;
  totalPages = data.totalPages;
  createPagination();
  if (data.jobs.length === 0) {
    noJobsBox.classList.remove("non-active");
  }
  jobsCount.innerHTML = `${data.totalJobs} Jobs Found`;
  jobsLoader.classList.add("non-active");
  if (totalPages > 1) {
    paginationBox.classList.remove("non-active");
  }
  data.jobs.forEach((job) => {
    createJobCard(
      job.status,
      job.position,
      job.company,
      job.location,
      job.type,
      job.createdAt,
      job._id
    );
  });
}

loadJobs();

function createJobCard(status, title, company, location, type, date, id) {
  let jobCard = document.createElement("div");
  jobCard.setAttribute("data-id", id);
  jobCard.classList.add("job-card");
  jobCard.innerHTML = `  <div class="card-header">
        <div class="logo">${company.split("")[0]}</div>
        <div class="title-group">
          <h5 class="job-title">${title}</h5>
          <p class="company-name">${company}</p>
        </div>
      </div>

      <div class="card-body">
        <div class="info-item">
          <i class="fas fa-map-marker-alt"></i>
          <span class="location">${location}</span>
        </div>
        <div class="info-item">
          <i class="fas fa-calendar-alt"></i>
          <span>${new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}</span>
        </div>
        <div class="info-item">
          <i class="fas fa-briefcase"></i>
          <span class="type">${type}</span>
        </div>
        <div class="info-item">
          <span class="status status-${status}">${status}</span>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </div>`;
  jobsBox.appendChild(jobCard);
}

function createPagination() {
  pageList.innerHTML = "";
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "page-link" + (i === currentPage ? " active" : "");
    btn.dataset.page = i;
    btn.textContent = i;
    btn.addEventListener("click", () => goToPage(i));
    li.appendChild(btn);
    pageList.appendChild(li);
  }
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

function goToPage(n) {
  if (n < 1) n = 1;
  if (n > totalPages) n = totalPages;
  currentPage = n;
  loadJobs(currentPage);
}

loadChart();

let searchTimeout;
searchFieldJob.addEventListener("input", async (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    loadJobs(1);
  }, 400);
});

statusSelect.addEventListener("change", () => {
  loadJobs(1);
});
typeSelect.addEventListener("change", () => {
  loadJobs(1);
});
sortSelect.addEventListener("change", () => {
  loadJobs(1);
});

clearFilterbtn.addEventListener("click", () => {
  clearFilters();
});

backJobsbtn.addEventListener("click", () => {
  clearFilters();
});

function clearFilters() {
  searchFieldJob.value = "";
  statusSelect.value = "all";
  typeSelect.value = "all";
  sortSelect.value = "latest";
  loadJobs(1);
}

jobsBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const card = e.target.closest(".job-card");
    if (card) {
      const id = card.getAttribute("data-id");
      jobIdToDelete = id;
      confirmBox.style.display = "flex";
    }
  }
});

cancelDelete.addEventListener("click", () => {
  confirmBox.style.display = "none";
  jobIdToDelete = null;
});

confirmDelete.addEventListener("click", async () => {
  if (!jobIdToDelete) {
    return;
  }
  try {
    const res = await fetch(`/jobs/${jobIdToDelete}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      sendNotification("success", "Job deleted successfully!");
      loadJobs();
    } else {
      sendNotification("error", data.msg || "Failed to delete Job.Try again!");
    }
  } catch (err) {
    sendNotification("error", err);
  }
  confirmBox.style.display = "none";
  jobIdToDelete = null;
});

//notification loading
function startLoading(bar) {
  interval = setInterval(() => {
    if (width > 99) {
      clearInterval(interval);
      notificationBox.style.transform = "translate(-50%, -1000px)";
    } else {
      width += 1;
      bar.style.width = width + "%";
    }
  }, 40);
}

//send Notification
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
  notificationBox.style.transform = "translate(-50%, 0)";
  setTimeout(() => {
    startLoading(loadingBar);
  }, 300);
}

notificationBox.addEventListener("mouseenter", () => {
  clearInterval(interval);
});

notificationBox.addEventListener("mouseleave", () => {
  startLoading(loadingBar);
});

notificationClosebtn.addEventListener("click", () => {
  notificationBox.style.transform = "translate(-50%, -1000px)";
});

submitbtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let position = positionField.value;
  let company = companyField.value;
  let status = statusSelectAddJob.value;
  let type = typeSelectAddJob.value;
  let location = locationField.value;
  if (
    position === "" ||
    company === "" ||
    status === "" ||
    type === "" ||
    location === ""
  ) {
    sendNotification("error", "Please fill out all the fields!");
  } else {
    if (jobIdtoUpdate === null) {
      try {
        submitbtn.classList.add("active");
        const res = await fetch(`/jobs`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: position,
            company: company,
            status: status,
            type: type,
            location: location,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          sendNotification("success", "Job Added Successfully!");
          loadJobs(1);
        } else {
          sendNotification(
            "error",
            data.msg || "An error occured while adding job!"
          );
        }
      } catch (err) {
        sendNotification("error", err);
      } finally {
        clearaddJobForm();
        submitbtn.classList.remove("active");
      }
    } else {
      try {
        submitbtn.classList.add("active");
        const res = await fetch(`/jobs/${jobIdtoUpdate}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: position,
            company: company,
            status: status,
            type: type,
            location: location,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          sendNotification("success", "Job Updated Successfully!");
          loadJobs(1);
        } else {
          sendNotification(
            "error",
            data.msg || "An error occured while Updating job!"
          );
        }
      } catch (err) {
        sendNotification("error", err);
      } finally {
        clearaddJobForm();
        submitbtn.classList.remove("active");
        jobIdtoUpdate = null;
        submitbtn.querySelector(".submit-text").innerText = "Submit";
      }
    }
  }
});

clearbtnAddJob.addEventListener("click", () => {
  clearaddJobForm();
});

//clear Add Job Form
function clearaddJobForm() {
  addjobFields.forEach((field) => {
    field.value = "";
    jobIdtoUpdate = null;
    submitbtn.querySelector(".submit-text").innerText = "Submit";
  });
}

jobsBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    const card = e.target.closest(".job-card");
    jobIdtoUpdate = card.getAttribute("data-id");
    let position = card.querySelector(".job-title").innerText;
    let company = card.querySelector(".company-name").innerText;
    let location = card.querySelector(".location").innerText;
    let type = card.querySelector(".type").innerText;
    let status = card.querySelector(".status").innerText.toLowerCase();
    positionField.value = position;
    companyField.value = company;
    locationField.value = location;
    typeSelectAddJob.value = type;
    statusSelectAddJob.value = status;
    submitbtn.querySelector(".submit-text").innerText = "Update";
    allJobsSectionButton.click();
  }
});

function populateUserFields() {
  nameField.value = user.name;
  locationFieldUser.value = user.location;
  emailField.value = user.email;
  userNameNav.innerHTML = user.name;
}

saveProfileButton.addEventListener("click", async () => {
  saveProfileButton.classList.add("active");
  const name = nameField.value;
  const location = locationFieldUser.value;
  const email = emailField.value;
  try {
    const res = await fetch(`/user/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        location: location,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      sendNotification("success", "Changes saved successfully!");
    } else {
      sendNotification("error", data.msg || "Failed to save changes!");
    }
  } catch (err) {
    sendNotification(
      "error",
      err || "An error occured while saving the user! Try again later."
    );
  } finally {
    saveProfileButton.classList.remove("active");
  }
});

logOutButton.addEventListener("click", () => {
  logout();
});

async function logout() {
  await fetch("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
}

