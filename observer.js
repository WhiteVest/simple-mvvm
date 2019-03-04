//监听数据对象
function observe(data){
    //必须为对象
    if(Object.prototype.toString.call(data) !== "[object Object]") return;

    Object.keys(data).forEach(function(key){
        val = data[key]; //防止触发getter和setter事件
        defineProperty(data,key,val);
        //监听子对象
        observe(val);
    })
}

function defineProperty(data,key,val){
    let dep = new Dep();
    Object.defineProperty(data,key,{
        configurable:false,//不可以配置
        enumerable:true,//可以枚举
        get:function(){
            //注册
            Dep.target && dep.addDep();
            return val;
        },
        set:function(newVal){
            //通知
            val = newVal;
            dep.notify(newVal);
        }
    })
}


