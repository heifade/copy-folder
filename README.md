# 复制目录

## 安装
```
npm i copy-folder
```

## 用法
```ts
import { copyFolder } from "copy-folder";

const options: IOptions = {
  overwrite: true, // 是否替换现有文件，默认 true
  deleteTargetFold: false // 复制前是否先删除目标目录，默认 false
}

copyFolder('/source', '/target', options);
```





