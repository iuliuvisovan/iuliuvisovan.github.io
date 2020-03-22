moment.locale('ro');
const isMobile = window.innerWidth < 768;
const defaultDateFormat = isMobile ? 'DD.MM' : 'DD MMMM';
const formatThousandsAsK = value => (value > 999 ? value / 1000 + 'k' : value);

function init() {
  setCurrentDate();
  cleanupData();
  setupBarLabels();
  setPickerCountries(window.data);
}

function draw() {
  init();

  drawDailyCasesChart('romaniaChart', 'Romania');
  setTimeout(() => {
    drawTotalsForCountry('romaniaTotals', 'Romania');
  }, 0);

  setTimeout(() => {
    drawTotalsChart();
    drawLastWeekChart();
    drawGlobalTotals();
    drawDailyCasesChart('otherCountryChart', 'Italy', '#ffeb3b');
    drawTotalsForCountry('otherCountryTotals', 'Italy', '#ffeb3b');
  }, 800);
}

function setCurrentDate() {
  const currentDateSpan = document.getElementById('currentDate');
  currentDateSpan.innerText = moment().format('DD MMMM YYYY');
}

var otherCountryChart = undefined;
var otherCountryChartTotals = undefined;

function drawDailyCasesChart(chartId, countryName, color = '#ff9800') {
  const ctx = document.getElementById(chartId).getContext('2d');
  const data = window.data;

  const countryData = data
    .sort((a, b) => +moment(b.DateRep) - +moment(a.DateRep))
    .filter(x => x.CountryExp == countryName);

  const justLastTwentyDays = countryData.reverse().slice(countryData.length - (isMobile ? 15 : 25));

  const labels = justLastTwentyDays.map(x => moment(x.DateRep).format(defaultDateFormat));
  const values = justLastTwentyDays.map(x => x.Cases);
  const deaths = justLastTwentyDays.map(x => +x.Deaths);
  const recoveries = justLastTwentyDays.map(x => +x.Recoveries);

  otherCountryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Infectari',
          data: values,
          backgroundColor: color + '22',
          borderColor: color,
          borderWidth: 1
        },
        {
          label: 'Vindecari',
          data: recoveries,
          backgroundColor: '#4CAF5022',
          borderColor: '#4CAF50',
          borderWidth: 1
        },
        {
          label: 'Morti',
          data: deaths,
          backgroundColor: '#E91E6322',
          borderColor: '#E91E63',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: formatThousandsAsK
            }
          }
        ]
      }
    }
  });
}

function drawTotalsChart() {
  const ctx = document.getElementById('totalsChart').getContext('2d');
  const data = window.data;

  const totals = {};

  data.forEach(x => {
    totals[x.CountryExp] = data
      .filter(y => y.CountryExp == x.CountryExp)
      .map(x => x.Cases)
      .reduce((a, b) => +a + +b);
  });

  const countriesWithTotals = Object.keys(totals).map(key => ({ countryName: key, total: totals[key] }));

  const sortedByTotalCases = countriesWithTotals.sort((a, b) => b.total - a.total).slice(0, 10);

  const labels = [...new Set(sortedByTotalCases.map(x => x.countryName))];
  const values = sortedByTotalCases.map(x => x.total);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Cazuri totale',
          data: values,
          backgroundColor: '#E91E6322',
          borderColor: '#E91E63',
          borderWidth: 1
        }
      ]
    },
    options: {
      animation: {
        duration: 0
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: formatThousandsAsK
            }
          }
        ]
      }
    }
  });
}

function drawLastWeekChart() {
  const ctx = document.getElementById('lastWeekTotals').getContext('2d');
  const data = window.data;

  const validData = data.filter(x => moment().diff(moment(x.DateRep), 'days') <= 7);

  const totals = {};

  validData.forEach(x => {
    totals[x.CountryExp] = validData
      .filter(y => y.CountryExp == x.CountryExp)
      .map(x => x.Cases)
      .reduce((a, b) => +a + +b);
  });

  const countriesWithTotals = Object.keys(totals).map(key => ({ countryName: key, total: totals[key] }));

  const sortedByTotalCases = countriesWithTotals.sort((a, b) => b.total - a.total).slice(0, 10);

  const labels = [...new Set(sortedByTotalCases.map(x => x.countryName))];
  const values = sortedByTotalCases.map(x => x.total);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Cazuri in ultimele 7 zile',
          data: values,
          backgroundColor: '#9c27b022',
          borderColor: '#9c27b0',
          borderWidth: 1
        }
      ]
    },
    options: {
      animation: {
        duration: 0
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: formatThousandsAsK
            }
          }
        ]
      }
    }
  });
}

