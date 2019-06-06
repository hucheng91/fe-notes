function Subject(){
    this.observerArray = [];
    this.state = "开心"
}
Subject.prototype.attach = function(fn){
    this.observerArray.push(fn);
}

