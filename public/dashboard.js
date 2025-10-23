import getAccessToken from "./helpers/getAccessToken.js";
const token = await getAccessToken();
const id = localStorage.getItem("user");
let user;
async function getUser(id) {
  const data = await fetch(`http://localhost:5000/user/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  user = await data.json();
}
getUser(id);

const hamBurger = document.querySelector(".ham-burger-svg-box ");
const logoBox = document.querySelector(".logo-box");
const grid = document.querySelector(".main-grid");
const nav = document.querySelector(".main-nav-box");
const profileButton = document.querySelector(".logout-button");
const logOutButton = document.querySelector(".button-log-out");
const chartButton = document.querySelector(".chart-name");
const barChart = document.querySelector("#jobsBarChart");
const areaChart = document.querySelector("#jobsAreaChart");

hamBurger.addEventListener("click", () => {
  grid.classList.toggle("collapsed");
  logoBox.classList.toggle("hidden");
  nav.classList.toggle("non-collapsed");
});

profileButton.addEventListener("click", () => {
  logOutButton.classList.toggle("show");
});

async function loadChart() {
  const chartLoader = document.querySelector(".loader-charts");
  barChart.style.display = "none";
  areaChart.style.display = "none";
  chartLoader.style.display = "block";
  try {
    const userId = `${id}`;
    const res = await fetch(`/jobs/count/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

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

loadChart();
