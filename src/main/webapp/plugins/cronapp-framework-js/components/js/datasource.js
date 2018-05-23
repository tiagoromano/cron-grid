angular.module('datasourcejs', [])

/**
 * Global factory responsible for managing all datasets
 */
    .factory('DatasetManager', ['$http', '$q', '$timeout', '$rootScope', '$window', 'Notification', function($http, $q, $timeout, $rootScope, $window, Notification) {
      // Global dataset List
      this.datasets = {};

      /**
       * Class representing a single dataset
       */
      var DataSet = function(name, scope) {

        var NO_IMAGE_UPLOAD = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4IiB2aWV3Qm94PSIwIDAgNDQuNTAyIDQ0LjUwMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQuNTAyIDQ0LjUwMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik05Ljg2MiwzNS42MzhoMjQuNzc5YzAtNS41NDYtMy44NjMtMTAuMjAzLTkuMTEzLTExLjYwNGMyLjc1LTEuMjQ4LDQuNjY4LTQuMDEzLDQuNjY4LTcuMjI5ICAgIGMwLTQuMzg4LTMuNTU5LTcuOTQyLTcuOTQyLTcuOTQyYy00LjM4NywwLTcuOTQzLDMuNTU3LTcuOTQzLDcuOTQyYzAsMy4yMTksMS45MTYsNS45OCw0LjY2OCw3LjIyOSAgICBDMTMuNzI1LDI1LjQzNSw5Ljg2MiwzMC4wOTIsOS44NjIsMzUuNjM4eiIgZmlsbD0iIzkxOTE5MSIvPgoJCTxwYXRoIGQ9Ik0xLjUsMTQuMTY5YzAuODI4LDAsMS41LTAuNjcyLDEuNS0xLjVWNC4zMzNoOC4zMzZjMC44MjgsMCwxLjUtMC42NzIsMS41LTEuNWMwLTAuODI4LTAuNjcyLTEuNS0xLjUtMS41SDIuNzc1ICAgIEMxLjI0NCwxLjMzMywwLDIuNTc3LDAsNC4xMDh2OC41NjFDMCwxMy40OTcsMC42NywxNC4xNjksMS41LDE0LjE2OXoiIGZpbGw9IiM5MTkxOTEiLz4KCQk8cGF0aCBkPSJNNDEuNzI3LDEuMzMzaC04LjU2MmMtMC44MjcsMC0xLjUsMC42NzItMS41LDEuNWMwLDAuODI4LDAuNjczLDEuNSwxLjUsMS41aDguMzM2djguMzM2YzAsMC44MjgsMC42NzMsMS41LDEuNSwxLjUgICAgczEuNS0wLjY3MiwxLjUtMS41di04LjU2QzQ0LjUwMiwyLjU3OSw0My4yNTYsMS4zMzMsNDEuNzI3LDEuMzMzeiIgZmlsbD0iIzkxOTE5MSIvPgoJCTxwYXRoIGQ9Ik00My4wMDIsMzAuMzMzYy0wLjgyOCwwLTEuNSwwLjY3Mi0xLjUsMS41djguMzM2aC04LjMzNmMtMC44MjgsMC0xLjUsMC42NzItMS41LDEuNXMwLjY3MiwxLjUsMS41LDEuNWg4LjU2ICAgIGMxLjUzLDAsMi43NzYtMS4yNDYsMi43NzYtMi43NzZ2LTguNTZDNDQuNTAyLDMxLjAwNSw0My44MywzMC4zMzMsNDMuMDAyLDMwLjMzM3oiIGZpbGw9IiM5MTkxOTEiLz4KCQk8cGF0aCBkPSJNMTEuMzM2LDQwLjE2OUgzdi04LjMzNmMwLTAuODI4LTAuNjcyLTEuNS0xLjUtMS41Yy0wLjgzLDAtMS41LDAuNjcyLTEuNSwxLjV2OC41NmMwLDEuNTMsMS4yNDQsMi43NzYsMi43NzUsMi43NzZoOC41NjEgICAgYzAuODI4LDAsMS41LTAuNjcyLDEuNS0xLjVTMTIuMTY1LDQwLjE2OSwxMS4zMzYsNDAuMTY5eiIgZmlsbD0iIzkxOTE5MSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";

        var NO_FILE_UPLOAD = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTQ4LjE3NiA1NDguMTc2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NDguMTc2IDU0OC4xNzY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNNTI0LjMyNiwyOTcuMzUyYy0xNS44OTYtMTkuODktMzYuMjEtMzIuNzgyLTYwLjk1OS0zOC42ODRjNy44MS0xMS44LDExLjcwNC0yNC45MzQsMTEuNzA0LTM5LjM5OSAgIGMwLTIwLjE3Ny03LjEzOS0zNy40MDEtMjEuNDA5LTUxLjY3OGMtMTQuMjczLTE0LjI3Mi0zMS40OTgtMjEuNDExLTUxLjY3NS0yMS40MTFjLTE4LjA4MywwLTMzLjg3OSw1LjkwMS00Ny4zOSwxNy43MDMgICBjLTExLjIyNS0yNy40MS0yOS4xNzEtNDkuMzkzLTUzLjgxNy02NS45NWMtMjQuNjQ2LTE2LjU2Mi01MS44MTgtMjQuODQyLTgxLjUxNC0yNC44NDJjLTQwLjM0OSwwLTc0LjgwMiwxNC4yNzktMTAzLjM1Myw0Mi44MyAgIGMtMjguNTUzLDI4LjU0NC00Mi44MjUsNjIuOTk5LTQyLjgyNSwxMDMuMzUxYzAsMi40NzQsMC4xOTEsNi41NjcsMC41NzEsMTIuMjc1Yy0yMi40NTksMTAuNDY5LTQwLjM0OSwyNi4xNzEtNTMuNjc2LDQ3LjEwNiAgIEM2LjY2MSwyOTkuNTk0LDAsMzIyLjQzLDAsMzQ3LjE3OWMwLDM1LjIxNCwxMi41MTcsNjUuMzI5LDM3LjU0NCw5MC4zNThjMjUuMDI4LDI1LjAzNyw1NS4xNSwzNy41NDgsOTAuMzYyLDM3LjU0OGgzMTAuNjM2ICAgYzMwLjI1OSwwLDU2LjA5Ni0xMC43MTEsNzcuNTEyLTMyLjEyYzIxLjQxMy0yMS40MDksMzIuMTIxLTQ3LjI0NiwzMi4xMjEtNzcuNTE2QzU0OC4xNzIsMzM5Ljk0NCw1NDAuMjIzLDMxNy4yNDgsNTI0LjMyNiwyOTcuMzUyICAgeiBNMzYyLjcyOSwyODkuNjQ4Yy0xLjgxMywxLjgwNC0zLjk0OSwyLjcwNy02LjQyLDIuNzA3aC02My45NTN2MTAwLjUwMmMwLDIuNDcxLTAuOTAzLDQuNjEzLTIuNzExLDYuNDIgICBjLTEuODEzLDEuODEzLTMuOTQ5LDIuNzExLTYuNDIsMi43MTFoLTU0LjgyNmMtMi40NzQsMC00LjYxNS0wLjg5Ny02LjQyMy0yLjcxMWMtMS44MDQtMS44MDctMi43MTItMy45NDktMi43MTItNi40MlYyOTIuMzU1ICAgSDE1NS4zMWMtMi42NjIsMC00Ljg1My0wLjg1NS02LjU2My0yLjU2M2MtMS43MTMtMS43MTQtMi41NjgtMy45MDQtMi41NjgtNi41NjZjMC0yLjI4NiwwLjk1LTQuNTcyLDIuODUyLTYuODU1bDEwMC4yMTMtMTAwLjIxICAgYzEuNzEzLTEuNzE0LDMuOTAzLTIuNTcsNi41NjctMi41N2MyLjY2NiwwLDQuODU2LDAuODU2LDYuNTY3LDIuNTdsMTAwLjQ5OSwxMDAuNDk1YzEuNzE0LDEuNzEyLDIuNTYyLDMuOTAxLDIuNTYyLDYuNTcxICAgQzM2NS40MzgsMjg1LjY5NiwzNjQuNTM1LDI4Ny44NDUsMzYyLjcyOSwyODkuNjQ4eiIgZmlsbD0iI2NlY2VjZSIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";

        // Publiic members
        this.Notification = Notification;
        this.$scope = scope;
        this.noImageUpload = NO_IMAGE_UPLOAD;
        this.noFileUpload = NO_FILE_UPLOAD;

        this.$apply = function(fc) {
          scope.$apply(fc);
        }.bind(scope);

        this.columns = [];
        this.data = [];
        this.name = name;
        this.keys = [];
        this.enabled = true;
        this.endpoint = null;
        this.active = {};
        this.inserting = false;
        this.editing = false;
        this.fetchSize = 2;
        this.observers = [];
        this.rowsPerPage = null;
        this.append = true;
        this.headers = null;
        this.responseHeaders = null;
        this._activeValues = null;
        this.errorMessage = "";
        this.onError = null;
        this.links = null;
        this.loadedFinish = null;
        this.lastFilterParsed = null;

        this.busy = false;
        this.cursor = 0;
        this._savedProps;
        this.hasMoreResults = false;
        this.loaded = false;
        this.unregisterDataWatch = null;
        this.dependentBufferLazyPostData = null; //TRM
        this.lastAction = null; //TRM
        this.dependentData = null; //TRM
		this.caseInsensitive = null;
        this.terms = null;
        var _self = this;
        var service = null;

        // Public methods

        /**
         * Initialize a single datasource
         */
        this.init = function() {

          var dsScope = this;

          // Get the service resource
          service = {
            save: function(object) {
              return this.call(_self.entity, "POST", object, true);
            },
            update: function(url, object) {
              return this.call(url, "PUT", object, false);
            },
            remove: function(url) {
              return this.call(url, "DELETE", null, true);
            },
            call: function(url, verb, obj, applyScope) {
              var object = {};
              var isCronapiQuery = (url.indexOf('/cronapi/query/') >= 0);

              if (isCronapiQuery) {
                object.inputs = [obj];

                var fields = {};

                var _callback;
                this.busy = true;
                url = url.replace('/specificSearch', '');
                url = url.replace('/generalSearch', '');

                if (_self && _self.$scope && _self.$scope.vars) {
                  fields["vars"] = {};
                  for (var attr in _self.$scope.vars) {
                    fields.vars[attr] = _self.$scope.vars[attr];
                  }
                }

                for (var key in _self.$scope) {
                  if (_self.$scope[key] && _self.$scope[key].constructor && _self.$scope[key].constructor.name == "DataSet") {
                    fields[key] = {};
                    fields[key].active = _self.$scope[key].active;
                  }
                }

                object.fields = fields;
              } else {
                object = obj;
              }

              // Get an ajax promise
              this.$promise = $http({
                method: verb,
                url: (window.hostApp || "") + url,
                data: (object) ? JSON.stringify(object) : null,
                headers: _self.headers
              }).success(function(data, status, headers, config) {
                this.busy = false;
                if (_callback) _callback(isCronapiQuery?data.value:data);
                if (isCronapiQuery) {
                  _self.$scope.cronapi.evalInContext(JSON.stringify(data));
                }
              }).error(function(data, status, headers, config) {
                this.busy = false;
                _self.handleError(isCronapiQuery&&data.value?data.value:data);
              });

              this.$promise.then = function(callback) {
                _callback = callback;
              }
              return this;
            }
          }

          /**
           * Check if the datasource is waiting for any request response
           */
          this.isBusy = function() {
            return this.busy;
          }

          /**
           * Check if the datasource was loaded by service
           */
          this.isLoaded = function() {
            return this.loaded;
          }

          this.toString = function() {
            return "[Datasource]"
          }

          this.handleAfterCallBack = function(callBackFunction) {
            if (callBackFunction) {
              try {
                var indexFunc = callBackFunction.indexOf('(') == -1 ? callBackFunction.length : callBackFunction.indexOf('(');
                var func = eval(callBackFunction.substring(0, indexFunc));
                var isFunc = typeof(func) === 'function';
                if (isFunc) func.call(this, this);
              } catch (e) {
                this.handleError(e);
              }
            }
          }

          this.handleBeforeCallBack = function(callBackFunction) {
            var isValid = true;
            if (callBackFunction) {
              try {
                var indexFunc = callBackFunction.indexOf('(') == -1 ? callBackFunction.length : callBackFunction.indexOf('(');
                var func = eval(callBackFunction.substring(0, indexFunc));
                var isFunc = typeof(func) === 'function';
                if (isFunc) func.call(this, this.active);
              } catch (e) {
                isValid = false;
                this.handleError(e);
              }
            }
            return isValid;
          }

          /**
           * Error Handler function
           */
          this.handleError = function(data) {
            console.log(data);

            var error = "";

            if (data) {
              if (Object.prototype.toString.call(data) === "[object String]") {
                error = data;
              } else {
                var errorMsg = (data.msg || data.desc || data.message || data.error || data.responseText);
                if (errorMsg) {
                  error = errorMsg;
                }
              }
            }

            if (!error) {
              error = this.defaultNotSpecifiedErrorMessage;
            }

            var regex = /<h1>(.*)<\/h1>/gmi;
            result = regex.exec(error);

            if (result && result.length >= 2) {
              error = result[1];
            }

            this.errorMessage = error;

            if (this.onError && this.onError != '') {
              if (typeof(this.onError) === 'string') {
                try {
                  var indexFunc = this.onError.indexOf('(') == -1 ? this.onError.length : this.onError.indexOf('(');
                  var func = eval(this.onError.substring(0, indexFunc));
                  if (typeof(func) === 'function') {
                    this.onError = func;
                  }
                } catch (e) {
                  isValid = false;
                  Notification.error(e);
                }
              }
            } else {
              this.onError = function(error) {
                Notification.error(error);
              };
            }

            this.onError.call(this, error);
          }

          // Start watching for changes in activeRow to notify observers
          if (this.observers && this.observers.length > 0) {
            $rootScope.$watch(function() {
              return this.active;
            }.bind(this), function(activeRow) {
              if (activeRow) {
                this.notifyObservers(activeRow);
              }
            }.bind(this), true);
          }
        }

        //Public methods

        this.setFile = function($file, object, field) {
          if ($file && $file.$error === 'pattern') {
            return;
          }
          if ($file) {
            toBase64($file, function(base64Data) {
              this.$apply = function(value) {
                object[field] = value;
                scope.$apply(object);
              }.bind(scope);
              this.$apply(base64Data);
            });
          }
        };

        this.downloadFile = function(field, keys) {
          if (keys === undefined)
            return;
          var url = (window.hostApp || "") + this.entity + "/download/" + field;
          for (var index = 0; index < keys.length; index++) {
            url += "/" + keys[index];
          }
          var req = {
            url: url,
            method: 'GET',
            responseType: 'arraybuffer'
          };
          $http(req).then(function(result) {
            var blob = new Blob([result.data], {
              type: 'application/*'
            });
            $window.open(URL.createObjectURL(blob));
          });
        };

        function toBase64(file, cb) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            var base64Data = e.target.result.substr(e.target.result.indexOf('base64,') + 'base64,'.length);
            cb(base64Data);
          };
        }

        this.openImage = function(data) {
          if (data.indexOf('https://') == -1 && data.indexOf('http://') == -1)  {
            var  value = 'data:image/png;base64,' + data;
            var w = $window.open("", '_blank', 'height=300,width=400');
            w.document.write('<img src="'+ value + '"/>');
          } else {
            $window.open(data, '_blank', 'height=300,width=400');
          }
        };

        this.byteSize = function(base64String) {
          if (!angular.isString(base64String)) {
            return '';
          }

          function endsWith(suffix, str) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
          }

          function paddingSize(base64String) {
            if (endsWith('==', base64String)) {
              return 2;
            }
            if (endsWith('=', base64String)) {
              return 1;
            }
            return 0;
          }

          function size(base64String) {
            return base64String.length / 4 * 3 - paddingSize(base64String);
          }

          function formatAsBytes(size) {
            return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes';
          }

          return formatAsBytes(size(base64String));
        };

        /**
         * Append a new value to the end of this dataset.
         */
        this.insert = function(obj, callback) {
          if (this.handleBeforeCallBack(this.onBeforeCreate)) {
            //Check if contains dependentBy, if contains, only store in data TRM
            if (this.dependentLazyPost && this.dependentLazyPostField && (eval(this.dependentLazyPost).inserting || eval(this.dependentLazyPost).editing)) {
              var random = Math.floor(Math.random() * 9999) + 1;
              obj.tempBufferId = random;

              if (callback)
                callback(obj);

              if (!this.dependentBufferLazyPostData)
                this.dependentBufferLazyPostData = [];

              this.dependentBufferLazyPostData.push(obj);
            } else {
              service.save(obj).$promise.then(callback);
            }
          }
        };

        //Public methods

        /**
         * Append a datasource to be notify when has a post or cancel
         */
        this.addDependentData = function(obj) {
          if (!this.dependentData)
            this.dependentData = [];
          this.dependentData.push(obj);
        }

        //TRM
        this.storeAndResetDependentBuffer = function(action) {
          var thisContextDataSet = this;
          if (action == 'post' && thisContextDataSet.dependentBufferLazyPostData) {

            $(thisContextDataSet.dependentBufferLazyPostData).each(function() {
              this[thisContextDataSet.dependentLazyPostField] = eval(thisContextDataSet.dependentLazyPost).active;

              if (thisContextDataSet.entity.indexOf('//') > -1) {
                var keyObj = this.getKeyValues(eval(thisContextDataSet.dependentLazyPost).active);
                var suffixPath = '';
                for (var key in keyObj) {
                  if (keyObj.hasOwnProperty(key)) {
                    suffixPath += '/' + keyObj[key];
                  }
                }
                suffixPath += '/';
                thisContextDataSet.entity = thisContextDataSet.entity.replace('//', suffixPath);
              }

              thisContextDataSet.insert(this);
            });
            this.busy = false;
            this.editing = false;
            this.inserting = false;
          } else {
            var indexObj = 0;
            while (indexObj > -1) {
              indexObj = -1;
              for (var i = 0; i < thisContextDataSet.data.length; i++) {
                if (thisContextDataSet.data[i].tempBufferId) {
                  indexObj = i;
                  break;
                }
              }
              if (indexObj > -1)
                thisContextDataSet.data.splice(indexObj, 1);
            }
          }

          thisContextDataSet.dependentBufferLazyPostData = null;
        }

        //TRM

        /**
         * Find object in list by tempBufferId
         */
        this.getIndexOfListTempBuffer = function(list, obj) {
          var indexObj = -1;
          for (var i = 0; i < list.length; i++) {
            if (list[i].tempBufferId && obj.tempBufferId && list[i].tempBufferId == obj.tempBufferId) {
              indexObj = i;
              break;
            }
          }
          return indexObj;
        }

        /**
         * Uptade a value into this dataset by using the dataset key to compare the objects.
         */
        this.update = function(obj, callback) {

          // Get the keys values
          var keyObj = this.getKeyValues(obj);

          //TRM
          if (this.dependentBufferLazyPostData && obj.tempBufferId) {
            var indexObj = this.getIndexOfListTempBuffer(this.dependentBufferLazyPostData, obj);

            if (indexObj > -1) {
              this.dependentBufferLazyPostData.splice(indexObj, 1);
              this.dependentBufferLazyPostData.push(obj);
              indexObj = this.getIndexOfListTempBuffer(this.data, obj);
              this.data.splice(indexObj, 1);
              //this.data.push(obj);
              this.data.splice(indexObj, 0, obj);
              return;
            }
          }

          var url = this.entity;

          var suffixPath = "";
          for (var key in keyObj) {
            if (keyObj.hasOwnProperty(key)) {
              suffixPath += "/" + keyObj[key];
            }
          }

          if (!this.dependentLazyPost)
            url = url + suffixPath;

          if (this.handleBeforeCallBack(this.onBeforeUpdate)) {
            service.update(url, obj).$promise.then(callback);
          }
        };

        /**
         * Valid if required field is valid
         */
        this.missingRequiredField = function() {
          return $('[required][ng-model*="' + this.name + '."]').hasClass('ng-invalid-required') || $('[ng-model*="' + this.name + '."]').hasClass('ng-invalid') ||
              $('[required][ng-model*="' + this.name + '."]').hasClass('ng-empty')  || $('[valid][ng-model*="' + this.name + '."]').hasClass('ng-empty');
        }

        /**
         * Valid is other validations like email, date and so on
         */
        this.hasInvalidField = function() {
          return $('input[ng-model*="' + this.name + '."]:invalid').size() > 0;
        };

        /**
         * Insert or update based on the the datasource state
         */
        this.post = function() {

          if (this.missingRequiredField())
            return;

          if (this.hasInvalidField())
            return;

          this.lastAction = "post"; //TRM

          this.busy = true;

          if (this.inserting) {
            // Make a new request to persist the new item
            this.insert(this.active, function(obj) {
              // In case of success add the new inserted value at
              // the end of the array
              this.data.push(obj);
              // The new object is now the active
              this.active = obj;
              this.handleAfterCallBack(this.onAfterCreate);
              this.onBackNomalState();

              if (this.dependentData) {
                $(this.dependentData).each(function() {
                  this.storeAndResetDependentBuffer('post');
                });
              }

            }.bind(this));

          } else if (this.editing) {
            // Make a new request to update the modified item
            this.update(this.active, function(obj) {
              // Get the list of keys
              var keyObj = this.getKeyValues(obj);

              // For each row data
              this.data.forEach(function(currentRow) {
                // Iterate all keys checking if the
                // current object match with the
                // extracted key values
                var found;
                var dataKeys = this.getKeyValues(currentRow);
                for (var key in keyObj) {
                  if (dataKeys[key] && dataKeys[key] === keyObj[key]) {
                    found = true;
                  } else {
                    found = false;
                    break;
                  }
                }

                if (found) {
                  this.copy(obj, currentRow);
                  this.active = currentRow;
                }

                this.handleAfterCallBack(this.onAfterUpdate);
              }.bind(this));

              this.onBackNomalState();

              if (this.dependentData) {
                $(this.dependentData).each(function() {
                  this.storeAndResetDependentBuffer('post');
                });
              }

            }.bind(this));
          }
        };

        this.refreshActive = function() {
          if (this.active) {
            var keyObj = this.getKeyValues(this.active);
            var url = this.entity;
            url += (this.entity.endsWith('/')) ? '' : '/';
            for (var key in keyObj) {
              url += this.active[key] + '/';
            }

            this.$promise = $http({
              method: "GET",
              url: url,
              headers: this.headers
            }).success(function(rows, status, headers, config) {
              var row = null;
              if (rows && rows.length > 0)
                row = rows[0];

              var indexFound = -1;
              var i = 0;
              this.active = row;
              this.data.forEach(function(currentRow) {
                var found = false;
                var idsFound = 0;
                var idsTotal = 0;
                for (var key in keyObj) {
                  idsTotal++;
                  if (currentRow[key] && currentRow[key] === keyObj[key]) {
                    idsFound++;
                  }
                }
                if (idsFound == idsTotal)
                  found = true;

                if (found) {
                  indexFound = i;
                  if (row)
                    this.copy(row, currentRow);
                }
                i++;
              }.bind(this));

              //Atualizou e o registro deixou de existir, remove da lista
              if (indexFound > -1 && !row) {
                this.data.splice(indexFound, 1);
              }

            }.bind(this)).error(function(data, status, headers, config) {
              return;
            }.bind(this));
          }

        };

        this.getColumn = function(index) {
          var returnValue = [];
          $.each(this.data, function(key, value) {
            returnValue.push(value[index]);
          });
          return returnValue;
        };

        // Set this datasource back to the normal state
        this.onBackNomalState = function() {
          this.busy = false;
          this.editing = false;
          this.inserting = false;
        };

        /**
         * Cancel the editing or inserting state
         */
        this.cancel = function() {
          if (this.inserting) {
            if (this.cursor >= 0)
              this.active = this.data[this.cursor];
            else
              this.active = {};
          }
          if (this.editing) {
            this.active = this.lastActive;
          }
          this.onBackNomalState();
          this.lastAction = "cancel"; //TRM
          if (this.dependentData) {
            $(this.dependentData).each(function() {
              this.storeAndResetDependentBuffer();
            });
          }
        };


        this.retrieveDefaultValues = function() {
          if (this.entity.indexOf('cronapi') >= 0) {
            // Get an ajax promise
            var url = this.entity;
            url += (this.entity.endsWith('/')) ? '__new__' : '/__new__';
            this.$promise = $http({
              method: "GET",
              url: url,
              headers: this.headers
            }).success(function(data, status, headers, config) {
              this.active = data;
            }.bind(this)).error(function(data, status, headers, config) {
              this.active = {};
            }.bind(this));
          } else {
            this.active = {};
          }
        };

        /**
         * Put the datasource into the inserting state
         */
        this.startInserting = function() {
          this.inserting = true;
          this.retrieveDefaultValues();
          if (this.onStartInserting) {
            this.onStartInserting();
          }
          
          this.active = { id: "-1"};
        };

        /**
         * Put the datasource into the editing state
         */
        this.startEditing = function(item) {
          if (item) {
            this.active = this.copy(item);
            this.lastActive = item;
          } else {
            this.lastActive = this.active;
            this.active = this.copy(this.active);
          }
          this.editing = true;
        };

        /**
         * Remove an object from this dataset by using the given id.
         * the objects
         */
        this.remove = function(object, callback) {

          this.busy = true;

          var _remove = function(object, callback) {
            if (!object) {
              object = this.active;
            }

            var keyObj = this.getKeyValues(object);

            //TRM
            if (this.dependentBufferLazyPostData) {
              if (this.dependentBufferLazyPostData.indexOf(object) > -1) {
                var indexObj = this.dependentBufferLazyPostData.indexOf(object);
                this.dependentBufferLazyPostData.splice(indexObj, 1);
                indexObj = this.data.indexOf(object);
                if (indexObj > -1)
                  this.data.splice(indexObj, 1);
                return;
              }
            }

            var suffixPath = "";
            for (var key in keyObj) {
              if (keyObj.hasOwnProperty(key)) {
                suffixPath += "/" + keyObj[key];
              }
            }

            callback = callback || function() {
              // For each row data
              for (var i = 0; i < this.data.length; i++) {
                // current object match with the same
                // vey values
                // Iterate all keys checking if the
                var dataKeys = this.getKeyValues(this.data[i]);
                // Check all keys
                var found;
                for (var key in keyObj) {
                  if (keyObj.hasOwnProperty(key)) {
                    if (dataKeys[key] && dataKeys[key] === keyObj[key]) {
                      found = true;
                    } else {
                      // There's a difference between the current object
                      // and the key values extracted from the object
                      // that we want to remove
                      found = false;
                      break;
                    }
                  }
                }

                if (found) {
                  // If it's the object we're loking for
                  // remove it from the array
                  this.data.splice(i, 1)
                  this.active = (i > 0) ? this.data[i - 1] : null;
                }

                this.onBackNomalState();
              }
              this.handleAfterCallBack(this.onAfterDelete);
            }.bind(this)

            if (this.handleBeforeCallBack(this.onBeforeDelete)) {
              service.remove(this.entity + suffixPath).$promise.then(callback);
            }
          }.bind(this);

          if (this.deleteMessage && this.deleteMessage.length > 0) {
            if (confirm(this.deleteMessage)) {
              _remove(object, callback);
            } else {
              this.filter();
            }
          } else {
            _remove(object, callback);
          }
        };

        /**
         * Get the object keys values from the datasource keylist
         * PRIVATE FUNCTION
         */
        this.getKeyValues = function(rowData) {
          var keys = this.keys;

          var keyValues = {};
          for (var i = 0; i < this.keys.length; i++) {
            var key = this.keys[i];
            var rowKey = null;
            try {
              rowKey = eval("rowData."+key);
            } catch(e){
              //
            }
            keyValues[key] = rowKey;
          }

          return keyValues;
        }.bind(this);

        /**
         * Check if two objects are equals by comparing their keys PRIVATE FUNCTION.
         */
        this.objectIsEquals = function(object1, object2) {
          var keys1 = this.getKeyValues(object1);
          var keys2 = this.getKeyValues(object2);
          for (var key in keys1) {
            if (keys1.hasOwnProperty(key)) {
              if (!keys2.hasOwnProperty(key)) return false;
              if (keys1[key] !== keys2[key]) return false;
            }
          }
          return true;
        }

        /**
         * Check if the object has more itens to iterate
         */
        this.hasNext = function() {
          return this.data && (this.cursor < this.data.length - 1);
        };

        /**
         * Check if the cursor is not at the beginning of the datasource
         */
        this.hasPrevious = function() {
          return this.data && (this.cursor > 0);
        };

        /**
         * Check if the object has more itens to iterate
         */
        this.order = function(order) {
          this._savedProps.order = order;
        };

        /**
         * Get the values of the active row as an array.
         * This method will ignore any keys and only return the values
         */
        this.getActiveValues = function() {
          if (this.active && !this._activeValues) {
            $rootScope.$watch(function(scope) {
                  return this.active;
                }.bind(this),
                function(newValue, oldValue) {
                  this._activeValues = this.getRowValues(this.active);
                }.bind(this), true);
          }
          return this._activeValues;
        }

        this.__defineGetter__('activeValues', function() {
          return _self.getActiveValues();
        });

        /**
         * Get the values of the given row
         */
        this.getRowValues = function(rowData) {
          var arr = [];
          for (var i in rowData) {
            if (rowData.hasOwnProperty(i)) {
              arr.push(rowData[i]);
            }
          }
          return arr;
        }

        /**
         *  Get the current item moving the cursor to the next element
         */
        this.next = function() {
          if (!this.hasNext()) {
            this.nextPage();
          }
          this.active = this.copy(this.data[++this.cursor], {});
          return this.active;
        };

        /**
         *  Try to fetch the previous page
         */
        this.nextPage = function() {
          var resourceURL = (window.hostApp || "") + this.entity;
          
          if (!this.hasNextPage()) {
            return;
          }
          if (this.apiVersion == 1 || resourceURL.indexOf('/cronapi/') == -1) {
            this.offset = parseInt(this.offset) + parseInt(this.rowsPerPage);
          } else {
            this.offset = parseInt(this.offset) + 1;
          }
          this.fetch(this._savedProps, {
            success: function(data) {
              if (!data || data.length < parseInt(this.rowsPerPage)) {
                if (this.apiVersion == 1 || resourceURL.indexOf('/cronapi/') == -1) {
                  this.offset = parseInt(this.offset) - this.data.length;
                }
              }
            }
          }, true);
        };

        /**
         *  Try to fetch the previous page
         */
        this.prevPage = function() {
          if (!this.append && !this.preppend) {
            this.offset = parseInt(this.offset) - this.data.length;

            if (this.offset < 0) {
              this.offset = 0;
            } else if (this.offset >= 0) {
              this.fetch(this._savedProps, {
                success: function(data) {
                  if (!data || data.length === 0) {
                    this.offset = 0;
                  }
                }
              }, true);
            }
          }
        };

        /**
         *  Check if has more pages
         */
        this.hasNextPage = function() {
          return this.hasMoreResults && (this.rowsPerPage != -1);
        };

        /**
         *  Check if has previews pages
         */
        this.hasPrevPage = function() {
          return this.offset > 0 && !this.append && !this.prepend;
        };

        /**
         *  Get the previous item
         */
        this.previous = function() {
          if (!this.hasPrevious()) throw "Dataset Overflor Error";
          this.active = this.copy(this.data[--this.cursor], {});
          return this.active;
        };

        /**
         *  Moves the cursor to the specified item
         */
        this.goTo = function(rowId) {
          for (var i = 0; i < this.data.length; i++) {
            if (this.data[i][this.key] === rowId) {
              this.cursor = i;
              this.active = this.copy(this.data[this.cursor], {});
              return this.active;
            }
          }
        };

        /**
         *  Get the current cursor index
         */
        this.getCursor = function() {
          return this.cursor;
        };

        /**
         *  filter dataset by URL
         */
        this.filter = function(url) {
          var oldoffset = this.offset;
          this.offset = 0;
          this.fetch({
            path: url
          }, {
            beforeFill: function(oldData) {
              this.cleanup();
            },
            error: function(error) {
              this.offset = oldoffset;
            }
          });
        };

        this.doSearchAll = function(terms, caseInsensitive) {
          this.searchTimeout = null;
          var oldoffset = this.offset;
          this.offset = 0;
          this.fetch({
            params: {
              filter: "%"+terms+"%",
              filterCaseInsensitive: (caseInsensitive?true:false)
            }
          }, {
            beforeFill: function(oldData) {
              this.cleanup();
            },
            error: function(error) {
              this.offset = oldoffset;
            }
          });
        }

        this.searchAll = function(terms, caseInsensitive) {
          if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
          }

          this.searchTimeout = setTimeout(function() {
            this.doSearchAll(terms, caseInsensitive);
          }.bind(this), 500);
        };

        this.doSearch = function(terms, caseInsensitive) {
          this.searchTimeout = null;
          var oldoffset = this.offset;
          this.offset = 0;
          this.fetch({
            params: {
              filter: terms,
              filterCaseInsensitive: (caseInsensitive?true:false)
            }
          }, {
            beforeFill: function(oldData) {
              this.cleanup();
            },
            error: function(error) {
              this.offset = oldoffset;
            }
          });
        }

        this.search = function(terms, caseInsensitive) {
          if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
          }

		this.caseInsensitive = caseInsensitive;
        this.terms = terms; 
		  
          this.searchTimeout = setTimeout(function() {
            this.doSearch(terms, caseInsensitive);
          }.bind(this), 500);
        };

        /**
         *  refresh dataset by URL and queryParams,
         */
        this.refresh = function(query, url, minChar) {
          this.cleanup();
          if (minChar === undefined) {
            minChar = 0;
          }
          if (query.length >= minChar) {
            this.filter(url + "/" + query);
          }
        };

        /**
         * Cleanup datasource
         */
        this.cleanup = function() {
          this.offset = 0;
          this.data.length = 0;
          this.cursor = -1;
          this.active = {};
          this.hasMoreResults = false;
        }

        /**
         *  Get the current row data
         */
        this.current = function() {
          return this.active || this.data[0];
        };

        this.getLink = function(rel) {
          if (this.links) {
            for (var i = 0; i < this.links.length; i++) {
              if (this.links[i].rel == rel) {
                return this.links[i].href;
              }
            }
          }
        }

        /**
         *  Fetch all data from the server
         */
        this.fetch = function(properties, callbacksObj, isNextOrPrev) {

          // Ignore any call if the datasource is busy (fetching another request)
          if (this.busy) return;

          //Ignore call witouth ids if not http:// or https://
          if (this.entity.indexOf('//') > -1 && this.entity.indexOf('://') < 0) return;

          if (!this.enabled) {
            this.cleanup();
            return;
          }

          var props = properties || {};
          var callbacks = callbacksObj || {};

          // Adjust property parameters and the endpoint url
          props.params = props.params || {};
          var resourceURL = (window.hostApp || "") + this.entity + (props.path || this.lastFilterParsed || "");

          //Check request, if  is dependentLazyPost, break old request
          if (this.dependentLazyPost) {
            if (eval(this.dependentLazyPost).active) {
              var checkRequestId = '';
              var keyDependentLazyPost = this.getKeyValues(eval(this.dependentLazyPost).active);
              for (var key in keyDependentLazyPost) {
                checkRequestId = keyDependentLazyPost[key]
                break;
              }
              if (checkRequestId && checkRequestId.length > 0)
                if (resourceURL.indexOf(checkRequestId) == -1)
                  return;
            }
          }

          // Set Limit and offset
          if (this.rowsPerPage > 0) {
            if (this.apiVersion == 1 || resourceURL.indexOf('/cronapi/') == -1) {
              props.params.limit = this.rowsPerPage;
              props.params.offset = this.offset;
            } else {
              props.params.size = this.rowsPerPage;
              props.params.page = this.offset;
            }
          }

          // Stop auto post for awhile
          this.stopAutoPost();

          // Store the last configuration for late use
          this._savedProps = props;

          // Make the datasource busy
          this.busy = true;

          // Get an ajax promise
          this.$promise = $http({
            method: "GET",
            url: resourceURL,
            params: props.params,
            headers: this.headers
          }).success(function(data, status, headers, config) {
            this.busy = false;
            sucessHandler(data, headers())
          }.bind(this)).error(function(data, status, headers, config) {
            this.busy = false;
            this.handleError(data);
            if (callbacks.error) callbacks.error.call(this, data);
          }.bind(this));

          // Success Handler
          var sucessHandler = function(data, headers) {
            var springVersion = false;
            this.responseHeaders = headers || {};
            
            if (this.entity.indexOf('//') > -1 && this.entity.indexOf('://') < 0)
              data = [];
            if (data) {
              if (Object.prototype.toString.call(data) !== '[object Array]') {
                if (data && data.links && Object.prototype.toString.call(data.content) === '[object Array]') {
                  this.links = data.links;
                  data = data.content;
                  springVersion = true;
                } else {
                  data = [data];
                }
              }
            } else {
              data = [];
            }

            // Call the before fill callback
            if (callbacks.beforeFill) callbacks.beforeFill.apply(this, this.data);

            if (isNextOrPrev) {
              // If prepend property was set.
              // Add the new data before the old one
              if (this.prepend) Array.prototype.unshift.apply(this.data, data);

              // If append property was set.
              // Add the new data after the old one
              if (this.append) Array.prototype.push.apply(this.data, data);

              // When neither  nor preppend was set
              // Just replace the current data
              if (!this.prepend && !this.append) {
                Array.prototype.push.apply(this.data, data);
                if (this.data.length > 0) {
                  this.active = data[0];
                  this.cursor = 0;
                } else {
                  this.active = {};
                  this.cursor = -1;
                }
              }
            } else {
              this.cleanup();
              Array.prototype.push.apply(this.data, data);
              if (this.data.length > 0) {
                this.active = data[0];
                this.cursor = 0;
              }
            }

            this.columns = [];
            if (this.data.length > 0) {
              for (var i = 0; i < this.data[0].length; i++) {
                this.columns.push(this.getColumn(i));
              }
            }

            if (callbacks.success) callbacks.success.call(this, data);

            this.hasMoreResults = (data.length >= this.rowsPerPage);

            if (springVersion) {
              this.hasMoreResults = this.getLink("next") != null;
            }

            /*
             *  Register a watcher for data
             *  if the autopost property was set
             *  It means that any change on dataset items will
             *  generate a new request on the server
             */
            if (this.autoPost) {
              this.startAutoPost();
            }

            this.loaded = true;
            this.loadedFinish = true;
            this.handleAfterCallBack(this.onAfterFill);
            var thisDatasourceName = this.name;
            $('datasource').each(function(idx, elem) {
              var dependentBy = null;
              var dependent = eval(elem.getAttribute('name'));
              if (elem.getAttribute('dependent-by') !== "" && elem.getAttribute('dependent-by') != null) {
                try {
                  dependentBy = JSON.parse(elem.getAttribute('dependent-by'));
                } catch (ex) {
                  dependentBy = eval(elem.getAttribute('dependent-by'));
                }

                if (dependentBy) {
                  if (dependentBy.name == thisDatasourceName) {
                    if (!dependent.filterURL)
                      eval(dependent.name).fetch();
                    //if has filter, the filter observer will be called
                  }
                } else {
                  console.log('O dependente ' + elem.getAttribute('dependent-by') + ' do pai ' + thisDatasourceName + ' ainda não existe.')
                }
              }
            });
          }.bind(this);
        };

        /**
         * Asynchronously notify observers
         */
        this.notifyObservers = function() {
          for (var key in this.observers) {
            if (this.observers.hasOwnProperty(key)) {
              var dataset = this.observers[key];
              $timeout(function() {
                dataset.notify.call(dataset, this.active);
              }.bind(this), 1);
            }
          }
        };

        this.notify = function(activeRow) {
          if (activeRow) {
            // Parse the filter using regex
            // to identify {params}
            var filter = this.watchFilter;
            var pattern = /\{([A-z][A-z|0-9]*)\}/gim;

            // replace all params found by the
            // respectiveValues in activeRow
            filter = filter.replace(pattern, function(a, b) {
              return activeRow.hasOwnProperty(b) ? activeRow[b] : "";
            });

            this.fetch({
              params: {
                q: filter
              }
            });
          }
        };

        this.addObserver = function(observer) {
          this.observers.push(observer);
        };

        /**
         * Clone a JSON Object
         */
        this.copy = function(from, to) {
          if (from === null || Object.prototype.toString.call(from) !== '[object Object]')
            return from;

          to = to || {};

          for (var key in from) {
            if (from.hasOwnProperty(key) && key.indexOf('$') == -1) {
              to[key] = this.copy(from[key]);
            }
          }
          //Verificando os campos que não existem mais no registro (Significa que foi setado para nulo)
          for (var key in to) {
            if (from[key] == undefined)
              delete to[key];
          }

          return to;
        };

        /**
         * Used to monitore the this datasource data for change (insertion and deletion)
         */
        this.startAutoPost = function() {
          this.unregisterDataWatch = $rootScope.$watch(function() {
            return this.data;
          }.bind(this), function(newData, oldData) {

            if (!this.enabled) {
              this.unregisterDataWatch();
              return;
            }

            // Get the difference between both arrays
            var difSize = newData.length - oldData.length;

            if (difSize > 0) {
              // If the value is positive
              // Some item was added
              for (var i = 1; i <= difSize; i++) {
                // Make a new request
                this.insert(newData[newData.length - i], function() {});
              }
            } else if (difSize < 0) {
              // If it is negative
              // Some item was removed
              var _self = this;
              var removedItems = oldData.filter(function(oldItem) {
                return newData.filter(function(newItem) {
                  return _self.objectIsEquals(oldItem, newItem);
                }).length == 0;
              });

              for (var i = 0; i < removedItems.length; i++) {
                this.remove(removedItems[i], function() {});
              }
            }
          }.bind(this));
        }

        /**
         * Unregister the data watcher
         */
        this.stopAutoPost = function() {
          // Unregister any defined watcher on data variable
          if (this.unregisterDataWatch) {
            this.unregisterDataWatch();
            this.unregisterDataWatch = undefined;
          }
        }

        this.hasDataBuffered = function() {
          if (this.dependentBufferLazyPostData && this.dependentBufferLazyPostData.length > 0)
            return true;
          else
            return false;
        }
        
        if (window.afterDatasourceCreate) {
          var args = [$q, $timeout, $rootScope, $window, Notification];
          window.afterDatasourceCreate.apply(this, args);
        }

        this.init();

      };

      /**
       * Dataset Manager Methods
       */
      this.storeDataset = function(dataset) {
        this.datasets[dataset.name] = dataset;
      },

          /**
           * Initialize a new dataset
           */
          this.initDataset = function(props, scope) {

            var endpoint = (props.endpoint) ? props.endpoint : "";
            var dts = new DataSet(props.name, scope);
            var defaultApiVersion = 1;

            dts.entity = props.entity;
            if (app && app.config && app.config.datasourceApiVersion) {
              defaultApiVersion = app.config.datasourceApiVersion;
            }

            dts.apiVersion = props.apiVersion ? parseInt(props.apiVersion) : defaultApiVersion;
            dts.keys = (props.keys && props.keys.length > 0) ? props.keys.split(",") : [];
            dts.rowsPerPage = props.rowsPerPage ? props.rowsPerPage : 100; // Default 100 rows per page
            dts.append = props.append;
            dts.prepend = props.prepend;
            dts.endpoint = props.endpoint;
            dts.filterURL = props.filterURL;
            dts.autoPost = props.autoPost;
            dts.deleteMessage = props.deleteMessage;
            dts.enabled = props.enabled;
            dts.offset = (props.offset) ? props.offset : 0; // Default offset is 0
            dts.onError = props.onError;
            dts.defaultNotSpecifiedErrorMessage = props.defaultNotSpecifiedErrorMessage;
            dts.onAfterFill = props.onAfterFill;
            dts.onBeforeCreate = props.onBeforeCreate;
            dts.onAfterCreate = props.onAfterCreate;
            dts.onBeforeUpdate = props.onBeforeUpdate;
            dts.onAfterUpdate = props.onAfterUpdate;
            dts.onBeforeDelete = props.onBeforeDelete;
            dts.onAfterDelete = props.onAfterDelete;
            dts.dependentBy = props.dependentBy;

            if (props.dependentLazyPost && props.dependentLazyPost.length > 0) {
              dts.dependentLazyPost = props.dependentLazyPost;
              eval(dts.dependentLazyPost).addDependentData(dts);
            }

            dts.dependentLazyPostField = props.dependentLazyPostField; //TRM

            // Check for headers
            if (props.headers && props.headers.length > 0) {
              dts.headers = {"X-From-DataSource": "true"};
              var headers = props.headers.trim().split(";");
              var header;
              for (var i = 0; i < headers.length; i++) {
                header = headers[i].split(":");
                if (header.length === 2) {
                  dts.headers[header[0]] = header[1];
                }
              }
            }

            this.storeDataset(dts);
            dts.allowFetch = true;

            if (dts.dependentBy && dts.dependentBy !== "" && dts.dependentBy.trim() !== "") {
              dts.allowFetch = false;

              //if dependentBy was loaded, the filter in this ds not will be changed and the filter observer not will be called
              var dependentBy = null;
              try {
                dependentBy = JSON.parse(dependentBy);
              } catch (ex) {
                dependentBy = eval(dependentBy);
              }

              if (dependentBy && dependentBy.loadedFinish)
                dts.allowFetch = true;
            }

            if (!props.lazy && dts.allowFetch && (Object.prototype.toString.call(props.watch) !== "[object String]") && !props.filterURL) {
              // Query string object
              var queryObj = {};

              // Fill the dataset
              dts.fetch({
                params: queryObj
              }, {
                success: function(data) {
                  if (data && data.length > 0) {
                    this.active = data[0];
                    this.cursor = 0;
                  }
                }
              });
            }

            if (props.lazy && props.autoPost) {
              dts.startAutoPost();
            }

            if (props.watch && Object.prototype.toString.call(props.watch) === "[object String]") {
              this.registerObserver(props.watch, dts);
              dts.watchFilter = props.watchFilter;
            }

            // Filter the dataset if the filter property was set
            if (props.filterURL && props.filterURL.length > 0 && dts.allowFetch) {
              dts.filter(props.filterURL);
            }

            // Add this instance into the root scope
            // This will expose the dataset name as a
            // global variable
            $rootScope[dts.name] = dts;
            window[dts.name] = dts;

            return dts;
          };

      /**
       * Register a dataset as an observer to another one
       */
      this.registerObserver = function(targetName, dataset) {
        this.datasets[targetName].addObserver(dataset);
      };

      return this;
    }])

    /**
     * Cronus Dataset Directive
     */
    .directive('datasource', ['DatasetManager', '$timeout', '$parse', 'Notification', '$translate', '$location', function(DatasetManager, $timeout, $parse, Notification, $translate, $location) {
      return {
        restrict: 'E',
        scope: true,
        template: '',
        link: function(scope, element, attrs) {
          var init = function() {

            //Add in header the path from the request was executed
            var originPath = "origin-path:" + $location.path();
            if (attrs.headers === undefined || attrs.headers === null) {
              attrs.headers = originPath;
            } else {
              attrs.headers = attrs.headers.concat(";", originPath);
            }

            var props = {
              name: attrs.name,
              entity: attrs.entity,
              apiVersion: attrs.apiVersion,
              enabled: (attrs.hasOwnProperty('enabled')) ? (attrs.enabled === "true") : true,
              keys: attrs.keys,
              endpoint: attrs.endpoint,
              lazy: (attrs.hasOwnProperty('lazy') && attrs.lazy === "") || attrs.lazy === "true",
              append: !attrs.hasOwnProperty('append') || attrs.append === "true",
              prepend: (attrs.hasOwnProperty('prepend') && attrs.prepend === "") || attrs.prepend === "true",
              watch: attrs.watch,
              rowsPerPage: attrs.rowsPerPage,
              offset: attrs.offset,
              filterURL: attrs.filter,
              watchFilter: attrs.watchFilter,
              deleteMessage: attrs.deleteMessage || attrs.deleteMessage === "" ? attrs.deleteMessage : $translate.instant('General.RemoveData'),
              headers: attrs.headers,
              autoPost: (attrs.hasOwnProperty('autoPost') && attrs.autoPost === "") || attrs.autoPost === "true",
              onError: attrs.onError,
              onAfterFill: attrs.onAfterFill,
              onBeforeCreate: attrs.onBeforeCreate,
              onAfterCreate: attrs.onAfterCreate,
              onBeforeUpdate: attrs.onBeforeUpdate,
              onAfterUpdate: attrs.onAfterUpdate,
              onBeforeDelete: attrs.onBeforeDelete,
              onAfterDelete: attrs.onAfterDelete,
              defaultNotSpecifiedErrorMessage: $translate.instant('General.ErrorNotSpecified'),
              dependentBy: attrs.dependentBy,
              dependentLazyPost: attrs.dependentLazyPost, //TRM
              dependentLazyPostField: attrs.dependentLazyPostField, //TRM
            }

            var firstLoad = {
              filter: true,
              entity: true,
              enabled: true
            }

            var datasource = DatasetManager.initDataset(props, scope);
            var timeoutPromise;

            attrs.$observe('filter', function(value) {
              if (!firstLoad.filter) {
                // Stop the pending timeout
                $timeout.cancel(timeoutPromise);

                // Start a timeout
                timeoutPromise = $timeout(function() {
                  datasource.filter(value);
                  datasource.lastFilterParsed = value;
                }, 200);
              } else {
                $timeout(function() {
                  firstLoad.filter = false;
                });
              }
            });

            attrs.$observe('enabled', function(value) {
              if (!firstLoad.enabled) {
                datasource.enabled = (value === "true");
                datasource.fetch({
                  params: {}
                });
              } else {
                $timeout(function() {
                  firstLoad.enabled = false;
                });
              }
            });

            attrs.$observe('entity', function(value) {
              datasource.entity = value;
              if (!firstLoad.entity) {
                // Only fetch if it's not the first load
                datasource.fetch({
                  params: {}
                });
              } else {
                $timeout(function() {
                  firstLoad.entity = false;
                });
              }
            });

          };
          init();
        }
      };
    }])

    .directive('crnDatasource', ['DatasetManager', '$parse', '$rootScope', function(DatasetManager, $parse, $rootScope) {
      return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs) {
          scope.data = DatasetManager.datasets;
          if (scope.data[attrs.crnDatasource]) {
            scope.datasource = scope.data[attrs.crnDatasource];
          } else {
            scope.datasource = {};
            scope.datasource.data = $parse(attrs.crnDatasource)(scope);
          }
          scope.$on('$destroy', function() {
            delete $rootScope[attrs.crnDatasource];
          });
        }
      };
    }]);