function drawLastWeekTotalsRomaniaRelative() {
  const ctx = document.getElementById('lastWeekTotalsRomaniaRelative').getContext('2d');
  const data = window.data;

  const validData = data.filter(x => moment().diff(moment(x.DateRep), 'days') <= 7);

  const totals = {};

  validData.forEach(x => {
    totals[x.CountryExp] = validData
      .filter(y => y.CountryExp == x.CountryExp)
      .map(x => x.Cases)
      .reduce((a, b) => +a + +b);
  });

  const countriesWithTotals = Object.keys(totals).map(key => ({ countryName: key, total: totals[key] }));

  const sortedByTotalCases = countriesWithTotals.sort((a, b) => b.total - a.total);
  const romaniaIndex = sortedByTotalCases.indexOf(sortedByTotalCases.find(x => x.countryName == 'Romania'));

  const slicedRelativeToRomania = sortedByTotalCases.slice(romaniaIndex - 5, romaniaIndex + 5);

  const labels = [...new Set(slicedRelativeToRomania.map(x => x.countryName))];
  const values = slicedRelativeToRomania.map(x => x.total);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Cazuri in ultimele 7 zile',
          data: values,
          backgroundColor: '#2196F322',
          backgroundColor: [
            '#2196F322',
            '#2196F322',
            '#2196F322',
            '#2196F322',
            '#2196F322',
            '#2196F3',
            '#2196F322',
            '#2196F322',
            '#2196F322',
            '#2196F322'
          ],
          borderColor: '#2196F3',
          borderWidth: 1
        }
      ]
    },
    options: {
      animation: {
        duration: 0
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: formatThousandsAsK
            }
          }
        ]
      }
    }
  });
}

function drawTotalsRomaniaRelative() {
  const ctx = document.getElementById('totalsRomaniaRelative').getContext('2d');
  const data = window.data;

  const validData = data;

  const totals = {};

  validData.forEach(x => {
    totals[x.CountryExp] = validData
      .filter(y => y.CountryExp == x.CountryExp)
      .map(x => x.Cases)
      .reduce((a, b) => +a + +b);
  });

  const countriesWithTotals = Object.keys(totals).map(key => ({ countryName: key, total: totals[key] }));

  const sortedByTotalCases = countriesWithTotals.sort((a, b) => b.total - a.total);
  const romaniaIndex = sortedByTotalCases.indexOf(sortedByTotalCases.find(x => x.countryName == 'Romania'));

  const slicedRelativeToRomania = sortedByTotalCases.slice(romaniaIndex - 5, romaniaIndex + 5);

  const labels = [...new Set(slicedRelativeToRomania.map(x => x.countryName))];
  const values = slicedRelativeToRomania.map(x => x.total);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Cazuri totale',
          data: values,
          backgroundColor: '#2196F322',
          backgroundColor: [
            '#2196F322',
            '#2196F322',
            '#2196F322',
            '#2196F322',
            '#2196F322',
            '#2196F3',
            '#2196F322',
            '#2196F322',
            '#2196F322',
            '#2196F322'
          ],
          borderColor: '#2196F3',
          borderWidth: 1
        }
      ]
    },
    options: {
      animation: {
        duration: 0
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#000',
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function drawGlobalTotals() {
  const ctx = document.getElementById('globalTotals').getContext('2d');
  const data = window.data;

  const labels = [...new Set(data.sort((a, b) => moment(a.DateRep) - moment(b.DateRep)).map(x => x.DateRep))];
  const localizedLabels = labels.map(x => moment(x).format(defaultDateFormat));
  const values = labels.map(x =>
    data
      .filter(y => y.DateRep == x)
      .map(x => x.Cases)
      .reduce((a, b) => +a + +b, 0)
  );
  const deaths = labels.map(x =>
    data
      .filter(y => y.DateRep == x)
      .map(x => x.Deaths)
      .reduce((a, b) => +a + +b, 0)
  );
  const recoveries = labels.map(x =>
    data
      .filter(y => y.DateRep == x)
      .map(x => x.Recoveries)
      .reduce((a, b) => +a + +b, 0)
  );

  const summedDailyValues = values.map((x, i, a) => {
    const totalSoFar = values.slice(0, i).reduce((a, b) => a + b, 0);
    return totalSoFar + x;
  });

  const summedDailyDeaths = deaths.map((x, i, a) => {
    const totalSoFar = deaths.slice(0, i).reduce((a, b) => a + b, 0);
    return totalSoFar + x;
  });

  const summedDailyRecoveries = recoveries.map((x, i, a) => {
    const totalSoFar = recoveries.slice(0, i).reduce((a, b) => a + b, 0);
    return totalSoFar + x;
  });

  const filterFunction = (x, i, a) => {
    const distanceFromPresent = a.length - i;

    const volumeToShow = isMobile ? 6 : 16;

    const rarifyingFactor = Math.floor(distanceFromPresent / volumeToShow) + 1;

    return i % rarifyingFactor == 0;
  };

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: localizedLabels.filter(filterFunction),
      datasets: [
        {
          label: 'Infectari - toata lumea',
          data: summedDailyValues.filter(filterFunction),
          backgroundColor: '#F4433622',
          borderColor: '#F4433688',
          borderWidth: 1
        },
        {
          label: 'Vindecari - toata lumea',
          data: summedDailyRecoveries.filter(filterFunction),
          backgroundColor: '#4CAF5022',
          borderColor: '#4CAF50',
          borderWidth: 1
        },
        {
          label: 'Morti - toata lumea',
          data: summedDailyDeaths.filter(filterFunction),
          backgroundColor: '#E91E6322',
          borderColor: '#E91E63',
          borderWidth: 1
        }
      ]
    },
    options: {
      animation: {
        duration: 0
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#000',
              beginAtZero: true,
              callback: formatThousandsAsK
            }
          }
        ]
      },
      layout: {
        padding: {
          left: 0,
          right: 15,
          top: 0,
          bottom: 0
        }
      }
    }
  });
}

