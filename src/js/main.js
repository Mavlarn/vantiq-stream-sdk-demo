// import { VantiqAPI } from "./vantiq-stream.umd";

// <script src="node_modules/chart.js/dist/Chart.min.js"></script>


Chart.defaults.global.pointHitDetectionRadius = 1;
Chart.defaults.global.tooltips.enabled = false;
Chart.defaults.global.tooltips.mode = 'index';
Chart.defaults.global.tooltips.position = 'nearest';
Chart.defaults.global.tooltips.custom = CustomTooltips; // eslint-disable-next-line no-unused-vars

// api.select("Sensor", null, null, null).then(response => {
//   console.log(response);
// });


// streamApi.timedQuery("TE_sensor_stream", "Sensor", 5, 10, null, null, (data) => {
//   console.log("sensor data:%o", data);
// });
function getSensorById(sensors, id) {
  let theSensor = null;
  sensors.forEach( sensor => {
    if (sensor.id === id) theSensor = sensor;
  });
  return theSensor;
}
const weatherStream = streamApi.sourceEvent("se_weatherStream", "demo_weather_source", (data) => {
  console.log("source data:%o", data);

  const temp = data.main.temp;
  const humidity = data.main.humidity + parseInt(Math.random() * 50); // add radon value to make it change.

  $("#weather_temperature").text(temp);
  $("#weather_humidity").text(humidity);
  $("#weather_humidity_progress").css("width", humidity +"%");
});
const whereParam = { id: { "$lt": 5 }};

// public timedQuery(streamName: string, typeName: string, intervalSec: number, where: any, limit: number, sort: any, onData: Function): Observable<any> {
const sensorStream = streamApi.timedQuery("tq_sensorStream", "Sensor", 10, whereParam, null, null, updateSensorData);
const sensor1EventStream = streamApi.clientEvent("ce_sensor1Event", data => {
  $("#sensor1_value_min").text(data.min);
  $("#sensor1_value_max").text(data.max);
});
const sensor2EventStream = streamApi.clientEvent("ce_sensor2EventStream", data => {
  $("#sensor2_value_min").text(data.min);
  $("#sensor2_value_max").text(data.max);
});
const sensorUpdateEventStream = streamApi.topicEvent("te_sensorUpdateEventStream", "/mt/sdk_stream_demo/sensor", data => {
  if (data.id === 3) {
    $("#sensor3_value").text(data.value);
  }
});

function pushAndLimit(list, value, limit) {
  if (list.length === limit) {
    list.shift();
  }
  list.push(value);
}

let sensor1EventData = { min: 100, max: 0 };
let sensor2EventData = { min: 100, max: 0 };

function updateSensorData(data) {
  console.log("Got sensor data:", data);

  const sensor1 = getSensorById(data, 1);
  const sensor2 = getSensorById(data, 2);
  const sensor3 = getSensorById(data, 3);
  const sensor4 = getSensorById(data, 4);

  const nowTime = new Date();
  // pushAndLimit(cardChart1.data.labels, nowTime, 50);
  // pushAndLimit(cardChart2.data.labels, nowTime, 50);
  // pushAndLimit(cardChart3.data.labels, nowTime, 50);
  // pushAndLimit(cardChart4.data.labels, nowTime, 50);
  pushAndLimit(cardChart1.data.datasets[0].data, { x: nowTime, y: sensor1.value }, 40);
  pushAndLimit(cardChart2.data.datasets[0].data, { x: nowTime, y: sensor2.value }, 40);
  pushAndLimit(cardChart3.data.datasets[0].data, { x: nowTime, y: sensor3.value }, 40);
  pushAndLimit(cardChart4.data.datasets[0].data, { x: nowTime, y: sensor4.value }, 40);

  cardChart1.update();
  cardChart2.update();
  cardChart3.update();
  cardChart4.update();

  // main chart mainChart
  for (var i = 0; i < 4; i++) {
    // mainChart.data.labels.push(nowTime);
    pushAndLimit(mainChart.data.datasets[i].data, { x: nowTime, y: data[i].value }, 100);
  }
  mainChart.update();

  // update sensor client event
  if (sensor1.value < sensor1EventData.min) {
    sensor1EventData.min = sensor1.value;
    sensor1EventStream.next(sensor1EventData);
  }
  if (sensor1.value > sensor1EventData.max) {
    sensor1EventData.max = sensor1.value;
    sensor1EventStream.next(sensor1EventData);
  }
  if (sensor2.value < sensor2EventData.min) {
    sensor2EventData.min = sensor1.value;
    sensor2EventStream.next(sensor2EventData);
  }
  if (sensor2.value > sensor2EventData.max) {
    sensor2EventData.max = sensor1.value;
    sensor2EventStream.next(sensor2EventData);
  }

  $("#sensor1_value").text(sensor1.value);
  $("#sensor2_value").text(sensor2.value);
}

var cardChart1 = new Chart($('#card-chart1'), {
  type: 'line',
  data: {
    datasets: [{
      label: 'Sensor 1',
      backgroundColor: getStyle('--primary'),
      borderColor: 'rgba(255,255,255,.55)',
      data: []
    }]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: 'time',
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent'
        }
      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  }
}); // eslint-disable-next-line no-unused-vars

var cardChart2 = new Chart($('#card-chart2'), {
  type: 'line',
  data: {
    datasets: [{
      label: 'Sensor 2',
      backgroundColor: getStyle('--info'),
      borderColor: 'rgba(255,255,255,.55)',
      data: []
    }]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: 'time',
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent'
        }
      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 0,
          max: 100
        }
      }]
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  }
}); // eslint-disable-next-line no-unused-vars

var cardChart3 = new Chart($('#card-chart3'), {
  type: 'line',
  data: {
    datasets: [{
      label: 'Sensor 3',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: []
    }]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: 'time',
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  }
}); // eslint-disable-next-line no-unused-vars

var cardChart4 = new Chart($('#card-chart4'), {
  type: 'bar',
  data: {
    datasets: [{
      label: 'Sensor 4',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: []
    }]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: 'time',
        display: false,
        barPercentage: 0.6
      }],
      yAxes: [{
        display: false
      }]
    }
  }
}); // eslint-disable-next-line no-unused-vars

var mainChart = new Chart($('#main-chart'), {
  type: 'line',
  data: {
    datasets: [{
      label: 'Sensor 1',
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: []
    }, {
      label: 'Sensor 2',
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: []
    }, {
      label: 'Sensor 3',
      backgroundColor: 'transparent',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: []
    }, {
      label: 'Sensor 4',
      backgroundColor: 'transparent',
      borderColor: getStyle('--warning'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: []
    }]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: 'time',
        gridLines: {
          drawOnChartArea: false
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5
        }
      }]
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    }
  }
});

