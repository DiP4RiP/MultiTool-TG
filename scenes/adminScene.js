const keyboards = require('../keyboards')
const { Scenes } = require('telegraf');

const admin = new Scenes.BaseScene('admin');
let user;

admin.enter(async ctx => {
    user = ctx.scene.state.user;
    ctx.reply("Вход успешный", keyboards.chooseRole);
});

admin.action('teacher', async (ctx) => {
    ctx.scene.enter('teacher', { user: ctx.scene.state.user });
})
admin.action('student', async (ctx) => {
    ctx.scene.enter('student', { user: ctx.scene.state.user });
})

module.exports = admin;