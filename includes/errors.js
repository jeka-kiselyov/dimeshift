var restify = require('restify');
var util = require('util');
var restifyErrors = require('restify-errors');

function ValidationError(err) {
  restifyErrors.RestError.call(this, {
    restCode: 'ValidationError',
    statusCode: 666,
    message: [],
    constructorOpt: ValidationError
  });
  this.name = 'ValidationError';
  if (typeof(err.errors) !== 'undefined') {
    for (var k in err.errors)
      this.message.push(err.errors[k].message);
  } else {
    console.log(err);
    this.message.push("" + err);
  }
};
util.inherits(ValidationError, restifyErrors.RestError);


function HaveNoRightsError() {
  restifyErrors.RestError.call(this, {
    restCode: 'HaveNoRightsError',
    statusCode: 6969,
    message: 'You have no rights to call this API method with this parameters. Try to check auth hash',
    constructorOpt: HaveNoRightsError
  });
  this.name = 'HaveNoRightsError';
};
util.inherits(HaveNoRightsError, restifyErrors.RestError);

function NotFoundError() {
  restifyErrors.RestError.call(this, {
    restCode: 'NotFoundError',
    statusCode: 404,
    message: 'Nothing is found. Please check item id',
    constructorOpt: NotFoundError
  });
  this.name = 'NotFoundError';
};
util.inherits(NotFoundError, restifyErrors.RestError);

exports.ValidationError = ValidationError;
exports.HaveNoRightsError = HaveNoRightsError;
exports.NotFoundError = NotFoundError;