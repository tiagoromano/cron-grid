var cronappModules = [
  'ui.router',
  'ui.select',
  'ui-select-infinity',
  'ngResource',
  'ngSanitize',
  'custom.controllers',
  'custom.services',
  'datasourcejs',
  'chart.js',
  'ngJustGage',
  'pascalprecht.translate',
  'tmh.dynamicLocale',
  'ui-notification',
  'ui.bootstrap',
  'ngFileUpload',
  'report.services',
  'upload.services',
  'summernote',
  'ui.tinymce'
];

if (window.customModules) {
  cronappModules = cronappModules.concat(window.customModules);
}

var app = (function() {

  return angular.module('MyApp', cronappModules)
      .constant('LOCALES', {
        'locales': {
          'pt_br': 'Portugues (Brasil)',
          'en_us': 'English'
        },
        'preferredLocale': 'pt_br',
        'urlPrefix': ''
      })
      .config([
        '$httpProvider',
        function($httpProvider) {
          var interceptor = [
            '$q',
            '$rootScope',
            function($q, $rootScope) {
              var service = {
                'request': function(config) {
                  var _u = JSON.parse(localStorage.getItem('_u'));
                  if (_u && _u.token) {
                    config.headers['X-AUTH-TOKEN'] = _u.token;
                    window.uToken = _u.token;
                  }
                  return config;
                }
              };
              return service;
            }
          ];
          $httpProvider.interceptors.push(interceptor);
        }
      ])
      .config(function($stateProvider, $urlRouterProvider, NotificationProvider) {
        NotificationProvider.setOptions({
          delay: 5000,
          startTop: 20,
          startRight: 10,
          verticalSpacing: 20,
          horizontalSpacing: 20,
          positionX: 'right',
          positionY: 'top'
        });
        
        if (window.customStateProvider) {
          window.customStateProvider($stateProvider);
        }
        else {
        // Set up the states
          $stateProvider
            .state('login', {
              url: "",
              controller: 'LoginController',
              templateUrl: 'views/login.view.html'
            })

            .state('social', {
              url: "/connected",
              controller: 'SocialController',
              templateUrl: 'views/login.view.html'
            })

            .state('socialError', {
              url: "/notconnected",
              controller: 'SocialController',
              templateUrl: 'views/login.view.html'
            })

            .state('main', {
              url: "/",
              controller: 'LoginController',
              templateUrl: 'views/login.view.html'
            })

            .state('publicRoot', {
              url: "/public/{name:.*}",
              controller: 'PageController',
              templateUrl: function(urlattr) {
                return 'views/public/' + urlattr.name + '.view.html';
              }
            })

            .state('public', {
              url: "/home/public",
              controller: 'PublicController',
              templateUrl: function(urlattr) {
                return 'views/public/home.view.html';
              }
            })

            .state('public.pages', {
              url: "/{name:.*}",
              controller: 'PageController',
              templateUrl: function(urlattr) {
                return 'views/public/' + urlattr.name + '.view.html';
              }
            })

            .state('home', {
              url: "/home",
              controller: 'HomeController',
              templateUrl: 'views/logged/home.view.html'
            })

            .state('home.pages', {
              url: "/{name:.*}",
              controller: 'PageController',
              templateUrl: function(urlattr) {
                return 'views/' + urlattr.name + '.view.html';
              }
            })

            .state('404', {
              url: "/error/404",
              controller: 'PageController',
              templateUrl: function(urlattr) {
                return 'views/error/404.view.html';
              }
            })

            .state('403', {
              url: "/error/403",
              controller: 'PageController',
              templateUrl: function(urlattr) {
                return 'views/error/403.view.html';
              }
            });
        }

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/error/404");
      })
      .factory('originPath', ['$location', function($location) {  
        var originPath = {
            request: function(config) {
                config.headers['origin-path'] = $location.path();
                return config;
            }
        };
        return originPath;
      }])
    	.config(['$httpProvider', function($httpProvider) {  
    	    $httpProvider.interceptors.push('originPath');
      }])
      .config(function($translateProvider, tmhDynamicLocaleProvider) {

        $translateProvider.useMissingTranslationHandlerLog();

        $translateProvider.useStaticFilesLoader({
          files: [
            {
              prefix: 'i18n/locale_',
              suffix: '.json'
            },
            {
              prefix: 'plugins/cronapp-framework-js/i18n/locale_',
              suffix: '.json'
            }]
        });

        $translateProvider.registerAvailableLanguageKeys(
            ['pt_br', 'en_us'], {
              'en*': 'en_us',
              'pt*': 'pt_br',
              '*': 'pt_br'
            }
        );

        var locale = (window.navigator.userLanguage || window.navigator.language || 'pt_br').replace('-', '_');

        $translateProvider.use(locale.toLowerCase());
        $translateProvider.useSanitizeValueStrategy('escaped');

        tmhDynamicLocaleProvider.localeLocationPattern('plugins/angular-i18n/angular-locale_{{locale}}.js');

        if (moment)
          moment.locale(locale);
      })

      .directive('crnValue', ['$parse', function($parse) {
        return {
          restrict: 'A',
          require: '^ngModel',
          link: function(scope, element, attr, ngModel) {
            var evaluatedValue;
            if (attr.value) {
              evaluatedValue = attr.value;
            } else {
              evaluatedValue = $parse(attr.crnValue)(scope);
            }
            element.attr("data-evaluated", JSON.stringify(evaluatedValue));
            element.bind("click", function(event) {
              scope.$apply(function() {
                ngModel.$setViewValue(evaluatedValue);
              }.bind(element));
            });
          }
        };
      }])
      .decorator("$xhrFactory", [
        "$delegate", "$injector",
        function($delegate, $injector) {
          return function(method, url) {
            var xhr = $delegate(method, url);
            var $http = $injector.get("$http");
            var callConfig = $http.pendingRequests[$http.pendingRequests.length - 1];
            if (angular.isFunction(callConfig.onProgress))
              xhr.upload.addEventListener("progress",callConfig.onProgress);
            return xhr;
          };
        }
      ])
      // General controller
      .controller('PageController', function($controller, $scope, $stateParams, $location, $http, $rootScope, $translate) {
        app.registerEventsCronapi($scope, $translate);

        // save state params into scope
        $scope.params = $stateParams;
        $scope.$http = $http;

        // Query string params
        var queryStringParams = $location.search();
        for (var key in queryStringParams) {
          if (queryStringParams.hasOwnProperty(key)) {
            $scope.params[key] = queryStringParams[key];
          }
        }

        //Components personalization jquery
        $scope.registerComponentScripts = function() {
          //carousel slider
          $('.carousel-indicators li').on('click', function() {
            var currentCarousel = '#' + $(this).parent().parent().parent().attr('id');
            var index = $(currentCarousel + ' .carousel-indicators li').index(this);
            $(currentCarousel + ' #carousel-example-generic').carousel(index);
          });
        }

        $scope.registerComponentScripts();

        try { 
          var contextAfterPageController = $controller('AfterPageController', { $scope: $scope });  
          app.copyContext(contextAfterPageController, this, 'AfterPageController');
        } catch(e) {};
        try { if ($scope.blockly.events.afterPageRender) $scope.blockly.events.afterPageRender(); } catch(e) {};
      })

      .run(function($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function() {
          if (arguments.length >= 6) {
            var requestObj = arguments[5];
            if (requestObj.status === 404 || requestObj.status === 403) {
              $state.go(requestObj.status.toString());
            }
          } else {
            $state.go('404');
          }
        });
      });

}(window));

