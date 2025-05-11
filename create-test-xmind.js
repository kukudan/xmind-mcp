const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

// 创建 ZIP 文件
const zip = new AdmZip();

// 添加 content.xml
const contentXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<xmap-content xmlns="urn:xmind:xmap:xmlns:content:2.0" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" version="2.0">
  <sheet id="sheet-1" timestamp="1234567890">
    <topic id="root" timestamp="1234567890">
      <title>Central Topic</title>
      <children>
        <topics type="attached">
          <topic id="topic-1" timestamp="1234567890">
            <title>Main Topic 1</title>
            <children>
              <topics type="attached">
                <topic id="topic-2" timestamp="1234567890">
                  <title>Subtopic 1</title>
                </topic>
                <topic id="topic-3" timestamp="1234567890">
                  <title>Subtopic 2</title>
                </topic>
              </topics>
            </children>
          </topic>
        </topics>
      </children>
    </topic>
  </sheet>
</xmap-content>`;

// 添加 meta.xml
const metaXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<meta xmlns="urn:xmind:xmap:xmlns:meta:2.0" version="2.0">
  <Creator>
    <Name>XMind MCP</Name>
    <Version>1.0.0</Version>
  </Creator>
</meta>`;

// 添加 manifest.xml
const manifestXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<manifest xmlns="urn:xmind:xmap:xmlns:manifest:1.0">
  <file-entry full-path="content.xml" media-type="text/xml"/>
  <file-entry full-path="meta.xml" media-type="text/xml"/>
  <file-entry full-path="META-INF/" media-type=""/>
  <file-entry full-path="META-INF/manifest.xml" media-type="text/xml"/>
</manifest>`;

// 添加文件到 ZIP
zip.addFile('content.xml', Buffer.from(contentXml));
zip.addFile('meta.xml', Buffer.from(metaXml));
zip.addFile('META-INF/manifest.xml', Buffer.from(manifestXml));

// 保存 ZIP 文件
zip.writeZip('test.xmind');

console.log('测试用的 XMind 文件已创建：test.xmind'); 