const fs = require("node:fs");
const path = require("node:path");

const BASE_SIZE = 16;

function pxToRem(pxValue) {
  const px = parseFloat(pxValue);

  if (px <= 7) {
    return `${px}px`;
  }

  const remValue = px / BASE_SIZE;
  return `${remValue}rem`;
}

function processFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`, err);
      return;
    }

    const updatedData = data.replace(
      /@media[^{]+\{[^}]+\}|\d*\.?\d+px/g,
      (match) => {
        if (match.startsWith("@media")) {
          return match;
        }
        return pxToRem(match);
      },
    );

    fs.writeFile(filePath, updatedData, "utf8", (err) => {
      if (err) {
        console.error(`Error writing file: ${filePath}`, err);
      } else {
        console.log(`Updated file: ${filePath}`);
      }
    });
  });
}

function processDirectory(directoryPath) {
  fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${directoryPath}`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file.name);

      if (file.isDirectory()) {
        processDirectory(filePath);
      } else if (
        file.isFile() &&
        (file.name.endsWith(".js") ||
          file.name.endsWith(".tsx") ||
          file.name.endsWith(".ts"))
      ) {
        processFile(filePath);
      }
    });
  });
}

const componentsPath = path.join(__dirname, "src", "components");
const templatesPath = path.join(__dirname, "src", "templates");

// Process both directories
processDirectory(componentsPath);
processDirectory(templatesPath);