app.userEvents = {};

//Configuration
app.config = {};
app.config.datasourceApiVersion = 2;

app.bindScope = function($scope, obj) {
  var newObj = {};

  for (var x in obj) {
    // var name = parentName+'.'+x;
    // console.log(name);
    if (typeof obj[x] == 'string')
      newObj[x] = obj[x];
    else if (typeof obj[x] == 'function')
      newObj[x] = obj[x].bind($scope);
    else {
      newObj[x] = app.bindScope($scope, obj[x]);
    }
  }

  return newObj;
};

app.registerEventsCronapi = function($scope, $translate) {
  for (var x in app.userEvents)
    $scope[x] = app.userEvents[x].bind($scope);

  $scope.vars = {};

  try {
    if (cronapi) {
      $scope['cronapi'] = app.bindScope($scope, cronapi);
      $scope['cronapi'].$scope = $scope;
      $scope.safeApply = safeApply;
      if ($translate) {
        $scope['cronapi'].$translate = $translate;
      }
    }
  } catch (e) {
    console.info('Not loaded cronapi functions');
    console.info(e);
  }
  try {
    if (blockly)
      $scope['blockly'] = app.bindScope($scope, blockly);
  } catch (e) {
    console.info('Not loaded blockly functions');
    console.info(e);
  }
};

