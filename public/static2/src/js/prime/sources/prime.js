(function(root){
	$Prime = root.$Prime || {};
	$Prime.version = "1.0.0";

	//dotjs模板渲染
	$Prime.tplRender = function(tpl, data){

		var fn = doT.template(tpl);
		return fn(data);
	};

	//form data转JSON
	$Prime.formDataToJson = function(formData){
		formData = formData.split("&");
		var result = {};
		for(var i = 0; i < formData.length; i++){
			var d = formData[i].split("=");
			result[d[0]] = d[1];
		}
		return result;
	};

	$Prime.ready = function(muduleAry, callback){
		callback && $(function(){
			require(muduleAry, callback);
		});
	};

    $Prime.isSuccess = function(json){
        var isSuccess = false;
        json = typeof json == "string"?JSON.parse(json):json;
        json.code == 200 ? isSuccess = true:isSuccess = false;
        return isSuccess;
    }
})(window);
