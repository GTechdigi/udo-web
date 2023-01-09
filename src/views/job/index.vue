<template>
  <div >
    <div class="filter-container">
      <el-select
        v-model="queryParams.project_code"
        placeholder="请选择项目"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in projects"
          :key="item.project_code"
          :label="item.project_name"
          :value="item.project_code"
        />
      </el-select>
      <el-input v-model="queryParams.job_name" placeholder="任务名称" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" @clear="getList" />
      <el-select v-model="queryParams.trigger" clearable class="filter-item" placeholder="请选择调度方式" @change="handleFilter" >
        <el-option
          v-for="item in triggers"
          :key="item.name"
          :label="item.name"
          :value="item.trigger"
        />
      </el-select>
      <el-input v-model="queryParams.rule_name" placeholder="规则名称" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" @clear="getList" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="add">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="项目名称" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.project_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" :show-overflow-tooltip="true" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.job_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则名称" :show-overflow-tooltip="true" min-width="150">
        <template slot-scope="{row}">
          <router-link v-if="row.rule_name.indexOf(',')<0" :to="{path:'/rule/add', query: {rule_code:row.rule_code}}">{{ row.rule_name || row.rule_code }}</router-link>
          <span v-else>{{ row.rule_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度方式" width="150">
        <template slot-scope="{row}">
          <el-tag type="info" v-for="item in triggers" v-if="item.trigger === row.trigger">
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_run"
            style="display: block; width:auto"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开"
            inactive-text="关"
            @change="changestatus(scope.row.job_id, scope.row.is_run)"
          />
        </template>
      </el-table-column>
      <el-table-column label="下次运行时间" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.next_run_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" min-width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="viewJob(row.job_id)">
            查看
          </el-button>
          <el-button type="primary" size="mini" @click="viewLog(row.rule_type, row.rule_code)">
            日志
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left:10px"
            @onConfirm="delJob(row.job_id)"
          >
            <el-button type="danger" slot="reference" size="mini">
              删除
            </el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page_num" :limit.sync="queryParams.page_size" @pagination="getList" />
  </div>
  <!--<div class="block">
    <el-tabs tab-position="top" style="height: 200px">
      <div class="env">
        <div class="search-box">
          <el-input
            v-model="queryParams.job_name"
            placeholder="请输入任务名称"
            prefix-icon="el-icon-search"
            style="”width: 200px”"
            clearable
          />
          <el-select v-model="queryParams.trigger" clearable placeholder="请选择调度方式">
            <el-option
              v-for="item in triggers"
              :key="item.name"
              :label="item.name"
              :value="item.trigger"
            />
          </el-select>
          <el-input
            v-model="queryParams.rule_name"
            placeholder="请输入规则名称"
            prefix-icon="el-icon-search"
            clearable
            style="”width: 200px”"
          />
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="findAll"
          >搜索</el-button>
        </div>
        <div style="padding-top: 10px">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="add"
          >添加调度</el-button>
        </div>
        <div class="ctable">
          <el-table :data="list" border style="width: 100%" height="595">
            <el-table-column
              prop="job_name"
              label="任务名称"
              width="200"
            />
            <el-table-column
              prop="trigger"
              label="触发方式"
              width="200"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.trigger=='interval'">间隔运行</span>
                <span v-else-if="scope.row.trigger=='date'">指定时间</span>
                <span v-else>cron调度</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="rule_code"
              label="对应规则名称"
              width="200"
              show-overflow-tooltip
            />
            &lt;!&ndash; <el-table-column label="状态" width="150">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  style="display: block width:auto"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开"
                  inactive-text="关"
                  @change="changestatus(scope.row.alarm_id, scope.row.status)"
                />
              </template>
            </el-table-column> &ndash;&gt;
            <el-table-column
              prop="next_run_time"
              sortable
              label="下次运行时间"
              width="230"
            />
            <el-table-column
              prop="create_time"
              sortable
              label="创建时间"
              width="230"
            />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" style="margin-right: 10px" @click="viewLog(scope.row.rule_code)">查看日志</el-button>
                <el-popconfirm
                  title="确定删除吗？"
                  @onConfirm="delJob(scope.row.job_id)"
                >
                  <el-button slot="reference" type="text">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.page_num" :limit.sync="queryParams.page_size" @pagination="getList" />
    </el-tabs>
  </div>-->
</template>

<script>
import { queryJob, deleteJob, changeJobStatus } from '@/api/job'
import Pagination from '@/components/Pagination'
import {queryProject} from "@/api/project";
export default {
  name: 'Datamonitor',
  components: { Pagination },
  data() {
    return {
      trigger: null,
      queryParams: { rule_name: null, trigger: null, job_name: null, page_num: 1, page_size: 10, project_name: null },
      list: [],
      total: 0,
      projects: [],
      triggers: [
        { name: '指定时间执行', trigger: 'date' },
        { name: '间隔执行', trigger: 'interval' },
        { name: 'cron调度器', trigger: 'cron' }
      ]
    }
  },
  created() {
    this.getList()
    this.getProjectList()
  },
  methods: {
    getList() {
      queryJob(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getProjectList(project_name) {
      queryProject({ 'project_name': project_name }).then((res) => {
        this.projects = res.data.list
      })
    },
    handleFilter(){
      this.list = null
      this.queryParams.page_num = 1
      this.getList()
    },
    viewJob(job_id) {
      this.$router.push({
        path: '/job/add',
        query: {
          job_id: job_id
        }
      })
    },
    viewLog(rule_type, rule_code) {
      this.$router.push({
        path: '/logs/list',
        query: {
          rule_type: rule_type,
          rule_code: rule_code
        }
      })
    },
    delJob(jobid) {
      console.log(jobid)
      deleteJob({ 'job_id': jobid }).then(res => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除调度任务成功',
          type: 'success'
        })
      })
    },
    add() {
      this.$router.push('/job/add')
    },
    changestatus(id, status) {
      changeJobStatus({ 'job_id': id, 'is_run': status }).then(res => {
        this.$notify({
          title: '成功',
          message: '更新调度任务状态成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
<style scoped>
/* .block .daterange,.env,.cname{
  display: inline
  margin-right: 50px
} */
.block {
  margin-left: 20px
}
.env > div > div {
  margin-right: 50px
}
.env .search-box .el-button--primary {
  float: right
  margin-right 100px
}
.env .el-input {
  width: 230px
}
.pagetitle > p {
  margin-top: 0
  font-size 20px
  padding-bottom 10px
  border-bottom-style solid
  border-width 1px
  border-color rgba(151, 151, 151, 0.3)
}
.pagetitle {
  margin-bottom: 10px
}

.ctable {
  margin-top: 10px
}
.Pagination {
  padding: 10px
}
</style>

