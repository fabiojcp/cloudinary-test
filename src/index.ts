import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const CLOUDINARY_URL = cloudinary.config({
  cloud_name: "dtgkjo5sy",
  api_key: "233472814953427",
  api_secret: "bGtUEh03unKMhW3sb78rGaEJHxU",
});

const app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log(`App rodando na porta 3000`);
});

const upload = multer({
  storage: multer.diskStorage({
    destination: "upload",
    filename: (request, file, callback) => {
      const filename = `${file.originalname}`;

      return callback(null, filename);
    },
  }),
});

app.post("/upload", upload.single("image"), async (req, res) => {
  console.log(req.file);
  const upload = await cloudinary.uploader.upload(
    req.file!.path,
    (error, result) => result
  );
  fs.unlink(req.file!.path, (error) => {
    if (error) {
      console.log(error);
    }
  });
  return res.json(upload);
});

app.get("/upload/:public_id", (req, res) => {
  const { public_id } = req.params;
  const image = cloudinary.url(public_id);
  res.json(image);
});
