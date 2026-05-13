import type { RuntimePort } from "./ports";

/** 解析当前表格 tableCode */
export function resolveTableCode(defaultTableCode: string, runtime: RuntimePort): string {
  const currentPath = runtime.currentPath;
  const treeFlatten = runtime.treeFlatten;
  if (!currentPath || !treeFlatten?.length) {
    return defaultTableCode;
  }
  const currentNode = treeFlatten.find((item) => item.fullPath === currentPath);
  return currentNode?.tableCode || defaultTableCode;
}