function drawTotalsForCountry(chartId, countryName, color = '#ff9800') {
  const ctx = document.getElementById(chartId).getContext('2d');
  const data = window.data;

  const labels = [...new Set(data.sort((a, b) => moment(a.DateRep) - moment(b.DateRep)).map(x => x.DateRep))];
  const localizedLabels = labels.map(x => moment(x).format(defaultDateFormat));
  const values = labels.map(x =>
    data
      .filter(y => y.DateRep == x && y.CountryExp == countryName)
      .map(x => x.Cases)
      .reduce((a, b) => +a + +b, 0)
  );
  const deaths = labels.map(x =>
    data
      .filter(y => y.DateRep == x && y.CountryExp == countryName)
      .map(x => x.Deaths)
      .reduce((a, b) => +a + +b, 0)
  );
  const recoveries = labels.map(x =>
    data
      .filter(y => y.DateRep == x && y.CountryExp == countryName)
      .map(x => x.Recoveries)
      .reduce((a, b) => +a + +b, 0)
  );

  const summedDailyValues = values.map((x, i, a) => {
    const totalSoFar = values.slice(0, i).reduce((a, b) => a + b, 0);
    return totalSoFar + x;
  });

  const summedDailyDeaths = deaths.map((x, i, a) => {
    const totalSoFar = deaths.slice(0, i).reduce((a, b) => a + b, 0);
    return totalSoFar + x;
  });

  const summedDailyRecoveries = recoveries.map((x, i, a) => {
    const totalSoFar = recoveries.slice(0, i).reduce((a, b) => a + b, 0);
    return totalSoFar + x;
  });

  const filterFunction = (x, i, a) => {
    if (i < a.length - (isMobile ? 30 : 40)) {
      return false;
    }

    const distanceFromPresent = a.length - i;

    const volumeToShow = isMobile ? 7 : 16;

    const rarifyingFactor = Math.floor(distanceFromPresent / volumeToShow) + 1;

    return i % rarifyingFactor == 0;
  };

  otherCountryChartTotals = new Chart(ctx, {
    type: 'line',
    data: {
      labels: localizedLabels.filter(filterFunction),
      datasets: [
        {
          label: 'Infectari - ' + countryName,
          data: summedDailyValues.filter(filterFunction),
          backgroundColor: color + '22',
          borderColor: color,
          borderWidth: 1
        },
        {
          label: 'Vindecari - ' + countryName,
          data: summedDailyRecoveries.filter(filterFunction),
          backgroundColor: '#4CAF5022',
          borderColor: '#4CAF50',
          borderWidth: 1
        },
        {
          label: 'Morti - ' + countryName,
          data: summedDailyDeaths.filter(filterFunction),
          backgroundColor: '#E91E6322',
          borderColor: '#E91E63',
          borderWidth: 1
        }
      ]
    },
    options: {
      animation: {
        duration: 0
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#000',
              beginAtZero: true,
              callback: formatThousandsAsK
            }
          }
        ]
      },
      layout: {
        padding: {
          left: 0,
          right: 20,
          top: 0,
          bottom: 0
        }
      }
    }
  });
}

