<template>

    <a-radio-group v-model="defaultPage" style="display: inline-grid;">
      <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 15px">
        <a-input v-model="pageSizeList[0].num" />
        <a-radio style="margin-left: 10px" :value="1" > 默认</a-radio>
      </div>
      <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 15px">
        <a-input v-model="pageSizeList[1].num" />
        <a-radio style="margin-left: 10px" :value="2"> 默认</a-radio>
      </div>
      <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 15px">
        <a-input v-model="pageSizeList[2].num" />
        <a-radio style="margin-left: 10px" :value="3"> 默认</a-radio>
      </div>
      <div style="display: inline-flex; flex-direction: row; align-items: center;margin-bottom: 15px">
        <a-input v-model="pageSizeList[3].num" />
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
      pageSizeList: [
        { num: 10, isCurrent: true },
        { num: 40, isCurrent: false },
        { num: 50, isCurrent: false },
        { num: 60, isCurrent: false }
      ]
    }
  },
  computed: {},
  created () {},
  mounted () {},
  props: {
  },
  methods: {
    changeValue (list) {
      let defaultPage = 1
      for (let i = 0; i < list.length; i++) {
        if (list[i].isCurrent) {
          defaultPage = i + 1
        }
      }
      this.pageSizeList = [...list]
      this.defaultPage = defaultPage
    },
    getJsonValue () {
      return {
        currentPageNum: 1,
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
