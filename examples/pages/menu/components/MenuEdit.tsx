// @ts-nocheck
export default {
  name: 'MenuEdit',
  data () {
    return {
      editForm: null
    }
  },
  props: {
    value: {
      type: Object,
      required: false
    },
    isEdit: {
      type: Boolean,
      required: false
    },
    // 是否显示弹窗
    visible: {}
  },
  watch: {
    visible (val) {
      this.localInsertVisible = val
    }
  },
  computed: {
    localInsertVisible: {
      get () {
        return this.visible
      },
      set (newVal) {
        if (!newVal) this.$emit('resetVisible')
      }
    }
  },
  methods: {
    okBtnEvent () {

    },
    cancelBtnEvent () {
      this.localInsertVisible = false
    },
    initFormNode () {
      return (
        <a-form ref="editForm" >
          <a-row>
            <a-col span="8">
              <a-form-item label="是否始终显示" labelCol={{ span: 7 }} wrapperCol={{ span: 15, offset: 1 }}>
                <a-select vDecorator={['alwaysShow', { rules: [{ required: true, message: '是否始终显示是必填项！' }], initialValue: 1 }]}>
                  <a-select-option value={1}>
                    是
                  </a-select-option>
                  <a-select-option value={0}>
                    否
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="8">
              <a-form-item label="是否不在菜单树显示" labelCol={{ span: 7 }} wrapperCol={{ span: 15, offset: 1 }}>
                <a-select vDecorator={['hidden', { rules: [{ required: true, message: '是否不在菜单树显示是必填项！' }], initialValue: 0 }]}>
                  <a-select-option value={1}>
                    是
                  </a-select-option>
                  <a-select-option value={0}>
                    否
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="8">
              <a-form-item label="菜单图标" labelCol={{ span: 7 }} wrapperCol={{ span: 15, offset: 1 }}>
                <a-input
                  vDecorator={['icon', { rules: [{ required: true, message: '菜单图标是必填项！' }] }]}
                />
              </a-form-item>
            </a-col>
            <a-col span="8">
              <a-form-item label="排序号" labelCol={{ span: 7 }} wrapperCol={{ span: 15, offset: 1 }}>
                <a-input-number min={1}
                  vDecorator={['sortNum', { rules: [{ required: true, message: '排序号是必填项！' }] }]}
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      )
    }
  },
  render () {
    return (
      <a-modal
        {...{ props: this.$attrs, on: this.$listeners }}
        destroyOnClose={true}
        visible={this.localInsertVisible}
        onOk={this.okBtnEvent}
        onCancel={this.cancelBtnEvent}>
        {this.initFormNode()}
      </a-modal>
    )
  }
}
