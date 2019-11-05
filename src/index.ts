import { resolve } from "path";
import { copyFileSync, readdirSync, existsSync, mkdirSync, statSync, unlinkSync, rmdirSync } from "fs";

interface IOptions {
  /**
   * 是否覆盖，默认 true。当 deleteTargetFold 为 false 时有效
   */
  overwrite?: boolean;
  /**
   * 复制前是否先删除目标目录，默认 false
   */
  deleteTargetFold?: boolean;
}

/**
 * 复制目录。默认请况下，将源目录递归覆盖到目标目录。可控制是否复制前将目标目录删除
 * @param source 源目录
 * @param target 目标目录
 * @param options 参数
 */
export function copyFolder(source: string, target: string, options: IOptions = { overwrite: true, deleteTargetFold: false }) {
  const { overwrite = true, deleteTargetFold = false } = options;
  if (deleteTargetFold && !overwrite) {
    throw new Error(`当deleteTargetFold为true时，overwrite只能是true`);
  }

  if (!existsSync(source)) {
    throw new Error(`${source}不存在！`);
  }
  if (deleteTargetFold && existsSync(target)) {
    // 复制前将目标目录删除
    deleteFolder(target);
  }
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
  }

  const files = readdirSync(source, { encoding: "utf8" });

  files.map(file => {
    const sourceFileName = resolve(source, file);
    const targetFileName = resolve(target, file);
    if (statSync(sourceFileName).isDirectory()) {
      copyFolder(sourceFileName, targetFileName, options);
    } else {
      if (!existsSync(targetFileName) || overwrite) {
        // 不存在或覆盖时
        copyFileSync(sourceFileName, targetFileName);
      }
    }
  });
}

export function deleteFolder(path: string) {
  if (existsSync(path)) {
    const files = readdirSync(path, { encoding: "utf8" });
    files.map(file => {
      const fileFullName = resolve(path, file);
      if (statSync(fileFullName).isDirectory()) {
        deleteFolder(fileFullName);
      } else {
        unlinkSync(fileFullName);
      }
    });
    rmdirSync(path);
  }
}
