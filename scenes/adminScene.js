const keyboards = require('../helpers/keyboards')
const { Scenes, Markup } = require('telegraf');
const enums = require('../helpers/enums');
const { users } = require('../classes/user');

const admin = new Scenes.BaseScene('admin');
const debugLoggin = new Scenes.BaseScene('debugLoggin');
const inputName = new Scenes.BaseScene('inputName');
const inputStatus = new Scenes.BaseScene('inputStatus');
const inputSub = new Scenes.BaseScene('inputSub');
const deleteUser = new Scenes.BaseScene('deleteUser');
let user; //Глобальная переменная для юзера

admFunc();
createUserFunc();
debugFunc();
deleteUserFunc();


async function admFunc() {
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
        await ctx.scene.enter('deleteUser');
    })
}

async function createUserFunc() {
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
        await ctx.editMessageText(`Имя: ${ctx.scene.state.userName}\nТип пользователя: ${ctx.scene.state.status}\nВыберите направления из списка и нажмите ✅ для подтверждения`, listBtn)
    })

    let subList = Object.keys(enums.subjects);

    subList.forEach(element => {
        splitSubList = subList.slice();
        inputSub.action(element, async ctx => {

            let currSub = []; //Выбранные преметы
            let subListBtn = []; //Список предметов кнопки

            let i = splitSubList.indexOf(element);
            if (i >= 0) {
                currSub.push(splitSubList[i])
                splitSubList.slice(i, 1);
                console.log(splitSubList);
            }
            
            splitSubList.forEach(element => {
                subListBtn.push(Markup.button.callback(element, element));
            })
           
            let listBtn = Markup.inlineKeyboard([subListBtn, [Markup.button.callback("✅ Готово", 'confirm')]])
         
            ctx.scene.state.sub = currSub;
            await ctx.editMessageText(`Имя: ${ctx.scene.state.userName}\nТип пользователя: ${ctx.scene.state.status}\nВыбрано направление ${currSub}, выберете еще или нажмите ✅ для подтверждения`, listBtn)
        })
    })

    inputSub.action('confirm', async ctx => {
        user.createUser(ctx.scene.state.userName, ctx.scene.state.status, ctx.scene.state.sub)
        await ctx.editMessageText(`Создан пользователь.\nИмя: ${ctx.scene.state.userName}\nТип пользователя: ${ctx.scene.state.status}\nНаправления: ${ctx.scene.state.sub}`);
        await ctx.scene.enter('admin', {user: user});
    })
}

async function createUserPage() {

    let pageUsers = new Map();
    let objUsers = Object.values(users)
    objUsers.splice(objUsers.length-2, 2); 
    for (let i = 0; i < objUsers.length/3; i++){
        let startIndex = i*3;
        pageUsers.set(i, objUsers.slice(startIndex, startIndex+3));
    }
    return pageUsers;
}

async function createKeyboard(page) {
    let userPagesMap = await createUserPage();
    let arrToBtn = []
    await userPagesMap.get(page).forEach(elem => {
        arrToBtn.push(Markup.button.callback(elem.name, elem.pass))
    })
    let menu = [Markup.button.callback('⬅', 'backPage'), Markup.button.callback(page, 'currPage'), Markup.button.callback('➡', 'nextPage')]
    
    return Markup.inlineKeyboard([arrToBtn, menu])
}

async function deleteUserFunc() {
    let page = 0;
    deleteUser.enter(async ctx => {
        await ctx.editMessageText('Для удаления пользователя, выберите пользователя из списка ниже', await createKeyboard(0)) //Отправка сообщения с выводом клавиатуры ролей
        
    })

    await users.forEach(element => {
        deleteUser.action(element.pass, async ctx => {
            await ctx.editMessageText('Пользователь удален')
            await user.deleteUser(element);
            page=0;
            await ctx.scene.enter('deleteUser');
        })
    });

    deleteUser.action('backPage', async ctx => {
        if (--page >= 0){
            await ctx.editMessageText('Для удаления пользователя, выберите пользователя из списка ниже', await createKeyboard(page));
        }
    })

    deleteUser.action('currPage', async ctx => {
        await ctx.scene.enter('admin', {user: user});
    })

    deleteUser.action('nextPage', async ctx => {
        let userLen = users.get('length');
        if (++page < userLen/3){
            await ctx.editMessageText('Для удаления пользователя, выберите пользователя из списка ниже', await createKeyboard(page));
        }
    })

}

async function debugFunc() {
    debugLoggin.enter(async ctx => {
        await ctx.editMessageText('Вы выбрали режим отладки. Можете выбрать сцену для входа', keyboards.chooseRole) //Отправка сообщения с выводом клавиатуры ролей
    })

    Object.values(enums.status).forEach(element => { //Выбор пользователя из списка status
        if (element !== enums.status.ADMIN) {
            debugLoggin.action(element, async (ctx) => {
                await ctx.scene.enter(element, { user: user }); //Переход в сцену учителя
            })
        }
    });

    debugLoggin.action('back', async (ctx) => {
        await ctx.scene.enter('admin')
    })
}

module.exports = [admin, debugLoggin, inputName, inputStatus, inputSub, deleteUser];