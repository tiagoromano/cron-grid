(function($app) {

  var isoDate = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

  /**
   * Função que retorna o formato que será utilizado no componente
   * capturando o valor do atributo format do elemento, para mais formatos
   * consulte os formatos permitidos em http://momentjs.com/docs/#/parsing/string-format/
   *
   */
  var patternFormat = function(element) {
    if (element) {
      return $(element).attr('format') || 'DD/MM/YYYY';
    }
    return 'DD/MM/YYYY';
  }

  var parsePermission = function(perm) {
    var result = {
      visible: {
        public: true
      },
      enabled: {
        public: true
      }
    }

    if (perm) {
      var perms = perm.toLowerCase().trim().split(",");
      for (var i=0;i<perms.length;i++) {
        var p = perms[i].trim();
        if (p) {
          var pair = p.split(":");
          if (pair.length == 2) {
            var key = pair[0].trim();
            var value = pair[1].trim();
            if (value) {
              var values = value.split(";");
              var json = {};
              for (var j=0;j<values.length;j++) {
                var v = values[j].trim();
                if (v) {
                  json[v] = true;
                }
              }
              result[key] = json;
            }
          }
        }
      }
    }
    return result;
  }

  app.directive('asDate', maskDirectiveAsDate)

      .directive('ngDestroy', function() {
        return {
          restrict: 'A',
          link: function(scope, element, attrs, ctrl) {
            element.on('$destroy', function() {
              if (attrs.ngDestroy && attrs.ngDestroy.length > 0)
                if (attrs.ngDestroy.indexOf('app.') > -1 || attrs.ngDestroy.indexOf('blockly.') > -1)
                  scope.$eval(attrs.ngDestroy);
                else
                  eval(attrs.ngDestroy);
            });
          }
        }
      })

      .directive('dynamicImage', function($compile) {
        var template = '';
        return {
          restrict: 'E',
          replace: true,
          scope: {
            ngModel: '@',
            width: '@',
            height: '@',
            style: '@',
            class: '@'
          },
          require: 'ngModel',
          template: '<div></div>',
          init: function(s) {
            if (!s.ngModel)
              s.ngModel = '';
            if (!s.width)
              s.width = '128';
            if (!s.height)
              s.height = '128';
            if (!s.style)
              s.style = '';
            if (!s.class)
              s.class = '';
            if (!this.containsLetter(s.width))
              s.width += 'px';
            if (!this.containsLetter(s.height))
              s.height += 'px';
          },
          containsLetter: function(value) {
            var containsLetter;
            for (var i=0; i<value.length; i++) {
              containsLetter = true;
              for (var number = 0; number <10; number++)
                if (parseInt(value[i]) == number)
                  containsLetter = false;
              if (containsLetter)
                break;
            }
            return containsLetter;
          },
          link: function(scope, element, attr) {
            this.init(scope);
            var s = scope;
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");
            var templateDyn    = '<div class="form-group upload-image-component" ngf-drop="" ngf-drag-over-class="dragover">\
                                  <img class="$class$" style="$style$; height: $height$; width: $width$;" ng-if="$ngModel$" data-ng-src="{{$ngModel$.startsWith(\'http\') || ($ngModel$.startsWith(\'/\') && $ngModel$.length < 1000)? $ngModel$ : \'data:image/png;base64,\' + $ngModel$}}">\
                                  <img class="$class$" style="$style$; height: $height$; width: $width$;" ng-if="!$ngModel$" data-ng-src="/plugins/cronapp-framework-js/img/selectImg.svg" class="btn" ng-if="!$ngModel$" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.setFile(\'$ngModel$\', $file)" accept="image/*;capture=camera">\
                                  <div class="remove btn btn-danger btn-xs" ng-if="$ngModel$" ng-click="$ngModel$=null">\
                                    <span class="glyphicon glyphicon-remove"></span>\
                                  </div>\
                                  <div class="btn btn-info btn-xs start-camera-button" ng-if="!$ngModel$" ng-click="cronapi.internal.startCamera(\'$ngModel$\')">\
                                    <span class="glyphicon glyphicon-facetime-video"></span>\
                                  </div>\
                                  <input ng-if="!$ngModel$" autocomplete="off" tabindex="-1" class="uiSelectRequired ui-select-offscreen" style="top: inherit !important; margin-left: 85px !important;margin-top: 50px !important;" type=text ng-model="$ngModel$" $required$>\
                                </div>';
            element.append(templateDyn
                .split('$height$').join(s.height)
                .split('$width$').join(s.width)
                .split('$ngModel$').join(s.ngModel)
                .split('$style$').join(s.style)
                .split('$class$').join(s.class)
                .split('$required$').join(required)
            );


            $compile(element)(element.scope());
          }
        }
      })
      .directive('dynamicImage', function($compile) {
        var template = '';
        return {
          restrict: 'A',
          scope: true,
          require: 'ngModel',
          link: function(scope, element, attr) {
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");
            var content = element.html();
            var templateDyn    =
                '<div ngf-drop="" ngf-drag-over-class="dragover">\
                   <img style="width: 100%;" ng-if="$ngModel$" data-ng-src="{{$ngModel$.startsWith(\'http\') || ($ngModel$.startsWith(\'/\') && $ngModel$.length < 1000)? $ngModel$ : \'data:image/png;base64,\' + $ngModel$}}">\
                   <input ng-if="!$ngModel$" autocomplete="off" tabindex="-1" class="uiSelectRequired ui-select-offscreen" style="top: inherit !important; margin-left: 85px !important;margin-top: 50px !important;" type=text ng-model="$ngModel$" $required$>\
                   <div class="btn" ng-if="!$ngModel$" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.setFile(\'$ngModel$\', $file)" ngf-pattern="\'image/*\'" ngf-max-size="$maxFileSize$">\
                     $userHtml$\
                   </div>\
                   <div class="remove-image-button btn btn-danger btn-xs" ng-if="$ngModel$" ng-click="$ngModel$=null">\
                     <span class="glyphicon glyphicon-remove"></span>\
                   </div>\
                   <div class="btn btn-info btn-xs start-camera-button-attribute" ng-if="!$ngModel$" ng-click="cronapi.internal.startCamera(\'$ngModel$\')">\
                     <span class="glyphicon glyphicon-facetime-video"></span>\
                   </div>\
                 </div>';
            var maxFileSize = "";
            if (attr.maxFileSize)
              maxFileSize = attr.maxFileSize;

            templateDyn = $(templateDyn
                .split('$ngModel$').join(attr.ngModel)
                .split('$required$').join(required)
                .split('$userHtml$').join(content)
                .split('$maxFileSize$').join(maxFileSize)
            );

            element.html(templateDyn);
            $compile(templateDyn)(element.scope());
          }
        }
      })
      .directive('dynamicFile', function($compile) {
        var template = '';
        return {
          restrict: 'A',
          scope: true,
          require: 'ngModel',
          link: function(scope, element, attr) {
            var s = scope;
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");

            var splitedNgModel = attr.ngModel.split('.');
            var datasource = splitedNgModel[0];
            var field = splitedNgModel[splitedNgModel.length-1];
            var number = Math.floor((Math.random() * 1000) + 20);
            var content = element.html();

            var maxFileSize = "";
            if (attr.maxFileSize)
              maxFileSize = attr.maxFileSize;

            var templateDyn    = '\
                                <div ng-show="!$ngModel$" ngf-drop="" ngf-drag-over-class="dragover">\
                                  <input ng-if="!$ngModel$" autocomplete="off" tabindex="-1" class="uiSelectRequired ui-select-offscreen" style="top: inherit !important;margin-left: 85px !important;margin-top: 50px !important;" type=text ng-model="$ngModel$" $required$>\
                                  <div class="btn" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.uploadFile(\'$ngModel$\', $file, \'uploadprogress$number$\')" ngf-max-size="$maxFileSize$">\
                                    $userHtml$\
                                  </div>\
                                  <div class="progress" data-type="bootstrapProgress" id="uploadprogress$number$" style="display:none">\
                                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:0%">\
                                      <span class="sr-only"></span>\
                                    </div>\
                                  </div>\
                                </div> \
                                <div ng-show="$ngModel$" class="upload-image-component-attribute"> \
                                  <div class="btn btn-danger btn-xs ng-scope" style="float:right;" ng-if="$ngModel$" ng-click="$ngModel$=null"> \
                                    <span class="glyphicon glyphicon-remove"></span> \
                                  </div> \
                                  <div> \
                                    <div ng-bind-html="cronapi.internal.generatePreviewDescriptionByte($ngModel$)"></div> \
                                    <a href="javascript:void(0)" ng-click="cronapi.internal.downloadFileEntity($datasource$,\'$field$\')">download</a> \
                                  </div> \
                                </div> \
                                ';
            templateDyn = $(templateDyn
                .split('$ngModel$').join(attr.ngModel)
                .split('$datasource$').join(datasource)
                .split('$field$').join(field)
                .split('$number$').join(number)
                .split('$required$').join(required)
                .split('$userHtml$').join(content)
                .split('$maxFileSize$').join(maxFileSize)

            );

            element.html(templateDyn);
            $compile(templateDyn)(element.scope());
          }
        }
      })
      .directive('dynamicFile', function($compile) {
        var template = '';
        return {
          restrict: 'E',
          replace: true,
          scope: {
            ngModel: '@',
          },
          require: 'ngModel',
          template: '<div></div>',
          init: function(s) {
            if (!s.ngModel)
              s.ngModel = '';
          },
          link: function(scope, element, attr) {
            this.init(scope);
            var s = scope;
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");

            var splitedNgModel = s.ngModel.split('.');
            var datasource = splitedNgModel[0];
            var field = splitedNgModel[splitedNgModel.length-1];
            var number = Math.floor((Math.random() * 1000) + 20);

            var templateDyn    = '\
                                <div ng-show="!$ngModel$">\
                                  <input ng-if="!$ngModel$" autocomplete="off" tabindex="-1" class="uiSelectRequired ui-select-offscreen" style="top: inherit !important;margin-left: 85px !important;margin-top: 50px !important;" type=text ng-model="$ngModel$" $required$>\
                                  <div class="form-group upload-image-component" ngf-drop="" ngf-drag-over-class="dragover"> \
                                    <img class="ng-scope" style="height: 128px; width: 128px;" ng-if="!$ngModel$" data-ng-src="/plugins/cronapp-framework-js/img/selectFile.png" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.uploadFile(\'$ngModel$\', $file, \'uploadprogress$number$\')" accept="*">\
                                    <progress id="uploadprogress$number$" max="100" value="0" style="position: absolute; width: 128px; margin-top: -134px;">0</progress>\
                                  </div>\
                                </div> \
                                <div ng-show="$ngModel$" class="form-group upload-image-component"> \
                                  <div class="btn btn-danger btn-xs ng-scope" style="float:right;" ng-if="$ngModel$" ng-click="$ngModel$=null"> \
                                    <span class="glyphicon glyphicon-remove"></span> \
                                  </div> \
                                  <div> \
                                    <div ng-bind-html="cronapi.internal.generatePreviewDescriptionByte($ngModel$)"></div> \
                                    <a href="javascript:void(0)" ng-click="cronapi.internal.downloadFileEntity($datasource$,\'$field$\')">download</a> \
                                  </div> \
                                </div> \
                                ';
            element.append(templateDyn
                .split('$ngModel$').join(s.ngModel)
                .split('$datasource$').join(datasource)
                .split('$field$').join(field)
                .split('$number$').join(number)
                .split('$required$').join(required)
            );
            $compile(element)(element.scope());
          }
        }
      })
      .directive('pwCheck', [function() {
        'use strict';
        return {
          require: 'ngModel',
          link: function(scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function() {
              scope.$apply(function() {
                var v = elem.val() === $(firstPassword).val();
                ctrl.$setValidity('pwmatch', v);
              });
            });
          }
        }
      }])
      .directive('ngClick', [function() {
        'use strict';
        return {
          link: function(scope, elem, attrs, ctrl) {
            if (scope.rowData) {
              var crnDatasource = elem.closest('[crn-datasource]')
              if (crnDatasource.length > 0) {
                elem.on('click', function() {
                  scope.$apply(function() {
                    var datasource = eval(crnDatasource.attr('crn-datasource'));
                    datasource.active = scope.rowData;
                  });
                });
              }
            }
          }
        }
      }])

      /**
       * Validação de campos CPF e CNPJ,
       * para utilizar essa diretiva, adicione o atributo valid com o valor
       * do tipo da validação (cpf ou cnpj). Exemplo <input type="text" valid="cpf">
       */
      .directive('valid', function() {
        return {
          require: '^ngModel',
          restrict: 'A',
          link: function(scope, element, attrs, ngModel) {
            var validator = {
              'cpf': CPF,
              'cnpj': CNPJ
            };

            ngModel.$validators[attrs.valid] = function(modelValue, viewValue) {
              var value = modelValue || viewValue;
              var fieldValid = validator[attrs.valid].isValid(value);
              if (!fieldValid) {
                element.scope().$applyAsync(function(){ element[0].setCustomValidity(element[0].dataset['errorMessage']); }) ;
              } else {
                element[0].setCustomValidity("");
              }
              return (fieldValid || !value);
            };
          }
        }
      })

      .directive('cronappSecurity', function() {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var roles = [];
            if (scope.session && scope.session.roles) {
              roles = scope.session.roles.toLowerCase().split(",");
            }

            var perms = parsePermission(attrs.cronappSecurity);
            var show = false;
            var enabled = false;
            for (var i=0;i<roles.length;i++) {
              var role = roles[i].trim();
              if (role) {
                if (perms.visible[role]) {
                  show = true;
                }
                if (perms.enabled[role]) {
                  enabled = true;
                }
              }
            }

            if (!show) {
              $(element).hide();
            }

            if (!enabled) {
              $(element).find('*').addBack().attr('disabled', true);
            }
          }
        }
      })

      .directive('qr', ['$window', function($window){
        return {
          restrict: 'A',
          require: '^ngModel',
          template: '<canvas ng-hide="image"></canvas><img ng-if="image" ng-src="{{canvasImage}}"/>',
          link: function postlink(scope, element, attrs, ngModel){
            if (scope.size === undefined  && attrs.size) {
              scope.text = attrs.size;
            }
            var getTypeNumeber = function(){
              return scope.typeNumber || 0;
            };
            var getCorrection = function(){
              var levels = {
                'L': 1,
                'M': 0,
                'Q': 3,
                'H': 2
              };
              var correctionLevel = scope.correctionLevel || 0;
              return levels[correctionLevel] || 0;
            };
            var getText = function(){
              return ngModel.$modelValue || "";
            };
            var getSize = function(){
              return scope.size || $(element).outerWidth();
            };
            var isNUMBER = function(text){
              var ALLOWEDCHARS = /^[0-9]*$/;
              return ALLOWEDCHARS.test(text);
            };
            var isALPHA_NUM = function(text){
              var ALLOWEDCHARS = /^[0-9A-Z $%*+\-./:]*$/;
              return ALLOWEDCHARS.test(text);
            };
            var is8bit = function(text){
              for (var i = 0; i < text.length; i++) {
                var code = text.charCodeAt(i);
                if (code > 255) {
                  return false;
                }
              }
              return true;
            };
            var checkInputMode = function(inputMode, text){
              if (inputMode === 'NUMBER' && !isNUMBER(text)) {
                throw new Error('The `NUMBER` input mode is invalid for text.');
              }
              else if (inputMode === 'ALPHA_NUM' && !isALPHA_NUM(text)) {
                throw new Error('The `ALPHA_NUM` input mode is invalid for text.');
              }
              else if (inputMode === '8bit' && !is8bit(text)) {
                throw new Error('The `8bit` input mode is invalid for text.');
              }
              else if (!is8bit(text)) {
                throw new Error('Input mode is invalid for text.');
              }
              return true;
            };
            var getInputMode = function(text){
              var inputMode = scope.inputMode;
              inputMode = inputMode || (isNUMBER(text) ? 'NUMBER' : undefined);
              inputMode = inputMode || (isALPHA_NUM(text) ? 'ALPHA_NUM' : undefined);
              inputMode = inputMode || (is8bit(text) ? '8bit' : '');
              return checkInputMode(inputMode, text) ? inputMode : '';
            };
            var canvas = element.find('canvas')[0];
            var canvas2D = !!$window.CanvasRenderingContext2D;
            scope.TYPE_NUMBER = getTypeNumeber();
            scope.TEXT = getText();
            scope.CORRECTION = getCorrection();
            scope.SIZE = getSize();
            scope.INPUT_MODE = getInputMode(scope.TEXT);
            scope.canvasImage = '';
            var draw = function(context, qr, modules, tile){
              for (var row = 0; row < modules; row++) {
                for (var col = 0; col < modules; col++) {
                  var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
                      h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));
                  context.fillStyle = qr.isDark(row, col) ? '#000' : '#fff';
                  context.fillRect(Math.round(col * tile), Math.round(row * tile), w, h);
                }
              }
            };
            var render = function(canvas, value, typeNumber, correction, size, inputMode){
              var trim = /^\s+|\s+$/g;
              var text = value.replace(trim, '');
              var qr = new QRCode(typeNumber, correction, inputMode);
              qr.addData(text);
              qr.make();
              var context = canvas.getContext('2d');
              var modules = qr.getModuleCount();
              var tile = size / modules;
              canvas.width = canvas.height = size;
              if (canvas2D) {
                draw(context, qr, modules, tile);
                scope.canvasImage = canvas.toDataURL() || '';
              }
            };

            scope.$watch(function(){return ngModel.$modelValue}, function(value, old){
              if (value !== old) {
                scope.text = ngModel.$modelValue;
                scope.TEXT = getText();
                scope.INPUT_MODE = getInputMode(scope.TEXT);
                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
              }
            });
            render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
          }};
      }])

      .directive('uiSelect', function ($compile) {
        return {
          restrict: 'E',
          require: 'ngModel',
          link: function (scope, element, attrs, ngModelCtrl) {
            if (attrs.required != undefined || attrs.ngRequired === "true") {
              $(element).append("<input autocomplete=\"off\" tabindex=\"-1\" class=\"uiSelectRequired ui-select-offscreen\" style=\"left: 50%!important; top: 100%!important;\" type=text ng-model=\""+attrs.ngModel+"\" required>");
              var input = $(element).find("input.uiSelectRequired");
              $compile(input)(element.scope());
            }
          }
        };
      })

      .filter('raw',function($translate) {
        return function(o) {
          if (o) {
            if (typeof o == 'number') {
              return o + "";
            }
            if (o instanceof Date) {
              return "datetime'" + o.toISOString() + "'";
            }
            else {
              return "'" + o + "'";
            }
          } else {
            return "";
          }
        }
      })

      .filter('mask',function($translate) {
        return function(value, maskValue) {
          maskValue = parseMaskType(maskValue, $translate);
          if (!maskValue)
            return value;

          maskValue = maskValue.replace(';1', '').replace(';0', '').trim();

          if (typeof value == "string" && value.match(isoDate)) {
            return moment.utc(value).format(maskValue);
          } else if (value instanceof Date) {
            return moment.utc(value).format(maskValue);
          } else if (typeof value == 'number') {
            return format(maskValue, value);
          }  else if (value != undefined && value != null && value != "") {
            var input = $("<input type=\"text\">");
            input.mask(maskValue);
            return input.masked(value);
          } else {
            return value;
          }
        };
      })

      .directive('mask', maskDirectiveMask)

      .directive('cronappFilter', function($compile) {
        return {
          restrict: 'A',
          require: '?ngModel',
          setFilterInButton: function($element, bindedFilter, operator) {
            var fieldset = $element.closest('fieldset');
            if (!fieldset)
              return;
            var button = fieldset.find('button[cronapp-filter]');
            if (!button)
              return;

            var filters = button.data('filters');
            if (!filters)
              filters = [];

            var index = -1;
            var ngModel = $element.attr('ng-model');
            $(filters).each(function(idx) {
              if (this.ngModel == ngModel)
                index = idx;
            });

            if (index > -1)
              filters.splice(index, 1);

            if (bindedFilter.length > 0) {
              var bindedFilterJson = {
                "ngModel" : ngModel,
                "bindedFilter" : bindedFilter
              };
              filters.push(bindedFilterJson);
            }
            button.data('filters', filters);
          },
          makeAutoPostSearch: function($element, bindedFilter, datasource, attrs) {
            var fieldset = $element.closest('fieldset');
            if (fieldset && fieldset.length > 0) {
              var button = fieldset.find('button[cronapp-filter]');
              if (button && button.length > 0) {
                var filters = button.data('filters');
                if (filters && filters.length > 0) {
                  bindedFilter = '';
                  $(filters).each(function() {
                    bindedFilter += this.bindedFilter+";";
                  });
                }
              }
            }
            datasource.search(bindedFilter, (attrs.cronappFilterCaseinsensitive=="true"));
          },
          inputBehavior: function(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost) {
            var filterTemplate = '';
            var filtersSplited = attrs.cronappFilter.split(';');
            var datasource = eval(attrs.crnDatasource);
            var isOData = datasource.isOData()

            $(filtersSplited).each(function() {
              if (this.length > 0) {
                if (filterTemplate != "") {
                  if (isOData) {
                    filterTemplate += " and ";
                  } else {
                    filterTemplate += ";";
                  }
                }

                if (isOData) {
                  if (operator == "=") {
                    operator = "eq";
                  }
                  else if (operator == "!=") {
                    operator = "ne";
                  }
                  else if (operator == ">") {
                    operator = "gt";
                  }
                  else if (operator == ">=") {
                    operator = "ge";
                  }
                  else if (operator == "<") {
                    operator = "lt";
                  }
                  else if (operator == "<=") {
                    operator = "le";
                  }
                }

                //Se for do tipo text passa parametro como like
                if (typeElement == 'text') {
                  if (isOData) {
                    filterTemplate += this + " " + operator + " {value}";
                  } else {
                    filterTemplate += this + '@' + operator + '%{value}%';
                  }
                  //Senão passa parametro como valor exato
                } else {
                  if (isOData) {
                    filterTemplate += this + " " + operator + ' {value}';
                  } else {
                    filterTemplate += this + operator + '{value}';
                  }
                }
              }
            });
            if (filterTemplate.length == 0) {
              if (isOData) {
                filterTemplate = "{value}";
              } else {
                filterTemplate = '%{value}%';
              }
            }

            var selfDirective = this;
            if (ngModelCtrl) {
              scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                if (angular.equals(newVal, oldVal)) { return; }
                var eType = $element.data('type') || $element.attr('type');
                var value = ngModelCtrl.$modelValue;

                if (isOData) {

                  if (value instanceof Date) {
                    if (eType == "datetime-local") {
                      value = "datetimeoffset'" + value.toISOString() + "'";
                    } else {
                      value = "datetime'" + value.toISOString().substring(0, 23) + "'";
                    }
                  }

                  else if (typeof value == "number") {
                    value = value;
                  }

                  else if (typeof value == "boolean") {
                    value = value;
                  } else {
                    value = "'" + value + "'";
                  }

                } else {
                  if (value instanceof Date) {
                    value = value.toISOString();
                    if (eType == "date") {
                      value = value + "@@date";
                    }
                    else if (eType == "time" || eType == "time-local") {
                      value = value + "@@time";
                    }
                    else {
                      value = value + "@@datetime";
                    }
                  }

                  else if (typeof value == "number") {
                    value = value + "@@number";
                  }

                  else if (typeof value == "boolean") {
                    value = value + "@@boolean";
                  }

                }
                var bindedFilter = filterTemplate.split('{value}').join(value);
                if (ngModelCtrl.$viewValue.length == 0)
                  bindedFilter = '';

                selfDirective.setFilterInButton($element, bindedFilter, operator);
                if (autopost)
                  selfDirective.makeAutoPostSearch($element, bindedFilter, datasource, attrs);

              });
            }
            else {
              if (typeElement == 'text') {
                $element.on("keyup", function() {
                  var datasource = eval(attrs.crnDatasource);
                  var value = undefined;
                  if (ngModelCtrl && ngModelCtrl != undefined)
                    value = ngModelCtrl.$viewValue;
                  else
                    value = this.value;
                  var bindedFilter = filterTemplate.split('{value}').join(value);
                  if (this.value.length == 0)
                    bindedFilter = '';

                  selfDirective.setFilterInButton($element, bindedFilter, operator);
                  if (autopost)
                    selfDirective.makeAutoPostSearch($element, bindedFilter, datasource, attrs);
                });
              }
              else {
                $element.on("change", function() {
                  var datasource = eval(attrs.crnDatasource);
                  var value = undefined;
                  var typeElement = $(this).attr('type');
                  if (attrs.asDate != undefined)
                    typeElement = 'date';

                  if (ngModelCtrl && ngModelCtrl != undefined) {
                    value = ngModelCtrl.$viewValue;
                  }
                  else {
                    if (typeElement == 'checkbox')
                      value = $(this).is(':checked');
                    else if (typeElement == 'date') {
                      value = this.value;
                      if (this.value.length > 0) {
                        var momentDate = moment(this.value, patternFormat(this));
                        value = momentDate.toDate().toISOString();
                      }
                    }
                    else
                      value = this.value;
                  }
                  var bindedFilter = filterTemplate.split('{value}').join(value);
                  if (value.toString().length == 0)
                    bindedFilter = '';

                  selfDirective.setFilterInButton($element, bindedFilter, operator);
                  if (autopost)
                    selfDirective.makeAutoPostSearch($element, bindedFilter, datasource, attrs);
                });
              }
            }
          },
          forceDisableDatasource: function(datasourceName, scope) {
            var disableDatasource = setInterval(function() {
              try {
                var datasourceInstance = eval(datasourceName);
                if (datasourceInstance) {
                  $(document).ready(function() {
                    var time = 0;
                    var intervalForceDisable = setInterval(function() {
                      if (time < 10) {
                        scope.$apply(function () {
                          datasourceInstance.enabled = false;
                          datasourceInstance.data = [];
                        });
                        time++;
                      }
                      else
                        clearInterval(intervalForceDisable);
                    }, 20);
                  });
                  clearInterval(disableDatasource);
                }
              }
              catch(e) {
                //try again, until render
              }
            },10);
          },
          buttonBehavior: function(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost) {
            var datasourceName = '';
            if (attrs.crnDatasource)
              datasourceName = attrs.crnDatasource;
            else
              datasourceName = $element.parent().attr('crn-datasource')
            var requiredFilter = attrs.requiredFilter && attrs.requiredFilter.toString() == "true";
            if (requiredFilter) {
              this.forceDisableDatasource(datasourceName, scope);
              // var $datasource = $('datasource[name="'+datasourceName+'"]');
              // $datasource.attr('enabled','false');
              // var x = angular.element($datasource);
              // $compile(x)(scope);
            }

            $element.on('click', function() {
              var $this = $(this);
              var filters = $this.data('filters');
              if (datasourceName && datasourceName.length > 0 && filters) {
                var bindedFilter = '';
                $(filters).each(function() {
                  bindedFilter += this.bindedFilter+";";
                });

                var datasourceToFilter = eval(datasourceName);

                if (requiredFilter) {
                  datasourceToFilter.enabled = bindedFilter.length > 0;
                  if (datasourceToFilter.enabled) {
                    datasourceToFilter.search(bindedFilter, (attrs.cronappFilterCaseinsensitive=="true"));
                  }
                  else {
                    scope.$apply(function () {
                      datasourceToFilter.data = [];
                    });
                  }
                }
                else
                  datasourceToFilter.search(bindedFilter, (attrs.cronappFilterCaseinsensitive=="true"));
              }
            });
          },
          link: function(scope, element, attrs, ngModelCtrl) {
            var $element = $(element);
            var typeElement = $element.data('type') || $element.attr('type');
            if (attrs.asDate != undefined)
              typeElement = 'date';

            var operator = '=';
            if (attrs.cronappFilterOperator && attrs.cronappFilterOperator.length > 0)
              operator = attrs.cronappFilterOperator;

            var autopost = true;
            if (attrs.cronappFilterAutopost && attrs.cronappFilterAutopost == "false")
              autopost = false;

            if ($element[0].tagName == "INPUT")
              this.inputBehavior(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost);
            else
              this.buttonBehavior(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost);
          }
        }
      })
      .directive('cronRichEditor', function ($compile) {
        return {
          restrict: 'E',
          replace: true,
          require: 'ngModel',
          parseToTinyMCEOptions: function(optionsSelected) {

            var toolbarGroup = {};
            toolbarGroup["allowFullScreen"] = "fullscreen |";
            toolbarGroup["allowPage"] = "fullpage newdocument code pagebreak |";
            toolbarGroup["allowPrint"] = "preview print |";
            toolbarGroup["allowTransferArea"] = "cut copy paste |";
            toolbarGroup["allowDoUndo"] = "undo redo |";
            toolbarGroup["allowSymbol"] = "charmap |";
            toolbarGroup["allowEmbeddedImage"] = "bdesk_photo |";
            toolbarGroup["allowFont"] = "formatselect fontselect fontsizeselect strikethrough bold italic underline removeformat |";
            toolbarGroup["allowLinks"] = "link unlink anchor |";
            toolbarGroup["allowParagraph"] = "alignleft aligncenter alignright alignjustify numlist bullist outdent indent blockquote hr |";
            toolbarGroup["allowFormulas"] = "tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry tiny_mce_wiris_CAS |";


            var tinyMCEOptions = {
              menubar: false,
              statusbar: false,
              plugins: "bdesk_photo advlist anchor autolink autoresize autosave charmap code colorpicker contextmenu directionality emoticons fullpage fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template toc visualblocks visualchars wordcount tiny_mce_wiris",
              toolbar: "",
              content_style: ""
            };

            for (var key in optionsSelected) {
              if (key.startsWith("allow")) {
                if (optionsSelected[key])
                  tinyMCEOptions.toolbar += " " + toolbarGroup[key];
              }
            }
            tinyMCEOptions.menubar = optionsSelected.showMenuBar;
            tinyMCEOptions.statusbar = optionsSelected.showStatusBar;
            tinyMCEOptions.content_style = optionsSelected.contentStyle;

            return JSON.stringify(tinyMCEOptions);
          },
          link: function (scope, element, attrs, ngModelCtrl) {

            var optionsSelected = JSON.parse(attrs.options);
            var tinyMCEOptions = this.parseToTinyMCEOptions(optionsSelected);

            var templateDyn    = '\
                  <textarea \
                    ui-tinymce="$options$" \
                    ng-model="$ngModel$"> \
                  </textarea> \
                ';
            templateDyn = $(templateDyn
                .split('$ngModel$').join(attrs.ngModel)
                .split('$options$').join(escape(tinyMCEOptions))
            );

            var x = angular.element(templateDyn);
            element.html('');
            element.append(x);
            $compile(x)(scope);
          }
        };
      })
  .directive('cronGrid', ['$compile', '$translate', function($compile, $translate) {
    return {
      restrict: 'E',
      replace: true,
      require: 'ngModel',
      initCulture: function() {
        var culture = $translate.use();
        culture = culture.replace(/_/gm,'-');
        var parts = culture.split('-');
        parts[parts.length - 1] = parts[parts.length - 1].toUpperCase();
        culture = parts.join('-');
        kendo.culture(culture);
      },
      generateId: function() {
        var numbersOnly = '0123456789';
        var result = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
        if (numbersOnly.indexOf(result.substr(0,1)) > -1)
          return this.generateId();
        return result;
      },
      generateBlocklyCall: function(blocklyInfo) {
        var call;
        if (blocklyInfo.type == "client")  {
          var splitedClass = blocklyInfo.blocklyClass.split('/');
          var blocklyName = splitedClass[splitedClass.length-1];
          call = "blockly.js.blockly." + blocklyName;
          call += "." +  blocklyInfo.blocklyMethod;
          var params = "()";
          if (blocklyInfo.blocklyParams.length > 0) {
            params = "(";
            blocklyInfo.blocklyParams.forEach(function(p) {
              params += this.encodeHTML(p.value ? p.value : "''") + ",";
            }.bind(this))
            params = params.substr(0, params.length - 1);
            params += ")";
          }
          call += params;
        }
        else if (blocklyInfo.type == "server") {
          var blocklyName = blocklyInfo.blocklyClass + ':' + blocklyInfo.blocklyMethod;
          call = "cronapi.util.makeCallServerBlocklyAsync('"+blocklyName+"',null,null,";
          if (blocklyInfo.blocklyParams.length > 0) {
            blocklyInfo.blocklyParams.forEach(function(p) {
              call += this.encodeHTML(p.value ? p.value : "''") + ",";
            }.bind(this))
          }
          call = call.substr(0, call.length - 1);
          call += ")";
        }
        return call;

      },
      generateToolbarButtonCall: function(toolbarButton, scope) {
        var buttonCall;

        var generateObjTemplate = function(functionToCall, title, saveButton, isSaveOrCancelChanges) {
          var obj = {
            template: function() {
              var buttonId = this.generateId();
              return compileTemplateAngular(buttonId, functionToCall, title, saveButton, isSaveOrCancelChanges);
            }.bind(this)
          };
          return obj;
        }.bind(this);

        var compileTemplateAngular = function(buttonId, functionToCall, title, saveButton, isSaveOrCancelChanges) {
          var template = '';
          if (isSaveOrCancelChanges) {
            if (saveButton)
              template = '<a role="button" class="saveorcancelchanges k-button k-button-icontext k-grid-save-changes" id="#BUTTONID#" href="javascript:void(0)" ng-click="#FUNCTIONCALL#"><span class="k-icon k-i-check"></span>#TITLE#</a>';
            else
              template = '<a role="button" class="saveorcancelchanges k-button k-button-icontext k-grid-cancel-changes" id="#BUTTONID#" href="javascript:void(0)" ng-click="#FUNCTIONCALL#"><span class="k-icon k-i-cancel" ></span>#TITLE#</a>';
          }
          else {
            template = '<a class="k-button" id="#BUTTONID#" href="javascript:void(0)" ng-click="#FUNCTIONCALL#">#TITLE#</a>';
          }

          template = template
          .split('#BUTTONID#').join(buttonId)
          .split('#FUNCTIONCALL#').join(functionToCall)
          .split('#TITLE#').join(title);

          var waitRender = setInterval(function() {
            if ($('#' + buttonId).length > 0) {
              var x = angular.element($('#' + buttonId ));
              $compile(x)(scope);
              clearInterval(waitRender);
            }
          },200);

          return template;
        };

        var call = '';
        if (toolbarButton.type == "SaveOrCancelChanges")
          call = toolbarButton.methodCall;
        else
          call = this.generateBlocklyCall(toolbarButton.blocklyInfo);
        buttonCall = generateObjTemplate(call, toolbarButton.title, toolbarButton.saveButton, toolbarButton.type == "SaveOrCancelChanges");
        return buttonCall;
      },
      getObjectId: function(obj) {
        if (!obj)
          obj = "";
        else if (obj instanceof Date) {
          var momentDate = moment.utc(obj);
          obj = new Date(momentDate.format('YYYY-MM-DDTHH:mm:ss'));
        }
        else if (typeof obj === 'object') {
          //Verifica se tem id, senão pega o primeiro campo
          if (obj["id"])
            obj = obj["id"];
          else {
            for (var key in obj) {
              obj = obj[key];
              break;
            }
          }
        }
        return obj;
      },
      updateFiltersFromAngular: function(grid, scope) {

        var getIndexFilter = function(obj) {
          var index = -1;

          var filters = grid.dataSource.filter() ? grid.dataSource.filter().filters : null;
          if (filters) {
            for (var i = 0; i< filters.length; i++) {
              if (obj.linkParentField == filters[i].linkParentField) {
                index = i;
                break;
              }
            }
          }
          return index;
        }

        var addOrRemoveFilter = function(f) {
          var index = getIndexFilter(f);
          var hasChanges = false;
          var filters = grid.dataSource.filter() ? grid.dataSource.filter().filters : null;
          if (index > -1) {
            if ((f.value && f.value != "") || !f.linkParentLoadIfEmpty)
              filters[index] = f;
            else
              filters.splice(index, 1);
            hasChanges = true;
          }
          else {
            if ((f.value && f.value != "") || !f.linkParentLoadIfEmpty)  {
              if (filters)
                filters.push(f)
              else
                filters = [f];
              hasChanges = true;
            }
          }
          if (hasChanges)
            grid.dataSource.filter(filters);
        }

        var updateFilterTimeout = null;
        var updateFilter = function(newValue, f) {
          f.value = this.getObjectId(newValue);
          addOrRemoveFilter(f);
          setTimeout(function() { grid.trigger('change'); }, 100);
        };

        grid.dataSource.options.filterScreen.forEach(function(f) {
          scope.$watch(f.linkParentField, function(newValue, oldValue) {

            if (updateFilterTimeout) {
              clearTimeout(updateFilterTimeout);
              updateFilterTimeout = null;
            }

            updateFilterTimeout = setTimeout(function() {
              updateFilter.bind(this)(newValue, f)
            }.bind(this), 500);


          }.bind(this));
        }.bind(this));
      },
      setFiltersFromLinkColumns: function(datasource, options, scope) {
        datasource.filter = [];
        //Os filtros que sejam de tela, deverão ser utilizados apenas se tiver valor, se estiver vazio, não seta
        //no filtro principal do datasource (filter)
        datasource.filterScreen = [];
        options.columns.forEach( function(c) {
          if (c.linkParentField && c.linkParentField.length > 0 &&
              c.linkParentType && c.linkParentType.length > 0)
          {
            if (c.linkParentType == "screen") {
              var value = scope[c.linkParentField];
              value = this.getObjectId(value);
              var filter = {
                field: c.field, operator: "eq", value: value, linkParentField: c.linkParentField, linkParentType: c.linkParentType,
                linkParentLoadIfEmpty: c.linkParentLoadIfEmpty
              };
              if ((value && value != "") || !c.linkParentLoadIfEmpty)
                datasource.filter.push(filter);
              datasource.filterScreen.push(filter);
            }
            else if (c.linkParentType == "hierarchy") {
              var filter = { field: c.field, operator: "eq", value: "", linkParentField: c.linkParentField, linkParentType: c.linkParentType };
              datasource.filter.push(filter);
            }
          }
        }.bind(this));
      },
      encodeHTML: function(value){
        return value.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      },
      decodeHTML: function(value){
        return value.replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');
      },
      getColumns: function(options, datasource, scope) {

        window.formatDate = function(value, format, type) {
          var momentDate;
          var formated = '';

          if (value) {
            if (type == 'date' || type == 'datetime' || type == 'time')
              momentDate = moment.utc(value);
            else
              momentDate = moment(value);

            if (format && format != "null")
              formated = momentDate.format(format);
            else {
              format= parseMaskType(type, $translate);
              formated = momentDate.format(format);
            }
          }
          return formated
        }

        function getTemplate(column) {
          var template = undefined;
          if (column.inputType == 'checkbox') {
            template = "<input type='checkbox' class='k-checkbox' #=" + column.field + " ? \"checked='checked'\": '' # />" +
                "<label class='k-checkbox-label k-no-text'></label>"
          }
          if (column.inputType == 'switch') {
            template =
                '<span class="k-switch km-switch k-widget km-widget k-switch-off km-switch-off" style="width: 100%">\
                  <span class="k-switch-wrapper km-switch-wrapper">\
                    <span class="k-switch-background km-switch-background" style="margin-left: #=' + column.field + ' ? "80%": "0%" #"></span>\
                  </span>\
                  <span class="k-switch-container km-switch-container">\
                    <span class="k-switch-handle km-switch-handle" style=#=' + column.field + ' ? "float:right;margin-right:-1px": "margin-left:0%" #>\
                    </span>\
                  </span>\
                </span>';
          }

          else if (column.displayField && column.displayField.length > 0) {
            if (column.type.startsWith('date') || column.type.startsWith('month')
                || column.type.startsWith('time') || column.type.startsWith('week')) {
              template = "#= formatDate("+column.displayField+",'"+column.format+"','"+column.type+"') #";
            }
            else {
              template = "#="+column.displayField+"#";
            }
          }
          else if (column.type.startsWith('date') || column.type.startsWith('month')
              || column.type.startsWith('time') || column.type.startsWith('week')) {
            template = "#= formatDate("+column.field+",'"+column.format+"','"+column.type+"') #";
          }
          return template;
        }

        function getFormat(column) {
          if (column.format && !column.type.startsWith('date') && !column.type.startsWith('time')
              && !column.type.startsWith('month') && !column.type.startsWith('week'))
            return column.format;
          return undefined;
        }

        function getColumnByField(fieldName) {
          var selected = null;
          options.columns.forEach(function(column)  {
            if (column.field == fieldName)
              selected = column;
          });
          return selected;
        }

        function isRequired(fieldName) {
          var required = false;
          var selected = null;
          if (datasource.schema.model.fields[fieldName]){
            selected = datasource.schema.model.fields[fieldName];
          }
          if (selected)
            required = !selected.nullable;
          return required;
        }

        function getEditor(column) {
          return editor.bind(this);
        }

        function editor(container, opt) {
          $(container).css("position", "relative");

          var column = getColumnByField(opt.field);
          var required = isRequired(opt.field) ? "required" : "";
          var buttonId = this.generateId();
          var $input = $('<input '+required+' name="' + opt.field + '" id="' + buttonId + '"from-grid=true />');
          if (column.inputType == 'dynamicComboBox' || column.inputType == 'comboBox') {
            var kendoConfig = app.kendoHelper.getConfigCombobox(column.comboboxOptions, scope);
            kendoConfig.autoBind = true;
            kendoConfig.optionLabel = undefined;
            if (column.displayField) {
              kendoConfig.change = function(e) {
                opt.model.set(column.displayField, this.text());
                opt.model.dirty = true;
                opt.model.dirtyFields[column.displayField] = true;
              }
            }
            $input.appendTo(container).kendoDropDownList(kendoConfig, scope);
          }
          else if (column.inputType == 'slider') {
            var kendoConfig = app.kendoHelper.getConfigSlider(column.sliderOptions);
            $input.appendTo(container).kendoSlider(kendoConfig, scope);
          }
          else if (column.inputType == 'switch') {
            var kendoConfig = app.kendoHelper.getConfigSwitch(column.switchOptions);
            $input.appendTo(container).kendoMobileSwitch(kendoConfig, scope);
          }
          else if (column.inputType == 'checkbox') {
            var guid = this.generateId();
            $input = $('<input id="'+guid+'" name="' + opt.field + '" class="k-checkbox" type="checkbox" ><label class="k-checkbox-label" for="'+guid+'"></label>');
            $input.appendTo(container);
          }
          else if (column.inputType == 'date') {
            $input.attr('cron-date', '');
            $input.attr('options', JSON.stringify(column.dateOptions));
            $input.data('initial-date', opt.model[opt.field]);
            $input.appendTo(container).off('change');
            var waitRender = setInterval(function() {
              if ($('#' + buttonId).length > 0) {
                var x = angular.element($('#' + buttonId ));
                $compile(x)(scope);
                clearInterval(waitRender);

                $('#' + buttonId).on('change', function() {
                  setTimeout(function() {
                    opt.model[opt.field] = $('#' + buttonId ).data('rawvalue');
                    opt.model.dirty = true;
                    opt.model.dirtyFields[opt.field] = true;
                  }.bind(this));

                });
              }
            },10);
          }
          else {
            $input.attr('type', column.type);
            $input.attr('mask', column.format ? column.format : '');
            $input.attr('class', 'k-input k-textbox');
            $input.data('initial-value', opt.model[opt.field]);
            $input.appendTo(container);

            var waitRender = setInterval(function() {
              if ($('#' + buttonId).length > 0) {
                $('#' + buttonId ).off('change');
                $('#' + buttonId ).on('change', function() {
                  opt.model[opt.field] = $('#' + buttonId ).data('rawvalue');
                  opt.model.dirty = true;
                  opt.model.dirtyFields[opt.field] = true;
                });

                var x = angular.element($('#' + buttonId ));
                $compile(x)(scope);
                clearInterval(waitRender);
              }
            },10);
          }

        }

        var columns = [];
        if (options.columns) {
          options.columns.forEach(function(column)  {
            if (column.visible) {
              if (column.dataType == "Database") {

                var addColumn = {
                  field: column.field,
                  title: column.headerText,
                  type: column.type,
                  width: column.width,
                  sortable: column.sortable,
                  filterable: column.filterable
                };
                addColumn.template = getTemplate(column);
                addColumn.format = getFormat(column);
                addColumn.editor = getEditor.bind(this)(column);
                columns.push(addColumn);

              }
              else if (column.dataType == "Command") {
                //Se não for editavel, não adiciona colunas de comando
                if (options.editable != 'no') {
                  var command = column.command.split('|');

                  var commands = [];
                  command.forEach(function(f) {
                    var cmd = { name: f };
                    if ( f == "edit")
                      cmd.text = { edit: " ", update: " ", cancel: " " };
                    else
                      cmd.text = " ";
                    commands.push(cmd);
                  });

                  var addColumn = {
                    command: commands,
                    title: column.headerText,
                    width: column.width ? column.width : 155
                  };
                  columns.push(addColumn);
                }
              }
              else if (column.dataType == "Blockly") {
                var directiveContext = this;
                var addColumn = {
                  command: [{
                    name: this.generateId(),
                    text: column.headerText,
                    click: function(e) {
                      e.preventDefault();
                      var tr = $(e.target).closest("tr"); // get the current table row (tr)
                      var grid = tr.closest('table');

                      var item = this.dataItem(tr);
                      // var index = $(grid).find('tr.'+$(tr).attr('class')).index(tr);
                      var index = $(grid.find('tbody')[0]).children().index(tr)
                      var consolidated = {
                        item: item,
                        index: index
                      }
                      var call = 'scope.' + directiveContext.generateBlocklyCall(column.blocklyInfo);
                      eval(call);
                      return;
                    }
                  }],
                  width: column.width
                };
                columns.push(addColumn);
              }

            }
          }.bind(this));
        }

        return columns;
      },
      getPageAble: function(options) {
        var pageable = {
          refresh:  options.allowRefreshGrid,
          pageSizes: options.allowSelectionTotalPageToShow,
          buttonCount: 5
        };

        if (!options.allowPaging)
          pageable = options.allowPaging;

        return pageable;
      },
      getToolbar: function(options, scope) {
        var toolbar = [];

        options.toolBarButtons.forEach(function(toolbarButton) {
          if (toolbarButton.type == "Native") {
            //Se a grade for editavel, adiciona todos os commands
            if (options.editable != 'no') {
              if (toolbarButton.title == "save" || toolbarButton.title == "cancel") {
                // //O Salvar e cancelar na toolbar só é possível no batch mode
                // if (options.editable == 'batch')
                toolbar.push(toolbarButton.title);
              }
              else
                toolbar.push(toolbarButton.title);
            }
            //Senão, adiciona somente commands que não sejam de crud
            else {
              if (toolbarButton.title == "pdf" || toolbarButton.title == "excel") {
                toolbar.push(toolbarButton.title);
              }
            }
          }
          else if (toolbarButton.type == "Blockly" || toolbarButton.type == "SaveOrCancelChanges") {
            var buttonBlockly = this.generateToolbarButtonCall(toolbarButton, scope);
            toolbar.push(buttonBlockly);
          }
          else if (toolbarButton.type == "Template") {
            var buttonTemplate =  {
              template: toolbarButton.template
            }
            toolbar.push(buttonTemplate);
          }

        }.bind(this));

        if (toolbar.length == 0)
          toolbar = undefined;
        return toolbar;
      },
      getEditable: function(options) {

        var editable = options.editable;
        if (options.editable == 'batch') {
          editable = true;
        }
        else if (options.editable == 'no') {
          editable = false;
        }
        return editable;
      },
      generateKendoGridInit: function(options, scope) {

        var helperDirective = this;
        function detailInit(e) {
          //Significa que está fechando o detalhe (não é para fazer nada)
          if (e.masterRow.find('a').hasClass('k-i-expand')) {
            // collapseAllExcecptCurrent(this, null, null);
            collapseCurrent(this, e.detailRow, e.masterRow);
            return;
          }

          var cronappDatasource = this.dataSource.transport.options.cronappDatasource;
          if (!(cronappDatasource.inserting || cronappDatasource.editing)) {
            if (this.selectable) {
              this.select(e.masterRow);
            }
            else {
              setToActiveInCronappDataSource.bind(this)(e.data);
              collapseAllExcecptCurrent(this, e.detailRow, e.masterRow);
            }
            //Obtendo todos os detalhes da grade atual, fechando e removendo todos (exceto o que esta sendo aberto agora)
            e.sender.options.listCurrentOptions.forEach(function(currentOptions) {
              var currentKendoGridInit = helperDirective.generateKendoGridInit(currentOptions, scope);
              
              var grid = $("<div/>").appendTo(e.detailCell).kendoGrid(currentKendoGridInit).data('kendoGrid');
              grid.dataSource.transport.options.grid = grid;
            });
          }
          else
            collapseAllExcecptCurrent(this, null, null);


        }

        var collapseAllExcecptCurrent = function(grid, trDetail, trMaster) {

          var masters = grid.table.find('.k-master-row');
          masters.each(function() {
            if (trMaster == null || this != trMaster[0]) {
              grid.collapseRow(this);
            }
          });

          var details = grid.table.find('.k-detail-row');
          details.each(function() {
            if (trDetail == null || this != trDetail[0]) {
              $(this).remove();
            }
          });

        };

        var collapseCurrent = function(grid, trDetail, trMaster) {

          var masters = grid.table.find('.k-master-row');
          masters.each(function() {
            if (trMaster != null || this == trMaster[0]) {
              grid.collapseRow(this);
            }
          });

          var details = grid.table.find('.k-detail-row');
          details.each(function() {
            if (trDetail != null || this == trDetail[0]) {
              $(this).remove();
            }
          });

        };

        var setToActiveInCronappDataSource = function(item) {
          var cronappDatasource = this.dataSource.transport.options.cronappDatasource;
          if (!(cronappDatasource.inserting || cronappDatasource.editing))
            scope.safeApply(cronappDatasource.goTo(item));
        };

        var datasource = app.kendoHelper.getDataSource(options.dataSourceScreen.entityDataSource, scope, options.allowPaging, options.pageCount, options.columns);

        var columns = this.getColumns(options, datasource, scope);
        var pageAble = this.getPageAble(options);
        var toolbar = this.getToolbar(options, scope);
        var editable = this.getEditable(options);

        var kendoGridInit = {
          toolbar: toolbar,
          pdf: {
            allPages: true,
            avoidLinks: true,
            paperSize: "A4",
            margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
            landscape: true,
            repeatHeaders: true,
            scale: 0.8
          },
          dataSource: datasource,
          editable: editable,
          height: options.height,
          groupable: options.allowGrouping,
          sortable: options.allowSorting,
          filterable: { mode: "row" },
          pageable: pageAble,
          columns: columns,
          selectable: options.allowSelectionRow,
          detailInit: (options.details && options.details.length > 0) ? detailInit : undefined,
          listCurrentOptions: (options.details && options.details.length > 0) ? options.details : undefined,
          edit: function(e) {
            this.dataSource.transport.options.disableAndSelect(e);
            var container = e.container;
            var cronappDatasource = this.dataSource.transport.options.cronappDatasource;
            if (e.model.isNew() && !e.model.dirty) {
              var model = e.model;
              cronappDatasource.startInserting(null, function(active) {
                for (var key in active) {
                  if (model.fields[key]) {
                    if (model.fields[key].validation && model.fields[key].validation.required) {
                      var input = container.find("input[name='" + key + "']");
                      if (input.length) {
                        //TODO: Verificar com a telerik https://stackoverflow.com/questions/22179758/kendo-grid-using-model-set-to-update-the-value-of-required-fields-triggers-vali
                        input.val(active[key]).trigger('change');
                      }
                    }
                    model.set(key, active[key]);
                  }
                }
              });
            }
            else if (!e.model.isNew() && !e.model.dirty) {
              scope.safeApply(function() {
                var currentItem = cronappDatasource.goTo(e.model);
                cronappDatasource.startEditing(currentItem, function(xxx) {});  
              });
            }
          },
          change: function(e) {
            var item = this.dataItem(this.select());
            setToActiveInCronappDataSource.bind(this)(item);
            collapseAllExcecptCurrent(this, this.select().next(), this.select() );
          },
          cancel: function(e) {
            var cronappDatasource = this.dataSource.transport.options.cronappDatasource;
            scope.safeApply(cronappDatasource.cancel());
            this.dataSource.transport.options.enableAndSelect(e);
          },
          dataBound: function(e) {
            this.dataSource.transport.options.selectActiveInGrid();
          }
        };

        return kendoGridInit;

      },
      link: function (scope, element, attrs, ngModelCtrl) {
        var $templateDyn = $('<div></div>');
        var baseUrl = 'plugins/cronapp-framework-js/dist/js/kendo-ui/js/messages/kendo.messages.';
        if ($translate.use() == 'pt_br')
          baseUrl += "pt-BR.min.js";
        else
          baseUrl += "en-US.min.js";

        this.initCulture();
        var helperDirective = this;
        $.getScript(baseUrl, function () {

          var options = JSON.parse(attrs.options || "{}");

          if (scope[options.dataSourceScreen.entityDataSource.name] && !scope[options.dataSourceScreen.entityDataSource.name].dependentLazyPost) {
            scope[options.dataSourceScreen.entityDataSource.name].batchPost = true;

            options.toolBarButtons = options.toolBarButtons || [];
            options.toolBarButtons.push({
              type: "SaveOrCancelChanges",
              title: $translate.instant('SaveChanges'),
              methodCall: options.dataSourceScreen.entityDataSource.name + ".postBatchData()",
              saveButton: true
            });
            options.toolBarButtons.push({
              type: "SaveOrCancelChanges",
              title: $translate.instant('CancelChanges'),
              methodCall: options.dataSourceScreen.entityDataSource.name + ".cancelBatchData()",
              saveButton: false
            });
          }



          var kendoGridInit = helperDirective.generateKendoGridInit(options, scope);

          var grid = $templateDyn.kendoGrid(kendoGridInit).data('kendoGrid');
          grid.dataSource.transport.options.grid = grid;

          scope.safeApply(function() {
            var checkDsChanges = setInterval(function() {
              if (scope[options.dataSourceScreen.entityDataSource.name]) {
                
                if (scope[options.dataSourceScreen.entityDataSource.name].hasPendingChanges()) {
                  $templateDyn.find('.k-filter-row').hide();
                  $templateDyn.find('.k-pager-sizes').hide();
                  $templateDyn.find('.k-pager-nav').hide();
                  $templateDyn.find('.k-pager-numbers').hide();
                  $templateDyn.find('.k-pager-refresh.k-link').hide();
                  $templateDyn.find('.saveorcancelchanges').show();
                }
                else {
                  $templateDyn.find('.k-filter-row').show();
                  $templateDyn.find('.k-pager-sizes').show();
                  $templateDyn.find('.k-pager-nav').show();
                  $templateDyn.find('.k-pager-numbers').show();
                  $templateDyn.find('.k-pager-refresh.k-link').show();
                  $templateDyn.find('.saveorcancelchanges').hide();
                }  
              }
              else {
                clearInterval(checkDsChanges);
              }
            },100);
          });
          

        });

        element.html($templateDyn);
        $compile($templateDyn)(element.scope());

      }
    };
  }])
  
  .directive('cronSelect', function ($compile) {
    return {
      restrict: 'E',
      replace: true,
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
		  var select = {};
		  try {
			// var json = window.buildElementOptions(element);
			select =  JSON.parse(attrs.options);
		  } catch(err) {
			console.log('ComboBox invalid configuration! ' + err);
		  }
		  
		  var id = attrs.id ? ' id="' + attrs.id + '"' : '';
		  var name = attrs.name ? ' name="' + attrs.name + '"' : '';
		  var parent = element.parent();
		  $(parent).append('<input style="width: 100%;" ' + id + name + ' class="cronSelect" ng-model="' + attrs.ngModel + '"/>');
		  var $element = $(parent).find('input.cronSelect');
		
		  var options = app.kendoHelper.getConfigCombobox(select, scope);
		  var combobox = $element.kendoComboBox(options).data('kendoComboBox');
		  $(element).remove();
		  
		  var _scope = scope;
		  var _ngModelCtrl = ngModelCtrl;
		  
		  $element.on('change', function (event) {
			_scope.$apply(function () {
			  _ngModelCtrl.$setViewValue(this.value());
			}.bind(combobox));
		  });

		  if (ngModelCtrl) {
			ngModelCtrl.$formatters.push(function (value) {
			  var result = '';
			  
			  if (value) {
				result = value;
			  }
			  
			  combobox.value(result);
			  
			  return result;
			});

			ngModelCtrl.$parsers.push(function (value) {
			  if (value) {
				return value;
			  }
			  
			  return null;
			});
		  }
		}
    };
  })
  
  .directive('cronDynamicSelect', function ($compile) {
    return {
      restrict: 'E',
      replace: true,
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
		  var select = {};
		  try {
			// var json = window.buildElementOptions(element);
			select = JSON.parse(attrs.options);
		  } catch(err) {
			console.log('DynamicComboBox invalid configuration! ' + err);
		  }
		  
		  var options = app.kendoHelper.getConfigCombobox(select, scope);
		  try {
			delete options.dataSource.schema.model.id;
		  } catch(e){}
		  
		  var parent = element.parent();
		  var id = attrs.id ? ' id="' + attrs.id + '"' : '';
		  var name = attrs.name ? ' name="' + attrs.name + '"' : '';
		  $(parent).append('<input style="width: 100%;"' + id + name + ' class="cronDynamicSelect" ng-model="' + attrs.ngModel + '"/>');
		  var $element = $(parent).find('input.cronDynamicSelect');
		  $(element).remove();
		  
		  options['dataBound'] = function(e) {
			var currentValue = $(combobox).data('currentValue');
			if (currentValue != null) {
			  setTimeout(function(){combobox.value(currentValue)},300);
			}
			$(combobox).data('currentValue', null);
		  };                   
		  
		  var combobox = $element.kendoDropDownList(options).data('kendoDropDownList');
		  if (combobox.dataSource.transport && combobox.dataSource.transport.options) {
			combobox.dataSource.transport.options.grid = combobox;
		  }
		  var _scope = scope;
		  var _ngModelCtrl = ngModelCtrl;
		  
		  $element.on('change', function (event) {
			_scope.$apply(function () {
			  _ngModelCtrl.$setViewValue(this.dataItem());
			}.bind(combobox));
		  });
		  
		  if (ngModelCtrl) {
			/**
			* Formatters change how model values will appear in the view.
			* For display component.
			*/
			ngModelCtrl.$formatters.push(function (value) {
			  var result = '';
			  
			  if (value) {
				if (typeof value == "string") {
				  result = value;
				} else {
				  if (value[select.dataValueField]) {
					result = value[select.dataValueField];
				  }
				}
			  }
			  
			  $(combobox).data('currentValue', result);
			  view = combobox.dataSource.view();
			  if (!view || (Array.isArray(view) && view.length == 0)) {
				combobox.dataSource.read();
			  } else {
				combobox.value(result);
			  }
			  
			  return result;
			});

			/**
			* Parsers change how view values will be saved in the model.
			* for storage
			*/
			ngModelCtrl.$parsers.push(function (value) {
			  if (value) {
				if (combobox.options.valuePrimitive === true) {  
				  if (typeof value == 'string') {
					return value;
				  } else if (value[select.dataValueField]) {
					return value[select.dataValueField];
				  }
				} else {
				  try {
					return objectClone(value, this.dataSource.options.schema.model.fields);
				  } catch(e){}
				}
			  }

			  return null;
			}.bind(combobox));
		}
      }
    };
  })
  
  .directive('cronMultiSelect', function ($compile) {
    return {
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
          var _self = this;
          var select = {};
          try {
            //var json = window.buildElementOptions(element);
            select = JSON.parse(attrs.options);
          } catch(err) {
            console.log('MultiSelect invalid configuration! ' + err);
          }
          
          var _scope = scope;
          var _ngModelCtrl = ngModelCtrl;
          
          var options = app.kendoHelper.getConfigCombobox(select, scope);
          
          try {
            delete options.dataSource.schema.model.id;
          } catch(e){}
          
          var parent = element.parent();
          var id = attrs.id ? ' id="' + attrs.id + '"' : '';
          var name = attrs.name ? ' name="' + attrs.name + '"' : '';
          $(parent).append('<input style="width: 100%;"' + id + name + ' class="cronMultiSelect" ng-model="' + attrs.ngModel + '"/>');
          var $element = $(parent).find('input.cronMultiSelect');
          $(element).remove();

          var combobox = $element.kendoMultiSelect(options).data('kendoMultiSelect');
          if (combobox.dataSource.transport && combobox.dataSource.transport.options) {
			combobox.dataSource.transport.options.grid = combobox;
		  }
		  
          $(element).on('change', function (event) {
            _scope.$apply(function () {
              _ngModelCtrl.$setViewValue(this.dataItems());
            }.bind(combobox));
          });
          
          var convertArray = function(value) {
            var result = [];
            
            if (value) {
              for (var item in value) {
                result.push(value[item][select.dataValueField]);
              }
            }
            
            return result;            
          }
          
          scope.$watchCollection(function(){return ngModelCtrl.$modelValue}, function(value, old){
            if (JSON.stringify(value) !== JSON.stringify(old)) {
              combobox.value(convertArray(value));
            }
          });
          
          if (ngModelCtrl) {
            ngModelCtrl.$formatters.push(function (value) {
              var result = convertArray(value);
              
              combobox.value(result);
            
              return result;
            });
  
            ngModelCtrl.$parsers.push(function (value) {
              if (value && Array.isArray(value)) {
                if (this.dataSource) {
                  var result = [];
                  
                  try {
                    for (var item in value) {
                      result.push(objectClone(value[item], this.dataSource.options.schema.model.fields));
                    }
                  } catch (e){}
                  
                  return result;
                }
              }
              
              return null;
            }.bind(combobox));
        }
      }
    };
  })  
  
  .directive('cronAutoComplete', function ($compile) {
    return {
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        var select = {};
        try {
          // var json = window.buildElementOptions(element);
          select = JSON.parse(attrs.options);
        } catch(err) {
          console.log('AutoComplete invalid configuration! ' + err);
        }
        
        try {
          delete options.dataSource.schema.model.id;
        } catch(e){}

        var options = app.kendoHelper.getConfigCombobox(select, scope);
        var parent = element.parent();
        var id = attrs.id ? ' id="' + attrs.id + '"' : '';
        var name = attrs.name ? ' name="' + attrs.name + '"' : '';
        $(parent).append('<input style="width: 100%;" ' + id + name + ' class="cronAutoComplete" ng-model="' + attrs.ngModel + '"/>');
        var $element = $(parent).find('input.cronAutoComplete');
        
        options['change'] = function(e) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue($element.val());
          });
        }  

        var autoComplete = $element.kendoAutoComplete(options).data('kendoAutoComplete');
		if (autoComplete.dataSource.transport && autoComplete.dataSource.transport.options) {
			autoComplete.dataSource.transport.options.grid = autoComplete;
		}
		  
        $(element).remove();

        if (ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            var result = '';
            
            if (value) {
              if (typeof value == 'string') {
                result = value;
              } else if (value[select.dataTextField]) {
                result = value[select.dataTextField];
              }
            }
            
            autoComplete.value(result);

            return result;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value) {
              if (typeof value == 'string') {
                return value;
              } else if (value[select.dataTextField]) {
                return value[select.dataTextField];
              }
            }

            return null;
          });
        }
      }
    }
  })

  .directive('cronDate', ['$compile', '$translate', '$window', function ($compile, $translate, $window) {
    return {
      restrict: 'AE',
      require: '?ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        var options = {};
        var cronDate = {};
        
        try {
          if (attrs.options)
            cronDate =  JSON.parse(attrs.options);
          else {
            var json = window.buildElementOptions(element);
            cronDate = JSON.parse(json);
          }
          if (!cronDate.format) {
            cronDate.format = parseMaskType(cronDate.type, $translate)
          }
          options = app.kendoHelper.getConfigDate($translate, cronDate);
        } catch(err) {
          console.log('AutoComplete invalid configuration! ' + err);
        }
        
        var useUTC = options.type == 'date' || options.type == 'datetime' || options.type == 'time';


        var $element;
        if (attrs.fromGrid) {
          $element = $(element);
        }
        else {
          var parent = element.parent();
          var $input = $('<input style="width: 100%;" class="cronDate" ng-model="' + attrs.ngModel + '"/>');
          $(parent).append($input);
          $element = $(parent).find('input.cronDate');
          $element.data("type", options.type);
          $element.attr("type", "date");
        }
        
        var datePicker = app.kendoHelper.buildKendoMomentPicker($element, options, scope, ngModelCtrl); 
        
        if (attrs.fromGrid) {
          var unmaskedvalue = function() {
            var momentDate = null;
           
            var valueDate =  $(this).val();
            if ($(this).data('initial-date')) {
              valueDate = $(this).data('initial-date');
              $(this).data('initial-date', null);
            }
            
            if (useUTC) {
              momentDate = moment.utc(valueDate, options.momentFormat);
            } else {
              momentDate = moment(valueDate, options.momentFormat);
            }
            
            datePicker.value(momentDate.format(options.momentFormat));
            $(this).data('rawvalue', momentDate.toDate());
          }
          $(element).on('keydown', unmaskedvalue).on('keyup', unmaskedvalue).on('change', unmaskedvalue);
          unmaskedvalue.bind($element)();
        }
        else {
          if (ngModelCtrl) {
            ngModelCtrl.$formatters.push(function (value) {
              var selDate = null;
              
              if (value) {
                var momentDate = null;
  
                if (useUTC) {
                  momentDate = moment.utc(value);
                } else {
                  momentDate = moment(value);
                }
  
                selDate = momentDate.format(options.momentFormat);
              }
              
              datePicker.value(selDate);
  
              return selDate;
            });
  
            ngModelCtrl.$parsers.push(function (value) {
              if (value) {
                var momentDate = null;
                if (useUTC) {
                  momentDate = moment.utc(datePicker._oldText, options.momentFormat);
                } else {
                  momentDate = moment(datePicker._oldText, options.momentFormat);
                }
                return momentDate.toDate();
              }
  
              return null;
            });
          }
          
          $(element).remove();
        }
      }
    }
  }])
  
  .directive('cronSlider', function ($compile) {
    return {
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        var slider = {};
        
        try {
          var json = window.buildElementOptions(element);
          slider = JSON.parse(json);
        } catch(err) {
          console.log('Slider invalid configuration! ' + err);
        }
        
        var onChange = function(event) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(parseInt($(element).val()));
          });
        }
        
        var sliderOnChange = function(event) {
          onChange(event);
        }
        
        var sliderOnSlide = function(event) {
          onChange(event);
        }
              
        var config = app.kendoHelper.getConfigSlider(slider);
        config['change'] = sliderOnChange;
        config['slide'] = sliderOnSlide;
        
        $(element).empty();
        var slider = $(element).kendoSlider(config).data("kendoSlider");
        
        scope.$watch(function(){return ngModelCtrl.$modelValue}, function(value, old){
          if (value !== old) { 
            if (!value) {
              slider.value(slider.min());
            } else {
              slider.value(value);
            }
          }
        });
        
        if (ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            var result = null;
            
            if (!value && slider.min) {
              result = slider.min;
            } else if (value) {
              result = value;
            }
            
            slider.value(result);
            
            return result;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value) {
              return value;
            }

            return null;
          });
        }
      }
    }
  })
  
  .directive('cronSwitch', function ($compile) {
    return {
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        var cronSwitch = {};
        
        try {  
          var json = window.buildElementOptions(element);
          cronSwitch = JSON.parse(json);
        } catch(err) {
          console.log('Switch invalid configuration! ' + err);
        }
        
        var options = app.kendoHelper.getConfigSwitch(cronSwitch);
        var parent = element.parent();
        $(parent).append('<input style="width: 100%;" class="cronSwitch" ng-model="' + attrs.ngModel + '"/>');
        var $element = $(parent).find('input.cronSwitch');
        
        var change = function(e) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(this.value());
          }.bind(this));
        } 
        options['change'] = change;
        
        var mobSwitch = $element.kendoMobileSwitch(options).data('kendoMobileSwitch');
        $(element).remove();
        
        if (ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            var result = false;
            
            if (value != undefined) {
              result = value;
            }
            
            mobSwitch.value(result);
            
            return result;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value != undefined) {
              return value;
            }
            
            return false;
          });
        }
      }
    }
  })
  
  .directive('cronBarcode', function ($compile) {
    return {
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        var cronBarcode = {};
        
        try {  
          var json = window.buildElementOptions(element);
          cronBarcode = JSON.parse(json);
        } catch(err) {
          console.log('Barcode invalid configuration! ' + err);
        }
        
        var options = app.kendoHelper.getConfigBarcode(cronBarcode);
        var parent = element.parent();
        $(parent).append('<span class="cronBarcode" ng-model="' + attrs.ngModel + '"></span>');
        var $element = $(parent).find('span.cronBarcode');
        
        var kendoBarcode = $element.kendoBarcode(options).data('kendoBarcode');
        $(element).remove();
        
        scope.$watch(function(){return ngModel.$modelValue}, function(value, old){
          var result = '';
          
          if (value !== old) {
            result = value;
          }
          
          options['value'] = result;
          kendoBarcode.setOptions(options);
        });
      }
    }
  })  
  
  .directive('cronQrcode', function ($compile) {
    return {
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        var cronQrcode = {};
        
        try {  
          var json = window.buildElementOptions(element);
          cronQrcode = JSON.parse(json);
        } catch(err) {
          console.log('Qrcode invalid configuration! ' + err);
        }
        
        var options = app.kendoHelper.getConfigQrcode(cronQrcode);
        var parent = element.parent();
        $(parent).append('<span class="cronQrcode" ng-model="' + attrs.ngModel + '"></span>');
        var $element = $(parent).find('span.cronQrcode');
        
        var kendoQRCode = $element.kendoQRCode().data('kendoQRCode');
        $(element).remove();
        
        scope.$watch(function(){return ngModel.$modelValue}, function(value, old){
          var result = '';
          
          if (value !== old) {
            result = value;
          }
          
          options['value'] = result;
          kendoQRCode.setOptions(options);
        });
      }
    }
  })
  
}(app));

