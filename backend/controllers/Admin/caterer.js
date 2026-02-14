const Caterer = require("../../models/Caterer");

const addCaterer = async (req, res) => {
  const { catererName, catererId } = req.body;

  if (!catererName || !catererId) {
    return res.status(400).json({ success: false, message: "Caterer name and ID are required" });
  }

  console.log("Received Caterer:", { catererName, catererId });

  try {
    const newCaterer = new Caterer({ caterer_id: catererId, name: catererName });
    await newCaterer.save();

    console.log("Caterer added successfully");
    return res.status(200).json({
      success: true,
      message: "Caterer added successfully",
      data: newCaterer,
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ success: false, message: "Error adding caterer", error: err });
  }
};

const CatererList = async (req, res) => {
  try {
    const caterers = await Caterer.find({});

    if (caterers.length === 0) {
      return res.status(404).json({ success: false, message: "No caterers found" });
    }

    return res.status(200).json({
      success: true,
      message: "Caterers retrieved successfully",
      data: caterers,
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ success: false, message: "Error fetching caterers", error: err });
  }
};

const deleteCaterer = async (req, res) => {
  const catererId = req.params.catererId;
  console.log("Deleting caterer:", catererId);

  try {
    const result = await Caterer.findOneAndDelete({ caterer_id: catererId });

    if (!result) {
      return res.status(404).send("Caterer not found.");
    }

    return res.send("Caterer deleted successfully.");
  } catch (err) {
    console.error("Error deleting caterer:", err);
    return res.status(500).send("Error deleting caterer.");
  }
};

module.exports = { addCaterer, CatererList, deleteCaterer };
