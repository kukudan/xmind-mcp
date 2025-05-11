#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// 导入必要的模块
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const xmind = __importStar(require("xmind")); // XMind文件处理库
/**
 * XMind MCP服务器类
 * 提供读取和解析XMind文件的功能
 */
class XMindServer {
    constructor() {
        // 初始化MCP服务器
        this.server = new index_js_1.Server({
            name: 'xmind-mcp',
            version: '1.0.0',
        }, {
            capabilities: {
                resources: {},
                tools: {},
            },
        });
        // 设置资源处理器
        this.setupResourceHandlers();
        // 设置工具处理器
        this.setupToolHandlers();
        // 错误处理
        this.server.onerror = (error) => console.error('[MCP错误]', error);
        // 处理进程中断信号
        process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
            yield this.server.close();
            process.exit(0);
        }));
    }
    /**
     * 设置资源处理器
     */
    setupResourceHandlers() {
        // 列出可用资源
        this.server.setRequestHandler(types_js_1.ListResourcesRequestSchema, () => __awaiter(this, void 0, void 0, function* () {
            return ({
                resources: []
            });
        }));
        // 列出资源模板
        this.server.setRequestHandler(types_js_1.ListResourceTemplatesRequestSchema, () => __awaiter(this, void 0, void 0, function* () {
            return ({
                resourceTemplates: [
                    {
                        uriTemplate: 'xmind://{filePath}',
                        name: 'XMind文件内容',
                        mimeType: 'application/json',
                        description: '读取和解析XMind文件内容',
                    },
                ]
            });
        }));
        // 读取资源
        this.server.setRequestHandler(types_js_1.ReadResourceRequestSchema, (request) => __awaiter(this, void 0, void 0, function* () {
            // 解析文件路径
            const match = request.params.uri.match(/^xmind:\/\/(.+)$/);
            if (!match) {
                throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidRequest, '无效的URI格式');
            }
            const filePath = decodeURIComponent(match[1]);
            try {
                // 打开XMind文件
                const workbook = xmind.open(filePath);
                const sheets = workbook.getSheets();
                // 提取所有工作表数据
                const result = sheets.map(sheet => ({
                    title: sheet.getTitle(),
                    topics: this.extractTopics(sheet.getRootTopic()) // 提取主题树
                }));
                return {
                    contents: [{
                            uri: request.params.uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(result, null, 2) // 返回JSON格式数据
                        }]
                };
            }
            catch (error) {
                const message = error instanceof Error ? error.message : '未知错误';
                throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `处理XMind文件失败: ${message}`);
            }
        }));
    }
    /**
     * 递归提取主题树
     * @param topic 当前主题
     * @returns 包含主题信息的对象
     */
    extractTopics(topic) {
        const result = {
            title: topic.getTitle(),
            notes: topic.getNotes(),
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
    /**
     * 设置工具处理器
     */
    setupToolHandlers() {
        // 列出可用工具
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, () => __awaiter(this, void 0, void 0, function* () {
            return ({
                tools: [
                    {
                        name: 'read_xmind',
                        description: '读取和解析XMind文件内容',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                filePath: {
                                    type: 'string',
                                    description: 'XMind文件路径'
                                }
                            },
                            required: ['filePath']
                        }
                    }
                ]
            });
        }));
        // 调用工具
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, (request) => __awaiter(this, void 0, void 0, function* () {
            if (request.params.name !== 'read_xmind') {
                throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, '未知工具');
            }
            const { filePath } = request.params.arguments;
            if (typeof filePath !== 'string') {
                throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, '无效的文件路径');
            }
            try {
                // 处理XMind文件
                const workbook = xmind.open(filePath);
                const sheets = workbook.getSheets();
                const result = sheets.map(sheet => ({
                    title: sheet.getTitle(),
                    topics: this.extractTopics(sheet.getRootTopic())
                }));
                return {
                    content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2) // 返回处理结果
                        }]
                };
            }
            catch (error) {
                const message = error instanceof Error ? error.message : '未知错误';
                return {
                    content: [{
                            type: 'text',
                            text: `处理XMind文件失败: ${message}`
                        }],
                    isError: true
                };
            }
        }));
    }
    /**
     * 启动服务器
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const transport = new stdio_js_1.StdioServerTransport();
            yield this.server.connect(transport);
            console.error('XMind MCP服务器已启动');
        });
    }
}
// 创建并运行服务器
const server = new XMindServer();
server.run().catch(console.error);
