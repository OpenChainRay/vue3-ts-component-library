import type { ViewListGroupItem } from "./types";

/** 过滤并拆分视图分组 */
export function splitViewList(list: ViewListGroupItem[]) {
  const groupList: ViewListGroupItem[] = [];
  const topLevelList: Array<{ viewId: string | number; viewName: string }> = [];
  list.forEach((item) => {
    if (item.isGroup) {
      groupList.push(item);
      return;
    }
    item.viewOptionList.forEach((view) => {
      topLevelList.push(view);
    });
  });
  return { groupList, topLevelList };
}
