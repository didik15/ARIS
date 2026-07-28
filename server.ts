import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI safely
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    return new GoogleGenAI({ apiKey });
  };

  // Health check route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", appName: "A.R.I.S. (Application Reminding Integrated System)" });
  });

  // AI Chat Assistant endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }

      const ai = getAi();
      const prompt = `Anda adalah Asisten AI untuk Biro Jasa Keimigrasian & Pengurusan Dokumen "A.R.I.S. (Application Reminding Integrated System)". Anda ahli dalam peraturan keimigrasian Indonesia (Paspor WNI, Paspor WNA, KITAS Investor/Working/Family, KITAP, VOA, Izin Tinggal, Overstay, Perpanjangan, Sponsor Perusahaan/PT PMA).

Konteks Sistem & Client Saat Ini:
${context || "Tidak ada konteks dokumen khusus."}

Pertanyaan/Instruksi Staff Biro Jasa:
${message}

Berikan tanggapan yang profesional, sopan, praktis, dan sesuai regulasi imigrasi Indonesia (Direktorat Jenderal Imigrasi). Jika diminta membuat draf pesan/WhatsApp/Email ke client, buatkan draf pesan yang sangat ramah, jelas, profesional, dan menyertakan rincian tanggal serta ajakan bertindak (call to action) untuk perpanjangan dokumen. Gunakan bahasa Indonesia atau bahasa yang diminta.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Error in /api/ai/chat:", error);
      return res.status(500).json({
        error: error.message || "Gagal memproses permintaan AI. Pastikan GEMINI_API_KEY terkonfigurasi.",
      });
    }
  });

  // AI Document Assistant endpoint (Extract metadata or draft reminder)
  app.post("/api/ai/generate-reminder", async (req, res) => {
    try {
      const { clientName, docType, docNumber, expiryDate, daysLeft, language, channel } = req.body;

      const ai = getAi();
      const prompt = `Buatkan draf pesan pengingat (reminder) untuk client biro jasa keimigrasian.
Detail Client & Dokumen:
- Nama Client: ${clientName}
- Jenis Dokumen: ${docType} (contoh: Paspor, KITAS, KITAP, VOA)
- Nomor Dokumen: ${docNumber || "N/A"}
- Tanggal Expired: ${expiryDate}
- Sisa Hari Masa Berlaku: ${daysLeft} hari lagi
- Bahasa yang Digunakan: ${language || "Indonesia"}
- Saluran Komunikasi: ${channel || "WhatsApp"}

Ketentuan:
1. Jika saluran WhatsApp, gunakan format teks WhatsApp (huruf tebal *seperti ini*, bullet points, emojikemudian tambahkan salam hangat dari Biro Jasa A.R.I.S.).
2. Sertakan alasan pentingnya perpanjangan tepat waktu (misal: menghindari denda overstay Rp 1.000.000/hari untuk VOA/KITAS, atau aturan paspor minimal 6 bulan masa berlaku untuk perjalanan internasional).
3. Buatkan tombol/instruksi respon singkat agar client mudah membalas.
4. Jangan gunakan placeholder bertanda [kurung siku] berlebihan, isi dengan data yang diberikan atau estimasi profesional.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return res.json({ reminderText: response.text });
    } catch (error: any) {
      console.error("Error in /api/ai/generate-reminder:", error);
      return res.status(500).json({
        error: error.message || "Gagal membuat draf pengingat otomatis.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[A.R.I.S. Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
