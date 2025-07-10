const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const config = require('./config');

// 临时预设手机号（仅用于测试，成功后请删除此文件）
const PHONE_NUMBER = "+8613281881130";

async function quickLogin() {
  console.log('🚀 快速登录测试');
  console.log('================');
  console.log(`📱 使用手机号: ${PHONE_NUMBER}`);
  console.log('⚠️  注意：这只是测试脚本，成功后请删除此文件');
  console.log('');
  
  const session = new StringSession("");
  const client = new TelegramClient(session, config.apiId, config.apiHash, {
    connectionRetries: 5,
    useTestDC: false,
  });

  try {
    await client.start({
      phoneNumber: async () => {
        console.log('✅ 自动使用预设手机号');
        return PHONE_NUMBER;
      },
      
      phoneCode: async () => {
        console.log('\n📱 验证码接收提示:');
        console.log('1. 打开您的Telegram应用');
        console.log('2. 查看"设置" → "设备" → "活跃会话"');
        console.log('3. 应该会看到新的登录请求和验证码');
        console.log('4. 也可能直接在聊天列表顶部显示验证码消息');
        console.log('');
        console.log('💡 如果没有收到验证码：');
        console.log('   - 确认手机号已注册Telegram');
        console.log('   - 检查网络连接');
        console.log('   - 尝试重启Telegram应用');
        console.log('   - 等待1-2分钟后重试');
        console.log('');
        
        const code = await input.text('请输入验证码: ');
        return code;
      },
      
      password: async () => {
        console.log('\n🔐 请输入两步验证密码（如果没有启用请直接回车）:');
        return await input.text("密码: ");
      },
      
      onError: (err) => {
        console.error('❌ 错误:', err.message);
        
        if (err.message.includes('PHONE_NUMBER_INVALID')) {
          console.log('📱 手机号无效或未注册Telegram');
        } else if (err.message.includes('PHONE_CODE_INVALID')) {
          console.log('🔑 验证码错误，请检查输入是否正确');
        } else if (err.message.includes('PHONE_CODE_EXPIRED')) {
          console.log('⏰ 验证码已过期，请重新运行程序');
        } else if (err.message.includes('FLOOD_WAIT')) {
          console.log('🚫 请求过于频繁，请稍后再试');
        }
      },
    });

    console.log('\n🎉 登录成功！');
    
    // 保存session到文件
    const sessionString = client.session.save();
    const fs = require('fs').promises;
    const path = require('path');
    const sessionFile = path.join(__dirname, `${config.sessionName}.session`);
    
    await fs.writeFile(sessionFile, sessionString);
    console.log('💾 Session已保存，下次运行将自动登录');
    
    // 显示群组和频道
    console.log('\n📋 获取群组和频道列表...');
    const dialogs = await client.getDialogs({ limit: 50 });
    
    console.log('\n📝 您的群组和频道:');
    console.log('=================');
    
    let foundPF = false;
    let foundJack = false;
    
    dialogs.forEach((dialog, index) => {
      const type = dialog.isChannel ? '📺 频道' : dialog.isGroup ? '👥 群组' : '👤 私聊';
      const id = dialog.entity.id;
      const title = dialog.title || '未知';
      const username = dialog.entity.username ? `@${dialog.entity.username}` : '';
      
      // 检查是否找到目标群组/频道
      if (title.includes('PF forwarding')) {
        foundPF = true;
        console.log(`✅ ${type} "${title}" (源群组)`);
      } else if (title.includes('jack hua')) {
        foundJack = true;
        console.log(`✅ ${type} "${title}" (目标频道)`);
      } else {
        console.log(`   ${type} "${title}"`);
      }
      
      console.log(`   ID: ${id}`);
      if (username) console.log(`   用户名: ${username}`);
      console.log('');
    });
    
    // 配置检查
    console.log('\n🔧 配置检查:');
    console.log('============');
    if (foundPF) {
      console.log('✅ 找到源群组 "PF forwarding"');
    } else {
      console.log('❌ 未找到 "PF forwarding" 群组');
      console.log('   请确认已加入该群组: https://t.me/+5lug4f3wbWI3ZjE0');
    }
    
    if (foundJack) {
      console.log('✅ 找到目标频道 "jack hua"');
    } else {
      console.log('❌ 未找到 "jack hua" 频道');
      console.log('   请确认频道名称是否正确，或在频道中添加您为管理员');
    }
    
    console.log('\n🎯 下一步:');
    if (foundPF && foundJack) {
      console.log('✅ 配置完整！可以运行: npm start');
    } else {
      console.log('⚠️  请先解决上述配置问题，然后运行: npm start');
    }
    
    await client.disconnect();
    console.log('\n✅ 已断开连接');
    console.log('🗑️  提醒：测试成功后请删除此quick-login.js文件');
    
  } catch (error) {
    console.error('\n❌ 登录失败:', error.message);
    
    if (error.message.includes('Code is empty')) {
      console.log('\n💡 验证码为空的解决方案:');
      console.log('1. 确保输入了完整的6位验证码');
      console.log('2. 检查Telegram应用是否收到验证码');
      console.log('3. 确认手机号已正确注册Telegram');
    }
    
    process.exit(1);
  }
}

quickLogin(); 