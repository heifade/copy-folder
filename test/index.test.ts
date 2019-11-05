import { copyFolder, deleteFolder } from "../src/index";
import { resolve } from "path";
import { expect } from "chai";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import("mocha");

const sourcePath = resolve(__dirname, "./source");
const targetPath = resolve(__dirname, "./target");

function readFile(file: string) {
  if (!existsSync(file)) {
    return null;
  }
  return readFileSync(file, { encoding: "utf8" });
}

function writeFile(file: string, content: string) {
  writeFileSync(file, content, { encoding: "utf8" });
}

describe("复制目录, 默认：将源目录递归覆盖到目标目录", () => {
  before(() => {
    deleteFolder(targetPath);
  });

  it("复制目录", () => {
    copyFolder(sourcePath, targetPath);

    expect(readFile(`${sourcePath}/path1/path2/f1.txt`)).to.equals(readFile(`${targetPath}/path1/path2/f1.txt`));
    expect(readFile(`${sourcePath}/path1/path2/f2.txt`)).to.equals(readFile(`${targetPath}/path1/path2/f2.txt`));

    expect(readFile(`${sourcePath}/path1/f3.txt`)).to.equals(readFile(`${targetPath}/path1/f3.txt`));
    expect(readFile(`${sourcePath}/f4.txt`)).to.equals(readFile(`${targetPath}/f4.txt`));
  });
});

describe("复制目录, 默认：将源目录递归覆盖到目标目录。先建一个文件，再覆盖", () => {
  before(() => {
    deleteFolder(targetPath);
    mkdirSync(`${targetPath}/path1/path2`, { recursive: true });
    writeFile(`${targetPath}/path1/path2/f1.txt`, "fff");
  });

  it("复制目录，覆盖，不先删除", () => {
    expect(readFile(`${targetPath}/path1/path2/f1.txt`)).to.equals("fff");

    copyFolder(sourcePath, targetPath, { overwrite: true, deleteTargetFold: false });

    expect(readFile(`${sourcePath}/path1/path2/f1.txt`)).to.equals(readFile(`${targetPath}/path1/path2/f1.txt`));
    expect(readFile(`${sourcePath}/path1/path2/f2.txt`)).to.equals(readFile(`${targetPath}/path1/path2/f2.txt`));

    expect(readFile(`${sourcePath}/path1/f3.txt`)).to.equals(readFile(`${targetPath}/path1/f3.txt`));
    expect(readFile(`${sourcePath}/f4.txt`)).to.equals(readFile(`${targetPath}/f4.txt`));
  });
});

describe("复制目录, 将源目录递归复制到目标目录，不覆盖。先建一个文件，再复制", () => {
  before(() => {
    deleteFolder(targetPath);
    mkdirSync(`${targetPath}/path1/path2`, { recursive: true });
    writeFile(`${targetPath}/path1/path2/f1.txt`, "fff");
  });

  it("复制目录，不覆盖，不先删除", () => {
    expect(readFile(`${targetPath}/path1/path2/f1.txt`)).to.equals("fff");

    copyFolder(sourcePath, targetPath, { overwrite: false, deleteTargetFold: false });

    expect(readFile(`${targetPath}/path1/path2/f1.txt`)).to.equals("fff");
    expect(readFile(`${sourcePath}/path1/path2/f2.txt`)).to.equals(readFile(`${targetPath}/path1/path2/f2.txt`));

    expect(readFile(`${sourcePath}/path1/f3.txt`)).to.equals(readFile(`${targetPath}/path1/f3.txt`));
    expect(readFile(`${sourcePath}/f4.txt`)).to.equals(readFile(`${targetPath}/f4.txt`));
  });
});

describe("复制目录, 将源目录递归复制到目标目录，先删除。先建一个文件，再复制", () => {
  before(() => {
    deleteFolder(targetPath);
    mkdirSync(`${targetPath}/path1/path2`, { recursive: true });
    writeFile(`${targetPath}/path1/path2/f1.txt`, "fff");
  });

  it("复制目录，先删除", () => {
    expect(readFile(`${targetPath}/path1/path2/f1.txt`)).to.equals("fff");

    copyFolder(sourcePath, targetPath, { deleteTargetFold: true });

    expect(readFile(`${sourcePath}/path1/path2/f1.txt`)).to.equals(readFile(`${targetPath}/path1/path2/f1.txt`));
    expect(readFile(`${sourcePath}/path1/path2/f2.txt`)).to.equals(readFile(`${targetPath}/path1/path2/f2.txt`));

    expect(readFile(`${sourcePath}/path1/f3.txt`)).to.equals(readFile(`${targetPath}/path1/f3.txt`));
    expect(readFile(`${sourcePath}/f4.txt`)).to.equals(readFile(`${targetPath}/f4.txt`));
  });
});

describe("复制目录, deleteTargetFold=true, overwrite=false时报错", () => {
  before(() => {
    deleteFolder(targetPath);
    mkdirSync(`${targetPath}/path1/path2`, { recursive: true });
    writeFile(`${targetPath}/path1/path2/f1.txt`, "fff");
  });

  it("复制目录，先删除", () => {
    expect(readFile(`${targetPath}/path1/path2/f1.txt`)).to.equals("fff");

    try {
      copyFolder(sourcePath, targetPath, { overwrite: false, deleteTargetFold: true });
      expect("这里应该执行不到").to.equals("");
    } catch (e) {
      expect(e.message).to.equals("当deleteTargetFold为true时，overwrite只能是true");
    }
  });
});
