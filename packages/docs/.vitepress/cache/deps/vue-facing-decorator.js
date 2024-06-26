import {
  defineComponent
} from "./chunk-YW53L7UT.js";
import "./chunk-UXIASGQL.js";

// vuedax/node_modules/vue-facing-decorator/dist/esm/deco3/utils.js
var Compatible = {};
function compatibleClassDecorator(deco) {
  return function(arg, ctx) {
    var _a;
    if (ctx) {
      if (ctx.kind !== "class") {
        throw "deco stage 3 class";
      }
      const proto = (_a = Compatible.fakePrototype) !== null && _a !== void 0 ? _a : Compatible.fakePrototype = {};
      const slot = obtainSlot(proto);
      delete Compatible.fakePrototype;
      obtainSlot(arg.prototype, slot);
      const ret = deco(arg);
      return ret;
    } else {
      return deco(arg);
    }
  };
}
function compatibleMemberDecorator(deco) {
  return function(arg, ctx) {
    var _a;
    if (typeof ctx === "object") {
      const proto = (_a = Compatible.fakePrototype) !== null && _a !== void 0 ? _a : Compatible.fakePrototype = {};
      proto[ctx.name] = arg;
      return deco(proto, ctx.name);
    } else {
      return deco(arg, ctx);
    }
  };
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/utils.js
var SlotSymbol = Symbol("vue-facing-decorator-slot");
var Slot = class {
  constructor(master) {
    this.names = /* @__PURE__ */ new Map();
    this.inComponent = false;
    this.cachedVueComponent = null;
    this.master = master;
  }
  obtainMap(name) {
    let map = this.getMap(name);
    if (!map) {
      map = /* @__PURE__ */ new Map();
      this.names.set(name, map);
    }
    return map;
  }
  getMap(name) {
    const map = this.names.get(name);
    return map;
  }
};
function makeSlot(obj, defaultSlot) {
  if (getSlot(obj)) {
    throw "";
  }
  if (defaultSlot) {
    defaultSlot.master = obj;
  }
  const slot = defaultSlot !== null && defaultSlot !== void 0 ? defaultSlot : new Slot(obj);
  Object.defineProperty(obj, SlotSymbol, {
    enumerable: false,
    value: slot
  });
  return slot;
}
function getSlot(obj) {
  var _a;
  return (_a = Object.getOwnPropertyDescriptor(obj, SlotSymbol)) === null || _a === void 0 ? void 0 : _a.value;
}
function obtainSlot(obj, defaultSlot) {
  const slot = getSlot(obj);
  if (slot) {
    return slot;
  }
  return makeSlot(obj, defaultSlot);
}
function makeObject(names, obj) {
  return names.reduce((pv, cv) => {
    pv[cv] = obj[cv];
    return pv;
  }, {});
}
function toComponentReverse(obj) {
  const arr = [];
  let curr = obj;
  do {
    arr.unshift(curr);
    curr = Object.getPrototypeOf(curr);
  } while (curr.constructor !== Base && !getSlot(curr));
  return arr;
}
function getSuperSlot(obj) {
  let curr = Object.getPrototypeOf(obj);
  while (curr.constructor !== Base) {
    const slot = getSlot(curr);
    if (slot) {
      return slot;
    }
    curr = Object.getPrototypeOf(curr);
  }
  return null;
}
function excludeNames(names, slot, filter) {
  return names.filter((name) => {
    let currSlot = slot;
    while (currSlot != null) {
      for (const mapName of currSlot.names.keys()) {
        if (filter && !filter(mapName)) {
          continue;
        }
        if (mapName === "customDecorator") {
          const map2 = currSlot.obtainMap("customDecorator");
          if (map2.has(name)) {
            if (map2.get(name).every((ite) => !ite.preserve)) {
              return false;
            } else {
              continue;
            }
          }
        }
        const map = currSlot.names.get(mapName);
        if (map.has(name)) {
          return false;
        }
      }
      currSlot = getSuperSlot(currSlot.master);
    }
    return true;
  });
}
function getValidNames(obj, filter) {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  return Object.keys(descriptors).filter((name) => filter(descriptors[name], name));
}
function optionNullableMemberDecorator(handler) {
  function decorator11(optionOrProto, name) {
    if (name) {
      compatibleMemberDecorator(function(proto, name2) {
        handler(proto, name2);
      })(optionOrProto, name);
    } else {
      return compatibleMemberDecorator(function(proto, name2) {
        handler(proto, name2, optionOrProto);
      });
    }
  }
  return decorator11;
}
function getProviderFunction(provide) {
  if (typeof provide === "function")
    return provide;
  return function() {
    return provide || {};
  };
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/setup.js
function decorator(setupFunction) {
  return compatibleMemberDecorator(function(proto, name) {
    const slot = obtainSlot(proto);
    const map = slot.obtainMap("setup");
    map.set(name, {
      setupFunction
    });
  });
}
var isPromise = (v) => v instanceof Promise;
function build(cons, optionBuilder) {
  const slot = obtainSlot(cons.prototype);
  const map = slot.getMap("setup");
  if (!map || map.size === 0) {
    return;
  }
  const setup = function(props, ctx) {
    const setupData = {};
    let promises = null;
    for (const name of map.keys()) {
      const setupState = map.get(name).setupFunction(props, ctx);
      if (isPromise(setupState)) {
        promises !== null && promises !== void 0 ? promises : promises = [];
        promises.push(setupState.then((v) => {
          setupData[name] = v;
        }));
      } else {
        setupData[name] = setupState;
      }
    }
    if (Array.isArray(promises)) {
      return Promise.all(promises).then(() => {
        return setupData;
      });
    } else {
      return setupData;
    }
  };
  optionBuilder.setup = setup;
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/computed.js
function build2(cons, optionBuilder) {
  var _a;
  (_a = optionBuilder.computed) !== null && _a !== void 0 ? _a : optionBuilder.computed = {};
  const slot = obtainSlot(cons.prototype);
  const map = slot.obtainMap("computed");
  const vanillaMap = slot.obtainMap("vanilla");
  const protoArr = toComponentReverse(cons.prototype);
  protoArr.forEach((proto) => {
    getValidNames(proto, (des, name) => {
      return (typeof des.get === "function" || typeof des.set === "function") && !vanillaMap.has(name);
    }).forEach((name) => {
      map.set(name, true);
      const des = Object.getOwnPropertyDescriptor(proto, name);
      optionBuilder.computed[name] = {
        get: typeof des.get === "function" ? des.get : void 0,
        set: typeof des.set === "function" ? des.set : void 0
      };
    });
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/data.js
function build3(cons, optionBuilder, vueInstance) {
  var _a;
  (_a = optionBuilder.data) !== null && _a !== void 0 ? _a : optionBuilder.data = {};
  const sample = new cons(optionBuilder, vueInstance);
  let names = getValidNames(sample, (des, name) => {
    var _a2, _b;
    return !!des.enumerable && !((_a2 = optionBuilder.methods) === null || _a2 === void 0 ? void 0 : _a2[name]) && !((_b = optionBuilder.props) === null || _b === void 0 ? void 0 : _b[name]);
  });
  const slot = obtainSlot(cons.prototype);
  names = excludeNames(names, slot, (mapName) => {
    return !["provide"].includes(mapName);
  });
  Object.assign(optionBuilder.data, makeObject(names, sample));
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/methodsAndHooks.js
var HookNames = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "activated",
  "deactivated",
  "beforeDestroy",
  "beforeUnmount",
  "destroyed",
  "unmounted",
  "renderTracked",
  "renderTriggered",
  "errorCaptured",
  "serverPrefetch",
  "render"
];
var decorator2 = optionNullableMemberDecorator(function(proto, name) {
  const slot = obtainSlot(proto);
  const map = slot.obtainMap("hooks");
  map.set(name, null);
});
function build4(cons, optionBuilder) {
  var _a, _b, _c;
  const slot = obtainSlot(cons.prototype);
  const protoArr = toComponentReverse(cons.prototype);
  const map = slot.obtainMap("hooks");
  (_a = optionBuilder.hooks) !== null && _a !== void 0 ? _a : optionBuilder.hooks = {};
  (_b = optionBuilder.methods) !== null && _b !== void 0 ? _b : optionBuilder.methods = {};
  const HookFunctions = {};
  const MethodFunctions = {};
  protoArr.forEach((proto) => {
    let names = getValidNames(proto, (des, name) => {
      if (name === "constructor") {
        return false;
      }
      if (typeof des.value === "function") {
        return true;
      }
      return false;
    });
    names = excludeNames(names, slot, (mapName) => {
      return !["watch", "hooks", "emits", "provide"].includes(mapName);
    });
    names.forEach((name) => {
      if (HookNames.includes(name) || map.has(name)) {
        HookFunctions[name] = proto[name];
      } else {
        MethodFunctions[name] = proto[name];
      }
    });
  });
  Object.assign(optionBuilder.methods, MethodFunctions);
  const beforeCreateCallbacks = [...(_c = optionBuilder.beforeCreateCallbacks) !== null && _c !== void 0 ? _c : []];
  if (beforeCreateCallbacks && beforeCreateCallbacks.length > 0) {
    const oldBeforeCreateCallback = HookFunctions["beforeCreate"];
    HookFunctions["beforeCreate"] = function() {
      beforeCreateCallbacks.forEach((callback) => callback.apply(this, arguments));
      if (oldBeforeCreateCallback) {
        oldBeforeCreateCallback.apply(this, arguments);
      }
    };
  }
  Object.assign(optionBuilder.hooks, HookFunctions);
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/optionBuilder.js
function applyAccessors(optionBuilder, dataFunc) {
  var _a;
  (_a = optionBuilder.beforeCreateCallbacks) !== null && _a !== void 0 ? _a : optionBuilder.beforeCreateCallbacks = [];
  optionBuilder.beforeCreateCallbacks.push(function() {
    const ctx = this;
    const data = dataFunc(ctx);
    data.forEach((v, n) => {
      Object.defineProperty(ctx, n, v);
    });
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/ref.js
var decorator3 = optionNullableMemberDecorator(function(proto, name, key) {
  const slot = obtainSlot(proto);
  const map = slot.obtainMap("ref");
  map.set(name, typeof key === "undefined" ? null : key);
});
function build5(cons, optionBuilder) {
  const slot = obtainSlot(cons.prototype);
  const names = slot.getMap("ref");
  if (!names || names.size === 0) {
    return;
  }
  applyAccessors(optionBuilder, (ctx) => {
    const data = /* @__PURE__ */ new Map();
    names.forEach((value, name) => {
      const refKey = value === null ? name : value;
      data.set(name, {
        get: function() {
          return ctx.$refs[refKey];
        },
        set: void 0
      });
    });
    return data;
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/watch.js
function decorator4(key, option) {
  return compatibleMemberDecorator(function(proto, name) {
    const slot = obtainSlot(proto);
    const map = slot.obtainMap("watch");
    const opt = Object.assign({}, option !== null && option !== void 0 ? option : {}, {
      key,
      handler: proto[name]
    });
    if (map.has(name)) {
      const t = map.get(name);
      if (Array.isArray(t)) {
        t.push(opt);
      } else {
        map.set(name, [t, opt]);
      }
    } else {
      map.set(name, opt);
    }
  });
}
function build6(cons, optionBuilder) {
  var _a;
  (_a = optionBuilder.watch) !== null && _a !== void 0 ? _a : optionBuilder.watch = {};
  const slot = obtainSlot(cons.prototype);
  const names = slot.getMap("watch");
  if (!names || names.size === 0) {
    return;
  }
  names.forEach((value, _name) => {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((v) => {
      if (!optionBuilder.watch[v.key]) {
        optionBuilder.watch[v.key] = v;
      } else {
        const t = optionBuilder.watch[v.key];
        if (Array.isArray(t)) {
          t.push(v);
        } else {
          optionBuilder.watch[v.key] = [t, v];
        }
      }
    });
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/props.js
var decorator5 = optionNullableMemberDecorator(function(proto, name, option) {
  const slot = obtainSlot(proto);
  const map = slot.obtainMap("props");
  const opt = Object.assign({}, option !== null && option !== void 0 ? option : {});
  map.set(name, opt);
});
function build7(cons, optionBuilder) {
  var _a;
  (_a = optionBuilder.props) !== null && _a !== void 0 ? _a : optionBuilder.props = {};
  const slot = obtainSlot(cons.prototype);
  const names = slot.getMap("props");
  if (!names || names.size === 0) {
    return;
  }
  names.forEach((value, name) => {
    optionBuilder.props[name] = value;
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/inject.js
var decorator6 = optionNullableMemberDecorator(function(proto, name, option) {
  const slot = obtainSlot(proto);
  const map = slot.obtainMap("inject");
  const opt = Object.assign({}, option !== null && option !== void 0 ? option : {});
  map.set(name, opt);
});
function build8(cons, optionBuilder) {
  var _a;
  (_a = optionBuilder.inject) !== null && _a !== void 0 ? _a : optionBuilder.inject = {};
  const slot = obtainSlot(cons.prototype);
  const names = slot.getMap("inject");
  if (!names || names.size === 0) {
    return;
  }
  names.forEach((value, name) => {
    optionBuilder.inject[name] = value;
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/provide.js
var decorator7 = optionNullableMemberDecorator(function(proto, name, key) {
  const slot = obtainSlot(proto);
  const map = slot.obtainMap("provide");
  map.set(name, typeof key === "undefined" ? null : key);
});
function build9(cons, optionBuilder, vueInstance) {
  var _a;
  (_a = optionBuilder.provide) !== null && _a !== void 0 ? _a : optionBuilder.provide = {};
  const sample = new cons(optionBuilder, vueInstance);
  const slot = obtainSlot(cons.prototype);
  const names = slot.obtainMap("provide");
  if (!names)
    return null;
  names.forEach((value, name) => {
    const key = value === null ? name : value;
    optionBuilder.provide[key] = sample[name];
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/emit.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var decorator8 = optionNullableMemberDecorator(function(proto, name, key) {
  const slot = obtainSlot(proto);
  const map = slot.obtainMap("emit");
  map.set(name, typeof key === "undefined" ? null : key);
});
function build10(cons, optionBuilder) {
  var _a;
  (_a = optionBuilder.methods) !== null && _a !== void 0 ? _a : optionBuilder.methods = {};
  const proto = cons.prototype;
  const slot = obtainSlot(proto);
  const names = slot.getMap("emit");
  if (!names || names.size === 0) {
    return;
  }
  const emits = slot.obtainMap("emits");
  names.forEach((value, key) => {
    const eventName = value === null ? key : value;
    emits.set(eventName, true);
    optionBuilder.methods[key] = function() {
      return __awaiter(this, arguments, void 0, function* () {
        const ret = proto[key].apply(this, arguments);
        if (ret instanceof Promise) {
          const proRet = yield ret;
          this.$emit(eventName, proRet);
        } else {
          this.$emit(eventName, ret);
        }
      });
    };
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/vmodel.js
var decorator9 = optionNullableMemberDecorator(function(proto, name, option) {
  var _a;
  option !== null && option !== void 0 ? option : option = {};
  const slot = obtainSlot(proto);
  let vmodelName = "modelValue";
  const propsConfig = Object.assign({}, option);
  if (propsConfig) {
    vmodelName = (_a = propsConfig.name) !== null && _a !== void 0 ? _a : vmodelName;
    delete propsConfig.name;
  }
  decorator5(propsConfig)(proto, vmodelName);
  const map = slot.obtainMap("v-model");
  map.set(name, option);
});
function build11(cons, optionBuilder) {
  var _a;
  (_a = optionBuilder.computed) !== null && _a !== void 0 ? _a : optionBuilder.computed = {};
  const slot = obtainSlot(cons.prototype);
  const names = slot.getMap("v-model");
  if (!names || names.size === 0) {
    return;
  }
  const emits = slot.obtainMap("emits");
  names.forEach((value, name) => {
    var _a2;
    const vmodelName = (_a2 = value && value.name) !== null && _a2 !== void 0 ? _a2 : "modelValue";
    const eventName = `update:${vmodelName}`;
    optionBuilder.computed[name] = {
      get: function() {
        return this[vmodelName];
      },
      set: function(val) {
        this.$emit(eventName, val);
      }
    };
    emits.set(eventName, true);
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/accessor.js
function build12(cons, optionBuilder) {
  const slot = obtainSlot(cons.prototype);
  const vanillaMap = slot.getMap("vanilla");
  if (!vanillaMap || vanillaMap.size === 0) {
    return;
  }
  const protoArr = toComponentReverse(cons.prototype);
  const map = /* @__PURE__ */ new Map();
  applyAccessors(optionBuilder, (ctx) => {
    protoArr.forEach((proto) => {
      const deses = Object.getOwnPropertyDescriptors(proto);
      for (const name in deses) {
        const des = deses[name];
        if (des && vanillaMap.has(name)) {
          if (typeof des.get === "function" || typeof des.set === "function") {
            map.set(name, {
              set: typeof des.set === "function" ? des.set.bind(ctx) : void 0,
              get: typeof des.get === "function" ? des.get.bind(ctx) : void 0
            });
          }
        }
      }
    });
    return map;
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/component.js
function ComponentOption(cons, extend) {
  const optionBuilder = {};
  build(cons, optionBuilder);
  build11(cons, optionBuilder);
  build2(cons, optionBuilder);
  build6(cons, optionBuilder);
  build7(cons, optionBuilder);
  build8(cons, optionBuilder);
  build10(cons, optionBuilder);
  build5(cons, optionBuilder);
  build12(cons, optionBuilder);
  build4(cons, optionBuilder);
  const raw = Object.assign(Object.assign({ name: cons.name, setup: optionBuilder.setup, data() {
    var _a;
    delete optionBuilder.data;
    build3(cons, optionBuilder, this);
    return (_a = optionBuilder.data) !== null && _a !== void 0 ? _a : {};
  }, methods: optionBuilder.methods, computed: optionBuilder.computed, watch: optionBuilder.watch, props: optionBuilder.props, inject: optionBuilder.inject, provide() {
    var _a;
    build9(cons, optionBuilder, this);
    return (_a = optionBuilder.provide) !== null && _a !== void 0 ? _a : {};
  } }, optionBuilder.hooks), { extends: extend });
  return raw;
}
function buildComponent(cons, arg, extend) {
  var _a;
  const option = ComponentOption(cons, extend);
  const slot = obtainSlot(cons.prototype);
  Object.keys(arg).reduce((option2, name) => {
    if (["options", "modifier", "emits", "setup", "provide"].includes(name)) {
      return option2;
    }
    option2[name] = arg[name];
    return option2;
  }, option);
  let emits = Array.from(slot.obtainMap("emits").keys());
  if (Array.isArray(arg.emits)) {
    emits = Array.from(/* @__PURE__ */ new Set([...emits, ...arg.emits]));
  }
  option.emits = emits;
  if (!option.setup) {
    option.setup = arg.setup;
  } else {
    const oldSetup = option.setup;
    const newSetup = (_a = arg.setup) !== null && _a !== void 0 ? _a : function() {
      return {};
    };
    const setup = function(props, ctx) {
      const newRet = newSetup(props, ctx);
      const oldRet = oldSetup(props, ctx);
      if (oldRet instanceof Promise || newRet instanceof Promise) {
        return Promise.all([newRet, oldRet]).then((arr) => {
          const ret = Object.assign({}, arr[0], arr[1]);
          return ret;
        });
      } else {
        const ret = Object.assign({}, newRet, oldRet);
        return ret;
      }
    };
    option.setup = setup;
  }
  const oldProvider = getProviderFunction(option.provide);
  const newProvider = getProviderFunction(arg.provide);
  option.provide = function() {
    return Object.assign({}, oldProvider.call(this), newProvider.call(this));
  };
  const map = slot.getMap("customDecorator");
  if (map && map.size > 0) {
    map.forEach((v) => {
      v.forEach((ite) => ite.creator.apply({}, [option, ite.key]));
    });
  }
  if (arg.options) {
    Object.assign(option, arg.options);
  }
  if (arg.modifier) {
    arg.modifier(option);
  }
  return defineComponent(option);
}
function build13(cons, option) {
  const slot = obtainSlot(cons.prototype);
  slot.inComponent = true;
  const superSlot = getSuperSlot(cons.prototype);
  if (superSlot) {
    if (!superSlot.inComponent) {
      throw "Class should be decorated by Component or ComponentBase: " + slot.master;
    }
    if (superSlot.cachedVueComponent === null) {
      throw "Component decorator 1";
    }
  }
  const component = buildComponent(cons, option, superSlot === null ? void 0 : superSlot.cachedVueComponent);
  component.__vfdConstructor = cons;
  slot.cachedVueComponent = component;
  cons.__vccOpts = component;
}
function _Component(cb, arg, ctx) {
  if (typeof arg === "function") {
    return compatibleClassDecorator(function(cons) {
      return cb(cons, {});
    })(arg, ctx);
  }
  return compatibleClassDecorator(function(cons) {
    return cb(cons, arg);
  });
}
function ComponentBase(arg, ctx) {
  return _Component(function(cons, option) {
    build13(cons, option);
    return cons;
  }, arg, ctx);
}
var Component = ComponentBase;
function toNative(cons) {
  const slot = obtainSlot(cons.prototype);
  if (!slot.inComponent) {
    throw "to native 1";
  }
  const cached = slot.cachedVueComponent;
  if (!cached) {
    throw "to native 2";
  }
  return cached;
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/option/vanilla.js
var decorator10 = optionNullableMemberDecorator(function(proto, name) {
  const slot = obtainSlot(proto);
  const map = slot.obtainMap("vanilla");
  map.set(name, true);
});

// vuedax/node_modules/vue-facing-decorator/dist/esm/custom/custom.js
function createDecorator(creator, opt) {
  return compatibleMemberDecorator(function(proto, key) {
    const slot = obtainSlot(proto);
    const map = slot.obtainMap("customDecorator");
    if (!map.has(key)) {
      map.set(key, []);
    }
    const arr = map.get(key);
    arr.push({
      key,
      creator,
      preserve: !!(opt === null || opt === void 0 ? void 0 : opt.preserve)
    });
  });
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/mixins.js
function mixins(...conses) {
  class MixinsClass extends Vue {
  }
  ComponentBase({
    mixins: conses.map((cons) => obtainSlot(cons.prototype).cachedVueComponent)
  })(MixinsClass);
  return MixinsClass;
}

// vuedax/node_modules/vue-facing-decorator/dist/esm/index.js
var IdentifySymbol = Symbol("vue-facing-decorator-identify");
function TSX() {
  return function(cons) {
    return cons;
  };
}
var Base = class {
  constructor(optionBuilder, vueInstance) {
    const props = optionBuilder.props;
    if (props) {
      Object.keys(props).forEach((key) => {
        this[key] = vueInstance[key];
      });
    }
    const methods = optionBuilder.methods;
    if (methods) {
      Object.keys(methods).forEach((key) => {
        this[key] = methods[key].bind(vueInstance);
      });
    }
  }
};
var Vue = Base;
export {
  Base,
  Component,
  ComponentBase,
  decorator8 as Emit,
  decorator2 as Hook,
  decorator6 as Inject,
  decorator9 as Model,
  decorator5 as Prop,
  decorator7 as Provide,
  decorator3 as Ref,
  decorator as Setup,
  TSX,
  decorator9 as VModel,
  decorator10 as Vanilla,
  Vue,
  decorator4 as Watch,
  createDecorator,
  mixins,
  toNative
};
//# sourceMappingURL=vue-facing-decorator.js.map
