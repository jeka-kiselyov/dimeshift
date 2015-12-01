var restify = require('restify');
var util = require('util');

function ValidationError(err) {
  restify.RestError.call(this, {
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
util.inherits(ValidationError, restify.RestError);


function HaveNoRightsError() {
  restify.RestError.call(this, {
    restCode: 'HaveNoRightsError',
    statusCode: 6969,
    message: 'You have no rights to call this API method with this parameters. Try to check auth hash',
    constructorOpt: HaveNoRightsError
  });
  this.name = 'HaveNoRightsError';
};
util.inherits(HaveNoRightsError, restify.RestError);

function NotFoundError() {
  restify.RestError.call(this, {
    restCode: 'NotFoundError',
    statusCode: 404,
    message: 'Nothing is found. Please check item id',
    constructorOpt: NotFoundError
  });
  this.name = 'NotFoundError';
};
util.inherits(NotFoundError, restify.RestError);

exports.ValidationError = ValidationError;
exports.HaveNoRightsError = HaveNoRightsError;
exports.NotFoundError = NotFoundError;