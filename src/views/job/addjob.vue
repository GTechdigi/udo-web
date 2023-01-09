<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="job_form" label-width="100px" :rules="form_rules" :model="request_body" class="demo-ruleForm">
        <el-form-item label="任务名称" prop="job_name">
          <el-input
            v-model="request_body.job_name"
            placeholder="请输入任务名称"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="项目类别" prop="project_name">
          <el-select
            v-model="request_body.project_code"
            placeholder="请选择项目类别"
            @change="clearRule"
          >
            <el-option
              v-for="item in projects"
              :key="item.project_code"
              :label="item.project_name"
              :value="item.project_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调度规则" prop="rule_code">
          <el-select
            v-model="request_body.rule_code"
            clearable
            filterable
            remote
            multiple
            :remote-method="queryRuleList"
            placeholder="请选择调度规则"
          >
            <el-option
              v-for="{rule_code,rule_name} in rule_list"
              :key="rule_code"
              :label="rule_name"
              :value="rule_code"
            />
          </el-select>
        </el-form-item>
        <div class="cron">
          <el-form-item label="调度配置">
            <el-select
              v-model="request_body.trigger"
              clearable
              filterable
              placeholder="请选择调度方式"
            >
              <el-option
                v-for="item in triggers"
                :key="item.name"
                :label="item.name"
                :value="item.trigger"
              />
            </el-select>
            <el-date-picker
              v-if="request_body.trigger=='date'"
              v-model="request_body.run_date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间"
            />
            <el-date-picker
              v-if="request_body.trigger=='interval'"
              v-model="request_body.start_date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择开始时间"
            />
            <el-select
              v-if="request_body.trigger=='interval'"
              v-model="interval_type"
              clearable
              filterable
              placeholder="请选择间隔类型"
            >
              <el-option
                v-for="item in interval"
                :key="item.name"
                :label="item.name"
                :value="item.type"
              />
            </el-select>
            <el-input
              v-if="request_body.trigger=='interval'"
              v-model="interval_value"
              placeholder="请输入间隔时间"
              style="width: 200px "
            />
          </el-form-item>
          <el-form-item v-if="request_body.trigger=='cron'" label="年">
            <el-input
              v-model="request_body.year"
              placeholder="*"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item v-if="request_body.trigger=='cron'" label="月">
            <el-input
              v-model="request_body.month"
              placeholder="*"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item v-if="request_body.trigger=='cron'" label="日">
            <el-input
              v-model="request_body.day"
              placeholder="*"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item v-if="request_body.trigger=='cron'" label="周">
            <el-input
              v-model="request_body.week"
              placeholder="*"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item v-if="request_body.trigger=='cron'" label="周几">
            <el-input
              v-model="request_body.day_of_week"
              placeholder="*"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item v-if="request_body.trigger=='cron'" label="小时">
            <el-input
              v-model="request_body.hour"
              placeholder="*"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item v-if="request_body.trigger=='cron'" label="分">
            <el-input
              v-model="request_body.minute"
              placeholder="0"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item v-if="request_body.trigger=='cron'" label="秒">
            <el-input
              v-model="request_body.second"
              placeholder="0"
              style="width: 240px"
            />
          </el-form-item>
        </div>
        <el-form-item >
          <el-button v-if="createStatus" type="primary" @click="add">立即创建</el-button>
          <el-button v-if="!createStatus" type="primary" @click="update">立即保存</el-button>
          <el-button @click="backHistory">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {queryTimely} from '@/api/rule'
