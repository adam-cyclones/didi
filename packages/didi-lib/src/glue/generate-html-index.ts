import { ITemplateHTMLIndexArgs } from '../types/types';
import { didiGlue } from './didi-glue';

const NOTHING = '';

export const generateHtmlIndex = async ({
  description,
  importMapInlineContent,
  importMapUrl,
  lang,
  noScriptMessage,
  polyFillScriptUrl,
  polyfillImportMap,
  scriptModuleUrl,
  title,
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
  
  ${polyfillImportMap ? `<script type="text/javascript" src="${polyFillScriptUrl}" defer></script>` : NOTHING}
  ${importMapInlineContent && polyfillImportMap ? 
    `<script type="importmap-shim" >${importMapInlineContent}</script>` : 
    `<script type="importmap" src="${importMapUrl}"></script>` 
}
  ${didiGlue()}  
  ${importMapInlineContent && polyfillImportMap ?
    `<script type="module-shim">
    import "${scriptModuleUrl}";
    console.log("ran")
    </script>` :
    `<script type="module" src="${scriptModuleUrl}"></script>`
}
  
</head>

<body>
  <noscript>${noScriptMessage}</noscript>
  
  <!---
    This is a starter template, thank you for using Didi
  -->
</body>
</html>
  `;
};
