#!/usr/bin/env node
// 导入必要的模块
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as xmind from 'xmind'; // XMind文件处理库
import type { Topic, Sheet } from 'xmind';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import { JSDOM } from 'jsdom';

interface TopicNode {
  title: string;
  notes: string;
  children: TopicNode[];
}

interface XMindSheet {
  title: string;
  topics: TopicNode;
}

/**
 * XMind MCP服务器类
 * 提供读取和解析XMind文件的功能
 */
class XMindServer {
  private server: McpServer;

  constructor() {
    // 初始化MCP服务器
    this.server = new McpServer({
      name: 'xmind-mcp',
      version: '1.0.0'
    });

    // 设置资源处理器
    this.setupResourceHandlers();
    // 设置工具处理器
    this.setupToolHandlers();
    
    // 处理进程中断信号
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * 设置资源处理器
   */
  private setupResourceHandlers() {
    // 添加XMind文件资源
    this.server.resource(
      'xmind-file',
      'xmind://{filePath}',
      async (uri) => {
        const filePath = uri.pathname.startsWith('/') ? uri.pathname.slice(1) : uri.pathname;
        try {
          // 创建并打开XMind文件
          const workbook = new xmind.Workbook();
          await workbook.load(filePath);
          const sheets = workbook.getSheets();
          // 提取所有工作表数据
          const result = sheets.map((sheet: Sheet) => ({
            title: sheet.getTitle(), // 工作表标题
            topics: this.extractTopics(sheet.getRootTopic()) // 提取主题树
          }));

          return {
            contents: [{
              uri: uri.href,
              mimeType: 'application/json',
              text: JSON.stringify(result, null, 2) // 返回JSON格式数据
            }]
          };
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : '未知错误';
          throw new Error(`处理XMind文件失败: ${message}`);
        }
      }
    );
  }

  /**
   * 递归提取主题树
   * @param topic 当前主题
   * @returns 包含主题信息的对象
   */
  private extractTopics(topic: Topic): TopicNode {
    const result: TopicNode = {
      title: topic.getTitle(), // 主题标题
      notes: topic.getNotes(), // 主题备注
      children: [] // 子主题
    };

    const children = topic.getChildren();
    if (children) {
      for (const child of children) {
        result.children.push(this.extractTopics(child));
      }
    }

    return result;
  }

  private parseTopic(topicElement: Element): TopicNode {
    const title = topicElement.querySelector('title')?.textContent || '';
    const notes = topicElement.querySelector('notes')?.textContent || '';
    const children: TopicNode[] = [];

    // 解析子主题
    const childrenElements = topicElement.querySelectorAll('children > topics > topic');
    childrenElements.forEach(child => {
      children.push(this.parseTopic(child));
    });

    return {
      title,
      notes,
      children
    };
  }

  private parseSheet(sheetElement: Element): XMindSheet {
    const title = sheetElement.querySelector('title')?.textContent || '';
    const topicElement = sheetElement.querySelector('topic');
    const topics = topicElement ? this.parseTopic(topicElement) : {
      title: '',
      notes: '',
      children: []
    };

    return {
      title,
      topics
    };
  }

  /**
   * 设置工具处理器
   */
  private setupToolHandlers() {
    this.server.tool(
      'read_xmind',
      {
        filePath: z.string().describe('XMind文件路径')
      },
      async ({ filePath }) => {
        try {
          // 检查文件是否存在
          if (!fs.existsSync(filePath)) {
            throw new Error(`文件不存在: ${filePath}`);
          }

          // 检查文件扩展名
          if (!filePath.toLowerCase().endsWith('.xmind')) {
            throw new Error('文件必须是 .xmind 格式');
          }

          // 读取并解压 XMind 文件
          const zip = new AdmZip(filePath);

          // 优先查找 document.json 或 content.json
          let jsonEntry = zip.getEntry('document.json') || zip.getEntry('content.json');
          if (jsonEntry) {
            // 解析新版 XMind JSON 文件
            const jsonStr = jsonEntry.getData().toString('utf8');
            let jsonData;
            try {
              jsonData = JSON.parse(jsonStr);
            } catch (e) {
              throw new Error('JSON 解析失败: ' + (e instanceof Error ? e.message : e));
            }
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(jsonData, null, 2)
              }]
            };
          }

          // 兼容旧版 content.xml
          const contentEntry = zip.getEntry('content.xml');
          if (contentEntry) {
            const contentXml = contentEntry.getData().toString('utf8');
            const dom = new JSDOM(contentXml, { contentType: 'text/xml' });
            const document = dom.window.document;
            const sheets: XMindSheet[] = [];
            const sheetElements = document.querySelectorAll('sheet');
            sheetElements.forEach(sheetElement => {
              sheets.push(this.parseSheet(sheetElement));
            });
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(sheets, null, 2)
              }]
            };
          }

          throw new Error('未找到可解析的 XMind 内容（document.json, content.json, content.xml 均不存在）');
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : '未知错误';
          return {
            content: [{
              type: 'text',
              text: `处理XMind文件失败: ${message}`
            }],
            isError: true
          };
        }
      }
    );
    console.log('工具已注册: read_xmind');
  }

  /**
   * 启动服务器
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('XMind MCP服务器已启动');
  }
}

// 创建并运行服务器
const server = new XMindServer();
server.run().catch(console.error);
