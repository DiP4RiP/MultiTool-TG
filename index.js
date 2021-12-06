const config = require('./config.json')
const { Telegraf, Scenes, session, Markup } = require('telegraf');
const bot = new Telegraf(config.token);
const initUserData = require('./initData')
initUserData() //Подгрузка файлов из бинарника
const UsersApi = require('./user')

const adminScene = require('./scenes/adminScene');
const studentScene = require('./scenes/studentScene');
const teacherScene = require('./scenes/teacherScene');

const kisID = 1370364784 //запасной тестовый id

const stage = new Scenes.Stage(adminScene.concat(teacherScene, studentScene)); //регистрация сцен

bot.use(session())
bot.use(stage.middleware());

bot.start(async (ctx) => { //Первый запуск
    await ctx.reply('Добро пожаловать в систему "Умный университет", введите пароль для продолжения');    
});

bot.on('text', async (ctx) => { //Ввод пароль и переадресация в нужную сцену
    let usersArray = UsersApi.users;
    usersArray.forEach(async user => { //Перебор всех юзеров
        if (ctx.message.text === user.pass) { //Если пароль совпал
            await ctx.scene.enter(user.status, { user: user }); //Перейти в сцену и предать юзера
        }
    })
})

bot.launch();

