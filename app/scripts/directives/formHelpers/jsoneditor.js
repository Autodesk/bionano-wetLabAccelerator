/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:jsonEditor
 * @description
 * When used on a textarea, allows the direct editing of a JSON object.
 * Invalid JSON will set the value to undefined.
 * It is recommended you do not allow saving etc. while this field is invalid.
 * Handles validation under the `json` attribute.
 *
 * Attribute json-editor-active (one-way binding) can be used to toggle the model check.
 * Use for performance
 * @example

    <form name="myForm">
      <textarea json-editor ng-model="myObject" rows="8" name="myFormElement" class="form-control"></textarea>
      <p ng-show="myForm.myFormElement.$error.json">JSON is invalid!</p>
    </form>

 */
//fixme - resets model when don't prototypically inherit / model undefined initially
//rpobably has to do with compilation / linking orders
angular.module('wetLabAccelerator').directive('jsonEditor', function ($timeout) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {

      var unwatch = angular.noop;
      var lastValidModel = null;

      //hack - need to run $parser after have model, used for jsonEditorActive
      // otherwise using bindOnce for model watch cancelled by jsonEditorActive before runs
      var initialModelSet = false;

      if (angular.isDefined(attrs.jsonEditorActive)) {
        setupToggledModelWatch();
      } else {
        setupModelWatch();
      }

      //if set ngModelOptions.updateOn, lets validate each keystroke
      //assumption is you would pass in 'blur' or something to prevent every keystroke
      if ( angular.isDefined(attrs.ngModelOptions) && angular.isDefined( scope.$eval(attrs.ngModelOptions)['updateOn'] ) ) {
        //validate on any change
        element.on('change keyup', function () {
          scope.$apply(string2JSON(element.text()));
        });

        //escape key, rollback
        //todo - clean up
        element.on('keydown', function (e) {
           if (e.keyCode == 27) {
             scope.$apply(function () {
               // if they have already set the model (i.e. to undefined),
               // and committed an invalid $viewValue,
               // then need to set the $viewValue ourselves based on last valid model
               if (!string2JSON(ngModelCtrl.$viewValue)) {
                 ngModelCtrl.$viewValue = JSON2String(lastValidModel);
                 ngModelCtrl.$render();
                 ngModelCtrl.$commitViewValue();
               } else {
                ngModelCtrl.$rollbackViewValue();
               }
             });
           }
        });
      }

      function setupModelWatch(bindOnce) {
        // Listen for model changes
        // $render not triggered unless both viewValue and $modelValue change
        // but because its an object and not deep-checked, do it ourselves
        //for performance reasons, recommend you use the attr.jsonEditorActive
        unwatch = scope.$watch(function () {
          return ngModelCtrl.$modelValue;
        }, function (newval) {
          if (_.isEmpty(newval)) return;

          //under assumption that model only set when valid
          lastValidModel = newval;
          ngModelCtrl.$setValidity('json', true);
          ngModelCtrl.$setViewValue(angular.toJson(newval, true));
          ngModelCtrl.$render();

          initialModelSet = true;

          !!bindOnce && unwatch();
        }, true);
      }

      function setupToggledModelWatch () {
        scope.$watch(function () {
          return scope.$eval(attrs.jsonEditorActive);
        }, function (newval) {
          if (!!newval) {
            setupModelWatch();
          } else {
            initialModelSet && unwatch();
          }
        });

        //set up an initial watch if we're inactive to start, using hack initialModelSet
        if ( ! scope.$eval(attrs.jsonEditorActive) ) {
          setupModelWatch(true);
        }
      }

      //need to do validation here, because validator is passed the model, which will not work for strings -- i.e. passing "" here will work, but when parsed to validator quotes will be stripped
      function string2JSON(text) {
        try {
          var j = angular.fromJson(text);
          ngModelCtrl.$setValidity('json', true);
          return j;
        } catch (err) {
          //note - $parsers may run before model actually set... todo if valid model not set, do something

          ngModelCtrl.$setValidity('json', false);
          //returning undefined results in a parser error as of angular-1.3-rc.0, and will not go through $validators
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
