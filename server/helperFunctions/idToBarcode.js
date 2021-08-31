const { DOMImplementation, XMLSerializer } = require('xmldom');
const JsBarcode = require('jsbarcode');

module.exports = function idToBarcode(ids) {
  const xmlSerializer = new XMLSerializer();
  const document = new DOMImplementation().createDocument(
    'http://www.w3.org/1999/xhtml',
    'html',
    null,
  );

  return ids.map((id) => {
    const svgNode = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    JsBarcode(svgNode, id, {
      xmlDocument: document,
    });

    return xmlSerializer.serializeToString(svgNode);
  });
};
