/**
 * (note : Interface.js was extracted from one of my upcoming project: Spid.
 *  note to myself : I should really put it in its own package... #lazy)
 *
 * Usage:
 *
 *  var MyInterface = Interface('MyInterface', {
 *    'key': function(a, b){}
 *  });
 * @param {String} name
 * @param {Object} props
 *                    attributes or methods
 */
var Interface = function Interface(name, props) {
  if(!(this instanceof Interface)){
    return new Interface(name, props);
  }

  if (arguments.length !== 2) {
    throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
  }

  this.name = name;
  this.props = [];
  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      if (typeof key !== 'string' || (typeof props[key] !== 'string' && typeof props[key] !== 'object' && typeof props[key] !== 'function' && typeof props[key] !== 'number')) {
        throw new Error("Interface constructor expects method to be " +
            "passed in as a key value pairs. (insupported value type : " + typeof props[key] + ")");
      }
      this.props.push({key : key, value : props[key]});
    }
  }
};

/**
 * Helpers for Interface.ensureImplements
 * @param  {Function} ctor [description]
 * @throws {Error} see @Interface.ensureImplements
 * @return {Function} ctor
 */
Interface.prototype.ensureImplements = function(ctor){
  return Interface.ensureImplements(this, ctor);
};

var FUNCTION = 'function';
// var OBJECT   = 'object';
// var STRING   = 'string';

/**
 * Ensure that `ctor` implements `ifaces` interfaces
 * @param  {Interface|Array[Interface]} ifaces interfaces name
 * @param  {Function|Object} ctor Constructor to check against or Object
 * @throws {Error} If the object does not implement the interface
 * @chainable
 * @return {Function} ctor
 */
Interface.ensureImplements = function(ifaces, objOrCtor) {
  // syntaxic sugar
  if(!Array.isArray(ifaces)){
    ifaces = [ifaces];
  }

  function getProp(objOrCtor, prop){
    return objOrCtor.prototype ? objOrCtor.prototype[prop] : objOrCtor[prop];
  }

  function getName(objOrCtor){
    return objOrCtor.name || objOrCtor.__name__;
  }

  function getHumanName(objOrCtor){
    return typeof objOrCtor === 'function' ?
      'for instance of "' + getName(objOrCtor) + '"'
    : 'in object "' + getName(objOrCtor) + '"';
  }

  ifaces.forEach(function(iface){
    iface.props.forEach(function(prop){
      var name      = prop.key; // attribute or method name
      var value     = prop.value; // attribute (string|object) or method value (function)
      var valueType = typeof value; // string | object | function
      var propExist = !!getProp(objOrCtor, name);

      // check method
      if(valueType === FUNCTION){
        // present but not method
        if (propExist && typeof getProp(objOrCtor, name) !== FUNCTION) {
          throw new Error('Interface #<'+iface.name+'> requires a method "' + name + '", found "' + (typeof getProp(objOrCtor, name)) + '"');
        }

        // present as a method, but wrong argument number
        if(propExist && value.length !== getProp(objOrCtor, name).length){
          throw new Error('Interface #<'+iface.name+'> requires a method "' + name + '" with "'+ value.length + '" argument(s), found "' + getProp(objOrCtor, name).length + '"');
        }

        // present as a method with the right number of arguments
        if(propExist){
          return;
        }

        throw new Error('Interface #<'+iface.name+'> requires a method "' + name + '" ' + getHumanName(objOrCtor));
      }

      throw new Error('Interface #<'+iface.name+'> requires an attribute "' + name + '" ' + getHumanName(objOrCtor));
    });
  });

  return objOrCtor;
};

module.exports = Interface;
