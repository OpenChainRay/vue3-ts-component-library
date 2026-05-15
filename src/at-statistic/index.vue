<template>
  <div @mouseleave="hiddenInput" @mouseover="showInput">
    <a-input v-model="account" type="number" :disabled="$attrs.disabled" :allowClear="$attrs.allowClear"
      :placeholder="$attrs.placeholder" @blur="change" :style="{ 'text-align': align }" v-show="isShowInput"

      />
    <a-statistic v-model="account" v-show="!isShowInput" :style="{ 'text-align': align }"
      value-style="font-size:14px;    padding: 4px 11px;"
      :class="{ 'ant-input': true, 'my-input-disabled': $attrs.disabled }" />

      <!-- <child-component v-bind="$attrs" v-on="$listeners"></child-component> -->

  </div>
</template>

<script>

export default {
  name: 'AtStatistic',
  components: {
  },
  data () {
    return {
      isShowInput: false,
      account: 0
    }
  },
  props: {
    /**
     * 绑定的参数
     */
    value: {
      type: [Number, String],
      default: () => ('')
    },
    /** 默认保留2位小数 */
    decimals: {
      type: Number,
      default: 2
    },
    /**
     * 文字对齐
     */
    align: {
      type: String,
      default: () => 'left'
    },
    min: {
      type: Number,
      default: () => (-Infinity)
    },
    max: {
      type: Number,
      default: () => (Infinity)

    }

  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    // value (value) {
    //   // console.log(value)
    // }
  },
  computed: {

  },
  methods: {
    change () {
      const account = Number(this.account)
      if (this.max !== Infinity && account > this.max) {
        this.account = this.max
      }

      if (this.min !== -Infinity && account < this.min) {
        this.account = this.min
      }
      this.account = Number(this.account).toFixed(this.decimals)

      this.$emit('change', this.account)
    },
    showInput () {
      // console.log('mouseover')

      this.isShowInput = true
    },
    hiddenInput () {
      // console.log('mouseleave')
      this.isShowInput = false
    }
  },
  created () {
    this.account = this.value
    this.account = Number(this.account).toFixed(this.decimals)
  }
}

</script>

<style  lang="less" scoped>
::v-deep .ant-statistic-content-value-decimal {
  font-size: 14px;
}

.my-input-disabled {
  background-color: #f5f5f5;
  opacity: 1;
  cursor: not-allowed;
  color: rgba(0, 0, 0, 0.25);
  pointer-events: none;

  ::v-deep .ant-statistic-content {
    color: rgba(0, 0, 0, 0.25);
  }
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
