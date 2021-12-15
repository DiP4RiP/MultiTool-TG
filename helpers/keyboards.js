const {Markup} = require('telegraf')
const enums = require('./enums')
const backBtn = Markup.button.callback("↩ Назад", 'back')

const chooseAdmin = Markup.inlineKeyboard([
    [Markup.button.callback('💼\nСоздать пользователя', 'createUser'), Markup.button.callback('📤\nУдалить пользователя', 'deleteUser')],
    [Markup.button.callback('🔧\nОтладка', 'debug')]
])

const chooseRole = Markup.inlineKeyboard([
    [Markup.button.callback('Учитель', 'teacher'), Markup.button.callback('Ученик', 'student')],
    [backBtn]
])

const actionsTeacher = Markup.inlineKeyboard([
    [Markup.button.callback('📧 Создать задание', 'createTask'), Markup.button.callback('📁 Список заданий', 'taskList')],
    [backBtn]
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

const subTeacher = Markup.inlineKeyboard([subBtn, [backBtn]],)

module.exports = {actionsTeacher, chooseRole, subTeacher, confrimTask, chooseAdmin};