// @ts-nocheck
import { listEmployeeOption, addDepartment, updateDepartment, getDepartmentInfoByDeptId } from '@/services/departmentList'
import { oftenMessage } from '@/utils/contextApi'
import { AtTable } from 'at-materia'
import {
  getStaffList
} from '@/services/personnel'
const { eventBus } = AtTable
export default {
  name: 'DepartmentEdit',
  data () {
    return {
      editForm: null,
      employeeList: null,
      formLoading: false,
      staffList: null
    }
  },
  props: {
    value: {
      type: Object,
      required: false
    },
    // 是否显示弹窗
    visible: {},
    isView: {
      type: Boolean,
      required: false
    },
    isEdit: {
      type: Boolean,
      required: false
    },
    currentDepartmentId: {}
  },
  async created () {
    const employeeData = await listEmployeeOption().catch((error) => { throw new Error(error) })
    const staffData = await getStaffList().catch((error) => { throw new Error(error) })
    this.employeeList = employeeData.data.data
    this.staffList = staffData.data.data
    await this.initEditData()
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
    },
    employeeOptions () {
      return this.employeeList?.map((item) => {
        return {
          value: item.id,
          label: `${item.employeeName}-${item.employeeCode}`
        }
      })
    },
    staffOptions () {
      return this.staffList?.map((item) => {
        return {
          value: item.id,
          label: `${item.positionName}`
        }
      })
    }
  },
  methods: {
    initEditData: async function () {
      if (this.isEdit) {
        this.formLoading = true
        const resResult = await getDepartmentInfoByDeptId(this.currentDepartmentId).catch((error) => { throw new Error(error) })
        const departmentData = resResult.data.data
        this.formLoading = false
        if (resResult?.data.code == 200) {
          this.formModel = { ...this.formModel,
            departmentCode: departmentData.departmentCode,
            kingDepartmentCode: departmentData.kingDepartmentCode,
            departmentName: departmentData.departmentName,
            departmentDesc: departmentData.departmentDesc
            // leaderId: departmentData.leaderId,
            // positionId: departmentData.positionId
           }
        } else {
          oftenMessage(false, '部门信息获取失败，请稍后尝试或联系技术支持！')
        }
      }
    },
    insertOk () {
      this.$refs.editForm.validate().then(async (values) => {
        const { departmentCode, departmentDesc = '', departmentName, kingDepartmentCode = '' } = values
          let result = null
          if (this.isEdit) {
            result = await updateDepartment({
              departmentCode,
              departmentDesc,
              departmentName,
              kingDepartmentCode,
              // leaderId,
              // positionId,
              id: this.currentDepartmentId
            }).catch((error) => { throw new Error(error) })
          } else {
            result = await addDepartment({
              departmentCode,
              departmentDesc,
              departmentName,
              kingDepartmentCode,
              // leaderId,
              // positionId,
              parentId: this.value.id
            }).catch((error) => { throw new Error(error) })
          }
          if (result?.data.code == 200) {
            this.$refreshPage('/personnel')
            oftenMessage(true, result.data.msg)
            this.$emit('refreshTree')
            eventBus.emit('departmentTableKey')

            this.localInsertVisible = false
          } else {
            oftenMessage(false, result.data.msg)
          }
      })
    },
    insertCancel () {
      this.localInsertVisible = false
    },
    initFormNode () {
      return (
        <a-form ref="editForm" >
          <a-form-item label="上级部门" labelCol={{ span: 7 }} wrapperCol={{ span: 15, offset: 1 }}>
            <a-input disabled readOnly style={{ minWith: '150px' }} vDecorator={['parentDepartment', { initialValue: this.value.departmentName }]}/>
          </a-form-item>
          <a-form-item label="部门编码" labelCol={{ span: 7 }} wrapperCol={{ span: 15, offset: 1 }}>
            <a-input style={{ minWith: '150px' }} vDecorator={['departmentCode', { rules: [{ required: true, message: '请填写部门编码！' }] }, { initialValue: this.value.departmentName }]}/>
          </a-form-item>
          <a-form-item label="金蝶部门编码" labelCol={{ span: 7 }} wrapperCol={{ span: 15, offset: 1 }}>
            <a-input style={{ minWith: '150px' }} vDecorator={['kingDepartmentCode']}/>
          </a-form-item>
          <a-form-item label="部门名称" labelCol={{ span: 7 }} wrapperCol={{ span: 15, offset: 1 }}>
            <a-input style={{ minWith: '150px' }} vDecorator={['departmentName', { rules: [{ required: true, message: '请填写部门名称！' }] }]}/>
          </a-form-item>
          <a-form-item label="描述" labelCol={{ span: 7 }} wrapperCol={{ span: 15, offset: 1 }}>
            <a-input style={{ minWith: '150px' }} vDecorator={['departmentDesc']}/>
          </a-form-item>
        </a-form>
      )
    }
  },
  render () {
    return (
      <a-modal {...{ props: this.$attrs, on: this.$listeners }} destroyOnClose={true} visible={this.localInsertVisible} onOk={this.insertOk} onCancel={this.insertCancel}>
        {this.initFormNode()}
      </a-modal>
    )
  }
}
