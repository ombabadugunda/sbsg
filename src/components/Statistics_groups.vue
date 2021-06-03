
<script>
import { Bar } from 'vue-chartjs'
import { mapGetters } from 'vuex'

export default {
  extends: Bar,
  data () {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Статистика',
            data: [],
            fill: true,
            borderColor: '#41337A',
            backgroundColor: '#41337A',
            borderWidth: 5
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'getGame'
    ])
  },
  mounted () {
    for (var stat in this.getGame.groups) {
      if (stat === 'Admin') {
        continue
      }
      this.chartData.datasets[0].data.push(this.getGame.groups[stat].stats)
      this.chartData.labels.push(stat)
    }
    this.renderChart(this.chartData, this.options)
  }
}
</script>
