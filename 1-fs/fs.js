let fs = require('fs');
let selection = process.argv[2];
let {exit} = require('node:process'); 

if (!selection) {
    console.error('Usage: node fs.js [read | create | update | destroy]')
    exit(1);
}
let read = function() {
    fs.readFile('./../pets.json', 'utf8', (error, data) => {
        if(error){
            console.error(error);
            exit(1);
        }
        let result = JSON.parse(data)
        if (process.argv[3] && process.argv[3] >= 0 && process.argv[3] < result.length){
            console.log(result[eval(process.argv[3])]);
            exit(1);
        } else if (process.argv[3]) {
            console.error('Usage: node fs.js read INDEX');
            console.error('TRY 0 THROUGH ' + (result.length - 1));
        } else {
            console.log(result);
            exit(1);
        }
    })
}

let create = function() {
    fs.readFile('./../pets.json', 'utf8', (error, data) => {
        if(error){
            console.error(error);
            exit(1);
        }
        let json = JSON.parse(data);
        if(typeof eval(process.argv[3]) === 'number' && process.argv[4] && process.argv[5]){
            json.push({"age": eval(process.argv[3]),"kind": process.argv[4] ,"name": process.argv[5]});
            fs.writeFile('./../pets.json', JSON.stringify(json), () => {
                console.log(json);
                exit(1); 
            })
        } else {
            console.error('Usage: node fs.js create AGE KIND NAME');
            exit(1);
        }
    })
}

if (selection) {
    let selectedFunction = eval(selection)
    selectedFunction();
}