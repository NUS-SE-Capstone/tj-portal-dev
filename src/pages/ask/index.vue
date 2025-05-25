<!-- 提问 -->
<template>
  <div class="askWrapper">
    <div class="container">
      <div class="askCont fx-sb">
        <div class="formCont bg-wt marg-rt-20 fx-1">
            <div class="title">Ask Question</div>
            <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              status-icon
              :rules="rules"
              label-width="120px"
              class="demo-ruleForm"
              label-position="left"
            >
              <el-form-item label="Course" >
                <span>{{classInfo.title}}</span>
              </el-form-item>
              <el-form-item label="Section" prop="pass">
                <div>
                  <el-cascader
                    v-model="value"
                    :options="options"
                    :props="props"
                    @change="handleChange"
                  />
                </div>
              </el-form-item>
              <el-form-item label="Question Title" prop="title" >
                <el-input v-model="ruleForm.title" maxlength="64" @input="ruleshandle"  show-word-limit placeholder="please input"/>
              </el-form-item>
              <el-form-item label="Description" prop="description">
                <el-input v-model="ruleForm.description" rows="11" type="textarea" @input="ruleshandle" maxlength="500" show-word-limit placeholder="please input" />
              </el-form-item>
              <el-form-item>
                <div class="fx-sb fx-al-ct">
                  <div><el-checkbox v-model="ruleForm.anonymity" label="anonymous" size="large" /></div>
                  <div class="subCont">
                    <span class="bt ft-14" :class="{'bt-dis':!isSend}" @click="submitForm(ruleFormRef)">Submit</span>
                    </div>
                </div>
              </el-form-item>
            </el-form>
        </div>
        <!-- 提问注意事项 - 写死的 -->
        <AskCareful></AskCareful>
      </div>
    </div>
  </div>
</template>
<script setup>
/** 数据导入 **/
import { onMounted,reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import AskCareful from "./components/AskCareful.vue";
import { useRoute, useRouter } from "vue-router";
import { getClassCourses, postQuestions, putQuestions, getQuestionsDetails } from "@/api/classDetails.js";

const route = useRoute()
const router = useRouter()
const classInfo = route.query

const type = ref('add')
onMounted(() => {
  // 获取章节列表 - 下拉选择
  getClassCoursesDataes()
  ruleForm.courseId = classInfo.id
  if (classInfo.type && classInfo.type == 'edit'){
    type.value = 'edit'
    // 编辑模式 获取问题详情
    getQuestionsDetailsData()
  }
})

const ruleFormRef = ref()

const props = {
  expandTrigger: 'hover',
}
// 选择小节的数据
const value = ref([])

// 提问数据
const ruleForm = reactive({
  courseId: '', // 课程id,
  chapterId: '',  // 章Id
  sectionId: '', // 小节Id
  title: '', 
  anonymity: false, // 是否匿名
  description: '',
})

// 获取章节列表 - 下拉使用
let options = ref([])
const getClassCoursesDataes = async () => {
  await getClassCourses(classInfo.id)
    .then((res) => {
      if (res.code == 200) {
        const { data } = res
        const opt = data.map(n => {
            return {
              value : n.id,
              label: n.name,
              children : n.sections.map(h => {
                return {
                value: h.id,
                label: h.name
              }
            })
          }
        })
        options.value = opt
      } else {
        ElMessage({
          message:res.data.msg,
          type: 'error'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: "req course section data err",
        type: 'error'
      });
    });
} 
// 获取问题详情
const getQuestionsDetailsData = async () => {
  await getQuestionsDetails(classInfo.queryId)
    .then((res) => {
      if (res.code == 200) {
        const { data } = res
        ruleForm.courseId = data.courseId, // 课程id,
        ruleForm.chapterId= data.chapterId,  // 章Id
        ruleForm.sectionId=data.sectionId, // 小节Id
        ruleForm.title= data.title, 
        ruleForm.anonymity= data.anonymity, // 是否匿名
        ruleForm.description= data.description,
        ruleForm.id=data.id
        value.value = [data.chapterId, data.sectionId]
      } else {
        ElMessage({
          message:res.data.msg,
          type: 'error'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: "req course question data err",
        type: 'error'
      });
    });
} 

// 效验规则
const rules = reactive({})
const isSend = ref(false)

const ruleshandle = () => {
  const ruleData = {...ruleForm}
  let isValue = true
  for(let k in ruleData){
    if (ruleData[k] == '' && k != 'anonymity'){
        isValue = false
      }
  }   
  isSend.value = isValue
}

// 寻找提问章节
const handleChange = (val) => {
  type.value == 'edit' ? ruleForm.id = route.query.queryId : null
  ruleForm.chapterId = val[0]
  ruleForm.sectionId = val[1]
  ruleshandle()
}
// 提问数据提交
const submitForm = (formEl) => {
  if (!isSend.value) return
  formEl.validate(async (valid) => {
    if (valid) {
    //  根据不同模式执行新增或编辑提问
     const subFunc = type.value == 'edit' ? putQuestions : postQuestions;

     await subFunc(ruleForm).then((res) => {
        if (res.code == 200) {
          router.push({path: '/result/success', query: 'view my question'})
        } else {
          ElMessage({
            message:res.data.msg,
            type: 'error'
          });
        }
      })
      .catch(() => {
        ElMessage({
          message: type.value == 'edit' ? 'edit question err':'submit question err',
          type: 'error'
        });
      });
    } else {
      return false
    }
  })
}

</script>
<style lang="scss" src="./index.scss"> </style>
