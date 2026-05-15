// @ts-nocheck
import { isPlainObject } from 'lodash'
import _extends from 'babel-runtime/helpers/extends'
import _typeof from 'babel-runtime/helpers/typeof'
/**
 * Determines whether the passed value is an integer. Uses `Number.isInteger` if available
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value - The value to be tested for being an integer.
 * @returns {boolean}
 */
const isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value
}

/**
 * No-op function
 */
const noop = function noop () {}

const warn = noop

/**
 * Determines whether the passed value is an Array.
 *
 * @param {*} value - The value to be tested for being an array.
 * @returns {boolean}
 */
const isArray = Array.isArray || function (value) {
  return toString.call(value) === '[object Array]'
}

const typeDefaults = function typeDefaults () {
  return {
    func: undefined,
    bool: undefined,
    string: undefined,
    number: undefined,
    array: undefined,
    object: undefined,
    integer: undefined
  }
}

const currentDefaults = typeDefaults()

/**
 * Checks if a value is a function
 *
 * @param {any} value - Value to check
 * @returns {boolean}
 */
const isFunction = function isFunction (value) {
  return toString.call(value) === '[object Function]'
}

/**
 * Adds a `isRequired` getter returning a new object with `required: true` key-value
 *
 * @param {object} type - Object to enhance
 */
const withRequired = function withRequired (type) {
  Object.defineProperty(type, 'isRequired', {
    get: function get () {
      this.required = true
      return this
    },

    enumerable: false
  }
  })
}

const ObjProto = Object.prototype
const toString = ObjProto.toString
const hasOwn = ObjProto.hasOwnProperty

const getNativeType = function getNativeType (value) {
  if (value === null || value === undefined) return null
  const match = value.constructor.toString().match(FN_MATCH_REGEXP)
  return match && match[1]
}

/**
 * Validates a given value against a prop type object
 *
 * @param {Object|*} type - Type to use for validation. Either a type object or a constructor
 * @param {*} value - Value to check
 * @param {boolean} silent - Silence warnings
 * @returns {boolean}
 */
const validateType = function validateType (type, value) {
  const silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false

  let typeToCheck = type
  let valid = true
  let expectedType
  if (!isPlainObject(type)) {
    typeToCheck = { type: type }
  }
  const namePrefix = typeToCheck._vueTypes_name ? typeToCheck._vueTypes_name + ' - ' : ''

  if (hasOwn.call(typeToCheck, 'type') && typeToCheck.type !== null) {
    if (isArray(typeToCheck.type)) {
      valid = typeToCheck.type.some(function (type) {
        return validateType(type, value, true)
    }
  })
      expectedType = typeToCheck.type.map(function (type) {
        return getType(type)
      }).join(' or ')
    } else {
      expectedType = getType(typeToCheck)

      if (expectedType === 'Array') {
        valid = isArray(value)
      } else if (expectedType === 'Object') {
        valid = isPlainObject(value)
      } else if (expectedType === 'String' || expectedType === 'Number' || expectedType === 'Boolean' || expectedType === 'Function') {
        valid = getNativeType(value) === expectedType
      } else {
        valid = value instanceof typeToCheck.type
      }
    }
  }

  if (!valid) {
    silent === false && warn(namePrefix + 'value "' + value + '" should be of type "' + expectedType + '"')
    return false
  }

  if (hasOwn.call(typeToCheck, 'validator') && isFunction(typeToCheck.validator)) {
    valid = typeToCheck.validator(value)
    if (!valid && silent === false) warn(namePrefix + 'custom validation failed')
    return valid
  }
  return valid
}

/**
 * Adds a `def` method to the object returning a new object with passed in argument as `default` property
 *
 * @param {object} type - Object to enhance
 */
const withDefault = function withDefault (type) {
  Object.defineProperty(type, 'def', {
    value: function value (def) {
      if (def === undefined && this.default === undefined) {
        this.default = undefined
        return this
      }
      if (!isFunction(def) && !validateType(this, def)) {
        warn(this._vueTypes_name + ' - invalid default value: "' + def + '"', def)
        return this
      }
      this.default = isArray(def) || isPlainObject(def)
        ? function () {
          return def
        }
        : def

      return this
    },

    enumerable: false,
    writable: false
  }
  })
}

