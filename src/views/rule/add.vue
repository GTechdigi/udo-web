<template>
  <div >
    <aside style="margin-top:15px;">规则定义</aside>
    <el-form ref="rule_form" :model="request_body" :rules="rules" projects="projects" label-width="120px" class="demo-ruleForm">
      <el-form-item label="项目名称" prop="project_code">
        <el-select
          v-model="request_body.project_code"
          clearable
          placeholder="请选择项目"
        >
          <el-option
            v-for="item in projects"
            :key="item.project_name"
            :label="item.project_name"
            :value="item.project_code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="监控类型" prop="rule_type">
        <el-select v-model="request_body.rule_type">
          <el-option
            v-for="item in rule_types"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="规则名称" prop="rule_name">
        <el-input
          v-model="request_body.rule_name"
          placeholder="请输入名称"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="规则描述" prop="rule_description">
        <el-input
          v-model="request_body.rule_description"
          placeholder="请输入内容"
          style="width: 240px"
        />
      </el-form-item>
      <div>
        <aside style="margin-top:15px;">校验数据源</aside>
        <el-form-item label="数据库类型" prop="check_source_type">
          <el-select v-model="request_body.check_source_type" clearable placeholder="请选择数据库类型" @change="queryDatabase(request_body.check_source_type, 1, true)">
            <el-option
              v-for="item in source_types"
              :key="'check' + item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库名" prop="check_db_code">
          <el-select
            v-model="request_body.check_db_code"
            clearable
            placeholder="请选择数据库"
            @change="queryTableList(request_body.check_db_code, request_body.check_source_type, 1, true)"
            @clear="clearTable(1)"
          >
            <el-option
              v-for="item in check_databases"
              :key="'check' + item.db_code"
              :label="item.source_name"
              :value="item.db_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="tramsfer" v-if="check_table_display" label="数据表" >
          <el-transfer
            v-model="request_body.check_table_codes"
            filterable
            :titles="['未选中', '已选中']"
            :button-texts="['取消', '选中']"
            filter-placeholder="请输入表名"
            :data="check_tables_transfer"
            @change="clearField(1)"
          >
            <span slot-scope="{ option }" :title="option.label">{{ option.label }}</span>
          </el-transfer>
          <el-button
            type="success"
            @click="switchTableOrSql('sql',1)"
          >切换sql</el-button>
        </el-form-item>
        <!--        <el-form-item v-if="check_table_display" label="数据表" prop="check_table_code">
                  <el-select
                    v-model="request_body.check_table_code"
                    :disabled="disables.table"
                    clearable
                    filterable
                    placeholder="请选择表"
                    @change="clearField(1)"
                    @clear="clearTable(1)"
                  >
                    <el-option
                      v-for="item in check_tables"
                      :key="'check' + item.table_name"
                      :label="item.table_name"
                      :value="item.table_code"
                    />
                  </el-select>
                  <el-button
                    type="success"
                    @click="switchTableOrSql('sql',1)"
                  >切换sql</el-button>
                </el-form-item>-->
        <el-form-item v-if="check_sql_display" label="数据表" prop="check_table_sql">
          <el-input
            v-model="request_body.check_table_sql"
            type="textarea"
            placeholder="请输入内容"
            @input="clearField(1)"
          />
          <el-button
            type="success"
            @click="switchTableOrSql('table',1)"
          >切换数据表</el-button>
        </el-form-item>
        <el-form-item v-if="request_body.rule_type === 'count' && min_display" prop="min_value" label="最低记录数">
          <el-input
            v-model="request_body.min_value"
            placeholder="请输入预期最低记录数"
            style="width: 240px"
            @input="change($event)"
          />
          <el-button
            type="success"
            @click="switchValue('max')"
          >切换为最大值</el-button>
        </el-form-item>
        <el-form-item v-if="request_body.rule_type === 'count' && max_display" prop="min_value" label="最高记录数">
          <el-input
            v-model="request_body.max_value"
            placeholder="请输入预期最高记录数"
            style="width: 240px"
            @input="change($event)"
          />
          <el-button
            type="success"
            @click="switchValue('min')"
          >切换为最小值</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="request_body.rule_type === 'consistency'" type="success" class="check_rule" icon="el-icon-plus" @click="add_field('check_rules')">添加对比字段</el-button>
          <el-button type="success" v-if="check_table_display" class="check_filter" icon="el-icon-plus" @click="add_field('check_filters')">添加过滤字段</el-button>
          <el-button v-if="request_body.rule_type === 'consistency'" type="success" class="check_dimension" icon="el-icon-plus" @click="add_field('check_dimensions')">添加维度字段</el-button>
        </el-form-item>
        <el-form-item
          v-for="(filter, index) in request_body.fields"
          v-if="request_body.rule_type === 'consistency' && filter.role_information === 1 && filter.operator_type === 1"
          :key="'check_1' + filter.id"
          label="对比字段"
          class="check_rule"
        >
          <el-select
            v-model="filter.field"
            clearable
            filterable
            placeholder="请选择字段"
            @focus="fieldList('check')"
          >
            <el-option
              v-for="item in check_fields"
              :key="'check_1' + item.field_name"
              :label="item.field_name"
              :value="item.field_name"
            />
          </el-select>
          <el-select
            v-model="filter.aggregate_type"
            filterable
            placeholder="聚合方式"
            style="width: 100px"
          >
            <el-option
              v-for="item in aggregate_types"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            class="delete_icon"
            @click="delete_field('check_rules', filter)"
          />
        </el-form-item>
        <el-form-item
          v-for="(filter, index) in request_body.fields"
          v-if="filter.role_information === 1 && filter.operator_type === 2 && check_table_display"
          :key="'check_2' + filter.id"
          label="过滤字段"
          class="check_filter"
        >
          <el-select
            v-model="filter.field"
            clearable
            filterable
            placeholder="请选择字段"
            @focus="fieldList('check')"
          >
            <el-option
              v-for="item in check_fields"
              :key="'check_2' + item.field_name"
              :label="item.field_name"
              :value="item.field_name"
            />
          </el-select>
          <el-select
            v-model="filter.operator"
            clearable
            filterable
            placeholder="操作符"
            style="width: 80px"
          >
            <el-option
              v-for="item in operators"
              :key="'check_2' + item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-input
            v-model="filter.value"
            placeholder="请输入值"
            style="width: 200px"
            @input="change($event)"
          />
          <!--          <el-checkbox v-model="filter.expression" class="filter-item" style="margin-left:15px;">表达式</el-checkbox>-->
          <el-select
            v-model="filter.expression"
            clearable
            filterable
            placeholder="表达式类型"
          >
            <el-option
              v-for="item in expressions"
              :key="'check_3_expression_' + item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            class="delete_icon"
            @click="delete_field('check_filters', filter)"
          />
        </el-form-item>
        <el-form-item
          v-for="(filter, index) in request_body.fields"
          v-if="filter.role_information === 1 && filter.operator_type === 3"
          :key="'check_3' + filter.id"
          label="维度字段"
          class="check_dimension"
        >
          <el-select
            v-model="filter.field"
            clearable
            filterable
            placeholder="请选择字段"
            @focus="fieldList('check')"
          >
            <el-option
              v-for="item in check_fields"
              :key="'check_3' + item.field_name"
              :label="item.field_name"
              :value="item.field_name"
            />
          </el-select>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            class="delete_icon"
            @click="delete_field('check_dimensions',filter)"
          />
        </el-form-item>
      </div>
      <div v-if="request_body.rule_type === 'check_count' || request_body.rule_type === 'consistency'">
        <aside style="margin-top:15px;">对比数据源</aside>
        <el-form-item label="数据库类型" prop="contrast_source_type">
          <el-select v-model="request_body.contrast_source_type" clearable placeholder="请选择数据库类型" @change="queryDatabase(request_body.contrast_source_type, 2, true)">
            <el-option
              v-for="item in source_types"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库名" prop="check_db_code">
          <el-select
            v-model="request_body.contrast_db_code"
            clearable
            placeholder="请选择数据库"
            @change="queryTableList(request_body.contrast_db_code, request_body.contrast_source_type, 2, true)"
            @clear="clearTable(2)"
          >
            <el-option
              v-for="item in contrast_databases"
              :key="item.db_code"
              :label="item.source_name"
              :value="item.db_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="tramsfer" v-if="contrast_table_display" label="数据表" prop="contrast_table_codes">
          <el-transfer
            v-model="request_body.contrast_table_codes"
            filterable
            :titles="['未选中', '已选中']"
            :button-texts="['取消', '选中']"
            filter-placeholder="请输入表名"
            :data="contrast_tables_transfer"
            @change="clearField(2)"
          >
            <span slot-scope="{ option }" :title="option.label">{{ option.label }}</span>
          </el-transfer>
          <el-button
            type="success"
            @click="switchTableOrSql('sql',2)"
          >切换sql</el-button>
        </el-form-item>
        <!--        <el-form-item v-if="contrast_table_display" label="数据表" prop="contrast_table_code">
                  <el-select
                    v-model="request_body.contrast_table_code"
                    :disabled="disables.table"
                    clearable
                    filterable
                    multiple
                    placeholder="请选择表"
                    @change="clearField(2)"
                    @clear="clearTable(2)"
                  >
                    <el-option
                      v-for="item in contrast_tables"
                      :key="item.table_name"
                      :label="item.table_name"
                      :value="item.table_code"
                    />
                  </el-select>
                  <el-button
                    type="success"
                    @click="switchTableOrSql('sql',2)"
                  >切换sql</el-button>
                </el-form-item>-->
        <el-form-item v-if="contrast_sql_display" label="数据表" prop="contrast_table_sql">
          <el-input
            v-model="request_body.contrast_table_sql"
            type="textarea"
            placeholder="请输入内容"
            @input="clearField(2)"
          />
          <el-button
            type="success"
            @click="switchTableOrSql('table',2)"
          >切换数据表</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="request_body.rule_type === 'consistency'" type="success" icon="el-icon-plus" @click="add_field('contrast_rules')">添加对比字段</el-button>
          <el-button type="success" v-if="contrast_table_display" icon="el-icon-plus" @click="add_field('contrast_filters')">添加过滤字段</el-button>
          <el-button v-if="request_body.rule_type === 'consistency'" type="success" icon="el-icon-plus" @click="add_field('contrast_dimensions')">添加维度字段</el-button>
        </el-form-item>
        <el-form-item
          v-for="(filter, index) in request_body.fields"
          v-if="request_body.rule_type === 'consistency' && filter.role_information === 2 && filter.operator_type === 1"
          :key="'contrast_1_' + filter.id"
          label="对比字段"
        >
          <el-select
            v-model="filter.field"
            clearable
            filterable
            placeholder="请选择字段"
            @focus="fieldList('contrast')"
          >
            <el-option
              v-for="item in contrast_fields"
              :key="'contrast_1_' + item.field_name"
              :label="item.field_name"
              :value="item.field_name"
            />
          </el-select>
          <el-select
            v-model="filter.aggregate_type"
            filterable
            placeholder="聚合方式"
            style="width: 100px"
          >
            <el-option
              v-for="item in aggregate_types"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            class="delete_icon"
            @click="delete_field('contrast_rules', filter)"
          />
        </el-form-item>
        <el-form-item
          v-for="(filter, index) in request_body.fields"
          v-if="filter.role_information === 2 && filter.operator_type === 2 && contrast_table_display"
          :key="'contrast_2_' + filter.id"
          label="过滤字段"
        >
          <el-select
            v-model="filter.field"
            clearable
            filterable
            placeholder="请选择字段"
            @focus="fieldList('contrast')"
          >
            <el-option
              v-for="item in contrast_fields"
              :key="'contrast_1_' + item.field_name"
              :label="item.field_name"
              :value="item.field_name"
            />
          </el-select>
          <el-select
            v-model="filter.operator"
            clearable
            filterable
            placeholder="操作符"
            style="width: 80px"
          >
            <el-option
              v-for="item in operators"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-input
            v-model="filter.value"
            placeholder="请输入值"
            style="width: 150px"
            @input="change($event)"
          />
          <!--          <el-checkbox v-model="filter.expression" class="filter-item" style="margin-left:15px;">表达式</el-checkbox>-->
          <el-select
            v-model="filter.expression"
            clearable
            filterable
            placeholder="表达式类型"
          >
            <el-option
              v-for="item in expressions"
              :key="'contrast_3_expression_' + item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            class="delete_icon"
            @click="delete_field('contrast_filters', filter)"
          />
        </el-form-item>
        <el-form-item
          v-for="(filter, index) in request_body.fields"
          v-if="filter.role_information === 2 && filter.operator_type === 3"
          :key="'contrast_3_' + filter.id"
          label="维度字段"
        >
          <el-select
            v-model="filter.field"
            clearable
            filterable
            placeholder="请选择字段"
            @focus="fieldList('contrast')"
          >
            <el-option
              v-for="item in contrast_fields"
              :key="'contrast_3_' + item.field_name"
              :label="item.field_name"
              :value="item.field_name"
            />
          </el-select>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            class="delete_icon"
            @click="delete_field('contrast_dimensions', filter)"
          />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="告警接收人">
          <el-select
            v-model="request_body.alert_user"
            filterable
            allow-create
            multiple
            default-first-option
            placeholder="请选择告警接收人或输入告警接收人域账号名称"
            style="width:350px"
            @change="test"
          >
            <el-option
              v-for="item in userList"
              :key="item.username"
              :label="item.username+' | '+item.email"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="手机号通知列表"
          prop="phone_list"
        >
          <el-tag
            v-for="tag in request_body.phone_list"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            style="width:150px"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加手机号</el-button>
        </el-form-item> -->
      </div>
      <el-form-item>
        <el-button v-if="createStatus" type="primary" @click="add">立即创建</el-button>
        <el-button v-if="!createStatus" type="primary" @click="update">立即保存</el-button>
        <el-button @click="backHistory">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {queryDatabases, queryField, queryTables} from '@/api/datasource'
