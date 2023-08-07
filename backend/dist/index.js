import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import XLSX from "xlsx";
import xlsx from "xlsx";
import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const upload = multer({ dest: "uploads/" });

const uri =
  "mongodb+srv://shaikhabrar637:mongo%40637@cluster0.rkx2uaw.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

//   const build=path.join(__dirname+'/public')
// // path.join(__dirname+'/public')
// app.use(express.static(build))

// app.get('*',async(req,res)=>{
//     res.sendFile(path.join(build,'index.html'))
// })

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  files: [{ filename: String, path: String }]
});

const User = new mongoose.model("mainUser", userSchema);

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// get current fileList from backend

app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    } else {
      res.send(user.files);
    }
  } catch (err) {
    console.log(err);
  } finally {
    console.log("COMPLETED");
  }
});

app.post("/fileUploader", upload.single("file"), async (req, res) => {
  // file content with user id
  // then file will be stored against that user
  const file = req.file;
  const userId = req.body.userId;
  console.log("FILE", req.body);
  const workbook = xlsx.readFile(file.path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  // Assuming your Excel has a header row, skip the first row (index 0)
  const data = jsonData.slice(1);

  // Save the file information to the user in MongoDB
  User.findByIdAndUpdate(
    userId,
    { $push: { files: { filename: file.originalname, path: file.path } } },
    { new: true }
  )
    .then((updatedUser) => {
      // File uploaded and user updated successfully
      res
        .status(200)
        .json({ message: "File uploaded successfully!", user: updatedUser });
    })
    .catch((error) => {
      // Error occurred while saving the data
      res.status(500).json({ error: "Error saving data to the database." });
    });
});

function convertExcelDate(serialNumber) {
  const date = new Date((serialNumber - 25569) * 86400 * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

app.get("/fileUploader/:userId/:fileId", (req, res) => {
  const { userId, fileId } = req.params;

  // Assuming you have a User model imported
  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }

      const file = user.files.find((file) => file._id.toString() === fileId);
      if (!file) {
        throw new Error("File not found");
      }
      fs.readFile(file.path, (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return res.status(500).send("Error reading file");
        }

        const workbook = XLSX.read(data, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Convert Excel date values to "yyyy-mm-dd" format
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          for (let j = 0; j < row.length; j++) {
            const cellValue = row[j];
            if (typeof cellValue === "number" && cellValue > 59) {
              row[j] = convertExcelDate(cellValue);
            }
          }
        }

        res.json(jsonData);
      });
    })
    .catch((error) => {
      console.error("Error fetching file content:", error);
      res.status(404).send("File not found");
    });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      if (password === user.password) {
        res.send({ message: "Login successful", user });
      } else {
        res.send({ message: "Password incorrect" });
      }
    } else {
      res.send({ message: "User not found" });
    }
  } catch (err) {
    res.send({ message: err.message });
  }
});

app.post("/signUp", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({
      email: email
    });

    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const newSignUp = new User({
        username,
        email,
        password
      });
      await newSignUp.save();
      res.send({ message: "Signed up successfully" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.listen(9002, () => {
  console.log("BE started at port 9002");
});
