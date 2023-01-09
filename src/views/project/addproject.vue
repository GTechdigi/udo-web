<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="project_form" label-width="100px" :rules="form_project" :model="request_body" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="project_name">
          <el-input
            v-model="request_body.project_name"
            placeholder="请输入项目名称"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="项目描述" prop="project_description">
          <el-input
            v-model="request_body.project_description"
            placeholder="请输入项目名称"
            type="textarea"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="企微机器人">
          <el-input
            v-model="request_body.we_work_robot"
            placeholder="请输入企微机器人id"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="createStatus" @click="add">立即创建</el-button>
          <el-button  v-if="!createStatus" type="primary" @click="update">立即保存</el-button>
          <el-button @click="backHistory">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addProject, updateProject, getProject } from '@/api/project'

export default {
  data() {
    return {
      createStatus: true,
      projects: [],
      form_project: {
        project_name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
        project_description: [{ required: true, message: '项目描述不能为空', trigger: 'blur' }]
      },
      request_body: {
        project_code: null,
        project_name: null,
        project_description: null,
        we_work_robot: null,
        trigger: null,
        is_delete: 0
      },
      project_code: null
    }
  },
  created() {
    const query = this.$route.query
    console.log(query.project_code)
    if (query.project_code) {
      this.project_code = query.project_code
      this.createStatus = false
      this.getProjectInfo()
    }
  },
  methods: {
    getProjectInfo() {
      getProject(this.project_code).then((res) => {
        this.request_body = res.data
      })
    },
    add() {
      addProject(this.request_body)
        .then((res) => {
          if (res.success) {
            this.$router.push('/project/list')
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
    },
    update() {
      this.$refs['project_form'].validate((valid) => {
        if (valid) {
          updateProject(this.project_code, this.request_body)
            .then((res) => {
              this.$router.push('/project/list')
              this.$notify({
                title: '成功',
                message: '编辑规则成功',
                type: 'success'
              })
            })
        }
      })
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
