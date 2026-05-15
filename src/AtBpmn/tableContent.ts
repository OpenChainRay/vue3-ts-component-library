const bpmnColumns = [
  { title: "序号", scopedSlots: { customRender: "serial" }, width: 80, align: "center" },
  { title: "流程名称", dataIndex: "taskName", align: "center" },
  { title: "开始时间", dataIndex: "startDate", align: "center" },
  { title: "结束时间", dataIndex: "endDate", align: "center" },
  { title: "处理人", dataIndex: "assignee", align: "center" },
  { title: "处理状态", dataIndex: "approveMsg", align: "center" },
  { title: "备注", dataIndex: "comment", width: 400, align: "center" }
]

export { bpmnColumns }
