(function (console, $hx_exports) { "use strict";
var PlatformClient = $hx_exports.PlatformClient = function() {
};


PlatformClient.jsonrpc = function(method,params) {
	return new Promise(function(resolve,reject) {
		var xhr = new XMLHttpRequest();
		xhr.open("post","https://platform.bionano.autodesk.com/rpc",true);
		xhr.setRequestHeader("Content-Type","text/plain");
		if(PlatformClient.authToken != null) xhr.setRequestHeader("auth-token",PlatformClient.authToken);
		if(params == null) params = { }; else params = params;
		params.token = PlatformClient.authToken;
		var requestObj = { 'method' : method, 'params' : params, 'id' : PlatformClient.Json_RPC_COUNT++ + "", 'jsonrpc' : "2.0"};
		var request = JSON.stringify(requestObj);
		xhr.onerror = function(err) {
			console.log("There was an error! " + err);
		};
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) try {
					var responseData = JSON.parse(xhr.responseText);
					resolve(responseData);
				} catch( err1 ) {
					var errorResponse = Reflect.copy(requestObj);
					errorResponse.error = { message : "Failed to parse response: " + xhr.responseText, data : err1, code : -32603};
					reject(errorResponse);
				} else {
					var errorResponse1 = Reflect.copy(requestObj);
					errorResponse1.error = { message : "Invalid Status " + xhr.status, data : xhr.responseText, code : xhr.status};
					reject(errorResponse1);
				}
			}
		};
		xhr.send(request);
	});
};
PlatformClient.authenticate = function(authString) {
	return PlatformClient.jsonrpc("get_auth_token",{ id : authString}).then(function(response) {
		var result = response.result;
		PlatformClient.authToken = result.token;
		return response;
	});
};
PlatformClient.get_user = function() {
	return PlatformClient.jsonrpc("get_user");
};
PlatformClient.get_user_value = function(key) {
	return PlatformClient.jsonrpc("get_user_value",{ key : key});
};
PlatformClient.set_user_value = function(key,val) {
	return PlatformClient.jsonrpc("set_user_value",{ key : key, val : val});
};
PlatformClient.delete_user_value = function(key) {
	return PlatformClient.jsonrpc("delete_user_value",{ key : key});
};
PlatformClient.get_all_project_ids = function() {
	return PlatformClient.jsonrpc("get_all_project_ids");
};
PlatformClient.create_project = function() {
	return PlatformClient.jsonrpc("create_project");
};
PlatformClient.use_project = function(projectId) {
	PlatformClient.currentProjectId = projectId;
};
PlatformClient.get_project = function(projectId) {
	return PlatformClient.jsonrpc("get_project",{ projectId : projectId});
};
PlatformClient.get_project_version = function(projectId) {
	return PlatformClient.jsonrpc("get_project_version",{ projectId : projectId == null?PlatformClient.currentProjectId:projectId});
};
PlatformClient.get_project_versions = function(projectId) {
	return PlatformClient.jsonrpc("get_project_versions",{ projectId : projectId == null?PlatformClient.currentProjectId:projectId});
};
PlatformClient.set_project_version = function(versionId,projectId) {
	return PlatformClient.jsonrpc("set_project_version",{ projectId : projectId == null?PlatformClient.currentProjectId:projectId, versionId : versionId});
};
PlatformClient.delete_project_version = function(versionId,projectId) {
	return PlatformClient.jsonrpc("delete_project_version",{ projectId : projectId == null?PlatformClient.currentProjectId:projectId, versionId : versionId});
};
PlatformClient.create_project_version = function(projectId) {
	return PlatformClient.jsonrpc("create_project_version",{ projectId : projectId == null?PlatformClient.currentProjectId:projectId});
};
PlatformClient.get_value = function(key,projectId) {
	return PlatformClient.jsonrpc("get_value",{ projectId : projectId == null?PlatformClient.currentProjectId:projectId, key : key});
};
PlatformClient.set_value = function(key,val,projectId) {
	return PlatformClient.jsonrpc("set_value",{ projectId : projectId == null?PlatformClient.currentProjectId:projectId, key : key, val : val});
};
PlatformClient.delete_value = function(key,projectId) {
	return PlatformClient.jsonrpc("delete_value",{ projectId : projectId == null?PlatformClient.currentProjectId:projectId, key : key});
};
PlatformClient.test = function() {
	return PlatformClient.jsonrpc("test");
};
PlatformClient.set_transcriptic_credentials = function(transcripticId,transcripticKey) {
	return PlatformClient.set_user_value("transcripticId",transcripticId).then(function(result) {
		return PlatformClient.set_user_value("transcripticKey",transcripticKey);
	});
};
PlatformClient.saveProject = function(json) {
	return PlatformClient.set_value(PlatformClient.PROJECT_KEY,JSON.stringify(json),json.id);
};
PlatformClient.getProject = function(id) {
	return PlatformClient.get_value(PlatformClient.PROJECT_KEY,id).then(function(result) {
		return JSON.parse(result.result);
	});
};
PlatformClient.main = function() {
};
var Reflect = function() { };
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		Reflect.setField(o2,f,Reflect.field(o,f));
	}
	return o2;
};
PlatformClient.Json_RPC_COUNT = 1;
PlatformClient.PROJECT_KEY = "project";
PlatformClient.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);

//# sourceMappingURL=api.js.map