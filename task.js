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
        setTaskToUser(this);
        // taskMap.set(sub, this)
    }
}

module.exports = Task