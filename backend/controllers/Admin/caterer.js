const Caterer = require("../../models/Caterer");

const addCaterer = async (req, res) => {
  const { catererName, catererId, password, phone } = req.body;
  if (!catererName || !catererId)
    return res.status(400).json({ success: false, message: "Caterer name and ID are required" });

  try {
    const newCaterer = new Caterer({
      caterer_id: catererId,
      name: catererName,
      password: password || 'caterer123',
      phone: phone || ''
    });
    await newCaterer.save();
    return res.status(200).json({ success: true, message: "Caterer added successfully", data: newCaterer });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: "Caterer ID already exists" });
    return res.status(500).json({ success: false, message: "Error adding caterer", error: err });
  }
};

const CatererList = async (req, res) => {
  try {
    const caterers = await Caterer.find({});
    // ✅ Always 200, even empty
    return res.status(200).json({ success: true, message: "Caterers retrieved", data: caterers });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching caterers", error: err });
  }
};

const deleteCaterer = async (req, res) => {
  const catererId = req.params.catererId;
  try {
    const result = await Caterer.findOneAndDelete({ caterer_id: catererId });
    if (!result) return res.status(404).json({ success: false, message: "Caterer not found" });
    return res.json({ success: true, message: "Caterer deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error deleting caterer" });
  }
};

module.exports = { addCaterer, CatererList, deleteCaterer };
