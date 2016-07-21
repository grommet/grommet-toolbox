"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (arr1, arr2) {
  var result = (arr1 || []).concat(arr2);

  return result.filter(function (elem, index) {
    return result.indexOf(elem) === index;
  });
};