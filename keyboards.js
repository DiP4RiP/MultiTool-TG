const {Markup} = require('telegraf')
const User = require('./user')
const enums = require('./enums')


const chooseRole = Markup.inlineKeyboard([
    Markup.button.callback('Учитель', 'teacher'),
    Markup.button.callback('Ученик', 'student')
])

const actionsTeacher = Markup.inlineKeyboard([
    Markup.button.callback('📧 Создать задание', 'createTask'),
    Markup.button.callback('📁 Список заданий', 'taskList')
])

const confrimTask = Markup.inlineKeyboard([
    Markup.button.callback('✅', 'confrim'),
    Markup.button.callback('❌', 'denied')
])

let subBtn = [];
let f = Object.entries(enums.subjects);
f.forEach((elem) => {
    subBtn.push(Markup.button.callback(elem[1], elem[0]));
    
})

const subTeacher = Markup.inlineKeyboard([subBtn])

module.exports = {actionsTeacher, chooseRole, subTeacher, confrimTask};