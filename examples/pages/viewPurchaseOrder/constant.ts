// @ts-nocheck
import { planSelectStockList, getSupplierName, getAllOrganizations, getDeptCodeByPage, getTypeTree } from '@/services/viewPurchaseOrder'
const columnRequest = {
  // 供应商
  supplierCode: {
    request: getSupplierName, // 请求函数 promise
    custom: true, // 如果为true  请求接口
    selectName: 'supplierName', // 下拉框名称
    selectValue: 'number' // 下拉框值
  },
  // 报价供应商
  quotaionSupplierCode: {
    request: getSupplierName, // 请求函数 promise
    custom: true, // 如果为true  请求接口
    selectName: 'supplierName', // 下拉框名称
    selectValue: 'number' // 下拉框值
  },
  // 结算组织
  settlementOrg: {
    request: getAllOrganizations, // 请求函数 promise
    custom: true, // 如果为true  请求接口
    selectName: 'orgName', // 下拉框名称
    selectValue: 'erpId' // 下拉框值
  },
  // 最近交易供应商
  recentlySupplierCode: {
    request: getSupplierName, // 请求函数 promise
    custom: true, // 如果为true  请求接口
    selectName: 'supplierName', // 下拉框名称
    selectValue: 'number' // 下拉框值
  },
  // 报价供应商型号
  quotaionSupplierSkuCode: {
    request: getSupplierName, // 请求函数 promise
    custom: true, // 如果为true  请求接口
    selectName: 'supplierName', // 下拉框名称
    selectValue: 'number' // 下拉框值
  },
  // 最低交易供应商
  minimumSupplierCode: {
    request: getSupplierName, // 请求函数 promise
    custom: true, // 如果为true  请求接口
    selectName: 'supplierName', // 下拉框名称
    selectValue: 'number' // 下拉框值
  },
  // 仓库
  warehouseId: {
    request: planSelectStockList, // 请求函数 promise
    custom: true, // 如果为true  请求接口
    selectName: 'fname', // 下拉框名称
    selectValue: 'fstockid' // 下拉框值
  }
}
export const columnMap = {
  // 供应商列表配置项(自定义数据源)
  '6d853dae-85a5-4a8f-8df0-3950da704e4b': {
    // 数据状态
    documentStatus: {
      list: [{ dictId: 'A', dictText: '创建' },
      { dictId: 'B', dictText: '审核中' },
      { dictId: 'C', dictText: '已审核' }
      ]
    },
    // 冻结范围
    freezeLimit: {
      list: [{ dictId: 'Apply', dictText: '申请' },
      { dictId: 'Order', dictText: '订单' },
      { dictId: 'Receive', dictText: '收货' },
      { dictId: 'Return', dictText: '退货' },
      { dictId: 'Instock', dictText: '入库' },
      { dictId: 'Invoice', dictText: '发票' },
      { dictId: 'Pay', dictText: '付款' }
      ]
    },
    // 创建组织
    createOrgId: {
      request: getAllOrganizations, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'orgName', // 下拉框名称
      selectValue: 'erpId' // 下拉框值
      // allowMultiple: 'multiple', // 多选
      // list: [{ dictId: 'Apply', dictText: '申请' },
      // { dictId: 'Order', dictText: '订单' },
      // { dictId: 'Receive', dictText: '收货' },
      // { dictId: 'Return', dictText: '退货' },
      // { dictId: 'Instock', dictText: '入库' },
      // { dictId: 'Invoice', dictText: '发票' },
      // { dictId: 'Pay', dictText: '付款' }
      // ]
    },
    // 使用组织
    useOrgId: {
      request: getAllOrganizations, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'orgName', // 下拉框名称
      selectValue: 'erpId' // 下拉框值
    }

  },
  // 出库计划列表配置项(自定义数据源)
  '46b96c6a-faf6-4980-8b4d-bd40e8baf97a': {
    ...columnRequest
  },
  // 出库详情配置项(自定义数据源)
  '8a8462f6-6218-40a6-8c36-cd46a6712ee3': {
    ...columnRequest
  },
  // 表格列列表(自定义数据源)
  '7f88d743-b411-4590-b6ca-42b68afa82bc': {
    // 数据源值类型
    dataSourceValueType: {
      list: [
        { dictId: 1, dictText: '单选' },
        { dictId: 2, dictText: '多选' }
      ]
    }
  },
  // 项次周期
  '0172513d-4630-462f-9cb4-9849e8c0e655': {
    // 产品分类
    qoCategoryProductName: {
      request: getTypeTree,
      params: {},
      custom: true, // 如果为true  请求接口
      // 树结构的配置 必须设置
      replaceFields: {
        title: 'typeName',
        value: 'id',
        key: 'typeCode',
        children: 'children'
      }
    },
    // 销售部门
    soSaleDeptName: {
      request: getDeptCodeByPage, // 请求函数 promise
      params: { pageNum: 1, pageSize: 10000 },
      custom: true, // 如果为true  请求接口
      selectName: 'departmentName', // 下拉框名称
      selectValue: 'departmentName', // 下拉框值
      name: 'getDeptCodeByPage',
      customList: true,
      transfrom: (item, response) => {
        item.list = response.list
      }
    },
    // 产品部门
    soItemQoDeptName: {
      request: getDeptCodeByPage, // 请求函数 promise
      params: { pageNum: 1, pageSize: 10000 },
      custom: true, // 如果为true  请求接口
      selectName: 'departmentName', // 下拉框名称
      selectValue: 'departmentName', // 下拉框值
      name: 'getDeptCodeByPage',
      customList: true,
      transfrom: (item, response) => {
        item.list = response.list
      }
    },
    // 金蝶销售订单关闭状态
    kdSoCloseStatus: {
      request: getDeptCodeByPage, // 请求函数 promise
      params: { pageNum: 1, pageSize: 10000 },
      custom: true, // 如果为true  请求接口
      selectName: 'departmentName', // 下拉框名称
      selectValue: 'departmentName', // 下拉框值
      name: 'getDeptCodeByPage',
      customList: true,
      transfrom: (item, response) => {
        item.list = response.list
      }
    },
    // 金蝶销售订单业务终止状态
    kdSoBusinessTerminationStatus: {
      request: getDeptCodeByPage, // 请求函数 promise
      params: { pageNum: 1, pageSize: 10000 },
      custom: true, // 如果为true  请求接口
      selectName: 'departmentName', // 下拉框名称
      selectValue: 'departmentName', // 下拉框值
      name: 'getDeptCodeByPage',
      customList: true,
      transfrom: (item, response) => {
        item.list = response.list
      }
    },
    // 金蝶销售订单业务关闭状态
    kdSoBusinessCloseStatus: {
      request: getDeptCodeByPage, // 请求函数 promise
      params: { pageNum: 1, pageSize: 10000 },
      custom: true, // 如果为true  请求接口
      selectName: 'departmentName', // 下拉框名称
      selectValue: 'departmentName', // 下拉框值
      name: 'getDeptCodeByPage',
      customList: true,
      transfrom: (item, response) => {
        item.list = response.list
      }
    }

  },
  // 采购计划列表配置项(自定义数据源)
  'ef735270-598d-4a6d-aa7d-e096abc56eb5': {
    ...columnRequest
  },
  // 采购单列表配置项(自定义数据源)
  '526ad8cc-fada-11ed-b6cc-0242ac110007': {
    // 数据状态
    businessStatus: {
      list: [{ dictId: '0', dictText: '关闭' },
      { dictId: '1', dictText: '正常' }
      ]
    },
    // 供应商
    supplierCode: {
      request: getSupplierName, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'supplierName', // 下拉框名称
      selectValue: 'number' // 下拉框值
    },
    // 最近交易供应商
    recentlySupplierCode: {
      request: getSupplierName, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'supplierName', // 下拉框名称
      selectValue: 'number' // 下拉框值
    },
    // 最低交易供应商
    minimumSupplierCode: {
      request: getSupplierName, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'supplierName', // 下拉框名称
      selectValue: 'number' // 下拉框值
    },
    // 结算组织
    settlementOrg: {
      request: getAllOrganizations, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'orgName', // 下拉框名称
      selectValue: 'erpId' // 下拉框值
    },
    // 仓库
    warehouseId: {
      request: planSelectStockList, // 请求函数 Function
      custom: true, // 如果为true  请求接口
      selectName: 'fname', // 下拉框名称
      selectValue: 'fstockid' // 下拉框值
    }
  },
  // 采购计划列表配置项(自定义数据源)
  '00afa9f5-fdbe-11ed-9cb0-0242ac110007': {
    // 供应商
    supplierCode: {
      request: getSupplierName, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      name: 'getSupplierName',
      selectName: 'supplierName', // 下拉框名称
      selectValue: 'number' // 下拉框值
    },
    // 报价供应商
    quotaionSupplierCode: {
      request: getSupplierName, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'supplierName', // 下拉框名称
      selectValue: 'number' // 下拉框值
    },
    // 结算组织
    settlementOrg: {
      request: getAllOrganizations, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'orgName', // 下拉框名称
      selectValue: 'erpId' // 下拉框值
    },
    // 最近交易供应商
    recentlySupplierCode: {
      request: getSupplierName, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'supplierName', // 下拉框名称
      selectValue: 'number' // 下拉框值
    },
    // 报价供应商型号
    quotaionSupplierSkuCode: {
      request: getSupplierName, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'supplierName', // 下拉框名称
      selectValue: 'number' // 下拉框值
    },
    // 最低交易供应商
    minimumSupplierCode: {
      request: getSupplierName, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'supplierName', // 下拉框名称
      selectValue: 'number' // 下拉框值
    },
    // 仓库
    warehouseId: {
      request: planSelectStockList, // 请求函数 promise
      custom: true, // 如果为true  请求接口
      selectName: 'fname', // 下拉框名称
      selectValue: 'fstockid' // 下拉框值
    }
  },
  // 报价管理
  'f18047a0-3013-11ee-84ee-0242ac110022': {

    // 部门
    inquiryDeptName: {
      request: getDeptCodeByPage, // 请求函数 promise
      params: { pageNum: 1, pageSize: 10000 },
      custom: true, // 如果为true  请求接口
      selectName: 'departmentName', // 下拉框名称
      selectValue: 'id', // 下拉框值
      name: 'getDeptCodeByPage', // 函数传参的话  必须得传name字段 可以是接口名称  是为了去重
      customList: true,
      transfrom: (item, response) => {
        item.list = response.list
      }
      // 解决list结构不一样问题
    },
    // 产品分类 树结构
    prodTypeName: {
      request: getTypeTree,
      custom: true, // 如果为true  请求接口
      // customList: true, // 解决list结构不一样问题
      // 树结构的配置 必须设置
      replaceFields: {
        title: 'typeName',
        value: 'typeCode',
        key: 'typeCode',
        children: 'children'
      }
    }
  },
  // 确认报价详情
  'a10091ee-4230-11ee-84ee-0242ac110022': {

  },
  // 确认报价
  '1d558811-3665-11ee-84ee-0242ac110022': {
    // 部门
    deptName: {
      request: getDeptCodeByPage, // 请求函数 promise
      params: { pageNum: 1, pageSize: 10000 },
      custom: true, // 如果为true  请求接口
      selectName: 'departmentName', // 下拉框名称
      selectValue: 'id', // 下拉框值
      name: 'getDeptCodeByPage', // 函数传参的话  必须得传name字段 可以是接口名称  是为了去重
      customList: true, // 解决list结构不一样问题
      transfrom: (item, response) => {
        item.list = response.list
      }
    },
    sourceName: {
      // 请求函数 promise
      custom: false, // 如果为true  请求接口
      list: [
        {
          dictText: '全部',
          dictId: ''
        },
        {
          dictText: '中台',
          dictId: '1'
        }, {
          dictText: '商城',
          dictId: '2'
        }
      ]

    },
    // 成单状态
    orderStateName: {
      // 请求函数 promise
      // custom: false, // 如果为true  请求接口
      allowMultiple: 'multiple', // 多选
      list: [
        {
          dictText: '全部',
          dictId: ''
        },
        {
          dictText: '进行中',
          dictId: '1'
        }, {
          dictText: '成单',
          dictId: '2'
        },
        {
          dictText: '丢单',
          dictId: '3'
        }
      ]

    },
    orderReviewTypeName: {
      // 请求函数 promise
      custom: false, // 如果为true  请求接口
      list: [
        {
          dictText: '全部',
          dictId: ''
        },
        {
          dictText: 'FA',
          dictId: '1'
        }, {
          dictText: 'AL',
          dictId: '2'
        }

      ]

    },
    proFinalJudTypeName: {
      // 请求函数 promise
      custom: false, // 如果为true  请求接口
      list: [
        {
          dictText: '全部',
          dictId: ''
        },
        {
          dictText: 'FA',
          dictId: '1'
        }, {
          dictText: 'AL',
          dictId: '2'
        }

      ]

    },
    strategyStateStr: {
      custom: false
    }
  },
  // 完成合同
  'a6d399aa-4545-11ee-84ee-0242ac110022': {
    deptName: {

      request: getDeptCodeByPage, // 请求函数 promise
      params: { pageNum: 1, pageSize: 10000 },
      custom: true, // 如果为true  请求接口
      selectName: 'departmentName', // 下拉框名称
      selectValue: 'id', // 下拉框值
      name: 'getDeptCodeByPage', // 函数传参的话  必须得传name字段 可以是接口名称  是为了去重
      customList: true, // 解决list结构不一样问题
      transfrom: (item, response) => {
        item.list = response.list
      }
    }

  },
  // 开始询价
  '64f81c43-536d-11ee-94dd-0242ac11002a': {
    inquirerDept: {
      request: getDeptCodeByPage, // 请求函数 promise
      params: { pageNum: 1, pageSize: 10000 },
      custom: true, // 如果为true  请求接口
      selectName: 'departmentName', // 下拉框名称
      selectValue: 'id', // 下拉框值
      name: 'getDeptCodeByPage', // 函数传参的话  必须得传name字段 可以是接口名称  是为了去重
      customList: true, // 解决list结构不一样问题
      transfrom: (item, response) => {
        item.list = response.list
      }
    }

  }
}
