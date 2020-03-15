function SuperType() {
	this.name = '祖先';
}
SuperType.prototype.getSuperValue = function() {
	return this.name;
}; 
function SubType() {
	SuperType.call(this);
	this.sub_name = '父亲';
}
//继承了SuperType
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function() {
	return this.sub_name;
};
var instance = new SubType();

console.log(instance.getSuperValue());	

// 随机
function num(a,b){
	var val=Math.random();
	var dd=((val*b)>a? val*b : a);
	console.log(dd);
	return dd
}


function circle(){
	var div=document.createElement('span');
	var att=document.createAttribute("style");
	att.value=`width:${num(20,50)}px;height:${num(20,50)}px;background:rgb(${0,255},${0,255},${0,255});position: absolute;top:${num(0,360)}px;left:${num(0,360)}px;border-radius:${num(0,50)}px`;
	div.setAttributeNode(att);
	document.getElementById('content').appendChild(div);
}
function move(doc){
	var v=document.getElementsByTagName(doc);
	for(let i=0;i<v.length;i++){
		console.log('is:',);
		var top_= Number((/\d+/g).exec(v[i].style.top)),
			left_= Number((/\d+/g).exec(v[i].style.left));

		v[i].style.top= ((top_<400? top_ : -40 ) + 1)+'px';
		v[i].style.left= ((left_<400? left_ : -40 ) + 1)+'px';
	}
}
function draw(){	
	var count=10;
	for(let i =0;i<10;i++){
		circle();
	}
}
// draw()
// setInterval(()=>{
// 	move('span')
// },70)

var num={'-1': '自动投标中','4':'预发布','5':'马上投资','6':'已满标','8':'还款中','9':'已完成'};

var val=-1;
console.log(num[val])

function radios({color='black',id,time=0}){
	console.log('id:',id)
	this.doc;
	this.width=100;
	this.height=50;
	if(time){
        for(let i=0;i<time;i++){
           new radios({color:`rgb(${ran(255)},${ran(255)},${ran(255)})`,id:i+'for'})
		}
	}
	else{
        this.color=color;
        this.id=id
        this.draw()
	}


}
radios.prototype.draw=function(){
	this.doc=document.createElement('div');
	this.doc.setAttribute('style',`width:${this.width}px;height:${this.height}px;margin-bottom:10px;`)
	this.doc.addEventListener('click',()=>{this.dele()})
	this.doc.addEventListener('mouseover',()=>{this.open(1)})
	this.doc.addEventListener('mouseout',()=>{this.open(0)})
	this.doc.innerHTML=`<div id="doc${this.id}" style="width:100%;height:100%;background:${this.color};"></div>`;
	document.body.appendChild(this.doc);
}
radios.prototype.dele=function(){
	document.body.removeChild(this.doc)
}
radios.prototype.open=function(is_open){
    document.getElementById(`doc${this.id}`).style.background=is_open?'pink': this.color
}
function ran(a){
	return Math.random()*a
}
for(let i=0;i<10;i++){
	new radios({color:`rgb(${ran(255)},${ran(255)},${ran(255)})`,id:i});
}
new radios( {color:`rgb(${ran(255)},${ran(255)},${ran(255)})`,time:30});


