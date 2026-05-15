// @ts-nocheck
import { request, METHOD } from '@/utils/request'
const APP_SRM_URL = process.env.APP_SRM_URL
const umsBaseUrl = process.env.APP_UMS_URL
const BASE_URL = process.env.APP_API_BASE_URL
const APP_OMS_URL = process.env.APP_OMS_URL
const APP_ARMS_URL = process.env.APP_ARMS_URL
// 查询：分页模糊查询部门
export function getDeptCodeByPage(params) {
  return request({
    url: `${umsBaseUrl}/department/getListByName`,
    method: METHOD.GET,
    params: params,
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  }
  })
}
export function getTypeTree(params) {
  return request({
    url: `${APP_OMS_URL}/oms/product/type/queryTree`,
    method: METHOD.GET,
    params: params
  }
  })
}
// 详情：采购单详情
export function procureOrderDetails(id) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/details/${id}`,
    method: METHOD.POST
  }
  })
}
// 查询仓库数据集合
export function planSelectStockList() {
  return request({
    url: `${APP_SRM_URL}/supplierPlanOrder/selectStockList`,
    method: METHOD.POST
  }
  })
}
// 获取集团所有组织（公司）
export async function getAllOrganizations() {
  return await request({
    url: `${umsBaseUrl}/organization/listOption`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
}

// 修改：更新采购单明细
export function updateOrderDetail(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/updateOrderDetail`,
    method: METHOD.POST,
    params: params
  }
  })
}
// 获取所有供应商下拉
export function getSupplierName() {
  return request({
    url: `${APP_SRM_URL}/productSkuPms/supplierName`,
    method: METHOD.POST
  }
  })
}

// 查询：分页查询采购单
export async function purchasePage(params) {
  return await request({
    // url: `${APP_OMS_URL}/oms/quote/newVwSalePage`,
    url: `${APP_SRM_URL}/procureOrder/page`,
    // url: `${APP_ARMS_URL}/receivable/receivableViewPage`,
    method: METHOD.POST,
    params: params
  }).catch((error) => { throw new Error(error) })
}

// 更新 :采购单头信息
export function editProcureOrder(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/editProcureOrder`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 提交:采购单生成合同审批
export function saveContractApprove(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/saveContractApprove`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 回签单确认:采购单回签单确认
export function procureOrderAffirm(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/procureOrderAffirm`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 审批 :采购单合同审批
export function contractApprove(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/contractApprove`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 保存:采购单行生成审批(行上保存)
export function saveOrderDetail(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/saveOrderDetail`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 保存:采购单行生成审批(头上保存)
export function saveOrderDetailList(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/saveOrderDetailList`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 关闭:关闭采购明细
export function cancellationOrderDetail(id) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/cancellationOrderDetail/${id}`,
    method: METHOD.POST
  }
  })
}

// 打开:采购明细
export function openOrderDetail(id) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/openOrderDetail/${id}`,
    method: METHOD.POST
  }
  })
}

// 打开:采购单
export function openOrder(id) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/openOrder/${id}`,
    method: METHOD.POST
  }
  })
}
export function cancelgl(id) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/cancelgl/${id}`,
    method: METHOD.POST
  }
  })
}

export function appendKin(id) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/appendKind/${id}`,
    method: METHOD.POST
  }
  })
}

// 关闭:采购单
export function cancellationOrder(id) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/cancellationOrder/${id}`,
    method: METHOD.POST
  }
  })
}

// 审批 :采购单明细价格审批
export function procureOrderDetailApprove(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/orderDetailApprove`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 保存：回签单生成
export function saveAffirmUrl(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/saveAffirmUrl`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 查询 :根据供应商编码查询合同联系人
export function selectContact(supplierId) {
  return request({
    url: `${APP_SRM_URL}/supplier/selectContact/${supplierId}`,
    method: METHOD.POST
  }
  })
}

// 发送 :采购单合同发送给供应商
export function sendContractEmail(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/sendContractEmail`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 查询:供应商合同发送记录
export function selectContractHistory(procureId) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/selectContractHistory/${procureId}`,
    method: METHOD.POST
  }
  })
}

// 查询：采购入库单集合
export function purInstocklist(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/purInstocklist`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 合并采购单明细
export function mergeOrder(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/mergeOrder`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 打开采购单明细
export function openAll(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/openAll`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 关闭采购单明细
export function closeAll(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/closeAll`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 作废闭采购单明细
export function zfAll(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/zfAll`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 结算币别 数据集合下拉
export function selectCurrencyList(params) {
  return request({
    url: `${APP_SRM_URL}/dropDown/selectCurrencyList`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 收付款条件  数据集合下拉
export function selectGatheringList(params) {
  return request({
    url: `${APP_SRM_URL}/dropDown/selectPaymentConditionList`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 结算方式数据集合下拉
export function selectSettleTypeList(params) {
  return request({
    url: `${APP_SRM_URL}/dropDown/selectSettleTypeList`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 作废:采购单
export function procureCancellationOrder(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/cancellationOrder`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 作废:采购单明细
export function procureCancellationDetail(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/cancellationOrderDetail`,
    method: METHOD.POST,
    params: params
  }
  })
}

export function addResouse(params) {
  return request({
    url: `${APP_SRM_URL}/supplierPlanOrder/addEdit`,
    method: METHOD.POST,
    params: params
  }
  })
}

export function removeProcureResource(id) {
  return request({
    url: `${APP_SRM_URL}/supplierPlanOrder/removeProcureResource/${id}`,
    method: METHOD.POST
  }
  })
}

// 块粘贴/批量填充
export function editProcureOrderBatch(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/editProcureOrderBatch`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 手动同步采购单数据
export function synchronousOrderData(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/synchronousOrderData`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 采购单详情page
export function detailsList(params) {
  return request({
    url: `${APP_SRM_URL}/procureOrder/detailsList`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 修改：修改视图信息  (修改列展示)
export function updateView(params) {
  return request({
    url: `${umsBaseUrl}/component/view/update`,
    method: METHOD.POST,
    params: params
  }
  })
}

export function calendar(params) { // 日历计算
  return request({
    url: `${APP_SRM_URL}/view/data/calendarDateCompute`,
    method: METHOD.POST,
    params: params

  }
  })
}
// 根据视图id获取查询条件
export function getQueryColumns(viewId) {
  return request({
    url: `${APP_SRM_URL}/vwView/get/filters/${viewId}`,
    method: METHOD.GET
  }
  })
}
// 根据视图id获取查询所有
export function getQueryDetail(viewId, tableCode) {
  return request({
    //
    url: `${APP_SRM_URL}/view/info/getViewShowInfo`,
    method: METHOD.GET,
    params: {
      viewId: viewId,
      tableCode: tableCode
    }
  })
}

// 查询：所有可添加的条件列信息接口
export function getViewInfoById(viewId) {
  return request({
    url: `${APP_SRM_URL}/view/getView/${viewId}`,
    method: METHOD.GET

  }
  })
}

export async function getAllFilterColumns(tableCode) {
  return await request({
    url: `${APP_SRM_URL}/table/info/getAllFilterColumns/${tableCode}`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
}
