const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const iconv = require("iconv-lite");

const folderPath = "C:\\Users\\ec000376\\Desktop\\202307複合機宛先設定自動化";
const uniqueCsvName = "unique.csv";
const files = fs.readdirSync(folderPath);

let uniqueLines = {};

files.map((file) => {
  if (!file.endsWith("csv")) {
    return;
  }

  if (file == uniqueCsvName) {
    return;
  }

  const filePath = path.join(folderPath, file);
  const fileData = fs.readFileSync(filePath, "utf-8");
  /* const convertedFileData = iconv.decode(fileData, "Shift-JIS"); */
  /* const lines = convertedFileData.split(/\r?\n/); */
  const lines = fileData.split(/\r?\n/);
  lines.map((line) => {
    if (line.trim() == "") {
      return;
    }
    const NoEliminatedLine = line.split(",").slice(1).join(",");
    uniqueLines[NoEliminatedLine] = line;
  });
});

const uniqueLinesArray = Object.values(uniqueLines);
let No = 0;
const uniqueCsvData = uniqueLinesArray
  .map((line) => {
    const head = line.split(",")[0];
    const body = line.split(",").slice(1).join(",");
    if (head == "*" || head == "MFDN") {
      return line;
    } else {
      No += 1;
      return No + "," + body;
    }
  })
  .join("\n");
const uniqueCsvPath = path.join(folderPath, uniqueCsvName);

fs.writeFileSync(uniqueCsvPath, uniqueCsvData);
