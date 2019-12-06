// var Book=function(id,title,author){
// 	this.set_id(id);
// 	this.title=title;
// 	this.author=author;
// }
// Book.prototype={
// 	set_id: function(id){
// 		if(!id) throw new Error("Book: Invalid id.");
// 		this._id=id;
// 	}
// }
// var test= new Book('001','从入行程序员到各种疾病的防治','比尔盖茨');
// console.log(test);

var Book2=function(id,title,author){
	var id,title,author;
	this.set_id(id);
	this.set_title(title);
	this.set_author(author);
	this.get_id= function(){
		return id;
	};
	this.get_param= function(name){
		try{
			var v=eval(name);
		}
		catch(e){
			throw new Error("The "+ name+ "is invalid.");
		}
		if(v) return v;
		
	}
}
Book2.prototype={
	set_id: function(id){
		if(!id) throw new Error("Book: Invalid id.");
		id=id;
	},
	set_title: function(title){
		title=title;
	},
	set_author: function(author){
		author=author;
	}
}
var test2= new Book2('001','从入行程序员到各种疾病的防治','比尔盖茨');
console.log(test2.get_param("title"));

var bb=function(){
	var time=90;
	return {
		get_v:function(){
			return time;
		}
	}
}

var b2=bb();
console.log(b2.get_v());