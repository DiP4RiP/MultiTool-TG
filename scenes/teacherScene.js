const keys = require('../helpers/keyboards')
const Task = require('../classes/task')
const enums = require('../helpers/enums')
const { Scenes } = require('telegraf');
const { users } = require('../classes/user');

const teacher = new Scenes.BaseScene('teacher');
const chooseSubject = new Scenes.BaseScene('chooseSubject');
const inputTask = new Scenes.BaseScene('inputTask');
const inputDeadline = new Scenes.BaseScene('inputDeadline');
const confrimCreate = new Scenes.BaseScene('confrimCreate');

let user;

teacher.enter(async (ctx) => {
    user = ctx.scene.state.user;
    ctx.reply(`${user.name}, вход успешный, должность ${user.status}. Ваши предметы: ${Object.values(user.subjects)}`, keys.actionsTeacher);
});

teacher.action('createTask', async (ctx) => {
    ctx.scene.enter('chooseSubject');
})

teacher.action('taskList', async (ctx) => {
    if (user.task == undefined) {
        ctx.reply(`Список заданий пуст`);
    }
    else {
        user.task.forEach(async (elem) => {
            ctx.reply(`Текущий список заданий:\n${elem.sub[1]}: ${elem.task}\nСрок сдачи: ${elem.time}`);
        })  
    }     
})


chooseSubject.enter(async (ctx) => {
    ctx.reply("Выберите предмет", keys.subTeacher);

})

Object.entries(enums.subjects).forEach(async (elem) => {
    chooseSubject.action(elem[0], async (ctx) => {
        ctx.editMessageText(`Вы выбрали ${elem[1]}`);
        ctx.scene.enter('inputTask', { currSub: elem[1] });
    })
})

inputTask.enter(async (ctx) => {
    ctx.reply("Введите задание для учеников:");
})

inputTask.on('text', async (ctx) => {
    ctx.scene.enter('inputDeadline', { currSub: ctx.scene.state.currSub, currTask: ctx.message.text });
})

inputDeadline.enter(async (ctx) => {
    ctx.reply("Введите дедлайн задания в формате ДД-ММ-ГГГГ");
})

inputDeadline.on('text', async (ctx) => {
    let sub = ctx.scene.state.currSub;
    let task = ctx.scene.state.currTask;
    let dead = ctx.message.text;
    ctx.scene.state.curDeadline = dead;
    ctx.reply(`Текующее задание:\nПредмет: ${sub}\nЗадание: ${task}\nДедлайн: ${ctx.message.text}`, keys.confrimTask, { curDeadline: dead });
})

inputDeadline.action('confrim', async (ctx) => {
    ctx.scene.enter('confrimCreate', { currSub: ctx.scene.state.currSub, currTask: ctx.scene.state.currTask, curDeadline: ctx.scene.state.curDeadline });
})

inputDeadline.action('denied', async (ctx) => {
    ctx.reply("Пока не реализованно");
})

confrimCreate.enter(async (ctx) => {
    let sub = ctx.scene.state.currSub;
    let task = ctx.scene.state.currTask
    let deadline = ctx.scene.state.curDeadline;
    let newtask = new Task(sub, task, deadline);
    ctx.reply(`Задание добавлено для направления: \n${sub}`);
    users.forEach(elem => {
        if (elem.subjects === sub ){
            elem.addTask(newtask)
            if (elem.tgUserID !== undefined){
                ctx.telegram.sendMessage(elem.tgUserID, `Вы получили задание по направлению: ${sub}\nЗадание: ${task}`)
            }
        }
    })
})

module.exports = [teacher, chooseSubject, inputTask, inputDeadline, confrimCreate];