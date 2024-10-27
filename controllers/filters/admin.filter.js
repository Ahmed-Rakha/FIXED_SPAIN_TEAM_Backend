exports.filterCasesByAdmin = async (req, res, next) => {
  try {
    const { filterBy, projection } = req.body;
    console.log(filterBy, projection);

    // Parsing filters and projection from query string
    const filters = {};
    if (filterBy.idCase) filters.idCase = filterBy.idCase;
    if (filterBy.status) filters.status = filterBy.status;
    if (filterBy.createdBy) filters.createdBy = filterBy.createdBy;
    if (filterBy.startDate || filterBy.endDate) {
      filters.dateProgress = {};
      if (filterBy.startDate)
        filters.dateProgress.$gte = new Date(filterBy.startDate);
      if (filterBy.endDate)
        filters.dateProgress.$lte = new Date(filterBy.endDate);
    }
    console.log('filters', filters);
    console.log('projection', projection);

    req.filters = filters;
    req.projection = projection;

    next();
  } catch (error) {
    console.error('Error filtering cases:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to filter cases',
    });
  }
};
