const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'nokormc.xyz', // ដាក់ IP server
  port: 16800,           // port (default 25565)
  username: 'Bot_Nokor',   // ឈ្មោះ bot
  version: true        // auto detect version
})

bot.on('login', () => {
  console.log('✅ Bot joined server!')
})

bot.on('spawn', () => {
  console.log('🌍 Bot spawned!')
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return

  console.log(username + ': ' + message)

  if (message === 'hi') {
    bot.chat('Hello 😁')
  }

  if (message === 'follow') {
    bot.chat('OK I follow you!')
  }
})

bot.on('end', () => {
  console.log('❌ Bot disconnected')
})

bot.on('error', (err) => {
  console.log('⚠️ Error:', err)
})
