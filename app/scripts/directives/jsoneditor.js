'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:jsonEditor
 * @description
 * When used on a textarea, allows the direct editing of a JSON object.
 * Invalid JSON will set the value to undefined.
 * It is recommended you do not allow saving etc. while this field is invalid.
 * Handles validation under the `json` attribute.
 * @example

    <form name="myForm">
      <textarea json-editor ng-model="myObject" rows="8" name="myFormElement" class="form-control"></textarea>
      <p ng-show="myForm.myFormElement.$error.json">JSON is invalid!</p>
    </form>

 */

angular.module('transcripticApp').directive('jsonEditor', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
      //no longer in use
			function isValidJson(model) {
        var flag = angular.isDefined(model);
				try {
					angular.fromJson(model);
				} catch (err) {
					flag = false;
				}
				return flag;
			}
      //need to do validation here, because validator is passed the model, which will not work for strings -- i.e. passing "" here will work, but when parsed to validator quotes will be stripped
      function string2JSON(text) {
        try {
          var j = angular.fromJson(text);
          ngModelCtrl.$setValidity('json', true);
          return j;
        } catch (err) {
          //returning undefined results in a parser error as of angular-1.3-rc.0, and will not go through $validators
          //return undefined
          ngModelCtrl.$setValidity('json', false);
          return text;
        }
      }
			function JSON2String(object) {
				// NOTE that angular.toJson will remove all $$-prefixed values
				// alternatively, use JSON.stringify(object, null, 2);
				return angular.toJson(object, true);
			}
			//$validators is an object, where key is the error
			//ngModelCtrl.$validators.json = isValidJson;
			//array pipelines
			ngModelCtrl.$parsers.push(string2JSON);
			ngModelCtrl.$formatters.push(JSON2String);
		}
	}
});
