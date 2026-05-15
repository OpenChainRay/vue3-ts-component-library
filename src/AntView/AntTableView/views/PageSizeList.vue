<template>

  <a-radio-group v-model="defaultPage" style="display: inline-grid;">
    <!-- <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px" :step="1" >
      <a-input-number :min="1" size="small" v-model="currentPageNum" :formatter="limitNumber"
      :parser="limitNumber"/>
      <div style="margin-left: 10px">默认页数</div>
    </div> -->
    <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px">
      <a-input-number :min="1" :max="1100" size="small" v-model="pageSizeList[0].num" :step="1" :formatter="limitNumber"
        :parser="limitNumber" />
      <a-radio style="margin-left: 10px" :value="1"> 默认</a-radio>
    </div>
    <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px">
      <a-input-number :min="1" :max="1100" size="small" v-model="pageSizeList[1].num" :step="1" :formatter="limitNumber"
        :parser="limitNumber" />
      <a-radio style="margin-left: 10px" :value="2"> 默认</a-radio>
    </div>
    <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px">
      <a-input-number :min="1" :max="1100" size="small" v-model="pageSizeList[2].num" :step="1" :formatter="limitNumber"
        :parser="limitNumber" />
      <a-radio style="margin-left: 10px" :value="3"> 默认</a-radio>
    </div>
    <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px">
      <a-input-number :min="1" :max="1100" size="small" v-model="pageSizeList[3].num" :step="1" :formatter="limitNumber"
        :parser="limitNumber" />
      <a-radio style="margin-left: 10px" :value="4"> 默认</a-radio>
    </div>
  </a-radio-group>
</template>
<script>
export default {
  name: 'pageSizeSetting',
  components: {},
  data () {
    return {
      defaultPage: 1,
      currentPageNum: 1,
      pageSizeList: [
        { num: 10, isCurrent: true },
        { num: 40, isCurrent: false },
        { num: 50, isCurrent: false },
        { num: 60, isCurrent: false }
      ]
    }
  },
  computed: {},
  created () { },
  mounted () { },
  props: {
  },
  methods: {
    // methods 正则替换小数点
    limitNumber (value) {
      // console.log(value)
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(/\./g, '') : 0
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(/\./g, '') : 0
      } else {
        return 0
      }
    },
    changeValue (list, currentPageNum) {
      if (list) {
        let defaultPage = 1
        for (let i = 0; i < list.length; i++) {
          if (list[i].isCurrent) {
            defaultPage = i + 1
          }
        }
        this.pageSizeList = [...list]
        this.defaultPage = defaultPage
      }
      if (currentPageNum) {
        this.currentPageNum = currentPageNum
      }
    },
    getJsonValue () {
      return {
        currentPageNum: this.currentPageNum,
        pageSizeList: [
          { num: this.pageSizeList[0].num, isCurrent: this.defaultPage === 1 },
          { num: this.pageSizeList[1].num, isCurrent: this.defaultPage === 2 },
          { num: this.pageSizeList[2].num, isCurrent: this.defaultPage === 3 },
          { num: this.pageSizeList[3].num, isCurrent: this.defaultPage === 4 }
        ]
      }
    }
  }
}
</script>
