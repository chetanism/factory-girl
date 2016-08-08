(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('chance')) :
  typeof define === 'function' && define.amd ? define(['exports', 'chance'], factory) :
  (factory((global.FactoryGirl = global.FactoryGirl || {}),global.Chance));
}(this, function (exports,Chance) { 'use strict';

  Chance = 'default' in Chance ? Chance['default'] : Chance;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              return step("next", value);
            }, function (err) {
              return step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function asyncPopulate(target, source) {
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
      return Promise.reject(new Error('Invalid target passed'));
    }
    if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) !== 'object') {
      return Promise.reject(new Error('Invalid source passed'));
    }

    var promises = Object.keys(source).map(function (attr) {
      var promise = void 0;
      if (Array.isArray(source[attr])) {
        target[attr] = [];
        promise = asyncPopulate(target[attr], source[attr]);
      } else if (_typeof(source[attr]) === 'object') {
        target[attr] = target[attr] || {};
        promise = asyncPopulate(target[attr], source[attr]);
      } else if (typeof source[attr] === 'function') {
        promise = Promise.resolve(source[attr]()).then(function (v) {
          target[attr] = v;
        });
      } else {
        promise = Promise.resolve(source[attr]).then(function (v) {
          target[attr] = v;
        });
      }
      return promise;
    });
    return Promise.all(promises);
  }

  var Factory = function () {
    function Factory(Model, initializer) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      classCallCheck(this, Factory);
      this.name = null;
      this.Model = null;
      this.initializer = null;
      this.options = {};

      if (!Model || typeof Model !== 'function') {
        throw new Error('Invalid Model constructor passed to the factory');
      }
      if ((typeof initializer === 'undefined' ? 'undefined' : _typeof(initializer)) !== 'object' && typeof initializer !== 'function' || !initializer) {
        throw new Error('Invalid initializer passed to the factory');
      }

      this.Model = Model;
      this.initializer = initializer;
      this.options = _extends({}, this.options, options);
    }

    createClass(Factory, [{
      key: 'getFactoryAttrs',
      value: function getFactoryAttrs() {
        var buildOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var attrs = void 0;
        if (typeof this.initializer === 'function') {
          attrs = this.initializer(buildOptions);
        } else {
          attrs = _extends({}, this.initializer);
        }
        return Promise.resolve(attrs);
      }
    }, {
      key: 'attrs',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var extraAttrs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          var buildOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var factoryAttrs, modelAttrs;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.getFactoryAttrs(buildOptions);

                case 2:
                  factoryAttrs = _context.sent;
                  modelAttrs = {};
                  _context.next = 6;
                  return asyncPopulate(modelAttrs, factoryAttrs);

                case 6:
                  _context.next = 8;
                  return asyncPopulate(modelAttrs, extraAttrs);

                case 8:
                  return _context.abrupt('return', modelAttrs);

                case 9:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function attrs(_x3, _x4) {
          return ref.apply(this, arguments);
        }

        return attrs;
      }()
    }, {
      key: 'build',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee2(adapter) {
          var extraAttrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var buildOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var buildCallbacks = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
          var modelAttrs, model;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.attrs(extraAttrs, buildOptions);

                case 2:
                  modelAttrs = _context2.sent;
                  model = adapter.build(this.Model, modelAttrs);
                  return _context2.abrupt('return', this.options.afterBuild && buildCallbacks ? this.options.afterBuild(model, extraAttrs, buildOptions) : model);

                case 5:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function build(_x7, _x8, _x9, _x10) {
          return ref.apply(this, arguments);
        }

        return build;
      }()
    }, {
      key: 'create',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee3(adapter) {
          var _this = this;

          var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var buildOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var model;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return this.build(adapter, attrs, buildOptions, false);

                case 2:
                  model = _context3.sent;
                  return _context3.abrupt('return', adapter.save(model, this.Model).then(function (savedModel) {
                    return _this.options.afterCreate ? _this.options.afterCreate(savedModel, attrs, buildOptions) : savedModel;
                  }));

                case 4:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function create(_x14, _x15, _x16) {
          return ref.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: 'attrsMany',
      value: function attrsMany(num) {
        var attrsArray = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var buildOptionsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

        var attrObject = null;
        var buildOptionsObject = null;

        if ((typeof attrsArray === 'undefined' ? 'undefined' : _typeof(attrsArray)) === 'object' && !Array.isArray(attrsArray)) {
          attrObject = attrsArray;
          attrsArray = [];
        }
        if ((typeof buildOptionsArray === 'undefined' ? 'undefined' : _typeof(buildOptionsArray)) === 'object' && !Array.isArray(buildOptionsArray)) {
          buildOptionsObject = buildOptionsArray;
          buildOptionsArray = [];
        }
        if (typeof num !== 'number' || num < 1) {
          return Promise.reject(new Error('Invalid number of objects requested'));
        }
        if (!Array.isArray(attrsArray)) {
          return Promise.reject(new Error('Invalid attrsArray passed'));
        }
        if (!Array.isArray(buildOptionsArray)) {
          return Promise.reject(new Error('Invalid buildOptionsArray passed'));
        }
        attrsArray.length = buildOptionsArray.length = num;
        var models = [];
        for (var i = 0; i < num; i++) {
          models[i] = this.attrs(attrObject || attrsArray[i] || {}, buildOptionsObject || buildOptionsArray[i] || {});
        }
        return Promise.all(models);
      }
    }, {
      key: 'buildMany',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee4(adapter, num) {
          var attrsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

          var _this2 = this;

          var buildOptionsArray = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
          var buildCallbacks = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];
          var attrs, models;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return this.attrsMany(num, attrsArray, buildOptionsArray);

                case 2:
                  attrs = _context4.sent;
                  models = attrs.map(function (attr) {
                    return adapter.build(_this2.Model, attr);
                  });
                  return _context4.abrupt('return', Promise.all(models).then(function (builtModels) {
                    return _this2.options.afterBuild && buildCallbacks ? Promise.all(builtModels.map(function (builtModel) {
                      return _this2.options.afterBuild(builtModel, attrsArray, buildOptionsArray);
                    })) : builtModels;
                  }));

                case 5:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function buildMany(_x21, _x22, _x23, _x24, _x25) {
          return ref.apply(this, arguments);
        }

        return buildMany;
      }()
    }, {
      key: 'createMany',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee5(adapter, num) {
          var _this3 = this;

          var attrsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
          var buildOptionsArray = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
          var models, savedModels;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return this.buildMany(adapter, num, attrsArray, buildOptionsArray, false);

                case 2:
                  models = _context5.sent;
                  savedModels = models.map(function (model) {
                    return adapter.save(model, _this3.Model);
                  });
                  return _context5.abrupt('return', Promise.all(savedModels).then(function (createdModels) {
                    return _this3.options.afterCreate ? Promise.all(createdModels.map(function (createdModel) {
                      return _this3.options.afterCreate(createdModel, attrsArray, buildOptionsArray);
                    })) : createdModels;
                  }));

                case 5:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function createMany(_x29, _x30, _x31, _x32) {
          return ref.apply(this, arguments);
        }

        return createMany;
      }()
    }]);
    return Factory;
  }();

  var Generator = function () {
    function Generator(factoryGirl) {
      classCallCheck(this, Generator);

      if (!factoryGirl) {
        throw new Error('No FactoryGirl instance provided');
      }
      this.factoryGirl = factoryGirl;
    }

    createClass(Generator, [{
      key: 'generate',
      value: function generate() {
        throw new Error('Override this method to generate a value');
      }
    }, {
      key: 'getAttribute',
      value: function getAttribute(name, model, key) {
        return this.factoryGirl.getAdapter(name).get(model, key);
      }
    }]);
    return Generator;
  }();

  var Sequence = function (_Generator) {
    inherits(Sequence, _Generator);

    function Sequence() {
      classCallCheck(this, Sequence);
      return possibleConstructorReturn(this, Object.getPrototypeOf(Sequence).apply(this, arguments));
    }

    createClass(Sequence, [{
      key: 'generate',
      value: function generate() {
        var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        if (typeof id === 'function') {
          callback = id;
          id = null;
        }
        id = id || this.id || (this.id = generateId());
        Sequence.sequences[id] = Sequence.sequences[id] || 1;
        var next = Sequence.sequences[id]++;
        return callback ? callback(next) : next;
      }
    }]);
    return Sequence;
  }(Generator);

  Sequence.sequences = {};
  function generateId() {
    var id = void 0;
    var i = 0;
    do {
      id = '_' + i++;
    } while (id in Sequence.sequences);
    return id;
  }

  var Assoc = function (_Generator) {
    inherits(Assoc, _Generator);

    function Assoc() {
      classCallCheck(this, Assoc);
      return possibleConstructorReturn(this, Object.getPrototypeOf(Assoc).apply(this, arguments));
    }

    createClass(Assoc, [{
      key: 'generate',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(name) {
          var key = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var attrs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var buildOptions = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
          var model;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.factoryGirl.create(name, attrs, buildOptions);

                case 2:
                  model = _context.sent;
                  return _context.abrupt('return', key ? this.getAttribute(name, model, key) : model);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate(_x, _x2, _x3, _x4) {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);
    return Assoc;
  }(Generator);

  var AssocAttrs = function (_Generator) {
    inherits(AssocAttrs, _Generator);

    function AssocAttrs() {
      classCallCheck(this, AssocAttrs);
      return possibleConstructorReturn(this, Object.getPrototypeOf(AssocAttrs).apply(this, arguments));
    }

    createClass(AssocAttrs, [{
      key: 'generate',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(name) {
          var key = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var attrs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var buildOptions = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
          var model;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.factoryGirl.attrs(name, attrs, buildOptions);

                case 2:
                  model = _context.sent;
                  return _context.abrupt('return', key ? this.getAttribute(name, model, key) : model);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate(_x, _x2, _x3, _x4) {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);
    return AssocAttrs;
  }(Generator);

  var AssocMany = function (_Generator) {
    inherits(AssocMany, _Generator);

    function AssocMany() {
      classCallCheck(this, AssocMany);
      return possibleConstructorReturn(this, Object.getPrototypeOf(AssocMany).apply(this, arguments));
    }

    createClass(AssocMany, [{
      key: 'generate',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(name, num) {
          var key = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

          var _this2 = this;

          var attrs = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
          var buildOptions = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
          var models;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.factoryGirl.createMany(name, num, attrs, buildOptions);

                case 2:
                  models = _context.sent;
                  return _context.abrupt('return', key ? models.map(function (model) {
                    return _this2.getAttribute(name, model, key);
                  }) : models);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate(_x, _x2, _x3, _x4, _x5) {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);
    return AssocMany;
  }(Generator);

  var AssocAttrsMany = function (_Generator) {
    inherits(AssocAttrsMany, _Generator);

    function AssocAttrsMany() {
      classCallCheck(this, AssocAttrsMany);
      return possibleConstructorReturn(this, Object.getPrototypeOf(AssocAttrsMany).apply(this, arguments));
    }

    createClass(AssocAttrsMany, [{
      key: 'generate',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(name, num) {
          var key = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

          var _this2 = this;

          var attrs = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
          var buildOptions = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
          var models;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(typeof num !== 'number' || num < 1)) {
                    _context.next = 2;
                    break;
                  }

                  throw new Error('Invalid number of items requested');

                case 2:
                  _context.next = 4;
                  return this.factoryGirl.attrsMany(name, num, attrs, buildOptions);

                case 4:
                  models = _context.sent;
                  return _context.abrupt('return', key ? models.map(function (model) {
                    return _this2.getAttribute(name, model, key);
                  }) : models);

                case 6:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate(_x, _x2, _x3, _x4, _x5) {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);
    return AssocAttrsMany;
  }(Generator);

  var chance = new Chance();

  var ChanceGenerator = function (_Generator) {
    inherits(ChanceGenerator, _Generator);

    function ChanceGenerator() {
      classCallCheck(this, ChanceGenerator);
      return possibleConstructorReturn(this, Object.getPrototypeOf(ChanceGenerator).apply(this, arguments));
    }

    createClass(ChanceGenerator, [{
      key: 'generate',
      value: function generate(chanceMethod, options) {
        if (typeof chance[chanceMethod] !== 'function') {
          throw new Error('Invalid chance method requested');
        }
        return chance[chanceMethod](options);
      }
    }]);
    return ChanceGenerator;
  }(Generator);

  var OneOf = function (_Generator) {
    inherits(OneOf, _Generator);

    function OneOf() {
      classCallCheck(this, OneOf);
      return possibleConstructorReturn(this, Object.getPrototypeOf(OneOf).apply(this, arguments));
    }

    createClass(OneOf, [{
      key: 'generate',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(possibleValues) {
          var size, randomIndex, value;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (Array.isArray(possibleValues)) {
                    _context.next = 2;
                    break;
                  }

                  throw new Error('Expected an array of possible values');

                case 2:
                  if (!(possibleValues.length < 1)) {
                    _context.next = 4;
                    break;
                  }

                  throw new Error('Empty array passed for possible values');

                case 4:
                  size = possibleValues.length;
                  randomIndex = Math.floor(Math.random() * size);
                  value = possibleValues[randomIndex];
                  return _context.abrupt('return', typeof value === 'function' ? value() : value);

                case 8:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate(_x) {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);
    return OneOf;
  }(Generator);

  /* eslint-disable no-unused-vars */

  var DefaultAdapter = function () {
    function DefaultAdapter() {
      classCallCheck(this, DefaultAdapter);
    }

    createClass(DefaultAdapter, [{
      key: "build",
      value: function build(Model, props) {
        return new Model(props);
      }
    }, {
      key: "save",
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(model, Model) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", Promise.resolve(model.save()).then(function () {
                    return model;
                  }));

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function save(_x, _x2) {
          return ref.apply(this, arguments);
        }

        return save;
      }()
    }, {
      key: "destroy",
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee2(model, Model) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", Promise.resolve(model.destroy()).then(function () {
                    return model;
                  }));

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function destroy(_x3, _x4) {
          return ref.apply(this, arguments);
        }

        return destroy;
      }()
    }, {
      key: "get",
      value: function get(model, attr, Model) {
        return model.get(attr);
      }
    }, {
      key: "set",
      value: function set(props, model, Model) {
        return model.set(props);
      }
    }]);
    return DefaultAdapter;
  }();

  var FactoryGirl = function () {
    function FactoryGirl() {
      var _this = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      classCallCheck(this, FactoryGirl);
      this.factories = {};
      this.options = {};
      this.adapters = {};
      this.created = new Set();

      this.assoc = generatorThunk(this, Assoc);
      this.assocMany = generatorThunk(this, AssocMany);
      this.assocBuild = deprecate('assocBuild', 'assocAttrs');
      this.assocBuildMany = deprecate('assocBuildMany', 'assocAttrsMany');
      this.assocAttrs = generatorThunk(this, AssocAttrs);
      this.assocAttrsMany = generatorThunk(this, AssocAttrsMany);
      this.seq = this.sequence = function () {
        return generatorThunk(_this, Sequence).apply(undefined, arguments);
      };
      this.chance = generatorThunk(this, ChanceGenerator);
      this.oneOf = generatorThunk(this, OneOf);

      this.defaultAdapter = new DefaultAdapter();
      this.options = options;
    }

    createClass(FactoryGirl, [{
      key: 'define',
      value: function define(name, Model, initializer, options) {
        if (this.getFactory(name, false)) {
          throw new Error('Factory ' + name + ' already defined');
        }
        this.factories[name] = new Factory(Model, initializer, options);
      }
    }, {
      key: 'attrs',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(name, _attrs, buildOptions) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt('return', this.getFactory(name).attrs(_attrs, buildOptions));

                case 1:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function attrs(_x2, _x3, _x4) {
          return ref.apply(this, arguments);
        }

        return attrs;
      }()
    }, {
      key: 'build',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee2(name) {
          var _this2 = this;

          var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var buildOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var adapter;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  adapter = this.getAdapter(name);
                  return _context2.abrupt('return', this.getFactory(name).build(adapter, attrs, buildOptions).then(function (model) {
                    return _this2.options.afterBuild ? _this2.options.afterBuild(model, attrs, buildOptions) : model;
                  }));

                case 2:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function build(_x5, _x6, _x7) {
          return ref.apply(this, arguments);
        }

        return build;
      }()
    }, {
      key: 'create',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee3(name, attrs, buildOptions) {
          var _this3 = this;

          var adapter;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  adapter = this.getAdapter(name);
                  return _context3.abrupt('return', this.getFactory(name).create(adapter, attrs, buildOptions).then(function (createdModel) {
                    return _this3.addToCreatedList(adapter, createdModel);
                  }).then(function (model) {
                    return _this3.options.afterCreate ? _this3.options.afterCreate(model, attrs, buildOptions) : model;
                  }));

                case 2:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function create(_x10, _x11, _x12) {
          return ref.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: 'attrsMany',
      value: function attrsMany(name, num, attrs, buildOptions) {
        return this.getFactory(name).attrsMany(num, attrs, buildOptions);
      }
    }, {
      key: 'buildMany',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee4(name, num, attrs, buildOptions) {
          var _this4 = this;

          var adapter;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  adapter = this.getAdapter(name);
                  return _context4.abrupt('return', this.getFactory(name).buildMany(adapter, num, attrs, buildOptions).then(function (models) {
                    return _this4.options.afterBuild ? Promise.all(models.map(function (model) {
                      return _this4.options.afterBuild(model, attrs, buildOptions);
                    })) : models;
                  }));

                case 2:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function buildMany(_x13, _x14, _x15, _x16) {
          return ref.apply(this, arguments);
        }

        return buildMany;
      }()
    }, {
      key: 'createMany',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee5(name, num, attrs, buildOptions) {
          var _this5 = this;

          var adapter;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  adapter = this.getAdapter(name);
                  return _context5.abrupt('return', this.getFactory(name).createMany(adapter, num, attrs, buildOptions).then(function (models) {
                    return _this5.addToCreatedList(adapter, models);
                  }).then(function (models) {
                    return _this5.options.afterCreate ? Promise.all(models.map(function (model) {
                      return _this5.options.afterCreate(model, attrs, buildOptions);
                    })) : models;
                  }));

                case 2:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function createMany(_x17, _x18, _x19, _x20) {
          return ref.apply(this, arguments);
        }

        return createMany;
      }()
    }, {
      key: 'getFactory',
      value: function getFactory(name) {
        var throwError = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (!this.factories[name] && throwError) {
          throw new Error('Invalid factory \'' + name + ' requested');
        }
        return this.factories[name];
      }
    }, {
      key: 'withOptions',
      value: function withOptions(options) {
        var merge = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        this.options = merge ? _extends({}, this.options, options) : options;
      }
    }, {
      key: 'getAdapter',
      value: function getAdapter(factory) {
        return factory ? this.adapters[factory] || this.defaultAdapter : this.defaultAdapter;
      }
    }, {
      key: 'addToCreatedList',
      value: function addToCreatedList(adapter, models) {
        if (!Array.isArray(models)) {
          this.created.add([adapter, models]);
        } else {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var model = _step.value;

              this.created.add([adapter, model]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
        return models;
      }
    }, {
      key: 'cleanUp',
      value: function cleanUp() {
        var promises = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.created[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = slicedToArray(_step2.value, 2);

            var adapter = _step2$value[0];
            var model = _step2$value[1];

            promises.push(adapter.destroy(model.constructor, model));
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.created.clear();
        return Promise.all(promises);
      }
    }, {
      key: 'setAdapter',
      value: function setAdapter(adapter) {
        var _this6 = this;

        var factoryNames = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        if (!factoryNames) {
          this.defaultAdapter = adapter;
        } else {
          factoryNames = Array.isArray(factoryNames) ? factoryNames : [factoryNames];
          factoryNames.forEach(function (name) {
            _this6.adapters[name] = adapter;
          });
        }
        return adapter;
      }
    }]);
    return FactoryGirl;
  }();

  function generatorThunk(factoryGirl, SomeGenerator) {
    var generator = new SomeGenerator(factoryGirl);
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return function () {
        return generator.generate.apply(generator, args);
      };
    };
  }

  function deprecate(method, see) {
    return function () {
      throw new Error('The ' + method + ' method has been deprecated, use ' + see + ' instead');
    };
  }

  /* eslint-disable no-unused-vars */

  var BookshelfAdapter = function (_DefaultAdapter) {
    inherits(BookshelfAdapter, _DefaultAdapter);

    function BookshelfAdapter() {
      classCallCheck(this, BookshelfAdapter);
      return possibleConstructorReturn(this, Object.getPrototypeOf(BookshelfAdapter).apply(this, arguments));
    }

    createClass(BookshelfAdapter, [{
      key: 'save',
      value: function save(doc, Model) {
        return doc.save(null, { method: 'insert' });
      }
    }]);
    return BookshelfAdapter;
  }(DefaultAdapter);

  /* eslint-disable no-unused-vars */

  var MongooseAdapter = function (_DefaultAdapter) {
    inherits(MongooseAdapter, _DefaultAdapter);

    function MongooseAdapter() {
      classCallCheck(this, MongooseAdapter);
      return possibleConstructorReturn(this, Object.getPrototypeOf(MongooseAdapter).apply(this, arguments));
    }

    createClass(MongooseAdapter, [{
      key: 'destroy',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(model, Model) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt('return', model.remove());

                case 1:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function destroy(_x, _x2) {
          return ref.apply(this, arguments);
        }

        return destroy;
      }()
    }]);
    return MongooseAdapter;
  }(DefaultAdapter);

  /* eslint-disable no-unused-vars */

  var ObjectAdapter = function (_DefaultAdapter) {
    inherits(ObjectAdapter, _DefaultAdapter);

    function ObjectAdapter() {
      classCallCheck(this, ObjectAdapter);
      return possibleConstructorReturn(this, Object.getPrototypeOf(ObjectAdapter).apply(this, arguments));
    }

    createClass(ObjectAdapter, [{
      key: 'build',
      value: function build(Model, props) {
        var model = new Model();
        this.set(props, model, Model);
        return model;
      }
    }, {
      key: 'save',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(model, Model) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt('return', model);

                case 1:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function save(_x, _x2) {
          return ref.apply(this, arguments);
        }

        return save;
      }()
    }, {
      key: 'destroy',
      value: function () {
        var ref = asyncToGenerator(regeneratorRuntime.mark(function _callee2(model, Model) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt('return', model);

                case 1:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function destroy(_x3, _x4) {
          return ref.apply(this, arguments);
        }

        return destroy;
      }()
    }, {
      key: 'get',
      value: function get(model, attr, Model) {
        return model[attr];
      }
    }, {
      key: 'set',
      value: function set(props, model, Model) {
        return Object.assign(model, props);
      }
    }]);
    return ObjectAdapter;
  }(DefaultAdapter);

  var factory = new FactoryGirl();
  factory.FactoryGirl = FactoryGirl;

  exports.BookshelfAdapter = BookshelfAdapter;
  exports.DefaultAdapter = DefaultAdapter;
  exports.MongooseAdapter = MongooseAdapter;
  exports.ObjectAdapter = ObjectAdapter;
  exports.factory = factory;
  exports['default'] = factory;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map