

const ctrlWrap = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      console.error("Error in controller:", error);
      next(error);
    }
  };

  return func;
};

module.exports = ctrlWrap;
