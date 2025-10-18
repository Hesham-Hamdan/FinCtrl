const express = require("express");
const { protect } = require("./../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("./../controllers/authController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// This route now correctly handles the response from the Cloudinary upload middleware.
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // THE FIX: The 'multer-storage-cloudinary' middleware provides the full,
  // public URL of the uploaded image in the 'req.file.path' property.
  res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;