import { addJob, getJob, updateJobInfo } from '@/api/job'
import {queryProject} from "@/api/project";
export default {
  data() {
    return {
      createStatus: true,
      rule_list: null,
      projects: [],
      form_rules: {

        job_name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        project_code: [{ required: true, message: '项目类别不能为空', trigger: 'change' }],
        rule_code: [{ required: true, message: '调度任务不能为空', trigger: 'change' }]
      },
      triggers: [
        { name: '指定时间执行', trigger: 'date' },
        { name: '间隔执行', trigger: 'interval' },
        { name: 'cron调度器', trigger: 'cron' }
      ],
      interval: [
        { name: '间隔几天', type: 'days' },
        { name: '间隔几小时', type: 'hours' },
        { name: '间隔几分钟', type: 'minutes' },
        { name: '间隔多少秒', type: 'seconds' }
      ],
      project_code: null,
      job_id: null,
      interval_type: null,
      interval_value: null,
      source_type: null,
      test: { id: 1, name: '123' },
      tableStatus: true,
      fieldStatus: true,
      key_value: null,
      ruleForm: {},
      disables: {
        table: true,
        field: true
      },
      value1: null,
      request_body: {
        project_code: null,
        project_name: null,
        rule_code: [],
        job_name: null,
        trigger: null,
        run_date: null,
        start_date: null,
        end_date: null,
        year: null,
        month: null,
        day: null,
        day_of_week: null,
        hour: null,
        minute: 0,
        second: 0,
        status: 1
      }
    }
  },
  created() {
    let query = this.$route.query
    if (query.job_id) {
      this.job_id = query.job_id
      this.createStatus = false
      this.jobInfo()
    } else {
      this.request_body.rule_type = query.rule_type
    }
    queryProject({ 'page_size': 30 }).then((res) => {
      this.projects = res.data.list
    })
  },
  methods: {
    jobInfo() {
      getJob(this.job_id).then((res) => {
        this.request_body = res.data
        this.queryRuleList()
        if (this.request_body.trigger === 'interval') {
          if (this.request_body.day) {
            this.interval_type = 'days'
            this.interval_value = this.request_body.day
          } else if (this.request_body.hour) {
            this.interval_type = 'hours'
            this.interval_value = this.request_body.hour
          } else if (this.request_body.minute) {
            this.interval_type = 'minutes'
            this.interval_value = this.request_body.minute
          } else if (this.request_body.second) {
            this.interval_type = 'seconds'
            this.interval_value = this.request_body.second
          }
        }
      })
    },
    queryRuleList(rule_name) {
      queryTimely({ 'project_code': this.request_body.project_code, 'page_size': 100, 'rule_name': rule_name }).then(res => {
        this.rule_list = res.data.list
      })
    },
    add() {
      this.$refs['job_form'].validate((valid) => {
        if (valid) {
          if (this.request_body.trigger === 'interval') {
            if (this.interval_type === 'days') {
              this.request_body.day = this.interval_value
            } else if (this.interval_type === 'hours') {
              this.request_body.hour = this.interval_value
            } else if (this.interval_type === 'minutes') {
              this.request_body.minute = this.interval_value
            } else if (this.interval_type === 'seconds') {
              this.request_body.second = this.interval_value
            }
          }
          if (this.request_body.trigger === 'cron') {
            this.request_body.start_date = null
          }
          addJob(this.request_body)
            .then((res) => {
              var message = res.success
              console.log(message)
              if (message === true) {
                this.$router.push('/job/list')
                this.$notify({
                  title: '成功',
                  message: '创建规则成功',
                  type: 'success'
                })
              } else {
                this.$alert(this.message['data'], '创建失败', {
                  confirmButtonText: '确定'
                })
              }
            })
        }
      })
    },
    update() {
      this.$refs['job_form'].validate((valid) => {
        if (valid) {
          if (this.request_body.trigger === 'interval') {
            if (this.interval_type === 'days') {
              this.request_body.day = this.interval_value
              this.request_body.hour = null
              this.request_body.minute = null
              this.request_body.second = null
            } else if (this.interval_type === 'hours') {
              this.request_body.hour = this.interval_value
              this.request_body.day = null
              this.request_body.minute = null
              this.request_body.second = null
            } else if (this.interval_type === 'minutes') {
              this.request_body.minute = this.interval_value
              this.request_body.hour = null
              this.request_body.day = null
              this.request_body.second = null
            } else if (this.interval_type === 'seconds') {
              this.request_body.second = this.interval_value
              this.request_body.hour = null
              this.request_body.minute = null
              this.request_body.day = null
            }
          }
          if (this.request_body.trigger === 'cron') {
            this.request_body.start_date = null
          }
          updateJobInfo(this.request_body)
            .then((res) => {
              var message = res.success
              console.log(message)
              if (message === true) {
                this.$router.push('/job/list')
                this.$notify({
                  title: '成功',
                  message: '更细规则成功',
                  type: 'success'
                })
              } else {
                this.$alert(this.message['data'], '更新失败', {
                  confirmButtonText: '确定'
                })
              }
            })
        }
      })
    },
    clearRule() {
      this.queryRuleList()
      this.request_body.rule_code = null
      this.request_body.rule_name = null
    },
    backHistory() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.create .create-body {
  padding: 50px 20px
}

.el-form-item__content {
  width: 250px
}
.demo-ruleForm .el-input__inner {
  width: 0
}
</style>
