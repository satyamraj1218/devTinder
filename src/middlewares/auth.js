const adminAuth = (req, res, next) => {
  console.log("admin authorization");
  const token = "xyz";
  isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Admin is not authorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("user authorization");
  const token = "xyz";
  isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("User is not authorized");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
