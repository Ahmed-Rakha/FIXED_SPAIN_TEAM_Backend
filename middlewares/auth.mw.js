
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user/userManagement.user.model");

// Middleware for authentication
exports.protectRoute = async (req, res, next) => {

    const token =
      req.cookies["access-token"] ||
      (req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : null);
  
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "No Autorizado: Debe iniciar sesión de nuevo",
      });
    }
    let decoded;
    try {
   
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      
    } catch (error) {
      console.log(error);
      
      if (error.name === "TokenExpiredError") {
        return res.status(403).json({
          status: "fail",
          message: "Sesion expirada. Por favor, inicia de nuevo",
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(403).json({
          status: "fail",
          message: "No Autorizado: Debe iniciar sesión de nuevo",
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "No Autorizado: Debe iniciar sesión de nuevo",
        });
      }
    }
  
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message:
          "No Autorizado: Usuario no encontrado. Por favor, Contacte al administrador",
      });
    }
  
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  };

  exports.checkForAdminRole = (req, res, next) => {
    const role = req.userRole;
    if (role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'No autorizado',
      });
    }
    next();
  };