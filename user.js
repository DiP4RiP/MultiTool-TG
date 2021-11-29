const fs = require('fs');;
const Arr = require('./arr');
const enums = require('./enums')

let users = new Arr();

class BaseUser {
    name;
    subjects;
    pass;
    tgUserID;
    status;
    /**
     * @param {enums.status} status
     * @param {enums.subjects} sub
     * @param {string} name
     */
    constructor(name, sub, status) {
        this.name = name;
        this.subjects = sub;
        this.status = status
        if (this.pass === undefined) {
            this.pass = this.generatePass();
        }
        console.log(`Для ${this.name} создан пароль - ${this.pass}`);
        users.push(this);

    }
    /**
     * @param {number} id
     */
    set tgUserID(id){
        this.tgUserID = id;
    }

    createTask(task){
        students.forEach(element => {
            if (task.subject === element.subjects){
                element.tasks = task;
            }
        });
    }

    generatePass() {
        let length = 12,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }

        return retVal;
    }
}

class Admin extends BaseUser {
    constructor(name, id) {
        super(name, enums.subjects.ALL, enums.status.ADMIN);
        this.tgUserID = id;
        
    }

    // createUser(name, sub, post) {
    //     let p = new User(name, sub, post)
    //     if (userMap.has(p.pass)) {
    //         console.log("Пароль уже используется");
    //     }
    //     else {
    //         userMap.set(p.pass, p);
    //         console.log(`${p.name} добавлен под паролем ${p.pass}`);
            
    //     }
    // }

    // deleteUser(pass) {
    //     if (userMap.has(pass)) {
    //         userMap.delete(pass);
    //         console.log(`${userMap.get(pass).name} удален`);
    //         saveToFile(userMap);
    //     }
    //     else {
    //         console.log(`${userMap.get(pass).name} не найден`);
    //     }
    // }
}

module.exports = { Admin, BaseUser};
module.exports.users = users