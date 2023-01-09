<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" onclick="location='/project/list'">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="table" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              总项目数
            </div>
            <count-to :start-val="0" :end-val="project_count" :duration="project_count / 5 " class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" onclick="location='/rule/list'">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="list" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              总规则数
            </div>
            <count-to :start-val="0" :end-val="rule_count" :duration="rule_count/5" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" onclick="location='/job/list'">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="component" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              总任务数
            </div>
            <count-to :start-val="0" :end-val="job_count" :duration="job_count/5" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" onclick="location='/logs/list'">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="documentation" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              昨日运行(总/成功/失败)
            </div>
            <span class="card-panel-num" style="color: blue">{{ yes_rule_count }}/</span>
            <span class="card-panel-num" style="color: green">{{ rule_success_count }}/</span>
            <span class="card-panel-num" style="color: red">{{ rule_fail_count }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div id="pie1" class="chart" style="height:350px;width:100%" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div id="pie2" class="chart" style="height:350px;width:100%" />
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div id="line1" class="chart" style="height:300px;width:100%" />
    </el-row>
  </div>
</template>

<script>
import { lastMonthJobTrend, ruleYesterdayFailCount, ruleYesterdaySuccessCount, ruleCount, jobCount, projectCount, projectJobCount, projectRuleCount } from '@/api/dashboard'
import CountTo from 'vue-count-to'
import * as echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  name: 'Dashboard',
  components: {
    CountTo
  },
  data() {
    return {
      dbCont: '',
      alarmCont: '',
      logCont: '',
      rule_success_count: 0,
      rule_fail_count: 0,
      rule_count: 0,
      yes_rule_count: 0,
      job_count: 0,
      project_count: 0,
      ruleForm: { 'page_num': '1', 'page_size': '10' },
      datas: { 'daysList': [], 'failNumberList': [], 'successNumberList': [] },
      data1: [],
      data1_name: [],
      data2: [],
      data2_name: []
    }
  },
  created() {
    this.getCount()
  },
  mounted() {
    this.$nextTick(() => {
      this.myPie1Echarts()
      this.myPie2Echarts()
      this.myLineEcharts()
    })
  },
  methods: {
    getCount() {
      lastMonthJobTrend().then((res) => {
        this.datas = res.data
        this.myLineEcharts()
      })
      ruleYesterdayFailCount().then((res) => {
        this.rule_fail_count = res.data
      })
      ruleYesterdaySuccessCount().then((res) => {
        this.rule_success_count = res.data
        this.yes_rule_count = this.rule_success_count + this.rule_fail_count
      })
      jobCount().then((res) => {
        this.job_count = res.data
      })
      projectCount().then((res) => {
        this.project_count = res.data
      })
      ruleCount().then((res) => {
        this.rule_count = res.data
      })
      projectJobCount().then((res) => {
        this.data2 = res.data
        this.data2_name = []
        res.data.forEach(x => {
          this.data2_name.push(x.name)
        })
        this.myPie2Echarts()
      })
      projectRuleCount().then((res) => {
        this.data1 = res.data
        this.data1_name = []
        res.data.forEach(x => {
          this.data1_name.push(x.name)
        })
        this.myPie1Echarts()
      })
    },
    myPie1Echarts() {
      var pie1Chart = echarts.init(document.getElementById('pie1'), 'macarons')
      pie1Chart.setOption({
        title: {
          text: '项目规则数量分布',
          // subtext: 'Fake Data',
          left: 'left',
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.data1_name
        },
        series: [
          {
            name: '项目规则数量分布',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.data1,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    myPie2Echarts() {
      var pie2Chart = echarts.init(document.getElementById('pie2'), 'macarons')
      pie2Chart.setOption({
        title: {
          text: '项目任务数量分布',
          left: 'left',
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.data2_name
        },
        series: [
          {
            name: '项目任务数量分布',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.data2,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    myLineEcharts() {
      var line1Chart = echarts.init(document.getElementById('line1'), 'macarons')
      line1Chart.setOption({
        title: {
          text: '近30天运行任务数量趋势',
          left: 'left',
          textStyle: {
            color: '#000'
          }
        },
        xAxis: {
          data: this.datas.daysList,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 40,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['Success', 'Failed']
        },
        series: [{
          name: 'Failed', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: this.datas.failNumberList,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'Success',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.datas.successNumberList,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
<style  lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 20px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.dashboard-editor-container {
  position: relative;

  .chart-wrapper {
    background-color: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 38px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
        max-width: 140px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

  .svg-icon {
    display: block;
    margin: 14px auto !important;
    float: none !important;
  }
}
}
</style>
