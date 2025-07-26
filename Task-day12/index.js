import express, { Router } from "express";
import pkg from "pg";
import { engine } from "express-handlebars";
import session from "express-session";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const { Pool } = pkg;
const app = express();

// Middleware untuk membaca form dan JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware Session di Express
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Koneksi ke PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "my_project",
  password: "123456",
  port: 5432,
});

// Konfigurasi View Engine Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "public/views");

// Public folder (CSS, JS, dll)
app.use(express.static("public/assets/css"));
app.use(express.static("public/assets/script"));
app.use(express.static("public/assets/image"));
app.use("/uploads", express.static("public/uploads"));

// validasi tipe
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Filter file
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = [".jpeg", ".jpg", ".png"];
  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("hanya file dengan tipe jpeg, jpg ,png"));
  }
};

export const upload = multer({ storage, fileFilter });

// Fungsi bantu untuk menghitung durasi bulan
function getDurationInMonths(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const totalMonths = years * 12 + months + 1;

  return `${totalMonths} bulan`;
}

// route tampilan
app.get("/register", (req, res) => {
  res.render("register", { layout: false });
});

app.get("/login", (req, res) => {
  res.render("login", { layout: false });
});

function authMiddleware(req, res, next) {
  if (req.session.isLogin) {
    next();
  } else {
    res.redirect("/login");
  }
}

// route register
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.redirect("/login");
  } catch (err) {
    console.error("❌ Gagal register:", err.message);
    res.status(500).send("Gagal register");
  }
});

// route login
app.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    const user = result.rows[0];
    if (!user) {
      return res.status(401).send("❌ Username tidak ditemukan");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("❌ Password salah");
    }

    // Simpan data user di session
    req.session.user = { id: user.id, username: user.username };
    req.session.isLogin = true;

    res.redirect("/"); // arahkan ke home setelah login
  } catch (err) {
    console.error("❌ Gagal login:", err.message);
    res.status(500).send("Terjadi kesalahan saat login");
  }
});

// route logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// ROUTE: Simpan data project dari form
app.post("/projects", upload.single("image"), async (req, res) => {
  try {
    const { project_name, start_date, end_date, description, technologies } =
      req.body;

    const selectedTechnologies = Array.isArray(technologies)
      ? technologies.join(", ")
      : technologies;

    // Simpan nama file jika ada upload gambar
    const imagePath = req.file ? req.file.filename : null;

    // Simpan ke database
    await pool.query(
      `INSERT INTO projects (project_name, start_date, end_date, description, technologies, image)
   VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        project_name,
        start_date,
        end_date,
        description,
        selectedTechnologies,
        imagePath,
      ]
    );

    res.redirect("/");
  } catch (err) {
    console.error("Error saat menyimpan project:", err);
    res.status(500).send("Gagal menyimpan project");
  }
});

// route: halaman utama menampilkan project
app.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");

    const projects = result.rows.map((project) => ({
      ...project,
      duration: getDurationInMonths(project.start_date, project.end_date),
      technologies: Array.isArray(project.technologies)
        ? project.technologies
        : [],
    }));

    res.render("home", {
      layout: false,
      projects,
      user: req.session.user,
    });
  } catch (err) {
    console.error("❌ Gagal load home:", err.message);
    res.status(500).send("Gagal mengambil data");
  }
});

// route: detail project
app.get("/projects/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    const project = result.rows[0];

    if (!project) {
      return res.status(404).send("Project tidak ditemukan");
    }

    // Konversi teknologi jika belum array
    project.technologies = Array.isArray(project.technologies)
      ? project.technologies
      : project.technologies?.split(",") || [];

    // Hitung durasi
    project.duration = getDurationInMonths(project.start_date, project.end_date);

    // Tampilkan ke halaman 'details.handlebars'
    res.render("details", { layout: false, project });
  } catch (err) {
    console.error(" Gagal menampilkan project detail:", err.message);
    res.status(500).send("Gagal mengambil data project");
  }
});


// untuk mengecek apakah ada nilai di dalam array
app.engine(
  "handlebars",
  engine({
    helpers: {
      includes: (array, value) => {
        if (!Array.isArray(array)) return false;
        return array.includes(value);
      },
    },
  })
);

// Router: edit project
app.get("/projects/edit/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [
      id,
    ]);
    const project = result.rows[0];

    if (!project) {
      return res.status(404).send("Project tidak ditemukan");
    }

    // Ubah string menjadi array jika perlu
    project.technologies = project.technologies
      ? Array.isArray(project.technologies)
        ? project.technologies
        : project.technologies.split(",")
      : [];

    // Tambahkan daftar teknologi yang tersedia
    const techList = ["Node.js", "Next.js", "React.js", "TypeScript"];

    res.render("edit", {
      layout: false,
      project,
      techList,
    });
  } catch (err) {
    console.error(" Gagal mengambil project untuk edit:", err.message);
    res.status(500).send("Gagal mengambil data project");
  }
});

app.post("/projects/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { project_name, start_date, end_date, description, technologies } =
    req.body;

  try {
    const techArray = Array.isArray(technologies)
      ? technologies
      : [technologies];

    await pool.query(
      `UPDATE projects
       SET project_name = $1,
           start_date = $2,
           end_date = $3,
           description = $4,
           technologies = $5
       WHERE id = $6`,
      [project_name, start_date, end_date, description, techArray, id]
    );

    res.redirect("/");
  } catch (err) {
    console.error(" Gagal update project:", err.message);
    res.status(500).send("Gagal update project");
  }
});

// route: hapus project
app.post("/projects/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    res.redirect("/?success=delete");
  } catch (err) {
    console.error(" Gagal menghapus project:", err.message);
    res.redirect("/?error=" + encodeURIComponent(err.message));
  }
});

// Start server
app.listen(3000, () => {
  console.log("✅ Server jalan di http://localhost:3000");
});
