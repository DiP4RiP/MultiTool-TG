const keyboards = require('../keyboards')
const { Scenes, Markup } = require('telegraf');
const enums = require('../enums');
const Arr = require('../arr');

const admin = new Scenes.BaseScene('admin');
const debugLoggin = new Scenes.BaseScene('debugLoggin');
const inputName = new Scenes.BaseScene('inputName');
const inputStatus = new Scenes.BaseScene('inputStatus');
const inputSub = new Scenes.BaseScene('inputSub');
const deleteUser = new Scenes.BaseScene('deleteUser');
let user; //Глобальная переменная для юзера

admin.enter(async ctx => { //Вход в сццену
    user = ctx.scene.state.user; //Запись в юзера полученного юзера
    await ctx.reply("Добро пожаловать в обитель. Выберите следующее действие", keyboards.chooseAdmin);
});


admin.action('debug', async ctx => {
    await ctx.scene.enter('debugLoggin');
})

admin.action('createUser', async ctx => {
    await ctx.scene.enter('inputName');
})

admin.action('deleteUser', async ctx => {
    await ctx.editMessageText('Пока не реализованно');
})


inputName.enter(async ctx => {
    await ctx.editMessageText('Введите имя пользователя');
})

inputName.on('text', async ctx => {
    await ctx.scene.enter('inputStatus', { userName: ctx.message.text });
})

inputStatus.enter(async ctx => {
    await ctx.reply('Выберите статус пользователя', keyboards.chooseRole);
})

Object.values(enums.status).forEach(element => { //Выбор пользователя из списка status
    if (element !== enums.status.ADMIN) {
        inputStatus.action(element, async (ctx) => {
            await ctx.scene.enter('inputSub', { userName: ctx.scene.state.userName, status: element });
        })
    }

});

inputSub.enter(async ctx => {
    let subListBtn = [];
    Object.keys(enums.subjects).forEach(element => {
        subListBtn.push(Markup.button.callback(element, element));
    })
    const listBtn = Markup.inlineKeyboard([subListBtn, [Markup.button.callback("✅ Готово", 'confirm')]])
    await ctx.editMessageText(`Имя: ${ctx.scene.state.status}\nТип пользователя: ${ctx.scene.state.status}\nВыберите направления из списка и нажмите ✅ для подтверждения`, listBtn)
})

let subList = Object.keys(enums.subjects);
let currSub = [];
subList.forEach(element => {
    inputSub.action(element, async ctx => {
        let subListBtn = [];
        let i = subList.indexOf(element);
        if(i >= 0) {
            currSub.push(subList[i])
            subList.splice(i,1);
        }
        subList.forEach(element => {
            subListBtn.push(Markup.button.callback(element, element));
        })
        let listBtn;
        if (subListBtn.length > 0){
            listBtn = Markup.inlineKeyboard([subListBtn, [Markup.button.callback("✅ Готово", 'confirm')]])
        } else {
            listBtn = Markup.inlineKeyboard([Markup.button.callback("✅ Готово", 'confirm')])
        }
        ctx.scene.state.sub = currSub;
        console.log(currSub);
        await ctx.editMessageText(`Имя: ${ctx.scene.state.status}\nТип пользователя: ${ctx.scene.state.status}\nВыбрано направление, выберете еще или нажмите ✅ для подтверждения`, listBtn)
    })
})

inputSub.action('confirm', async ctx => {
    console.log(ctx.scene.state.sub);
})

debugLoggin.enter(async ctx => {
    await ctx.editMessageText('Вы выбрали режим отладки. Можете выбрать сцену для входа', keyboards.chooseRole) //Отправка сообщения с выводом клавиатуры ролей
})

Object.values(enums.status).forEach(element => { //Выбор пользователя из списка status
    if (element !== enums.status.ADMIN) {
        debugLoggin.action(element, async (ctx) => {
            await ctx.scene.enter(element, { user: ctx.scene.state.user }); //Переход в сцену учителя
        })
    }
});

debugLoggin.action('back', async (ctx) => {
    await ctx.scene.enter('admin')
})

module.exports = [admin, debugLoggin, inputName, inputStatus, inputSub, deleteUser];