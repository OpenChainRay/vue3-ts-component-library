<template>

  <a-radio-group v-model:value="defaultPage" style="display: inline-grid;">
    <!-- <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px" :step="1" >
      <a-input-number :min="1" size="small" v-model="currentPageNum" :formatter="limitNumber"
      :parser="limitNumber"/>
      <div style="margin-left: 10px">默认页数</div>
    </div> -->
    <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px">
      <a-input-number :min="1" :max="1100" size="small" v-model:value="pageSizeList[0].num" :step="1" :formatter="limitNumber"
        :parser="limitNumber" />
      <a-radio style="margin-left: 10px" :value="1"> 默认</a-radio>
    </div>
    <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px">
      <a-input-number :min="1" :max="1100" size="small" v-model:value="pageSizeList[1].num" :step="1" :formatter="limitNumber"
        :parser="limitNumber" />
      <a-radio style="margin-left: 10px" :value="2"> 默认</a-radio>
    </div>
    <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px">
      <a-input-number :min="1" :max="1100" size="small" v-model:value="pageSizeList[2].num" :step="1" :formatter="limitNumber"
        :parser="limitNumber" />
      <a-radio style="margin-left: 10px" :value="3"> 默认</a-radio>
    </div>
    <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 5px">
      <a-input-number :min="1" :max="1100" size="small" v-model:value="pageSizeList[3].num" :step="1" :formatter="limitNumber"
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
    /** 接口可能返回不足 4 项、num 为字符串、无 isCurrent，统一为 4 档数字 */
    changeValue (list, currentPageNum) {
      if (list && list.length) {
        const fallbacks = [10, 40, 50, 60]
        const padded = list.map((row, i) => {
          const n = Number(row.num)
          return {
            num: Number.isFinite(n) && n > 0 ? n : fallbacks[i] ?? 10,
            isCurrent: !!row.isCurrent
          }
        })
        while (padded.length < 4) {
          const i = padded.length
          padded.push({ num: fallbacks[i] ?? 10, isCurrent: false })
        }
        const four = padded.slice(0, 4)
        if (!four.some((x) => x.isCurrent)) {
          four[0].isCurrent = true
        }
        let defaultPage = 1
        for (let i = 0; i < four.length; i++) {
          if (four[i].isCurrent) defaultPage = i + 1
        }
        this.pageSizeList = four
        this.defaultPage = defaultPage
      }
      if (currentPageNum !== undefined && currentPageNum !== null) {
        const pn = Number(currentPageNum)
        this.currentPageNum = Number.isFinite(pn) && pn > 0 ? pn : 1
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
