const fs = require('fs');
const path = require('path');

exports.format = format;
function format(dir) {
  const re = /^([^:]+):\/(.+)$/.exec(dir);
  return {
    type: re[1],
    pathname: '/' + re[2]
  }
}

exports.defaultCamelize = defaultCamelize;
function defaultCamelize(filepath, options) {
  const { caseStyle, lowercaseFirst } = options;
  const properties = filepath.substring(0, filepath.lastIndexOf('.')).split('/');
  return properties.map(property => {
    if (!/^[a-z][a-z0-9_-]*$/i.test(property)) {
      throw new Error(`${property} is not match 'a-z0-9_-' in ${filepath}`);
    }
    property = property.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());
    let first = property[0];
    switch (caseStyle) {
      case 'lower':
        first = first.toLowerCase();
        break;
      case 'upper':
        first = first.toUpperCase();
        break;
      case 'camel':
      default:
    }
    if (lowercaseFirst) first = first.toLowerCase();
    return first + property.substring(1);
  });
}

exports.properties = properties;
function properties(file, dir) {
  const paths = path.relative(dir, file);
  return defaultCamelize(paths, {
    caseStyle: 'camel',
    lowercaseFirst: true
  });
}

exports.defineValue = defineValue;
function defineValue(str, obj, value) {
  const strs = str.split('.');
  let data = obj;
  for (let i = 0; i < strs.length; i++) {
    if (i === strs.length - 1) {
      data[strs[i]] = value;
    } else {
      if (data[strs[i]] === undefined) {
        data[strs[i]] = {};
      }
      data = data[strs[i]];
    }
  }
}

exports.unlinkValue = unlinkValue;
function unlinkValue(str, obj) {
  const strs = str.split('.');
  let data = obj;
  for (let i = 0; i < strs.length; i++) {
    if (i === strs.length - 1) {
      delete data[strs[i]];
    } else {
      if (data[strs[i]] === undefined) break;
      data = data[strs[i]];
    }
  }
}

exports.readJson = readJson;
function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}