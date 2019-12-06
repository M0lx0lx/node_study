var Interface= function(name, methods){  //创建接口类
	this.name=name;
	this.method=methods;
}

Interface.prototype.ensureImplements= function(obj,interface){  //创建检测方法
	var noMethods= [];
	for(let i=0,len= interface.method.length;i<len;i++){
		if(!interface.method[i] || typeof obj[interface.method[i]] !== "function"){
			noMethods.push(interface.method[i]);
		}
	}
	if(noMethods.length){
		throw new Error(obj.name+"实例对象没有实现"+interface.name+"接口");
	}
	else{
		console.log(obj.name,"实例对象已经实现",interface.name,"接口");
	}
}

var Duck= new Interface("Duck",["swim","cry","foots"]);  //定义接口规则


var dk=function(){
	this.name="dk";
}
dk.prototype={
	"swim": function(){},
	"cry": function(){},
	"foots": function(){},
}
var x=new dk();
Duck.ensureImplements(x, Duck);  //检测该对象是否实现了接口所定义的所有方法