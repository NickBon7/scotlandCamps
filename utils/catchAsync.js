module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
//gia ta lathoi sto price pou ta vriksoi apo Schema pou to exoume dilwsei Number

//catchAsync egine wrap se ola ta app.get