const fs = require('fs')
const {users, BaseUser, Admin} = require('./user')
const dipID = 395483849
const path = "./data.bin";
const enums = require('./enums');

users.on('change', (event) => {
    saveToFile(users);
})

function saveToFile(arr) {
    fs.writeFile("data.bin", JSON.stringify(arr), 'utf-8', (err) => {
        if (err) console.log(err)
        else console.log('File saved')
    })
}

function readFromFile() {
    let p = JSON.parse(fs.readFileSync(path, "utf-8"));
    Object.entries(p).forEach(elem => {
        if (elem[1].status !== undefined && elem[1].status !== enums.status.ADMIN) {
            new BaseUser(elem[1].name, elem[1].status, elem[1].subjects, elem[1].pass, elem[1].tgUserID, elem[1].task);
        }
        else if (elem[1].status !== undefined && elem[1].status === enums.status.ADMIN) {
            new Admin(elem[1].name, elem[1].tgUserID);
        }
    })
}

function createDefUser() {
    console.log(`Файл ${path} пуст - принудительное создание объектов`);
    new Admin("Никита Скрипниченнко", dipID);
    new BaseUser("Aboba", enums.status.STUDENT, enums.subjects.CPP);
    saveToFile(users)
}

module.exports = function () {
    if (fs.existsSync(path)) {
        console.log("exist:", path);
        if (fs.readFileSync(path, "utf-8") == '') {
            createDefUser();
        }
        else {
            console.log(`Загрузка объектов из файла ${path}`);
            readFromFile();
        }

    } else {
        console.log("DOES NOT exist:", path);
        createDefUser();
    }
}