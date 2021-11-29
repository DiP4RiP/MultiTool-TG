const fs = require('fs');;
const Arr = require('./arr');
const enums = require('./enums');
const { indexOf } = require('./scenes/adminScene');

let users = new Arr();

class BaseUser {
    name;
    subjects;
    pass;
    tgUserID;
    status;
    task = [];
    /**
     * @param {enums.status} status
     * @param {enums.subjects} sub
     * @param {string} name
     */
    constructor(name, status, sub, pass, id, task) {
        this.name = name;
        this.subjects = sub;
        this.status = status
        if (pass === undefined && id === undefined) {
            this.pass = this.generatePass();
        }
        else {
            this.pass = pass;
            this.tgUserID = id;
        }
        if (task !== undefined){
            this.task = task;
        }
        console.log(`Пароль для ${this.name} - ${this.pass}`);
        users.push(this);

    }
    /**
     * @param {number} id
     */
    writeTgID(id){
        let p = this;
        p.tgUserID = id;
        users.set(users.indexOf(this), p)
    }

    addTask(task){
        let p = this;
        p.task.push(task)
        users.set(users.indexOf(this), p)
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
        super(name, enums.status.ADMIN, enums.subjects);
        this.tgUserID = id;
    }

    createUser(name, status, sub) {
        let p = new BaseUser(name, status, sub)
        console.log(`${p.name} добавлен под паролем ${p.pass}`);
    }

    deleteUser(name) {
        users.remove((item, index) => {
            if (item.indexOf(name) !== -1){
                return true
            }
        })
    }
}

module.exports = { Admin, BaseUser};
module.exports.users = users