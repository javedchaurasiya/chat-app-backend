const bcrypt = require("bcryptjs");

const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    // console.log("Hashing");
    const salt = await bcrypt.genSalt(10);
    // console.log(salt);
    const hash = await bcrypt.hash(password, salt);
    // console.log(hash);
    req.hash = hash;
    next();
  } catch (error) {
    // console.log(error);
    return res.status(403).json({ error });
  }
};

module.exports = hashPassword;