app.copyContext = function(fromContext, toContext, controllerName) {
	if (fromContext) {
  	for (var item in fromContext) {
  	  if (!toContext[item])
  	    toContext[item] = fromContext[item];
  	  else 
  	    toContext[item+controllerName] = fromContext[item];
  	}
	}
};

window.safeApply = function(fn) {
  var phase = this.$root.$$phase;
  if (phase == '$apply' || phase == '$digest') {
    if (fn && (typeof(fn) === 'function')) {
      fn();
    }
  } else {
    this.$apply(fn);
  }
};

app.kendoHelper = {
  generateId: function() {
    var numbersOnly = '0123456789';
    var result = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
    if (numbersOnly.indexOf(result.substr(0,1)) > -1)
      return this.generateId();
    return result;
  },
  getSchema: function(dataSource) {
    var parseAttribute = [
      { kendoType: "string", entityType: ["string", "character", "uuid", "guid"] },
      { kendoType: "number", entityType: ["integer", "long", "double", "int", "float", "bigdecimal", "single", "int32", "int64", "decimal"] },
      { kendoType: "date", entityType: ["date", "time", "datetime"] },
      { kendoType: "boolean", entityType: ["boolean"] }
    ];

    var parseType = function(type) {
      for (var i = 0; i < parseAttribute.length; i++) {
        if (parseAttribute[i].entityType.includes(type.toLocaleLowerCase()))
          return parseAttribute[i].kendoType;
      }
      return "string";
    };

    var schema = {
      model : {
        id : "__$id",
        fields: {}
      }
    };
    if (dataSource && dataSource.schemaFields) {
      dataSource.schemaFields.forEach(function(field) {
        schema.model.fields[field.name] = {
          type: parseType(field.type),
          editable: true,
          nullable: field.nullable,
          validation: { required: !field.nullable },
        }
      });
      schema.model.fields["__$id"] = {
        type: "string",
        editable: true,
        nullable: true,
        validation: { required: false }
      }
    }
    return schema;
  },
  getDataSource: function(dataSource, scope, allowPaging, pageCount, columns) {
    var schema = this.getSchema(dataSource);
    if (columns) {
      columns.forEach(function(c) {
        for (var key in schema.model.fields) {
          if (c.dataType == "Database" && c.field == key ) {
            schema.model.fields[key].nullable = !c.required;
            schema.model.fields[key].validation.required = c.required;
            break;
          }
        }
      });
    }

    var parseParameter = function(data) {
      for (var attr in data) {
        if (schema.model.fields.hasOwnProperty(attr)) {

          var schemaField = schema.model.fields[attr];
          if (schemaField.type == 'string' && data[attr] != undefined)
            data[attr] = data[attr] + "";
          else if (schemaField.type == 'number' && data[attr] != undefined)
            data[attr] = parseFloat(data[attr]);
          else if (schemaField.type == 'date' && data[attr] != undefined)
            data[attr] = '/Date('+data[attr].getTime()+')/';
          else if (schemaField.type == 'boolean') {
            if (data[attr] == undefined)
              data[attr] = false;
            else
              data[attr] = data[attr].toString().toLowerCase() == "true"?true:false;
          }

          //Significa que é o ID
          if (schema.model.id == attr) {
            //Se o mesmo for vazio, remover do data
            if (data[attr] != undefined && data[attr].toString().length == 0)
              delete data[attr];
          }
        }
      }
      return data;
    };

    var pageSize = 10;
    if (scope[dataSource.name])
      pageSize = scope[dataSource.name].rowsPerPage;

    //Quando não for data UTC
    var offsetMiliseconds = new Date().getTimezoneOffset() * 60000;
    function onRequestEnd(e) {
      if (e.response  && e.response.d ) {
        var items = null;
        if (e.response.d.results)
          items = e.response.d.results;
        else
          items = [e.response.d];

        if (this.group().length) {

          columns.forEach( function(c) {
            if (c.dataType == 'Database') {
              var notUseUTC = c.type == 'datetime-local' || c.type == 'month' || c.type == 'time-local' || c.type == 'week';
              if (notUseUTC) {
                for (var i = 0; i < items.length; i++) {
                  var gr = items[i];
                  if (c.field == gr.Member) {
                    gr.Key = gr.Key.replace(/\d+/,
                        function (n) { return parseInt(n) + offsetMiliseconds }
                    );
                  }
                  addOffset.bind(this)(gr.Items);
                }
              }
            }
          });
        } else {
          addOffset.bind(this)(items);
        }
      }
    }

    function addOffset(items) {
      for (var i = 0; i < items.length; i++) {
        if (columns) {
          columns.forEach( function(c) {
            if (c.dataType == 'Database') {
              var notUseUTC = c.type == 'datetime-local' || c.type == 'month' || c.type == 'time-local' || c.type == 'week';
              if (notUseUTC) {
                if (items[i][c.field]) {
                  items[i][c.field] = items[i][c.field].replace(/\d+/,
                      function (n) { return parseInt(n) + offsetMiliseconds }
                  );
                }
              }
            }
          });
        }

      }
    }

    var datasourceId = this.generateId();
    var datasource = {
      transport: {
        setActiveAndPost: function(e) {
          var cronappDatasource = this.options.cronappDatasource;
          scope.safeApply(cronappDatasource.updateActive(parseParameter(e.data)));
          cronappDatasource.active.__sender = datasourceId;
          cronappDatasource.postSilent(
              function(data) {
                this.options.enableAndSelect(e);
                e.success(data);
              }.bind(this),
              function(data) {
                this.options.enableAndSelect(e);
                e.error(data, data, data);
              }.bind(this)
          );
        },
        push: function(callback) {
          if (!this.options.dataSourceEventsPush && this.options.cronappDatasource) {
            this.options.dataSourceEventsPush = {
              create: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  var current = this.options.getCurrentCallbackForPush(callback, this.options.grid);
                  current.pushUpdate(data);
                }
                else
                  this.options.cronappDatasource.removeDataSourceEvents(this.options.dataSourceEventsPush);
              }.bind(this),
              update: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  var current = this.options.getCurrentCallbackForPush(callback, this.options.grid);
                  current.pushUpdate(data);
                }
                else
                  this.options.cronappDatasource.removeDataSourceEvents(this.options.dataSourceEventsPush);
              }.bind(this),
              delete: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  var current = this.options.getCurrentCallbackForPush(callback, this.options.grid);
                  current.pushDestroy(data);
                }
                else
                  this.options.cronappDatasource.removeDataSourceEvents(this.options.dataSourceEventsPush);
              }.bind(this),
              overRideRefresh: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  this.options.grid.dataSource.read();
                }
              }.bind(this),
              read: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  this.options.fromRead = true;
                  this.options.grid.dataSource.read();  
                }
              }.bind(this)
            };
            this.options.cronappDatasource.addDataSourceEvents(this.options.dataSourceEventsPush);
          }
        },
        read:  function (e) {
          
          var doFetch = false;
          try {
            var cronappDatasource = this.options.cronappDatasource;
            var grid = this.options.grid;

            if (!this.options.kendoCallback) {
              this.options.kendoCallback = e;
              doFetch = true;
              // e.success(cronappDatasource.data);
            } 
            else {
              if (this.options.fromRead) {
                this.options.kendoCallback.success(cronappDatasource.data);
              } 
              else {
                doFetch = true;
              }
            }
          } finally {
            this.options.fromRead = false;
          }

          if (doFetch) {
            for (key in e.data)
              if(e.data[key] == undefined)
                delete e.data[key];
            var paramsOData = kendo.data.transports.odata.parameterMap(e.data, 'read');
            var orderBy = '';

            if (this.options.grid) {
              this.options.grid.dataSource.group().forEach(function(group) {
                orderBy += group.field +" " + group.dir + ",";
              });
            }
            if (orderBy.length > 0) {
              orderBy = orderBy.substr(0, orderBy.length-1);
              if (paramsOData.$orderby)
                paramsOData.$orderby =  orderBy + "," + paramsOData.$orderby;
              else
                paramsOData.$orderby = orderBy;
            }

            var cronappDatasource = this.options.cronappDatasource;
            cronappDatasource.rowsPerPage = e.data.pageSize;
            cronappDatasource.offset = (e.data.page - 1);
            var fetchData = {};
            fetchData.params = paramsOData;
            cronappDatasource.fetch(fetchData, {
              success:  function(data) {
                e.success(data);
              },
              canceled:  function(data) {
                e.error("canceled", "canceled", "canceled");
              }
            });
          }

        },
        update: function(e) {
          this.setActiveAndPost(e);
        },
        create: function (e) {
          this.setActiveAndPost(e);
        },
        destroy: function(e) {
          cronappDatasource = this.options.cronappDatasource;
          cronappDatasource.removeSilent(e.data,
              function(data) {
                e.success(data);
              },
              function(data) {
                e.error("canceled", "canceled", "canceled");
              }
          );
        },
        batch: function (e) {
        },
        options: {
          fromRead: false,
          disableAndSelect: function(e) {
            if (this.isGridInDocument(this.grid)) {
              this.grid.select(e.container);
              this.grid.options.selectable = false;
              if (this.grid.selectable && this.grid.selectable.element) {
                this.grid.selectable.destroy();
                this.grid.selectable = null;
              }
            }
          },
          enableAndSelect: function(e) {
           if (this.isGridInDocument(this.grid)) {
              this.grid.options.selectable = "row";
              this.grid._selectable();
              this.grid.select(e.container);
            }
          },
          selectActiveInGrid: function(data) {
            //Verifica se já existe a grid
            if (this.isGridInDocument(this.grid)) {
              //Verifica se tem a opção selecionavel setada e se tem registros
              if (this.grid.selectable && this.grid.dataItems().length > 0) {
                //Se já existir o active setado, verifica se tem na grade
                if (this.cronappDatasource.active && this.cronappDatasource.active.__$id) {
                  var items = this.grid.dataItems();
                  var idxSelected = -1;
                  for (var idx = 0; idx < items.length; idx++) {
                    if (this.cronappDatasource.active.__$id == items[idx].__$id) {
                      idxSelected = idx;
                      break;
                    }
                  }
                  if (idxSelected >-1)
                    this.grid.select(this.grid.table.find('tr')[idxSelected]); 
                }
              }
            }
          },
          isGridInDocument: function(grid) {
            if (!grid) return false;
            //Verifica se a grade ainda existe
            return ($(document).has(grid.table[0]).length);
          },
          getCurrentCallbackForPush: function(callback, grid) {
            if (callback)
              return callback;
            return grid;
          },
          cronappDatasource: scope[dataSource.name]
        }
      },
      pageSize: pageSize,
      serverPaging: true,
      serverFiltering: true,
      serverSorting: true,
      batch: false,
      schema: schema,
      requestEnd: onRequestEnd
    };

    datasource.schema.total = function(){
      return datasource.transport.options.cronappDatasource.getRowsCount();
    };
    return datasource;
  },
  getConfigCombobox: function(options, scope) {
    var dataSource = {};
    
    var valuePrimitive = false;
    var dataSource = {};
    if (options && (!options.dynamic || options.dynamic=='false')) {
      valuePrimitive = true;
      options.dataValueField = 'key'; 
      options.dataTextField = 'value';
      dataSource.data = (options.staticDataSource == null ? undefined : options.staticDataSource);
    } else if (options.dataSource) {
      dataSource = app.kendoHelper.getDataSource(options.dataSource, scope);
      valuePrimitive = (options.valuePrimitive == null ? false : (typeof options.valuePrimitive == 'string' ? options.valuePrimitive == 'true' : options.valuePrimitive));
    }
    
    if (!options.dataValueField || options.dataValueField.trim() == '') {
      options.dataValueField = (options.dataTextField == null ? undefined : options.dataTextField);
    }
    
    var config = {
      dataTextField: (options.dataTextField == null ? undefined : options.dataTextField),
      dataValueField: (options.dataValueField == null ? undefined : options.dataValueField),
      dataSource: dataSource,
      headerTemplate: (options.headerTemplate == null ? undefined : options.headerTemplate),
      template: (options.template == null ? undefined : options.template),
      placeholder: (options.placeholder == null ? undefined : options.placeholder),
      footerTemplate: (options.footerTemplate == null ? undefined : options.footerTemplate),
      filter: (options.filter == null ? undefined : options.filter),
      valuePrimitive : valuePrimitive,
      optionLabel : (options.optionLabel == null ? undefined : options.optionLabel),
      valueTemplate : (options.valueTemplate == null ? undefined : options.valueTemplate),
      suggest: true
    };

    return config;
  },
  getConfigDate: function(translate, options) {
    var config = {};

    if (config) {
      var formatCulture = function(culture) {
        culture = culture.replace(/_/gm,'-');
        var parts = culture.split('-');
        parts[parts.length - 1] = parts[parts.length - 1].toUpperCase();
        return parts.join('-');
      }

      var formatKendoMask = function(mask) {
        if (mask) {
          mask = mask.replace(/:MM/gm,':mm');
          mask = mask.replace(/:M/gm,':m');
          mask = mask.replace(/S/gm,'s');
          mask = mask.replace(/D/gm,'d');
          mask = mask.replace(/Y/gm,'y');
        }

        return mask;
      }

      var formatMomentMask = function(type, mask) {
        if (mask == null) {
          mask = parseMaskType(type, translate)
        }
        
        return mask;
      }

      var animation = {};
      if (options.animation) {
        try {
          animation = JSON.parse(options.animation);
        } catch(err) {
          console.log('DateAnimation invalid configuration! ' + err);
        }
      }

      var momentFormat = formatMomentMask(options.type, options.format);
      var format = formatKendoMask(momentFormat);
      
      var timeFormat = formatKendoMask(options.timeFormat);
      var culture = formatCulture(translate.use());
      
      config = {
        value: null,
        format: format,
        timeFormat: timeFormat,
        momentFormat: momentFormat,
        culture: culture,
        type: (options.type == null ? undefined : options.type),
        weekNumber: (options.weekNumber  == null ? undefined : options.weekNumber),
        dateInput: (options.dateInput == null ? undefined : options.dateInput),
        animation: animation,
        footer: (options.footer == null ? undefined : options.footer),
        start: (options.start == null ? undefined : options.start),
        depth: (options.start == null ? undefined : options.start)
      }
    }

    return config;
  },
  buildKendoMomentPicker : function($element, options, scope, ngModelCtrl) {
    var useUTC = options.type == 'date' || options.type == 'datetime' || options.type == 'time';
    
    if (!$element.attr('from-grid')) {
      var onChange = function() {
        var value = $element.val();
        if (!value || value.trim() == '') {
        if (ngModelCtrl)
            ngModelCtrl.$setViewValue('');
        } else {
          var momentDate = null;
  
          if (useUTC) {
            momentDate = moment.utc(value, options.momentFormat);
          } else {
            momentDate = moment(value, options.momentFormat);
          }
  
          if (ngModelCtrl && momentDate.isValid()) {
            ngModelCtrl.$setViewValue(momentDate.toDate());
            $element.data('changed', true);
          }
        }
      }

      if (scope) {
        options['change'] = function() {
          scope.$apply(function () {
            onChange();
          });
        };
      } else {
        options['change'] = onChange;
      }  
    }
    
    
    if (options.type == 'date') {
      return $element.kendoDatePicker(options).data('kendoDatePicker'); 
    } else if (options.type == 'datetime' || options.type == 'datetime-local') {
      return $element.kendoDateTimePicker(options).data('kendoDateTimePicker'); 
    } else if (options.type == 'time' || options.type == 'time-local') {
      return $element.kendoTimePicker(options).data('kendoTimePicker'); 
    }
  },
  getConfigSlider: function(options) {
    var config = {
      increaseButtonTitle: options.increaseButtonTitle,
      decreaseButtonTitle: options.decreaseButtonTitle,
      dragHandleTitle: options.dragHandleTitle
    }

    try {
      config['min'] = options.min ? parseInt(options.min) : 1;
      config['max'] = options.max ? parseInt(options.max) : 1;
      config['smallStep'] = options.smallStep ? parseInt(options.smallStep) : 1;
      config['largeStep'] = options.largeStep ? parseInt(options.largeStep) : 1;      
    } catch(err) {
      console.log('Slider invalid configuration! ' + err);
    }

    return config;
  },
  getConfigSwitch: function(options) {
    var config = {
      onLabel: (options.onLabel == null ? undefined : options.onLabel),
      offLabel: (options.offLabel == null ? undefined : options.offLabel)
    }

    return config;
  },
  getConfigBarcode: function(options) {
    var config = {
      type: (options.type == null ? undefined : options.type),
      width: (options.width == null ? undefined : parseInt(options.width)),
      height: (options.height == null ? undefined : parseInt(options.height))
    }
    
    if (!config.type) {
      config.type = 'EAN8';
    }

    return config;
  },
  getConfigQrcode: function(options) {
    var config = {
      errorCorrection: (options.errorCorrection == null ? undefined : options.errorCorrection),
      size: (options.size == null ? undefined : parseInt(options.size)),
      color: (options.color == null ? undefined : options.color)
    }
    
    if (options.borderColor || options.borderSize) {
      config['border'] = {
        size: (options.size == null ? undefined : parseInt(options.size)),
        color: (options.color == null ? undefined : options.color)
      }
    }

    return config;
  }
};