/**
 * Adds `isRequired` and `def` modifiers to an object
 *
 * @param {string} name - Type internal name
 * @param {object} obj - Object to enhance
 * @returns {object}
 */
const toType = function toType (name, obj) {
  Object.defineProperty(obj, '_vueTypes_name', {
    enumerable: false,
    writable: false,
    value: name
  }
  })
  withRequired(obj)
  withDefault(obj)

  if (isFunction(obj.validator)) {
    obj.validator = obj.validator.bind(obj)
  }
  return obj
}

const PropTypes = {
  get any () {
    return toType('any', {
      type: null
    }
    })
  },

  get func () {
    return toType('function', {
      type: Function
    }).def(currentDefaults.func)
  },

  get bool () {
    return toType('boolean', {
      type: Boolean
    }).def(currentDefaults.bool)
  },

  get string () {
    return toType('string', {
      type: String
    }).def(currentDefaults.string)
  },

  get number () {
    return toType('number', {
      type: Number
    }).def(currentDefaults.number)
  },

  get array () {
    return toType('array', {
      type: Array
    }).def(currentDefaults.array)
  },

  get object () {
    return toType('object', {
      type: Object
    }).def(currentDefaults.object)
  },

  get integer () {
    return toType('integer', {
      type: Number,
      validator: function validator (value) {
        return isInteger(value)
          }).def(currentDefaults.integer)
  },

  get symbol () {
    return toType('symbol', {
      type: null,
      validator: function validator (value) {
        return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol'
      }
    })
  },

  custom: function custom (validatorFn) {
    const warnMsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'custom validation failed'

    if (typeof validatorFn !== 'function') {
      throw new TypeError('[VueTypes error]: You must provide a function as argument')
    }

    return toType(validatorFn.name || '<<anonymous function>>', {
      validator: function validator () {
        const valid = validatorFn.apply(undefined, arguments)
        if (!valid) warn(this._vueTypes_name + ' - ' + warnMsg)
        return valid
      }
    })
  },
  oneOf: function oneOf (arr) {
    if (!isArray(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument')
    }
    const msg = 'oneOf - value should be one of "' + arr.join('", "') + '"'
    const allowedTypes = arr.reduce(function (ret, v) {
      if (v !== null && v !== undefined) {
        ret.indexOf(v.constructor) === -1 && ret.push(v.constructor)
      }
      return ret
    }, [])

    return toType('oneOf', {
      type: allowedTypes.length > 0 ? allowedTypes : null,
      validator: function validator (value) {
        const valid = arr.indexOf(value) !== -1
        if (!valid) warn(msg)
        return valid
      }
    })
  },
  instanceOf: function instanceOf (instanceConstructor) {
    return toType('instanceOf', {
      type: instanceConstructor
    }
    })
  },
  oneOfType: function oneOfType (arr) {
    if (!isArray(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument')
    }

    let hasCustomValidators = false

    const nativeChecks = arr.reduce(function (ret, type) {
      if (isPlainObject(type)) {
        if (type._vueTypes_name === 'oneOf') {
          return ret.concat(type.type || [])
        }
        if (type.type && !isFunction(type.validator)) {
          if (isArray(type.type)) return ret.concat(type.type)
          ret.push(type.type)
        } else if (isFunction(type.validator)) {
          hasCustomValidators = true
        }
        return ret
      }
      ret.push(type)
      return ret
    }, [])

    if (!hasCustomValidators) {
      // we got just native objects (ie: Array, Object)
      // delegate to Vue native prop check
      return toType('oneOfType', {
        type: nativeChecks
      }).def(undefined)
    }

    const typesStr = arr.map(function (type) {
      if (type && isArray(type.type)) {
        return type.type.map(getType)
      }
      return getType(type)
    }).reduce(function (ret, type) {
      return ret.concat(isArray(type) ? type : [type])
    }, []).join('", "')

    return this.custom(function oneOfType (value) {
      const valid = arr.some(function (type) {
        if (type._vueTypes_name === 'oneOf') {
          return type.type ? validateType(type.type, value, true) : true
        }
        return validateType(type, value, true)
    }
  })
      if (!valid) warn('oneOfType - value type should be one of "' + typesStr + '"')
      return valid
    }).def(undefined)
  },
  arrayOf: function arrayOf (type) {
    return toType('arrayOf', {
      type: Array,
      validator: function validator (values) {
        const valid = values.every(function (value) {
          return validateType(type, value)
     }
   })
        if (!valid) warn('arrayOf - value must be an array of "' + getType(type) + '"')
        return valid
      }
    })
  },
  objectOf: function objectOf (type) {
    return toType('objectOf', {
      type: Object,
      validator: function validator (obj) {
        const valid = Object.keys(obj).every(function (key) {
          return validateType(type, obj[key])
     }
   })
        if (!valid) warn('objectOf - value must be an object of "' + getType(type) + '"')
        return valid
      }
    })
  },
  shape: function shape (obj) {
    const keys = Object.keys(obj)
    const requiredKeys = keys.filter(function (key) {
      return obj[key] && obj[key].required === true
    }
    })

    const type = toType('shape', {
      type: Object,
      validator: function validator (value) {
        const _this = this

        if (!isPlainObject(value)) {
          return false
        }
        const valueKeys = Object.keys(value)

        // check for required keys (if any)
        if (requiredKeys.length > 0 && requiredKeys.some(function (req) {
          return valueKeys.indexOf(req) === -1
        })) {
          warn('shape - at least one of required properties "' + requiredKeys.join('", "') + '" is not present')
          return false
        }

        return valueKeys.every(function (key) {
          if (keys.indexOf(key) === -1) {
            if (_this._vueTypes_isLoose === true) return true
            warn('shape - object is missing "' + key + '" property')
            return false
          }
          const type = obj[key]
          return validateType(type, value[key])
     }
   })
      }
    })

    Object.defineProperty(type, '_vueTypes_isLoose', {
      enumerable: false,
      writable: true,
      value: false
    }
    })

    Object.defineProperty(type, 'loose', {
      get: function get () {
        this._vueTypes_isLoose = true
        return this
      },

      enumerable: false
    }
    })

    return type
  }
}
const PaginationProps = {
  total: PropTypes.number,
  defaultCurrent: PropTypes.number,
  disabled: PropTypes.bool,
  current: PropTypes.number,
  defaultPageSize: PropTypes.number,
  pageSize: PropTypes.number,
  hideOnSinglePage: PropTypes.bool,
  showSizeChanger: PropTypes.bool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  buildOptionText: PropTypes.func,
  showSizeChange: PropTypes.func,
  showQuickJumper: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  showTotal: PropTypes.any,
  size: PropTypes.string,
  simple: PropTypes.bool,
  locale: PropTypes.object,
  prefixCls: PropTypes.string,
  selectPrefixCls: PropTypes.string,
  itemRender: PropTypes.any,
  role: PropTypes.string,
  showLessItems: PropTypes.bool
}
const SpinSize = PropTypes.oneOf(['small', 'default', 'large'])
const SpinProps = {
  prefixCls: PropTypes.string,
  spinning: PropTypes.bool,
  size: SpinSize,
  wrapperClassName: PropTypes.string,
  tip: PropTypes.string,
  delay: PropTypes.number,
  indicator: PropTypes.any
}

