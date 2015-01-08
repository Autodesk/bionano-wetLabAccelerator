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

      // Listen for model changes
      // $render not triggered unless both viewValue and $modelValue change
      // but because its an object and not deep-checked, do it ourselves
      scope.$watch(function () {
        return ngModelCtrl.$modelValue;
      }, function (newval) {
        if (_.isEmpty(newval)) return;

        //under assumption that model only set when valid
        ngModelCtrl.$setValidity('json', true);
        ngModelCtrl.$setViewValue(angular.toJson(newval, true));
        ngModelCtrl.$render()
      }, true);

      //need to do validation here, because validator is passed the model, which will not work for strings -- i.e. passing "" here will work, but when parsed to validator quotes will be stripped
      function string2JSON(text) {
        try {
          var j = angular.fromJson(text);
          ngModelCtrl.$setValidity('json', true);
          return j;
        } catch (err) {
          //returning undefined results in a parser error as of angular-1.3-rc.0, and will not go through $validators
          ngModelCtrl.$setValidity('json', false);
          return undefined; //will set a parse error
          //return text; //allows setting nasty string...
        }
      }

			function JSON2String(object) {
				// NOTE that angular.toJson will remove all $$-prefixed values
				// alternatively, use JSON.stringify(object, null, 2);
				return angular.toJson(object, true);
			}

			ngModelCtrl.$parsers.push(string2JSON);
			ngModelCtrl.$formatters.push(JSON2String);
		}
	}
});
