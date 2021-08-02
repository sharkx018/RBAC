class ActionType {
    constructor(write = false, read = false, del = false) {
        this.read = read;
        this.write = write;
        this.delete = del
    }
}

module.exports = { ActionType }