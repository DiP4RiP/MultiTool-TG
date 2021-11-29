const keys = require('../keyboards')
const task = require('../task')
const { Scenes, Markup } = require('telegraf');

const student = new Scenes.BaseScene('student');
let user;

student.enter(async ctx => {
    user = ctx.scene.state.user;
    ctx.reply(`${user.name}, вход успешный, должность ${user.post}. Ваши предметы: ${user.sub}`);
    user.tgUserID = ctx.from.id;
    if (user.task == undefined){
        ctx.reply("Ожидайте задание от преподавателя");
    } else {
        ctx.reply(`Текущее задание по ${user.task.sub}: ${user.task.task}`)
    }
});

module.exports = student;