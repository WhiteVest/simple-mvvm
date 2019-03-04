function Compiler(el,mv){
    this.mv = mv;
    this.data = mv.data;
    compile(el,mv,this)
}
 
Compiler.prototype = {
    isTextNode: function(el) {
        return el.nodeType == 3;
    },
    isElementNode: function(el){
        return el.nodeType === 1;
    },
    isEventDirection: function(key){
        return key.startsWith('v-on:')
    },
    isModelDirection: function(key){
        return key.startsWith('v-model')
    },
    parseDirection: function(el){
        const _this = this;
        el.getAttributeNames().forEach(function(key){
            if(_this.isEventDirection(key)){
                _this.bindEvent(el,key);
            }else if(_this.isModelDirection(key)){
                _this.bindModel(el,key)
            }
        });
    },
    bindModel:function(node,key){
        let name = node.getAttribute(key);
        const _this = this;
        //key变量内容变化时候，更新节点
        new Watcher(this.data,name,function(val){
            node.value = val;
        })
        //input输入值时，修改data值
        node.addEventListener('input',function(){
            _this.mv.setValue(name,node.value);
        })
    },
    bindEvent:function(node,key){
        let val = key.slice(5);
        let fn = node.getAttribute(key);
        const _this = this;
        //绑定事件
        node.addEventListener(val,function(e){
            //this值指向mv
            _this.mv.methods[fn].call(_this.mv); 
        })
    },
    getTextNodeKey: function(node){
        let reg = /\{\{(.*)\}\}/; 
        if(reg.test(node.textContent))
            return RegExp.$1;
        else return null;
    },
    bindTextNode(node,key){
        let reg = new RegExp("\{\{(" + key + ")\}\}");
        let val = this.mv.getValue(key);
        //缓存rawTextContent
        let rawTextContent = node.textContent;
        //初次渲染
        node.textContent = rawTextContent.replace(reg,val)
        //key变量内容变化时候，更新节点(只替换括号内的)
        new Watcher(this.data,key,function(val){
            let text = rawTextContent.replace(reg,val);
            // node.textConten = text; 
            node.nodeValue = text;
            console.log(text)
        })
    }

}

function compile(el,mv,cm){
    //children只会返回节点类型，childNode会返回包含节点、文本等所有类型
    [].slice.call(el.childNodes).forEach(function(node){
        if(cm.isElementNode(node)){//元素节点
            //解析指令
            cm.parseDirection(node);
            //继续解析子元素
            compile(node,mv,cm)
        }else if(cm.isTextNode(node)){//文本节点
            let key = cm.getTextNodeKey(node);
            key && cm.bindTextNode(node,key);
        }
    }); 
}