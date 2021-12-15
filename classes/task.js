class Task{
    sub;
    task;
    time;
    status;
    constructor(sub, task, time){
        this.sub = sub;
        this.task = task;
        this.time = time;
        this.status = false;
    }
}

module.exports = Task