const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const config = require('./config');

async function debugLogin() {
  console.log('🔧 Telegram 登录调试工具');
  console.log('========================');
  
  const session = new StringSession("");
  const client = new TelegramClient(session, config.apiId, config.apiHash, {
    connectionRetries: 5,
    useTestDC: false,
    baseLogger: console,
  });

  let phoneNumber = '';

  try {
    console.log('📱 开始连接到Telegram...');
    
    await client.start({
      phoneNumber: async () => {
        console.log('\n📞 请输入您的手机号码（格式：+8613812345678）:');
        phoneNumber = await input.text("手机号: ");
        console.log(`✅ 使用手机号: ${phoneNumber}`);
        return phoneNumber;
      },
      
      password: async () => {
        console.log('\n🔐 请输入您的两步验证密码（如果没有启用请直接回车）:');
        return await input.text("密码: ");
      },
      
      phoneCode: async () => {
        console.log('\n📱 验证码发送方式选择:');
        console.log('1. 通过Telegram应用接收');
        console.log('2. 通过短信接收');
        console.log('3. 通过语音电话接收');
        
        const method = await input.text('选择方式 (1/2/3): ');
        
                 switch(method) {
           case '2':
             console.log('📱 尝试请求短信验证码...');
             console.log('⚠️ 注意：短信验证码功能可能不可用，但您仍可通过Telegram应用接收验证码');
             break;
          case '3':
            console.log('📞 语音验证码功能需要Telegram Premium');
            break;
          default:
            console.log('📱 使用Telegram应用接收验证码');
        }
        
        console.log('\n⏰ 等待验证码...');
        console.log('💡 提示：');
        console.log('   - 检查Telegram应用中的"设备"部分');
        console.log('   - 验证码通常在1-2分钟内到达');
        console.log('   - 如果长时间未收到，可以尝试重新运行程序');
        
        const code = await input.text('验证码: ');
        console.log(`✅ 输入验证码: ${code}`);
        return code;
      },
      
      onError: (err) => {
        console.error('❌ 认证错误:', err.message);
        
        if (err.message.includes('PHONE_NUMBER_INVALID')) {
          console.log('📱 手机号格式错误，请确保格式为: +8613812345678');
        } else if (err.message.includes('PHONE_CODE_INVALID')) {
          console.log('🔑 验证码错误，请重新输入正确的验证码');
        } else if (err.message.includes('PHONE_CODE_EXPIRED')) {
          console.log('⏰ 验证码已过期，请重新运行程序获取新验证码');
        } else if (err.message.includes('SESSION_PASSWORD_NEEDED')) {
          console.log('🔐 需要两步验证密码');
        }
        
        throw err;
      },
    });

    console.log('🎉 登录成功！');
    
    // 显示所有对话
    console.log('\n📋 获取您的群组和频道列表...');
    const dialogs = await client.getDialogs({ limit: 50 });
    
    console.log('\n📝 可用的群组和频道:');
    console.log('===================');
    
    dialogs.forEach((dialog, index) => {
      const type = dialog.isChannel ? '📺 频道' : dialog.isGroup ? '👥 群组' : '👤 私聊';
      const id = dialog.entity.id;
      const title = dialog.title || '未知';
      const username = dialog.entity.username ? `@${dialog.entity.username}` : '无用户名';
      
      console.log(`${index + 1}. ${type} "${title}"`);
      console.log(`   ID: ${id}`);
      console.log(`   用户名: ${username}`);
      console.log('');
    });
    
    console.log('💡 提示: 将上面的群组名称或ID复制到config.js中使用');
    
    await client.disconnect();
    console.log('✅ 已断开连接');
    
  } catch (error) {
    console.error('❌ 登录失败:', error.message);
    
    if (error.message.includes('TIMEOUT')) {
      console.log('\n⏰ 连接超时解决方案:');
      console.log('1. 检查网络连接');
      console.log('2. 尝试使用VPN');
      console.log('3. 稍后重试');
    }
    
    process.exit(1);
  }
}

// 运行调试登录
debugLogin(); 