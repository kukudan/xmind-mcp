const xmind = require('xmind');
console.log('xmind模块导出内容:');
console.log(Object.keys(xmind));
console.log('Workbook是否存在:', 'Workbook' in xmind);
console.log('open函数是否存在:', typeof xmind.open === 'function');

const { spawn } = require('child_process');
const path = require('path');

// 启动 MCP 服务器
const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// 处理服务器输出
server.stdout.on('data', (data) => {
  console.log('收到响应:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('错误:', data.toString());
});

// 等待服务器启动
setTimeout(() => {
  // 发送 listTools 请求
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list'
  };
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

  // 等待工具列表响应后发送 read_xmind 请求
  setTimeout(() => {
    const readXmindRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'read_xmind',
        arguments: {
          filePath: '/Users/little/Documents/思维导图/5.6 考虑（5.10 更新）.xmind'
        }
      }
    };
    server.stdin.write(JSON.stringify(readXmindRequest) + '\n');
  }, 1000);
}, 1000);

// 处理服务器退出
server.on('close', (code) => {
  console.log(`服务器退出，退出码: ${code}`);
});