function cleanupData() {
  window.data = window.data.map(x => {
    let countryName = x['Countries and territories'];
    if (countryName.startsWith('Cases')) {
      countryName = 'Diamond Princess';
    }
    if (countryName.toLowerCase().startsWith('canada')) {
      countryName = 'Canada';
    }

    const currentCountryWithTerritories = window.recoveredData.filter(x => {
      const sourceCountryName = countryName.replace(/[\s\_]/g, '').toLowerCase();
      const targetCountryName = x['Country/Region'].toLowerCase().replace(/[\s\_]/g, '');

      return targetCountryName == sourceCountryName;
    });

    const yesterdaysKey = moment(x.DateRep)
      .subtract(1, 'day')
      .format('M/D/YY');
    const todaysKey = moment(x.DateRep).format('M/D/YY');

    const todaysTotalRecoveries =
      currentCountryWithTerritories?.map(x => x[todaysKey]).reduce((a, b) => +a + +b, 0) || 0;
    const yesterdaysTotalRecoveries =
      currentCountryWithTerritories?.map(x => x[yesterdaysKey]).reduce((a, b) => +a + +b, 0) || 0;

    x = { ...x, Recoveries: todaysTotalRecoveries ? todaysTotalRecoveries - yesterdaysTotalRecoveries : 0 };

    if (countryName == 'China') {
      console.log('x.Recoveries', x.Recoveries, x.DateRep);
    }
    if (countryName == 'Romania') {
      x = { ...x, ...window.romaniaData[x.DateRep] };
    }
    if (countryName == 'Italy') {
      if (x.DateRep == '03/16/2020') {
        x.Cases = '3230';
      }
      if (x.DateRep == '03/15/2020') {
        x.Cases = '3090';
      }
    }
    return {
      ...x,
      CountryExp: countryName
    };
  });
}

function drawComparedCountry(picker) {
  otherCountryChart.destroy();

  drawDailyCasesChart('otherCountryChart', picker.value, '#ffeb3b');
}

function drawComparedCountryTotalCases(picker) {
  otherCountryChartTotals.destroy();
  drawTotalsForCountry('otherCountryTotals', picker.value, '#ffeb3b');
}

function setPickerCountries(data) {
  const pickers = document.querySelectorAll('.country-picker');

  const countries = [...new Set(data.map(x => x.CountryExp))];

  pickers.forEach(picker => {
    countries.forEach(countryName => {
      const option = document.createElement('option');
      option.innerText = countryName;
      picker.appendChild(option);
    });
    picker.value = 'Italy';
  });
}

function setupBarLabels() {
  Chart.pluginService.register({
    afterDraw: function(chartInstance) {
      var ctx = chartInstance.chart.ctx;

      ctx.font = Chart.helpers.fontString(
        Chart.defaults.global.defaultFontSize,
        'normal',
        Chart.defaults.global.defaultFontFamily
      );
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#000';

      chartInstance.data.datasets.forEach(function(dataset) {
        for (var i = 0; i < dataset.data.length; i++) {
          var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
          const currentValue = dataset.data[i];
          let formattedValue = currentValue > 9999 ? Math.floor(dataset.data[i] / 1000) + 'k' : dataset.data[i];

          if (isMobile) {
            const thousands = (currentValue / 1000).toFixed(1);
            const endsWithZero = thousands.endsWith('.0');
            const thousandsWithoutZero = (dataset.data[i] / 1000).toFixed(endsWithZero ? 0 : 1);

            formattedValue = formattedValue > 999 ? thousandsWithoutZero + 'k' : formattedValue;
          }

          if (currentValue > 0) {
            ctx.fillText(formattedValue, model.x, model.y - 2);
          }
        }
      });
    }
  });
}

draw();