function maskDirectiveAsDate($compile, $translate) {
  return maskDirective($compile, $translate, 'as-date');
}

function maskDirectiveMask($compile, $translate) {
  return maskDirective($compile, $translate, 'mask');
}

function maskDirective($compile, $translate, attrName) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      if(attrName == 'as-date' && attrs.mask !== undefined)
        return;


      var $element = $(element);

      var type = $element.attr("type");

      if (type == "checkbox" || type == "password")
        return;

      $element.data("type", type);

      $element.attr("type", "text");

      if (ngModelCtrl) {
        ngModelCtrl.$formatters = [];
        ngModelCtrl.$parsers = [];
      }

      if (attrs.asDate !== undefined && type == 'text')
        type = "date";

      var textMask = true;

      var removeMask = false;

      var attrMask = attrs.mask || attrs.format;

      if (!attrMask) {
        attrMask = parseMaskType(type, $translate);
      } else {
        attrMask = parseMaskType(attrMask, $translate);
      }

      if (attrMask.endsWith(";0")) {
        removeMask = true;
      }

      var mask = attrMask.replace(';1', '').replace(';0', '').trim();
      if (mask == undefined || mask.length == 0) {
        return;
      }

      if (type == 'date' || type == 'datetime' || type == 'datetime-local' || type == 'month' || type == 'time' || type == 'time-local' || type == 'week') {

        var options = {
          format: mask,
          locale: $translate.use(),
          showTodayButton: true,
          useStrict: true,
          tooltips: {
            today: $translate.instant('DatePicker.today'),
            clear: $translate.instant('DatePicker.clear'),
            close: $translate.instant('DatePicker.close'),
            selectMonth: $translate.instant('DatePicker.selectMonth'),
            prevMonth: $translate.instant('DatePicker.prevMonth'),
            nextMonth: $translate.instant('DatePicker.nextMonth'),
            selectYear: $translate.instant('DatePicker.selectYear'),
            prevYear: $translate.instant('DatePicker.prevYear'),
            nextYear: $translate.instant('DatePicker.nextYear'),
            selectDecade: $translate.instant('DatePicker.selectDecade'),
            prevDecade: $translate.instant('DatePicker.prevDecade'),
            nextDecade: $translate.instant('DatePicker.nextDecade'),
            prevCentury: $translate.instant('DatePicker.prevCentury'),
            nextCentury: $translate.instant('DatePicker.nextCentury')
          }
        };

        if (mask != 'DD/MM/YYYY' && mask != 'MM/DD/YYYY') {
          options.sideBySide = true;
        }

        var useUTC = type == 'date' || type == 'datetime' || type == 'time';

        if ($element.attr('from-grid')) {
          $element.on('click', function() {
            var popup = $(this).offset();

            var isBellowInput = true;
            var datetimepickerShowing = $(this).parent().find('.bootstrap-datetimepicker-widget.dropdown-menu.usetwentyfour.bottom');
            if (!datetimepickerShowing.length) {
              isBellowInput = false;
              datetimepickerShowing = $(this).parent().find('.bootstrap-datetimepicker-widget.dropdown-menu.usetwentyfour.top');
            }
            var popupLeft = $(datetimepickerShowing).offset().left;

            var grid = datetimepickerShowing.closest('cron-grid');
            datetimepickerShowing.appendTo(grid);

            var popupTop = 0
            if (!isBellowInput)
              popupTop = popup.top - ($(datetimepickerShowing).height() + 15);
            else
              popupTop = popup.top + 35;

            datetimepickerShowing.css("top", popupTop);
            datetimepickerShowing.css("bottom", "auto");
            datetimepickerShowing.css("left", popupLeft);
          });
          $element.on('dp.change', function () {
            var momentDate = null;
            if (useUTC) {
              momentDate = moment.utc($element.val(), mask);
            } else {
              momentDate = moment($element.val(), mask);
            }
            $element.data('rawvalue', momentDate.toDate());
          });
          if ($element.data('initial-value')) {
            var initialValue = $element.data('initial-value');
            var momentDate = null;
            if (useUTC) {
              momentDate = moment.utc(initialValue);
            } else {
              momentDate = moment(initialValue);
            }
            $element.val(momentDate.format(mask));
            $element.data('initial-value', null);
          }

        }
        else
          $element.wrap("<div style=\"position:relative\"></div>");
        $element.datetimepicker(options);



        $element.on('dp.change', function () {
          if ($(this).is(":visible")) {
            $(this).trigger('change');
            scope.$apply(function () {
              var value = $element.val();
              var momentDate = null;
              if (useUTC) {
                momentDate = moment.utc(value, mask);
              } else {
                momentDate = moment(value, mask);
              }
              if (momentDate.isValid() && ngModelCtrl)
                ngModelCtrl.$setViewValue(momentDate.toDate());
            });
          }
        });

        if (ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            if (value) {
              var momentDate = null;

              if (useUTC) {
                momentDate = moment.utc(value);
              } else {
                momentDate = moment(value);
              }

              return momentDate.format(mask);
            }

            return null;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value) {
              var momentDate = null;
              if (useUTC) {
                momentDate = moment.utc(value, mask);
              } else {
                momentDate = moment(value, mask);
              }
              return momentDate.toDate();
            }

            return null;
          });
        }

      } else if (type == 'number' || type == 'money' || type == 'integer') {
        removeMask = true;
        textMask = false;

        var currency = mask.trim().replace(/\./g, '').replace(/\,/g, '').replace(/#/g, '').replace(/0/g, '').replace(/9/g, '');

        var prefix = '';
        var suffix = '';
        var thousands = '';
        var decimal = ',';
        var precision = 0;

        if (mask.startsWith(currency)) {
          prefix = currency;
        }

        else if (mask.endsWith(currency)) {
          suffix = currency;
        }

        var pureMask = mask.trim().replace(prefix, '').replace(suffix, '').trim();

        if (pureMask.startsWith("#.")) {
          thousands = '.';
        }
        else if (pureMask.startsWith("#,")) {
          thousands = ',';
        }

        var dMask = null;

        if (pureMask.indexOf(",0") != -1) {
          decimal = ',';
          dMask = ",0";
        }
        else if (pureMask.indexOf(".0") != -1) {
          decimal = '.';
          dMask = ".0";
        }

        if (dMask != null) {
          var strD = pureMask.substring(pureMask.indexOf(dMask) + 1);
          precision = strD.length;
        }


        var inputmaskType = 'numeric';

        if (precision == 0)
          inputmaskType = 'integer';

        var ipOptions = {
          'rightAlign':  (type == 'money'),
          'unmaskAsNumber': true,
          'allowMinus': true,
          'prefix': prefix,
          'suffix': suffix,
          'radixPoint': decimal,
          'digits': precision
        };

        if (thousands) {
          ipOptions['autoGroup'] = true;
          ipOptions['groupSeparator'] = thousands;
        }

        $(element).inputmask(inputmaskType, ipOptions);

        var unmaskedvalue = function() {
          $(this).data('rawvalue',$(this).inputmask('unmaskedvalue'));
        }
        $(element).on('keydown', unmaskedvalue).on('keyup', unmaskedvalue);

        if (ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            if (value != undefined && value != null && value != '') {
              return format(mask, value);
            }

            return null;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value != undefined && value != null && value != '') {
              var unmaskedvalue = $element.inputmask('unmaskedvalue');
              if (unmaskedvalue != '')
                return unmaskedvalue;
            }

            return null;
          });
        }

      }

      else if (type == 'text' || type == 'tel') {

        var options = {};
        if (attrs.maskPlaceholder) {
          options.placeholder = attrs.maskPlaceholder
        }

        $element.mask(mask, options);

        var unmaskedvalue = function() {
          if (removeMask)
            $(this).data('rawvalue',$(this).cleanVal());
        }
        $(element).on('keydown', unmaskedvalue).on('keyup', unmaskedvalue);

        if (removeMask && ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            if (value) {
              return $element.masked(value);
            }

            return null;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value) {
              return $element.cleanVal();
            }

            return null;
          });
        }
      }
      else {
        if ($element.attr('from-grid')) {
          var unmaskedvalue = function() {
            $(this).data('rawvalue',$(this).val());
          }
          $(element).on('keydown', unmaskedvalue).on('keyup', unmaskedvalue);
        }
      }
    }
  }
}

function parseMaskType(type, $translate) {
  if (type == "datetime" || type == "datetime-local") {
    type = $translate.instant('Format.DateTime');
    if (type == 'Format.DateTime')
      type = 'DD/MM/YYYY HH:mm:ss'
  }

  else if (type == "date") {
    type = $translate.instant('Format.Date');
    if (type == 'Format.Date')
      type = 'DD/MM/YYYY'
  }

  else if (type == "time" || type == "time-local") {
    type = $translate.instant('Format.Hour');
    if (type == 'Format.Hour')
      type = 'HH:mm:ss'
  }

  else if (type == "month") {
    type = 'MMMM';
  }

  else if (type == "number") {
    type = $translate.instant('Format.Decimal');
    if (type == 'Format.Decimal')
      type = '0,00'
  }

  else if (type == "money") {
    type = $translate.instant('Format.Money');
    if (type == 'Format.Money')
      type = '#.#00,00'
  }

  else if (type == "integer") {
    type = '0';
  }

  else if (type == "week") {
    type = 'dddd';
  }

  else if (type == "tel") {
    type = '(00) 00000-0000;0';
  }

  else if (type == "text") {
    type = '';
  }

  return type;
}