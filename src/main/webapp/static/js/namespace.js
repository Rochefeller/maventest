var IBM = window.IBM || {};
/*
 * 注册命名空间
 * 使用示例：
 * var myObj = IBM.namespace("icsas.list");
 * 
 * myObj.myClass = function(){
 * 		this.x = 1;
 *      this.y = 1;
 *      this.test = function(){
 *      	alert(this.x);
 *      }
 * }
 * 
 * 用法：
 * 
 * var obj = new IBM.icsas.list.myClass();
 * obj.test();
 * 
 * 效果：
 * 输出alert（1）；
 */
IBM.namespace = function(ns) {
	if (!ns || !ns.length) {
	   return null;
	}
	var levels = ns.split(".");
	var nsobj = IBM;
	//如果申请的命名空间是在IBM下的，则必须忽略它，否则就成了IBM.IBM了
	for (var i=(levels[0] == "IBM") ? 1 : 0; i<levels.length; ++i) {
		//如果当前命名空间下不存在，则新建一个关联数组。
		nsobj[levels[i]] = nsobj[levels[i]] || {};
		nsobj = nsobj[levels[i]];
	}
	//返回所申请命名空间的一个引用；
	return nsobj;
};