import {addRule, ruleInfo, updateRule} from '@/api/rule'
import {queryList} from '@/api/user'
import {createUniqueString} from '@/utils'
import {queryProject} from '@/api/project'

export default {
  data() {
    return {
      projects: [],
      rules: {
        project_code: [{ required: true, message: '项目不能为空', trigger: 'change' }],
        rule_name: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
        rule_type: [{ required: true, message: '监控类型不能为空', trigger: 'change' }],
        check_source_type: [{ required: true, message: '原始数据库类型不能为空', trigger: 'change' }],
        contrast_source_type: [{ required: true, message: '对比数据库类型不能为空', trigger: 'change' }],
        check_db_code: [{ required: true, message: '原始数据库不能为空', trigger: 'change' }],
        check_table_codes: [{ required: true, message: '原始数据表不能为空', trigger: 'change' }],
        check_table_sql: [{ required: true, message: '原始数据表不能为空', trigger: 'change' }],
        contrast_db_code: [{ required: true, message: '对比数据库不能为空', trigger: 'change' }],
        contrast_table_code: [{ required: true, message: '对比数据表不能为空', trigger: 'change' }],
        contrast_table_sql: [{ required: true, message: '对比数据表不能为空', trigger: 'change' }],
        min_value: [{ required: true, message: '最低记录数不能为空', trigger: 'blur' }],
        max_value: [{ required: true, message: '最高记录数不能为空', trigger: 'blur' }],
      },
      userList: [],
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      check_table_display: true,
      max_display: false,
      min_display: true,
      check_sql_display: false,
      contrast_table_display: true,
      contrast_sql_display: false,
      createStatus: true,
      check_databases: [],
      contrast_databases: [],
      check_tables: [],
      check_tables_transfer: [],
      contrast_tables_transfer: [],
      contrast_tables: [],
      check_fields: [],
      contrast_fields: [],
      expressions: [
        { 'key': 0, 'value': '非表达式' },
        { 'key': 1, 'value': 'sql表达式' },
        { 'key': 2, 'value': 'python表达式' }
      ],
      aggregate_types: ['sum', 'count'],
      operators: ['=', '!=', '>', '>=', '<', '<=', 'in'],
      source_types: ['hive', 'mysql', 'clickhouse', 'es'],
      rule_types: [
        { key: 'count', value: '数据及时性' },
        { key: 'check_count', value: '数据同步' },
        { key: 'consistency', value: '数据一致性' },
        { key: 'business_monitoring', value: '业务监控' }
      ],
      tableStatus: true,
      fieldStatus: true,
      disables: {
        table: true,
        field: true
      },
      request_body: {
        rule_name: null,
        rule_type: null,
        rule_description: null,
        check_source_type: null,
        check_db_code: null,
        check_db_name: null,
        check_table_code: null,
        check_table_name: null,
        check_table_sql: null,
        min_value: 1,
        max_value: 1,
        contrast_source_type: null,
        contrast_db_code: null,
        contrast_db_name: null,
        contrast_db_sql: null,
        contrast_table_code: null,
        contrast_table_name: null,
        contrast_table_sql: null,
        phone_list: [],
        alert_user: [],
        fields: [],
        check_table_codes: [],
        contrast_table_codes: [],
        execution_cycle: null,
        next_execution_time: null,
        last_execution_time: null,
        last_execution_status: null,
        create_user: null,
        update_user: null,
        status: 1
      },
      operator_type: { 'rules': 1, 'filters': 2, 'dimensions': 3 },
      role_information: { 'check': 1, 'contrast': 2 },
      rule_code: null
    }
  },
  created() {
    const query = this.$route.query
    if (query.rule_code) {
      this.createStatus = false
      this.rule_code = query.rule_code
      this.getRule()
    } else {
      this.request_body.rule_type = query.rule_type
    }
    this.queryUserList()
    queryProject({ 'page_size': 30 }).then((res) => {
      this.projects = res.data.list
    })
  },
  methods: {
    test() {
      console.log(this.request_body.alert_user)
    },
    queryUserList() {
      queryList({ 'page_num': 1, 'page_size': 100 }).then(res => {
        this.userList = res.data.list
      })
    },
    handleClose(tag) {
      this.request_body.phone_list.splice(this.request_body.phone_list.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.request_body.phone_list.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getRule() {
      ruleInfo({ rule_code: this.rule_code }).then(res => {
        this.request_body = res.data
        if (this.request_body.check_source_type) {
          this.queryDatabase(this.request_body.check_source_type, 1)
          if (this.request_body.check_db_code) {
            this.queryTableList(this.request_body.check_db_code, this.request_body.check_source_type, 1)
          }
          if (this.request_body.check_table_sql) {
            this.check_table_display = false
            this.check_sql_display = true
            this.$set(this.request_body, 'check_table_codes', [])
          } else {
            this.$set(this.request_body, 'check_table_codes', [...res.data.check_table_code.split(',')])
          }
        }
        if (this.request_body.contrast_source_type) {
          this.queryDatabase(this.request_body.contrast_source_type, 2)
          if (this.request_body.contrast_db_code) {
            this.queryTableList(this.request_body.contrast_db_code, this.request_body.check_source_type, 2)
          }
          if (this.request_body.contrast_table_sql) {
            this.contrast_table_display = false
            this.contrast_sql_display = true
            this.$set(this.request_body, 'contrast_table_codes', [])
          } else {
            this.$set(this.request_body, 'contrast_table_codes', [...res.data.contrast_table_code.split(',')])
          }
        }
        let min_value = null
        let max_value = null
        this.request_body.fields.forEach(function(x) {
          x.field = x.col
          x.value = x.expected_value
          x.operator_type = parseInt(x.operator_type)
          x.role_information = parseInt(x.role_information)
          if (x.operator_type === 1 && x.role_information === 1) {
            if (x.operator === '>=') {
              min_value = x.value
            } else {
              max_value = x.value
            }
          }
        })
        if (min_value) {
          this.request_body.min_value = min_value
          this.min_display = true
          this.max_display = false
        }
        if (max_value) {
          this.request_body.max_value = max_value
          this.max_display = true
          this.min_display = false
        }
        this.request_body.max_value = max_value
      })
    },
    change(e) {
      this.$forceUpdate()
    },
    getProjectList(project_name) {
      queryProject({ 'project_name': project_name }).then((res) => {
        this.projects = res.data.list
      })
    },
    queryDatabase(source_type, type, clear) {
      queryDatabases({ source_type: source_type }).then(res => {
        if (type === 1) {
          this.check_databases = res.data
        } else {
          this.contrast_databases = res.data
        }
        this.disables.table = false
        if (clear) {
          this.clearDatabase(type)
        }
      })
    },
    queryTableList(db_code, source_type, type, clear) {
      if (db_code && source_type) {
        const params = { 'db_code': db_code, 'source_type': source_type }
        queryTables(params).then(res => {
          if (type === 1) {
            this.check_tables = res.data
            const tableList = []
            res.data.forEach(x => {
              tableList.push({ key: x.table_code, label: x.table_name, db: db_code })
            })
            this.check_tables_transfer = tableList
          } else {
            this.contrast_tables = res.data
            const tableList = []
            res.data.forEach(x => {
              tableList.push({ key: x.table_code, label: x.table_name, db: db_code })
            })
            this.contrast_tables_transfer = tableList
          }
          console.log("this.check_tables_transfer ", this.check_tables_transfer )
          console.log("this.contrast_tables_transfer ", this.contrast_tables_transfer )
          this.disables.field = false
          if (clear) {
            this.clearTable(type)
          }
        })
      }
    },
    async queryFieldsList(table_code, source_type, type) {
      if (source_type && table_code) {
        const params = { 'source_type': source_type, 'table_code': table_code }
        await queryField(params).then(res => {
          if (type === 1) {
            this.check_fields = res.data
          } else {
            this.contrast_fields = res.data
          }
        })
      }
    },
    add() {
      console.log(this.request_body)
      this.$refs['rule_form'].validate( async (valid) => {
        if (valid) {
          if (this.request_body.rule_type === 'count') {
            if (this.min_display === true) {
              this.request_body.fields.push({ id: '1', field: 'count(1)', operator: '>=', value: this.request_body.min_value, expression: 0, operator_type: 1, role_information: 1 })
            } else {
              this.request_body.fields.push({ id: '1', field: 'count(1)', operator: '<=', value: this.request_body.max_value, expression: 0, operator_type: 1, role_information: 1 })
            }
          } else if (this.request_body.rule_type === 'check_count') {
            this.request_body.fields.push({ id: 1, field: 'count(1)', operator: null, value: null, expression: 0, operator_type: 1, role_information: 1 })
            this.request_body.fields.push({ id: 1, field: 'count(1)', operator: null, value: null, expression: 0, operator_type: 1, role_information: 2 })
          } else if (this.request_body.rule_type === 'business_monitoring') {
            await this.fieldList('check')
            console.log('this.check_fields', this.check_fields)
            for (let i = 0; i < this.check_fields.length; i++){
              this.request_body.fields.push({ id: i + 1, field: this.check_fields[i].field_name, operator: null, value: null, expression: 0, operator_type: 1, role_information: 1 })
            }
          }
          this.request_body.check_table_code = this.request_body.check_table_codes.join(',')
          this.request_body.check_table_name = this.request_body.check_table_codes.join(',').replaceAll(this.request_body.check_db_code + '_', '')
          if (this.request_body.contrast_table_codes) {
            this.request_body.contrast_table_code = this.request_body.contrast_table_codes.join(',')
            this.request_body.contrast_table_name = this.request_body.contrast_table_codes.join(',').replaceAll(this.request_body.contrast_db_code + '_', '')
          }
          addRule(this.request_body)
            .then((res) => {
              this.$router.push('/rule/list')
              this.$notify({
                title: '成功',
                message: '创建规则成功',
                type: 'success'
              })
            })
        }
      })
    },
    async update() {
      console.log(this.request_body)
      if (this.request_body.rule_type === 'count') {
        for (let i = this.request_body.fields.length - 1; i >= 0; i--) {
          if (this.request_body.fields[i].operator_type === 1 && this.request_body.fields[i].role_information === 1) {
            this.request_body.fields.splice(i, 1)
          }
        }
        if (this.min_display) {
          this.request_body.fields.push({ id: '1', field: 'count(1)', operator: '>=', value: this.request_body.min_value, expression: 0, operator_type: 1, role_information: 1 })
        } else {
          this.request_body.fields.push({ id: '1', field: 'count(1)', operator: '<=', value: this.request_body.max_value, expression: 0, operator_type: 1, role_information: 1 })
        }
      } else if (this.request_body.rule_type === 'check_count') {
        this.request_body.fields = this.request_body.fields.filter(function (val) {
          if (val.operator_type !== 1) {
            return val
          }
        })
        this.request_body.fields.push({ id: 1, field: 'count(1)', operator: null, value: null, expression: 0, operator_type: 1, role_information: 1 })
        this.request_body.fields.push({ id: 1, field: 'count(1)', operator: null, value: null, expression: 0, operator_type: 1, role_information: 2 })
      } else if (this.request_body.rule_type === 'business_monitoring') {
        await this.fieldList('check')
        console.log('this.check_fields', this.check_fields)
        this.request_body.fields = this.request_body.fields.filter(function (val) {
          if (val.operator_type !== 1) {
            return val
          }
        })
        console.log('this.request_body.fields', this.request_body.fields.length, this.request_body.fields)
        for (let i = 0; i < this.check_fields.length; i++) {
          this.request_body.fields.push({ id: i + 1, field: this.check_fields[i].field_name, operator: null, value: null, expression: 0, operator_type: 1, role_information: 1 })
        }
      }

      this.request_body.check_table_code = this.request_body.check_table_codes.join(',')
      this.request_body.check_table_name = this.request_body.check_table_codes.join(',').replaceAll(this.request_body.check_db_code + '_', '')
      if (this.request_body.contrast_table_codes){
        this.request_body.contrast_table_code = this.request_body.contrast_table_codes.join(',')
        this.request_body.contrast_table_name = this.request_body.contrast_table_codes.join(',').replaceAll(this.request_body.contrast_db_code + '_', '')
      }
      this.$refs['rule_form'].validate((valid) => {
        if (valid) {
          updateRule(this.rule_code, this.request_body)
            .then((res) => {
              this.$router.push('/rule/list')
              this.$notify({
                title: '成功',
                message: '编辑规则成功',
                type: 'success'
              })
            })
        }
      })
    },
    add_field(type) {
      const item = { id: createUniqueString(), field: null, operator: null, value: null, expression: 0,
        operator_type: this.operator_type[type.split('_')[1]], role_information: this.role_information[type.split('_')[0]] }
      this.request_body.fields.push(item)
    },
    delete_field(type, rule) {
      this.request_body.fields.splice(this.request_body.fields.indexOf(rule), 1)
    },
    clearDatabase(type) {
      if (type === 1) {
        this.request_body.check_db_code = null
      } else {
        this.request_body.contrast_db_code = null
      }
      this.clearTable(type)
    },
    clearTable(type) {
      if (type === 1) {
        this.request_body.check_table_code = null
        this.request_body.check_table_codes = []
        this.request_body.check_table_sql = null
      } else {
        this.request_body.contrast_table_code = null
        this.request_body.contrast_table_codes = []
        this.request_body.contrast_table_sql = null
      }
      this.clearField(type)
    },
    clearField(type) {
      for (let i = this.request_body.fields.length - 1; i >= 0; i--) {
        if (this.request_body.fields[i].role_information === type) {
          this.request_body.fields.splice(i, 1)
        }
      }
      if (type === 1) {
        this.check_fields = []
      } else {
        this.contrast_fields = []
      }
      this.check_fields = []
    },
    backHistory() {
      this.$router.go(-1)
    },
    switchTableOrSql(tableOrSql, type) {
      if (type === 1) {
        this.check_table_display = tableOrSql === 'table'
        this.check_sql_display = tableOrSql === 'sql'
        this.check_fields = []
      } else {
        this.contrast_table_display = tableOrSql === 'table'
        this.contrast_sql_display = tableOrSql === 'sql'
        this.contrast_fields = []
      }
      this.clearTable(type)
    },
    switchValue(value) {
      this.min_display = value === 'min'
      this.max_display = value === 'max'
    },
    async fieldList(type) {
      if (type === 'check' && this.check_fields.length === 0) {
        if (this.check_sql_display) {
          const sql = this.request_body.check_table_sql
          this.check_fields = this.handlerSql(sql)
        } else {
          await this.queryFieldsList(this.request_body.check_table_codes[0], this.request_body.check_source_type, 1)
        }
      } else if (type === 'contrast' && this.contrast_fields.length === 0) {
        if (this.contrast_sql_display) {
          const sql = this.request_body.contrast_table_sql
          this.contrast_fields = this.handlerSql(sql)
        } else {
          await this.queryFieldsList(this.request_body.contrast_table_codes[0], this.request_body.contrast_source_type, 2)
        }
      }
    },
    handlerSql(sql) {
      const endIndex = sql.search(/\sfrom\s/i)
      const select_list = sql.substring(sql.toLowerCase().indexOf('select') + 6, endIndex)
      const list = []
      for (let i = 0; i < select_list.split(',').length; i++) {
        const field = select_list.split(',')[i].trim()
        let field_name = field
        if (field.toLowerCase().indexOf(' as ') > 0) {
          field_name = field.toLowerCase().split(' as ')[1].trim()
        }
        if (field_name.toLowerCase().indexOf(' ') > 0) {
          const temp_list = field_name.toLowerCase().split(' ');
          field_name = temp_list[temp_list.length - 1].trim()
        }
        if (field_name.indexOf('.') > 0) {
          field_name = field_name.split('.')[1].trim()
        }
        list.push({ field_name: field_name })
      }
      return list
    }
  }
}
</script>

<style>
.phoneList >div{
  background: #fff;
  width: 300px;
}
.delete_icon{
  margin-left: 10px;
}
.create .create-body {
  padding: 50px 20px
}
.el-transfer-panel{
  width: 300px!important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
