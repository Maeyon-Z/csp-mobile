<template>
  <view class="mine-container" :style="{height: `${windowHeight}px`}">
    <van-cell-group inset>
      <van-cell title="请选择题目类型" :value="type" is-link @click="showTypePopup" arrow-direction="down"></van-cell>
      <van-cell title="请选择题目数量" :value="count" is-link @click="showCountPopup" arrow-direction="down"></van-cell>
      <van-cell title="点击按钮生成题目">
        <view>
          <van-button type="info" size="small" @click="startPractice">开始刷题</van-button>
        </view>
      </van-cell>
    </van-cell-group>
    <view style="height:10px"/>
    <van-tabs v-if="showExercise" style="margin-top:20px" :key="exerciseList" :active="active">
      <van-tab v-for="(item, id) in exerciseList" :key="id" :title="id+1">
        <van-row :span="24" style="margin-top:20px; margin-bottom:20px; font-size:20px">
          {{ "第" + (id+1) + "题"}}
        </van-row>
        <view v-if="item.quesType === 0" style="font-size:15px; margin-right:10px; margin-left:10px">  
          <view v-html="item.exerciseTitle"/>
          <van-radio-group :disabled="item.showAnswer" :value="item.answer" @change="(arg) => {test(item, arg)}">
              <van-radio name="A" size="large">{{ "A、" + item.choiceA }}</van-radio>
              <van-radio name="B" size="large">{{ "B、" + item.choiceB }}</van-radio>
              <van-radio name="C" size="large">{{ "C、" + item.choiceC }}</van-radio>
              <van-radio name="D" size="large">{{ "D、" + item.choiceD }}</van-radio>
          </van-radio-group>
          <view v-if="showAnswerList.includes(item.id)" style="color:red">
              <van-row :span="24" :key="item.answer" style="margin-top:20px; margin-bottom:20px;">
                  你的答案：{{ item.answer}}
              </van-row>
              <van-row :span="24" style="margin-top:20px; margin-bottom:20px;">
                  {{"正确答案：" + item.correctAnswer }}
              </van-row>
              <van-row :span="24" style="margin-top:20px; margin-bottom:20px;">
                  {{ item.analysis }}
              </van-row>
          </view>
        </view>
        <view v-else style="font-size:15px; margin-right:10px; margin-left:10px">
            <view v-html="item.exerciseProgram"/>
            <view style="height:10px"/>
            <view v-for="(ques, idx) in item.quesList" :key="idx">
                <view v-html="ques.exerciseTitle"/>
                <van-radio-group :disabled="item.showAnswer" :value="ques.answer" v-show="ques.exerciseType == 0" @change="(arg) => {test(ques, arg)}">
                    <van-radio name="A" size="large">{{ "A、" + ques.choiceA }}</van-radio>
                    <van-radio name="B" size="large">{{ "B、" + ques.choiceB }}</van-radio>
                    <van-radio name="C" size="large">{{ "C、" + ques.choiceC }}</van-radio>
                    <van-radio name="D" size="large">{{ "D、" + ques.choiceD }}</van-radio>
                </van-radio-group>
                <van-radio-group :disabled="item.showAnswer" :value="ques.answer" v-show="ques.exerciseType == 1" @change="(arg) => {test(ques, arg)}">
                    <van-radio name="正确" size="large">{{ "正确" }}</van-radio>
                    <van-radio name="错误" size="large">{{ "错误" }}</van-radio>
                </van-radio-group>
                <view v-if="showAnswerList.includes(item.id)" style="color:red">
                    <van-row :span="24" style="margin-top:10px; margin-bottom:10px;">
                        你的答案：{{ ques.answer}}
                    </van-row>
                    <van-row :span="24" style="margin-top:10px; margin-bottom:10px;">
                        {{"正确答案：" + ques.correctAnswer }}
                    </van-row>
                    <van-row :span="24" style="margin-top:10px; margin-bottom:10px;">
                        {{ ques.analysis }}
                    </van-row>
                </view>
            </view>
        </view>
        <view style="margin-top:20px;">
          <van-button type="info" v-show="!item.showAnswer" size="small" @click="submit(item)">提交并查看答案解析</van-button>
        </view>
      </van-tab>
    </van-tabs>

    <van-popup :show="showType" position="bottom" custom-style="height: 40%;"  @close="typeClose">
      <van-picker default-index="1" :columns="typeColumns" @change="changeType" />
    </van-popup>
    <van-popup :show="showCount" position="bottom" custom-style="height: 40%;"  @close="countClose">
      <van-picker default-index="9" :columns="countColumns" @change="changeCount" />
    </van-popup>
  </view>
</template>

<script>
  import storage from '@/utils/storage'
  import { genExrcise, getQues, submitPractice } from '@/api/csp/practice'
  
  export default {
    data() {
      return {
        showType: false,
        showCount: false,
        showExercise:false,
        type: "基础题",
        count: 10,
        typeColumns: ['随机', '基础题', '阅读程序题', '补全程序题'],
        countColumns: [],
        exerciseList:[],
        showAnswerList:[],
        active: 0,
      }
    },
    methods: {
      async startPractice() {
        this.showExercise = false;
        this.active = 0;
        let i = 0;
        if (this.type === '随机') i = -1;
        if (this.type === '基础题') i = 0;
        if (this.type === '阅读程序题') i = 1;
        if (this.type === '补全程序题') i = 2;

        const res = await genExrcise({ type: i, count: this.count });
        let exerciseList = [];
        if (res.code === 200) {
          exerciseList = res.data;
        }

        await Promise.all(exerciseList.map(async (exercise) => {
          if (exercise.quesType != 0) {
            const res = await getQues(exercise.id);
            if (res.code === 200) {
              exercise.quesList = res.data;
              exercise.quesList.forEach(ques => { ques.answer = '' });
            }
          }
          exercise.showAnswer = false;
          exercise.answer = '';
        }));

        this.exerciseList = exerciseList;
        this.showExercise = true;
        this.showAnswerList = [];
      },
      test(item, arg){
        item.answer = arg.detail;
      },
      submit(item) {
        item.showAnswer = true;
        if(item.quesType == 0 && item.answer != item.correctAnswer){
            submitPractice(item.id);
        }
        if(item.quesType != 0){
            let flag = false;
            item.quesList.forEach(ques => {
                if(ques.answer != ques.correctAnswer){
                    flag = true;
                }
            })
            if(flag){
                submitPractice(item.id);
            }
        }
        this.showAnswerList.push(item.id);
      },
      showTypePopup() {
        this.showType=true;
      },
      showCountPopup() {
        this.showCount=true;
      },
      typeClose() {
        this.showType=false;
      },
      countClose() {
        this.showCount=false;
      },
      changeType(event){
        const { picker, value, index } = event.detail;
        this.type = value;
      },
      changeCount(event){
        const { picker, value, index } = event.detail;
        this.count = value;
      }
    },
    computed: {
      windowHeight() {
        return uni.getSystemInfoSync().windowHeight - 50
      }
    }, 
    created() {
      for(let i = 1; i <= 100; i++){
        this.countColumns.push(i);
      }     
    }
  }
</script>

<style lang="scss" scoped>
  page {
    background-color: #f5f6f7;
  }

  .mine-container {
    width: 100%;
    height: 100%;
    margin-top: 10px;
  }
</style>
