const {
  createService: create,
  getAllServices: getAll,
  getServiceById: getById,
  updateService: update,
  deleteService: remove,
  searchServices: search,
} = require("../services/service.service");

const createService = async (req, res) => {
  try {
    const service = await create({
      ...req.body,
      owner_id: req.user._id,
    });
    res.status(201).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating service",
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await getAll(req.query);
    res.status(200).json({
      success: true,
      results: services.length,
      data: { services },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching services",
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await getById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching service",
    });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await update(req.params.id, req.body);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating service",
    });
  }
};

const deleteService = async (req, res) => {
  try {
    await remove(req.params.id);
    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting service",
    });
  }
};

const searchServices = async (req, res) => {
  try {
    const services = await search(req.query);
    res.status(200).json({
      success: true,
      results: services.length,
      data: { services },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error searching services",
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  searchServices,
};
