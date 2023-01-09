<template>
  <div>
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
      <el-select v-model="queryParams.rule_type" clearable class="filter-item" @change="handleFilter">
        <el-option
          v-for="item in ruleTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="dataList"
      border
      fit
      highlight-current-row
      show-overflow-tooltip
      style="width: 100%;"
    >
      <el-table-column label="项目名称" fixed="left" width="120" prop="project_name" />
      <el-table-column label="规则名称" fixed="left" width="120" prop="rule_name" />
      <el-table-column label="规则类型" width="110">
        <template slot-scope="{ row: { rule_type_name }}">
          <el-tag>{{ rule_type_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="原始数据源类型" width="130" prop="check_source_type" />
      <el-table-column label="原始数据源" width="150" prop="check_db_name" />
      <el-table-column label="原始数据表" width="150" prop="check_table_name" />
      <el-table-column label="对比数据源类型" width="130" prop="contrast_source_type" />
      <el-table-column label="对比数据源" width="150" prop="contrast_db_name" />
      <el-table-column label="对比数据表" width="150" prop="contrast_table_name" />
      <el-table-column label="创建时间" width="160" prop="create_time" />
      <el-table-column label="创建人" width="160" prop="create_user" />
      <el-table-column label="更新人" width="160" prop="update_user" />
      <el-table-column :label="$t('table.actions')" align="center" fixed="right" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" title="编辑" style="min-width: 40px" @click="viewInfo(row.rule_code)">
            <i class="el-icon-edit" />
          </el-button>
          <el-button type="primary" size="mini" title="日志" style="min-width: 40px" @click="viewLog(row.rule_type, row.rule_code)">
            <i class="el-icon-document" />
          </el-button>
          <el-button type="primary" size="mini" title="运行" style="min-width: 40px" @click="handleRun(row.rule_code)">
            <i class="el-icon-caret-right" />
          </el-button>
          <el-button v-if="row.status!='deleted'" title="删除" size="mini" style="min-width: 40px" type="danger" @click="handleDelete(row.rule_code)">
            <i class="el-icon-delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :hidden="total <= 0" :total="total" :page.sync="queryParams.page_num" :limit.sync="queryParams.page_size" @pagination="queryRuleList" />
  </div>
</template>

<script>
import { queryTimely, runRule, delRule } from '@/api/rule'
import { queryProject } from '@/api/project'
import Pagination from '@/components/Pagination'

export default {
  name: 'RuleList',
  components: { Pagination },
  data() {
    this.ruleTypes = [
      { value: 'count', label: '数据及时性' },
      { value: 'check_count', label: '数据同步' },
      { value: 'consistency', label: '数据一致性' },
      { value: 'business_monitoring', label: '业务监控' }
    ]

    return {
      loading: false,
      projects: [],
      queryParams: { rule_name: null, rule_type: null, page_num: 1, page_size: 10, project_name: null },
      dataList: [],
      total: 0
    }
  },
  created() {
    this.queryProjects()
    this.queryRuleList()
  },
  methods: {
    async queryRuleList() {
      try {
        this.loading = true
        const { data: { list = [], total }} = await queryTimely(this.queryParams)
        this.dataList = list.map(item => {
          const target = this.ruleTypes.find(({ value }) => item.rule_type === value)
          return {
            ...item,
            rule_type_name: target?.label || item.rule_type
          }
        })
        this.total = total
      } catch (err) {
        console.warn(err)

        this.dataList = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
    async queryProjects(project_name) {
      const res = await queryProject({ project_name })
      this.projects = res.data.list
    },
    handleFilter() {
      this.dataList = []
      this.total = 0
      this.queryParams.page_num = 1
      this.queryRuleList()
    },
    viewInfo(rule_code) {
      this.$router.push({
        name: 'RuleEditor',
        query: { rule_code }
      })
    },
    viewLog(rule_type, rule_code) {
      this.$router.push({
        name: 'LogList',
        query: { rule_type, rule_code }
      })
    },
    handleRun(id) {
      runRule(id).then(() => {
        this.$notify({ title: '成功', message: '运行成功', type: 'success' })
      })
    },
    handleDelete(id) {
      delRule(id).then(() => {
        this.$notify({ title: '成功', message: '删除成功', type: 'success' })
        this.queryRuleList()
      })
    },
    handleCreate() {
      this.$router.push({ name: 'RuleEditor' })
    }
  }
}
</script>
