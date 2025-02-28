const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const data = `IP: ${ip} - User-Agent: ${userAgent} - Fecha: ${new Date().toISOString()}\n`;

    // Guardar la IP en un archivo
    fs.appendFileSync("ips.txt", data);

    // Redirigir a otra página después de capturar la IP
    res.redirect("https://www.google.com"); // Puedes cambiar la URL
});

app.get("/ver", (req, res) => {
    const ips = fs.existsSync("ips.txt") ? fs.readFileSync("ips.txt", "utf-8") : "No hay IPs registradas.";
    res.send(`<pre>${ips}</pre>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
