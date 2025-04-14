import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const execAsync = promisify(exec);

const TEST_CONFIG = {
    cookie: process.env.ICONFONT_COOKIE || '',
    name: 'lk-ui',
    output: 'iconfont-output'
};

async function setupTest() {
    try {
        console.log('开始设置测试环境...');

        // 检查 cookie 是否存在
        if (!TEST_CONFIG.cookie) {
            throw new Error('未设置 ICONFONT_COOKIE 环境变量，请在 .env 文件中设置');
        }

        // 创建测试配置文件
        console.log('创建测试配置文件...');
        await fs.promises.writeFile(
            'auto-icon.json',
            JSON.stringify(TEST_CONFIG, null, 2)
        );

        // 确保输出目录存在
        console.log('创建输出目录...');
        if (!fs.existsSync(TEST_CONFIG.output)) {
            await fs.promises.mkdir(TEST_CONFIG.output, { recursive: true });
        }

        console.log('测试环境设置完成');
    } catch (error) {
        console.error('设置测试环境时出错:', error);
        throw error;
    }
}

describe('本地测试', () => {
    beforeAll(async () => {
        await setupTest();
    });

    it('应该成功运行并生成文件', async () => {
        try {
            console.log('开始运行测试...');

            // 运行命令
            console.log('执行命令: npx ts-node src/cli.ts');
            const { stdout, stderr } = await execAsync('npx ts-node src/cli.ts');

            // 输出命令执行结果
            console.log('命令输出:', stdout);
            if (stderr) {
                console.error('命令错误:', stderr);
            }

            // 检查输出目录中的文件
            console.log('检查输出文件...');
            const files = await fs.promises.readdir(TEST_CONFIG.output);
            console.log('生成的文件列表:', files);

            expect(files).toContain('iconfont.css');
            expect(files).toContain('iconfont.ts');
            expect(files).toContain('model.ts');

            // 检查文件内容
            console.log('检查文件内容...');
            const cssContent = await fs.promises.readFile(
                path.join(TEST_CONFIG.output, 'iconfont.css'),
                'utf-8'
            );
            expect(cssContent).toContain('@font-face');

            const tsContent = await fs.promises.readFile(
                path.join(TEST_CONFIG.output, 'iconfont.ts'),
                'utf-8'
            );
            expect(tsContent).toContain('export default');

            const modelContent = await fs.promises.readFile(
                path.join(TEST_CONFIG.output, 'model.ts'),
                'utf-8'
            );
            expect(modelContent).toContain('export type IconType');

            // 输出文件位置信息
            const absolutePath = path.resolve(TEST_CONFIG.output);
            console.log('\n生成的文件已保存在以下位置：');
            console.log(absolutePath);
            console.log('\n您可以在该目录下查看以下文件：');
            console.log('- iconfont.css：图标样式文件');
            console.log('- iconfont.ts：图标类型定义');
            console.log('- model.ts：图标类型声明');
            console.log('\n注意：这些文件将被保留，您可以随时查看它们。');

            console.log('测试完成');
        } catch (error) {
            console.error('测试过程中出错:', error);
            throw error;
        }
    }, 60000); // 增加超时时间到 60 秒
}); 