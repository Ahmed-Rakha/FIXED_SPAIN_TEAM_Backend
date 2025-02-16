const UserCaseGrande = require("../../models/user/caseGrande.user.model");
const AdminCaseGrande = require("../../models/admin/caseGrande.admin.model");
const User = require("../../models/user/userManagement.user.model");

exports.getCase = async (req, res) => {
  try {
    const caseGrande = await UserCaseGrande.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        caseGrande,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "No case found",
    });
  }
};

exports.createCase = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const createdBy = `${user.firstName} ${user.lastName}`;
    req.body.userId = req.userId;
    req.body.createdBy = createdBy;

    const newCaseGrande = await UserCaseGrande.create(req.body);

    console.log("New Case Created:", newCaseGrande);
    res.status(201).json({
      status: "success",
      data: {
        newCaseGrande,
      },
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      const duplicates = Object.entries(err.keyValue).map(([key, value]) => {
        return `${key} ${value} ya existe`;
      });

      return res.status(409).json({
        status: "fail",
        message:
          "Los siguientes campos tienen valores duplicados: " +
          duplicates.join(", "),
        keyValue: err.keyValue,
      });
    }
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const cases = await UserCaseGrande.find(req.params);

    if (!cases || cases.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No cases found",
      });
    }

    // Loop through each case and update
    const modificationDate = new Date().toISOString().split("T")[0];
    const updatedCases = [];

    for (let caseGrande of cases) {
      const previousStatus = caseGrande.status;
      caseGrande.previousStatus = previousStatus;
      caseGrande.status = req.body.status;
      caseGrande.lastModified = modificationDate;

      // Save each case
      await caseGrande.save({ validateBeforeSave: false });
      updatedCases.push(caseGrande);
    }

    console.log("Updated cases:", updatedCases);

    res.status(200).json({
      status: "success",
      data: {
        updatedCases,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

// exports.updateCase = async (req, res) => {
//   try {
//     const caseGrande = await UserCaseGrande.findOne(req.params);

//     if (!caseGrande) {
//       return res.status(404).json({
//         status: "fail",
//         message: "No case found",
//       });
//     }
//     const previousStatus = caseGrande.status;
//     const modificationDate = new Date().toISOString().split("T")[0];
//     caseGrande.previousStatus = previousStatus;
//     caseGrande.status = req.body.status;
//     caseGrande.lastModified = modificationDate;

//     await caseGrande.save({ validateBeforeSave: false });
//     console.log("caseGrande", caseGrande);

//     res.status(200).json({
//       status: "success",
//       data: {
//         caseGrande,
//       },
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(400).json({
//       status: "fail",
//       message: "Invalid data sent!",
//     });
//   }
// };

exports.deleteCase = async (req, res) => {
  try {
    await UserCaseGrande.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "No case found",
    });
  }
};

exports.getUserCases = async (req, res) => {
  try {
    const insertedCasesByUsers = await UserCaseGrande.find().lean();
    const userCases = insertedCasesByUsers.filter(
      (caseGrande) => caseGrande.userId == req.userId
    );
    const insertedCasesByAdmin = await AdminCaseGrande.find().lean();
    const casesHandledByUser = userCases.map((userCase) => {
      const mainCase = insertedCasesByAdmin.find((adminCase) => {
        return userCase.idCase == adminCase.idCase;
      });
      return { ...userCase, mainCase };
    });

    res.status(200).json({
      status: "success",
      data: {
        cases: casesHandledByUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: "No cases found",
    });
  }
};
