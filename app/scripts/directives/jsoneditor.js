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

      //need to do validation here, because validator is passed the model, which will not work for strings -- i.e. passing "" here will work, but when parsed to validator quotes will be stripped
      function string2JSON(text) {
        try {
          var j = angular.fromJson(text);
          ngModelCtrl.$setValidity('json', true);
          return j;
        } catch (err) {
          //returning undefined results in a parser error as of angular-1.3-rc.0, and will not go through $validators
          ngModelCtrl.$setValidity('json', false);
          return undefined;
          //todo - how to handle
          return text;
        }
      }

			function JSON2String(object) {
				// NOTE that angular.toJson will remove all $$-prefixed values
				// alternatively, use JSON.stringify(object, null, 2);
				return angular.toJson(object, true);
			}

      //todo - listen for model changes and update

			ngModelCtrl.$parsers.push(string2JSON);
			ngModelCtrl.$formatters.push(JSON2String);
		}
	}
});
