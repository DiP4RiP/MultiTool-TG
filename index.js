const { Telegraf, Scenes, session } = require('telegraf');
const fs = require('fs');
const bot = new Telegraf('1783153297:AAEXHFZePlFTBI827xsXgi7CpKONqfR-Z6E');
const UsersApi = require('./user')
const enums = require('./enums')
const adminScene = require('./scenes/adminScene');
const studentScene = require('./scenes/studentScene');
const teacherScene = require('./scenes/teacherScene');

const dipID = 395483849
const kisID = 1370364784

const stage = new Scenes.Stage([adminScene, studentScene, teacherScene.teacher, teacherScene.chooseSubject, teacherScene.inputTask, teacherScene.inputDeadline, teacherScene.confrimCreate]);

bot.use(session())
bot.use(stage.middleware());

let p = new UsersApi.Admin("Никита Скрипниченнко", dipID)
let f = new UsersApi.BaseUser("Aboba", enums.subjects.CPP, enums.status.STUDENT)

//bot.telegram.sendMessage(kisID, "Хуй может быть")

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


    // if (users.has(ctx.message.text)) {
    //     if (users.get(ctx.message.text).tgUserID === dipID) {
    //         await ctx.scene.enter('admin', { user: users.get(ctx.message.text) });
    //     }
    //     else if (users.get(ctx.message.text).post === 'student') {
    //         await ctx.scene.enter('student', { user: users.get(ctx.message.text) });
    //     }
    //     else if (users.get(ctx.message.text).post === 'teacher') {
    //         await ctx.scene.enter('teacher', { user: users.get(ctx.message.text) });
    //     }
    // }
    // else {
    //     ctx.reply("Неверный пароль или аккаунт не найден")
    // }
})

bot.launch();

