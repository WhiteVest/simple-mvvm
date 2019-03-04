function Watcher(data,key,updateFn){
    Dep.target = this;
    this.data = data;
    MVVM.prototype.getValue.call(this,key); //触发getter

    this.updateFn = updateFn;
    Dep.target = null;
}
Watcher.prototype.update = function(val){
    this.updateFn(val);
}


function Dep(){
    this.list = [];
}
Dep.prototype.addDep = function(){
    this.list.push(Dep.target)
}
Dep.prototype.notify = function(val){
    this.list.forEach(function(obj){
        obj.update(val);
    })
}