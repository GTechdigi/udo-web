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
      <el-input v-model="queryParams.rule_name" placeholder="规则名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="queryParams.rule_type" clearable placeholder="规则类型" class="filter-item" @change="handleFilter">
        <el-option
          v-for="item in rule_types"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-select v-model="queryParams.status" clearable placeholder="调度状态" class="filter-item" @change="handleFilter">
        <el-option
          v-for="item in status_list"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-select v-model="queryParams.check_status" clearable placeholder="执行状态" class="filter-item" @change="handleFilter">
        <el-option
          v-for="item in check_status_list"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-date-picker
        v-model="date_range"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
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
          <router-link :to="{path:'/rule/add', query: {project_name:row.project_name}}">{{ row.project_name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="规则名称" min-width="150">
        <template slot-scope="{row}">
          <router-link :to="{path:'/rule/add', query: {rule_code:row.rule_code}}">{{ row.rule_name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="规则类型" width="150">
        <template slot-scope="{row}">
          <el-tag v-for="item in rule_types" v-if="item.key === row.rule_type" type="info">
            {{ item.value }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行开始时间" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行结束时间" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度状态" width="150" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="item in status_list" v-if="item.key === row.status" :type="item.type">
            {{ item.value }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行状态" width="150" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="item in check_status_list" v-if="item.key === row.check_status" :type="item.type">
            {{ item.value }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="viewLog(row.content)">
            查看日志
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page_num" :limit.sync="queryParams.page_size" @pagination="getList" />

    <el-dialog title="执行日志" :visible.sync="dialogVisible">
      <div class="log-container">
        <pre>{{ content }}</pre>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryLogList } from '@/api/logs'
import Pagination from '@/components/Pagination'
import { queryProject } from '@/api/project'
export default {
  components: { Pagination },
  data() {
    return {
      datas: [],
      date_range: [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date().getTime() - 1],
      dialogVisible: false,
      total: 0,
      list: [],
      rule_types: [
        { key: 'count', value: '数据及时性' },
        { key: 'check_count', value: '数据同步' },
        { key: 'consistency', value: '数据一致性' },
        { key: 'business_monitoring', value: '业务监控' }
      ],
      status_list: [
        { key: 1, value: '成功', type: 'success' },
        { key: 2, value: '失败', type: 'danger' },
        { key: 3, value: '执行中', type: 'warn' }
      ],
      check_status_list: [
        { key: 1, value: '成功', type: 'success' },
        { key: 2, value: '失败', type: 'danger' }
      ],
      content: null,
      pageNum: '1',
      pageSize: '10',
      projects: [],
      queryParams: { rule_type: null, page_num: 1, page_size: 10, rule_code: null, project_name: null, check_status: null, status: null }
    }
  },
  created() {
    this.date_range[0] = this.format(this.date_range[0])
    this.date_range[1] = this.format(this.date_range[1])
    this.queryParams.rule_type = this.$route.query.rule_type
    this.queryParams.rule_code = this.$route.query.rule_code
    this.getList()
    this.getProjectList()
  },
  methods: {
    add0(m) { return m < 10 ? '0' + m : m },
    format(shijianchuo) {
      var time = new Date(shijianchuo)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      console.log(y + '-' + this.add0(m) + '-' + this.add0(d))
      return y + '-' + this.add0(m) + '-' + this.add0(d)
    },
    getList() {
      this.queryParams.start_date = this.date_range[0]
      this.queryParams.end_date = this.date_range[1]
      queryLogList(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getProjectList(project_name) {
      queryProject({ 'project_name': project_name }).then((res) => {
        this.projects = res.data.list
      })
    },
    handleFilter() {
      this.list = null
      this.queryParams.page_num = 1
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.actual_and_expected === '1') {
        return 'success-row'
      } else if (row.actual_and_expected === '0') {
        return 'warning-row'
      }
      return ''
    },
    viewLog(content) {
      this.content = content
      this.dialogVisible = true
    }
  }
}
</script>

<style>
.filter-container .filter-item {
  margin-bottom: 1px
}
.log-container{
  height: 300px;
  padding: 0 10px;
  background-color: #f5f5f5;
  border-radius: 1px;
  display: block;
  overflow: scroll;
}
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
  float: right;
  margin-right: 100px
}
.env .el-input {
  width: 230px
}
.ctable {
  margin: 10px 0 30px 0
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

