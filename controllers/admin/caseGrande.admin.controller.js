const CaseGrande = require('../../models/admin/caseGrande.admin.model');

const AdminCaseGrande = require('../../models/admin/caseGrande.admin.model');
const UserCaseGrande = require('../../models/user/caseGrande.user.model');

exports.getCasesHandledByUsers = async (req, res) => {
  console.log("req.userRole", req.userRole);
  
  if (req.userRole !== "admin") {
    return res.status(403).json({
      status: "error", 
      message: "Unauthorized",
    });
  }
  try {
    // const projection = req.projection || {};
    // console.log("projectionME", projection);
    // console.log("filtersme", req.filters);

    // const { idCase, status, createdBy, startDate, endDate } = req.filters || {};

    // Build user case filters
    // const userCaseFilters = {};
    // if (idCase) userCaseFilters.idCase = idCase;
    // if (status) userCaseFilters.status = status;
    // if (createdBy) userCaseFilters.createdBy = createdBy;
    // if (startDate || endDate) {
    //   userCaseFilters.dateProgress = {};
    //   if (startDate) userCaseFilters.dateProgress.$gte = new Date(startDate);
    //   if (endDate) userCaseFilters.dateProgress.$lte = new Date(endDate);
    // }
    // console.log("userCaseFilters", userCaseFilters);

    // Fetch filtered user cases
    const userCases = await UserCaseGrande.find();
    console.log("userCases", userCases);
    
    // Fetch the corresponding admin cases
    const adminCases = await AdminCaseGrande.find({
      idCase: { $in: userCases.map((userCase) => userCase.idCase) },
    });

    // Combine admin cases with user cases
    const casesWithUserDetails = adminCases.map((adminCase) => ({
      ...adminCase.toObject(),
      userCases: userCases.filter(
        (userCase) => userCase.idCase === adminCase.idCase
      ),
    }));

    res.status(200).json({
      status: "success",
      data: {
        cases: casesWithUserDetails,
      },
    });
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch cases",
      error: err.message,
    });
  }
};



exports.getAllCasesGrandes = async (req, res) => {
  try {
    const cases = await CaseGrande.find();

    res.status(200).json({
      status: 'success',
      data: {
        cases,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'No cases found',
    });
  }
};

exports.getCase = async (req, res) => {

  try {
    const cases = await CaseGrande.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        cases,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'No case found',
    });
  }
};

exports.createCase = async (req, res) => {
  try {
    const newCaseGrande = await CaseGrande.create(req.body);
    console.log('New Case Created:', newCaseGrande);

    res.status(201).json({
      status: 'success',
      data: {
        newCaseGrande,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: 'fail',
        message: `Caso Grande ${err.keyValue.idCase} ya existe`,
        keyValue: err.keyValue,
      });
    }

    console.error('Error creating case:', err);
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
      error: err.message,
    });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const caseGrande = await CaseGrande.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        caseGrande,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'No case found',
    });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    await CaseGrande.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'No case found',
    });
  }
};



// exports.test = async (req, res) => {
//   const adminCases = await AdminCaseGrande.find();
//   const userCases = await UserCaseGrande.find().populate('idCase');
//   console.log('adminCases', adminCases);
//   console.log('userCases', userCases);
  
  
  // const cases = adminCases.map(adminCase => {
  //   const relatedUserCases = userCases.filter(userCase => userCase.idCase.toString() === adminCase._id.toString());
  //   return {
  //     ...adminCase.toObject(),
  //     userCases: relatedUserCases,
  //   };
  // });

  // return cases;
// }