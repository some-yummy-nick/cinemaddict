import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export function getGenres(films) {
  let genreArr = [];
  films.map((item)=>{
    genreArr.push(item.genre);
  });

  genreArr = genreArr.join().split(`,`);
  return genreArr.reduce(function (acc, el) {
    if (el !== ``) {
      acc[el] = (acc[el] || 0) + 1;

    }
    return acc;
  }, {});
}

export default function getChart(films) {
  const statisticCtx = document.querySelector(`.statistic__chart`);
  const BAR_HEIGHT = 50;
  const genresNumbers = Object.values(getGenres(films));

  statisticCtx.height = BAR_HEIGHT * genresNumbers.length;

  (()=> new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(getGenres(films)),
      datasets: [{
        data: Object.values(getGenres(films)),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  }))();
}

