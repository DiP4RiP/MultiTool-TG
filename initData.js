import fs from 'fs';
import user from './user'

const path = "./data.bin";

function initData(){
    if (fs.existsSync(path)) {
        console.log("exists:", path);
    } else {
        console.log("DOES NOT exist:", path);
    }
    
}

function saveToFile(arr) {
    
    // let result = Array.from(map.entries());
    // fs.writeFile("data.bin", JSON.stringify(result), 'utf-8', (err) => {
    //     if (err) console.log(err)
    //     else console.log('File saved')
    // })
}

// function readFromFile(path) {
//     let p = JSON.parse(fs.readFileSync(path, "utf-8"));
//     p.forEach(elem => {
//         let p = new user.(elem[1].name, elem[1].post, elem[1].sub);
//         console.log(`Пароль для ${elem[1].name} - ${elem[1].pass}`)
//     })
//     console.log(User.userMap);
    
// }

module.exports = initData();