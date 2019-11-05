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

describe("删除目录", () => {
  before(() => {
    deleteFolder(targetPath);
  });

  it("删除目录", () => {
    expect(readFile(`${targetPath}/path1/path2/f1.txt`)).to.equals(null);

    copyFolder(sourcePath, targetPath);

    expect(readFile(`${sourcePath}/path1/path2/f1.txt`)).to.equals(readFile(`${targetPath}/path1/path2/f1.txt`));

    deleteFolder(targetPath);
    expect(readFile(`${targetPath}/path1/path2/f1.txt`)).to.equals(null);
  });
});