const FN_MATCH_REGEXP = /^\s*function (\w+)/

// https://github.com/vuejs/vue/blob/dev/src/core/util/props.js#L159
const getType = function getType (fn) {
  const type = fn !== null && fn !== undefined ? fn.type ? fn.type : fn : null
  const match = type && type.toString().match(FN_MATCH_REGEXP)
  return match && match[1]
}

const TableLocale = PropTypes.shape({
  filterTitle: PropTypes.string,
  filterConfirm: PropTypes.any,
  filterReset: PropTypes.any,
  emptyText: PropTypes.any,
  selectAll: PropTypes.any,
  selectInvert: PropTypes.any,
  sortTitle: PropTypes.string,
  expand: PropTypes.string,
  collapse: PropTypes.string
}).loose

const RowSelectionType = PropTypes.oneOf(['checkbox', 'radio'])

const TableRowSelection = {
  type: RowSelectionType,
  selectedRowKeys: PropTypes.array,
  // onChange?: (selectedRowKeys: string[] | number[], selectedRows: Object[]) => any;
  getCheckboxProps: PropTypes.func,
  // onSelect?: SelectionSelectFn<T>;
  // onSelectAll?: (selected: boolean, selectedRows: Object[], changeRows: Object[]) => any;
  // onSelectInvert?: (selectedRows: Object[]) => any;
  selections: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  hideDefaultSelections: PropTypes.bool,
  fixed: PropTypes.bool,
  columnWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectWay: PropTypes.oneOf(['onSelect', 'onSelectMultiple', 'onSelectAll', 'onSelectInvert']),
  columnTitle: PropTypes.any
}

