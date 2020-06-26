import {ITemplateHTMLIndexArgs} from "../types/types";

const NOTHING = '';

export const generateHtmlIndex = async ({
  title,
  description,
  lang,
  polyfillImportMap,
  noScriptMessage,
  importMapUrl,
  scriptModuleUrl,
  polyFillScriptUrl
}: ITemplateHTMLIndexArgs) => {
  return `
<!doctype html>

<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <meta name="author" content="${title}">
  <link rel="stylesheet" href="css/styles.css?v=1.0">
  
  ${polyfillImportMap ? `<script type="text/javascript" src="${polyFillScriptUrl}"></script>` : NOTHING}
  <script type="importmap" src="${importMapUrl}"></script>
  <script type="module" src="${scriptModuleUrl}"></script>
</head>

<body>
  <noscript>${noScriptMessage}</noscript>
  
  <!---
    This is a starter template, thank you for using Unpack
  -->
</body>
</html>
  `;
};
