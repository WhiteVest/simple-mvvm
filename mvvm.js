function MVVM(obj){
    this.data = obj.data;
    this.methods = obj.methods;
    //观察对象
    observe(this.data);
    //解析绑定事件
    let el = document.getElementById('app');
    new Compiler(el,this);
    //代理
    const _this = this;
    Object.keys(this.data).forEach(function(key){
        _this.proxy(_this,key)
    });
}
MVVM.prototype = {
    proxy : function(vm,key){
        Object.defineProperty(vm,key,{
            configurable:false,
            enumerable:true,
            get:function(){
                return vm.getValue(key)
            },
            set:function(newVal){
                vm.setValue(key,newVal)
            }
        })
    },
    getValue: function(str){
        let keys = str.split('.');
        let val = this.data;
        keys.forEach(function(key){
            val = val[key];
        })
        return val;
    },
    setValue: function(str,newVal){
        let keys = str.split('.');
        let len = keys.length - 1;
        let val = this.data;
        keys.forEach(function(key,index){
            if(index >= len) 
                val[key] = newVal;
            else     
                val = val[key];
        })
    }
}