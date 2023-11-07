<template>
  <view class="mine-container" :style="{height: `${windowHeight}px`}">
    <!--顶部个人信息栏-->
    <view class="header-section">
      <view class="uni-title uni-common-pl">地区选择器</view>
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">
            当前选择
          </view>
          <view class="uni-list-cell-db">
            <picker @change="bindPickerChange" :value="index" :range="array">
              <view class="uni-input">{{array[index]}}</view>
            </picker>
          </view>
        </view>
      </view>
    </view>

    <view class="content-section">
      {{ "题目" }}

    </view>
  </view>
</template>

<script>
  import storage from '@/utils/storage'
  
  export default {
    data() {
      return {
        
      }
    },
    computed: {
      
    },
    methods: {
      
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #f5f6f7;
  }

  .mine-container {
    width: 100%;
    height: 100%;


    .header-section {
      padding: 15px 15px 45px 15px;
      background-color: #3c96f3;
      color: white;
    }

    .content-section {
      position: relative;
      top: -50px;
    }
  }
</style>
