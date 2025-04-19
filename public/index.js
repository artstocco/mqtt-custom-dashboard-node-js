// Import MQTT service
import { MQTTService } from "./mqttService.js";

// Target specific HTML items
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

// Holds the background color of all chart
var chartBGColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-background"
);
var chartFontColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-font-color"
);
var chartAxisColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-axis-color"
);

/*
  Event listeners for any HTML click
*/
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");

  // Update Chart background
  chartBGColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-background"
  );
  chartFontColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-font-color"
  );
  chartAxisColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-axis-color"
  );
  updateChartsBackground();
});

/*
  Plotly.js graph and chart setup code
*/
var temperaturaHistoryDiv = document.getElementById("temperatura-history");
var umidadeHistoryDiv = document.getElementById("umidade-history");
var voltagemHistoryDiv = document.getElementById("voltagem-history");
var rpmHistoryDiv = document.getElementById("rpm-history");

var temperaturaGaugeDiv = document.getElementById("temperatura-gauge");
var umidadeGaugeDiv = document.getElementById("umidade-gauge");
var voltagemGaugeDiv = document.getElementById("voltagem-gauge");
var rpmGaugeDiv = document.getElementById("rpm-gauge");

const historyCharts = [
  temperaturaHistoryDiv,
  umidadeHistoryDiv,
  voltagemHistoryDiv,
  rpmHistoryDiv,
];

const gaugeCharts = [
  temperaturaGaugeDiv,
  umidadeGaugeDiv,
  voltagemGaugeDiv,
  rpmGaugeDiv,
];

// History Data
var temperaturaTrace = {
  x: [],
  y: [],
  name: "temperatura",
  mode: "lines+markers",
  type: "line",
};
var umidadeTrace = {
  x: [],
  y: [],
  name: "umidade",
  mode: "lines+markers",
  type: "line",
};
var voltagemTrace = {
  x: [],
  y: [],
  name: "voltagem",
  mode: "lines+markers",
  type: "line",
};
var rpmTrace = {
  x: [],
  y: [],
  name: "rpm",
  mode: "lines+markers",
  type: "line",
};

