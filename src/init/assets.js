import { readFile } from "fs";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// assets 폴더 경로
const basePath = path.join(__dirname, "../../assets");

// 비동기 병렬로 파일을 읽음.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    readFile(path.join(basePath, filename), "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    // 디렉토리 내 파일을 불러옴
    const files = await readdir(basePath); // basePath는 위에서 assets 디렉토리를 선언한 변수이다.
    // 파일 중 json 파일만 걸러냄
    const jsonFiles = files.filter((file) => file.endsWith(".json")); // endsWith(찾을 문자열(필수),길이(선택))
    // 읽어온 json 파일을 readFileAsync에 씌움
    const jsonReadFileAsync = jsonFiles.map((file) => readFileAsync(file));
    // Promise.all 처리
    const results = await Promise.all(jsonReadFileAsync);

    // 내보낼 객체 생성
    gameAssets = jsonFiles.reduce((assets, fileName, idx) => {
      const key = fileName.replace(".json", "");
      assets[key] = results[idx];
      return assets;
    }, {});

    // 최종적으로 불러온 json 객체 내보냄
    return gameAssets;
  } catch (error) {
    throw new Error("Failed to load game assets" + error.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