const TableProps = {
  prefixCls: PropTypes.string,
  dropdownPrefixCls: PropTypes.string,
  rowSelection: PropTypes.oneOfType([PropTypes.shape(TableRowSelection).loose, null]),
  pagination: PropTypes.oneOfType([PropTypes.shape(_extends({}, PaginationProps, {
    position: PropTypes.oneOf(['top', 'bottom', 'both'])
  })).loose, PropTypes.bool]),
  size: PropTypes.oneOf(['default', 'middle', 'small', 'large']),
  dataSource: PropTypes.array,
  components: PropTypes.object,
  columns: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  rowClassName: PropTypes.func,
  expandedRowRender: PropTypes.any,
  defaultExpandAllRows: PropTypes.bool,
  defaultExpandedRowKeys: PropTypes.array,
  expandedRowKeys: PropTypes.array,
  expandIconAsCell: PropTypes.bool,
  expandIconColumnIndex: PropTypes.number,
  expandRowByClick: PropTypes.bool,
  // onExpandedRowsChange?: (expandedRowKeys: string[] | number[]) => void;
  //  onExpand?: (expanded: boolean, record: T) => void;
  // onChange?: (pagination: PaginationProps | boolean, filters: string[], sorter: Object) => any;
  loading: PropTypes.oneOfType([PropTypes.shape(SpinProps).loose, PropTypes.bool]),
  locale: TableLocale,
  indentSize: PropTypes.number,
  // onRowClick?: (record: T, index: number, event: Event) => any;
  customRow: PropTypes.func,
  customHeaderRow: PropTypes.func,
  useFixedHeader: PropTypes.bool,
  bordered: PropTypes.bool,
  showHeader: PropTypes.bool,
  footer: PropTypes.func,
  title: PropTypes.func,
  scroll: PropTypes.object,
  childrenColumnName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  bodyStyle: PropTypes.any,
  sortDirections: PropTypes.array,
  tableLayout: PropTypes.string,
  getPopupContainer: PropTypes.func,
  expandIcon: PropTypes.func,
  transformCellText: PropTypes.func
  // className?: PropTypes.string,
  // style?: React.CSSProperties;
  // children?: React.ReactNode;
}

const initDefaultProps = function (propTypes, defaultProps) {
  Object.keys(defaultProps).forEach(function (k) {
    if (propTypes[k]) {
      propTypes[k].def && (propTypes[k] = propTypes[k].def(defaultProps[k]))
    } else {
      throw new Error('not have ' + k + ' prop')
    }
  })
  return propTypes
}

const tableAllProps = initDefaultProps(TableProps, {
  dataSource: [],
  useFixedHeader: false,
  // rowSelection: null,
  size: 'default',
  loading: false,
  bordered: false,
  indentSize: 20,
  locale: {},
  rowKey: 'key',
  showHeader: true,
  sortDirections: ['ascend', 'descend'],
  childrenColumnName: 'children'
}
})

export {
  tableAllProps
}
