import type { ViewColumn } from "./types";

export const defaultPageSizeList = ["50", "100", "150", "200"];

export const defaultPageInfo = {
  currentPageNum: 1,
  pageSizeList: [
    { num: Number(defaultPageSizeList[0]), isCurrent: true },
    { num: Number(defaultPageSizeList[1]), isCurrent: false },
    { num: Number(defaultPageSizeList[2]), isCurrent: false },
    { num: Number(defaultPageSizeList[3]), isCurrent: false }
  ]
};

export const whiteColumns: ViewColumn[] = [
  { dataIndex: "serial", columnTitle: "序号", sortNo: 0 },
  { dataIndex: "action", columnTitle: "操作", sortNo: 1 }
];
