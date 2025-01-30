import bcryptjs from "bcryptjs";

const checkPassword = (password) => {
  // TODO: rules for password generation
  return true;
};

const comparePassword = (password, hashedPassword) => {
  const eq = bcryptjs.compareSync(password, hashedPassword);
  return eq;
};

const _password = {
  checkPassword,
  comparePassword,
};

export default _password;