var temperaturaLayout = {
  autosize: true,
  title: {
    text: "temperatura",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 10 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
};
var umidadeLayout = {
  autosize: true,
  title: {
    text: "umidade",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var voltagemLayout = {
  autosize: true,
  title: {
    text: "voltagem",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var rpmLayout = {
  autosize: true,
  title: {
    text: "rpm",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var config = { responsive: true, displayModeBar: false };

// Event listener when page is loaded
window.addEventListener("load", (event) => {
  Plotly.newPlot(
    temperaturaHistoryDiv,
    [temperaturaTrace],
    temperaturaLayout,
    config
  );
  Plotly.newPlot(umidadeHistoryDiv, [umidadeTrace], umidadeLayout, config);
  Plotly.newPlot(voltagemHistoryDiv, [voltagemTrace], voltagemLayout, config);
  Plotly.newPlot(rpmHistoryDiv, [rpmTrace], rpmLayout, config);

  // Get MQTT Connection
  fetchMQTTConnection();

  // Run it initially
  handleDeviceChange(mediaQuery);
});

// Gauge Data
var temperaturaData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "temperatura" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 30 },
    gauge: {
      axis: { range: [null, 50] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var umidadeData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "umidade" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 50 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var voltagemData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "voltagem" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 750 },
    gauge: {
      axis: { range: [null, 1100] },
      steps: [
        { range: [0, 300], color: "lightgray" },
        { range: [300, 700], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var rpmData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "rpm" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 60 },
    gauge: {
      axis: { range: [null, 150] },
      steps: [
        { range: [0, 50], color: "lightgray" },
        { range: [50, 100], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var layout = { width: 300, height: 250, margin: { t: 0, b: 0, l: 0, r: 0 } };

Plotly.newPlot(temperaturaGaugeDiv, temperaturaData, layout);
Plotly.newPlot(umidadeGaugeDiv, umidadeData, layout);
Plotly.newPlot(voltagemGaugeDiv, voltagemData, layout);
Plotly.newPlot(rpmGaugeDiv, rpmData, layout);

// Will hold the arrays we receive from our BME280 sensor
// temperatura
let newTempXArray = [];
let newTempYArray = [];
// umidade
let newumidadeXArray = [];
let newumidadeYArray = [];
// voltagem
let newvoltagemXArray = [];
let newvoltagemYArray = [];
// rpm
let newrpmXArray = [];
let newrpmYArray = [];

// The maximum number of data points displayed on our scatter/line graph
let MAX_GRAPH_POINTS = 12;
let ctr = 0;

// Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
function updateSensorReadings(jsonResponse) {
  console.log(typeof jsonResponse);
  console.log(jsonResponse);

  let temperatura = Number(jsonResponse.temperatura).toFixed(2);
  let umidade = Number(jsonResponse.umidade).toFixed(2);
  let voltagem = Number(jsonResponse.voltagem).toFixed(2);
  let rpm = Number(jsonResponse.rpm).toFixed(2);

  updateBoxes(temperatura, umidade, voltagem, rpm);

  updateGauge(temperatura, umidade, voltagem, rpm);

  // Update temperatura Line Chart
  updateCharts(
    temperaturaHistoryDiv,
    newTempXArray,
    newTempYArray,
    temperatura
  );
  // Update umidade Line Chart
  updateCharts(
    umidadeHistoryDiv,
    newumidadeXArray,
    newumidadeYArray,
    umidade
  );
  // Update voltagem Line Chart
  updateCharts(
    voltagemHistoryDiv,
    newvoltagemXArray,
    newvoltagemYArray,
    voltagem
  );

  // Update rpm Line Chart
  updateCharts(
    rpmHistoryDiv,
    newrpmXArray,
    newrpmYArray,
    rpm
  );
}

function updateBoxes(temperatura, umidade, voltagem, rpm) {
  let temperaturaDiv = document.getElementById("temperatura");
  let umidadeDiv = document.getElementById("umidade");
  let voltagemDiv = document.getElementById("voltagem");
  let rpmDiv = document.getElementById("rpm");

  temperaturaDiv.innerHTML = temperatura + " C";
  umidadeDiv.innerHTML = umidade + " %";
  voltagemDiv.innerHTML = voltagem + " hPa";
  rpmDiv.innerHTML = rpm + " m";
}

function updateGauge(temperatura, umidade, voltagem, rpm) {
  var temperatura_update = {
    value: temperatura,
  };
  var umidade_update = {
    value: umidade,
  };
  var voltagem_update = {
    value: voltagem,
  };
  var rpm_update = {
    value: rpm,
  };
  Plotly.update(temperaturaGaugeDiv, temperatura_update);
  Plotly.update(umidadeGaugeDiv, umidade_update);
  Plotly.update(voltagemGaugeDiv, voltagem_update);
  Plotly.update(rpmGaugeDiv, rpm_update);
}

function updateCharts(lineChartDiv, xArray, yArray, sensorRead) {
  if (xArray.length >= MAX_GRAPH_POINTS) {
    xArray.shift();
  }
  if (yArray.length >= MAX_GRAPH_POINTS) {
    yArray.shift();
  }
  xArray.push(ctr++);
  yArray.push(sensorRead);

  var data_update = {
    x: [xArray],
    y: [yArray],
  };

  Plotly.update(lineChartDiv, data_update);
}

function updateChartsBackground() {
  // updates the background color of historical charts
  var updateHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));

  // updates the background color of gauge charts
  var gaugeHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  gaugeCharts.forEach((chart) => Plotly.relayout(chart, gaugeHistory));
}

const mediaQuery = window.matchMedia("(max-width: 600px)");

mediaQuery.addEventListener("change", function (e) {
  handleDeviceChange(e);
});

function handleDeviceChange(e) {
  if (e.matches) {
    console.log("Inside Mobile");
    var updateHistory = {
      width: 323,
      height: 250,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  } else {
    var updateHistory = {
      width: 550,
      height: 260,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  }
}

/*
  MQTT Message Handling Code
*/
const mqttStatus = document.querySelector(".status");

function onConnect(message) {
  mqttStatus.textContent = "Connected";
}
function onMessage(topic, message) {
  var stringResponse = message.toString();
  var messageResponse = JSON.parse(stringResponse);
  updateSensorReadings(messageResponse);
}

function onError(error) {
  console.log(`Error encountered :: ${error}`);
  mqttStatus.textContent = "Error";
}

function onClose() {
  console.log(`MQTT connection closed!`);
  mqttStatus.textContent = "Closed";
}

function fetchMQTTConnection() {
  fetch("/mqttConnDetails", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      initializeMQTTConnection(data.mqttServer, data.mqttTopic);
    })
    .catch((error) => console.error("Error getting MQTT Connection :", error));
}
function initializeMQTTConnection(mqttServer, mqttTopic) {
  console.log(
    `Initializing connection to :: ${mqttServer}, topic :: ${mqttTopic}`
  );
  var fnCallbacks = { onConnect, onMessage, onError, onClose };

  var mqttService = new MQTTService(mqttServer, fnCallbacks);
  mqttService.connect();

  mqttService.subscribe(mqttTopic);
}
