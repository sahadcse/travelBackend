const {
  createTransport: create,
  getAllTransports: getAll,
  getTransportById: getById,
  updateTransport: update,
  deleteTransport: remove,
  searchTransports: search,
} = require("../services/transport.service");

const createTransport = async (req, res) => {
  try {
    const transport = await create({
      ...req.body,
      owner_id: req.user._id,
    });
    res.status(201).json({
      success: true,
      data: { transport },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating transport",
    });
  }
};

const getAllTransports = async (req, res) => {
  try {
    const transports = await getAll(req.query);
    res.status(200).json({
      success: true,
      results: transports.length,
      data: { transports },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching transports",
    });
  }
};

const getTransportById = async (req, res) => {
  try {
    const transport = await getById(req.params.id);
    if (!transport) {
      return res.status(404).json({
        success: false,
        message: "Transport not found",
      });
    }
    res.status(200).json({
      success: true,
      data: { transport },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching transport",
    });
  }
};

const updateTransport = async (req, res) => {
  try {
    const transport = await update(req.params.id, req.body);
    if (!transport) {
      return res.status(404).json({
        success: false,
        message: "Transport not found",
      });
    }
    res.status(200).json({
      success: true,
      data: { transport },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating transport",
    });
  }
};

const deleteTransport = async (req, res) => {
  try {
    await remove(req.params.id);
    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting transport",
    });
  }
};

const searchTransports = async (req, res) => {
  try {
    const transports = await search(req.query);
    res.status(200).json({
      success: true,
      results: transports.length,
      data: { transports },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error searching transports",
    });
  }
};

module.exports = {
  createTransport,
  getAllTransports,
  getTransportById,
  updateTransport,
  deleteTransport,
  searchTransports,
};
