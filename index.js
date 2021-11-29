const { Telegraf, Scenes, session } = require('telegraf');
const bot = new Telegraf('1783153297:AAEXHFZePlFTBI827xsXgi7CpKONqfR-Z6E');
const UsersApi = require('./user')
const enums = require('./enums')
const init = require('./initData')
const adminScene = require('./scenes/adminScene');
const studentScene = require('./scenes/studentScene');
const teacherScene = require('./scenes/teacherScene');

const kisID = 1370364784

const stage = new Scenes.Stage(adminScene.concat(teacherScene, studentScene));

bot.use(session())
bot.use(stage.middleware());

//bot.telegram.sendMessage(kisID, "Хуй может быть")
init()
bot.start(async (ctx) => {
    await ctx.reply('Добро пожаловать в систему "Умный университет", введите пароль для продолжения');
});

bot.on('text', async (ctx) => {
    let usersArray = UsersApi.users;
    usersArray.forEach(async user => {
        if (ctx.message.text === user.pass) {
            await ctx.scene.enter(user.status, { user: user });
        }
    })
})

bot.launch();

