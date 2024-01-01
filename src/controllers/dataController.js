import PDFDocument from "pdfkit-table";
import { findUserById } from "../queries/userQueries.js";
import { findRoleByUserId } from "../queries/roleQueries.js";
import { findAllPlants } from "../queries/plantQueries.js";
import { sequelize } from "../db/server.js";

/**
 * get user and all data related to him
 * prepare a pdf file and stock all info in tables
 * send pdf to user as a downloadable file
 */
export const dataUserSend = async (req, res) => {
  let message;
  try {
    //create the pdf and a array that will contain datas
    const doc = new PDFDocument({ margin: 24, size: "A4" });
    const buffers = [];

    //when doc receiva data, push this on buffer array
    doc.on("data", (chunk) => {
      buffers.push(chunk);
    });
    //when write if finish, get all datas stored in buffer, set headers to download file, and send to user
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="petal-patrol-user-data.pdf"'
      );
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdfData);
    });

    const { id } = req.user;
    const datas = await Promise.all([
      findUserById(id),
      findRoleByUserId(id),
      findAllPlants("user", id),
    ]);

    async function createTable(data) {
      let options = null;
      if (data instanceof sequelize.models.user) {
        options = {
          title: "Information compte utilisateur",
          headers: ["identifiant", "nom d'utilisateur", "email", "avatar"],
          rows: [[data.id, data.name, data.email, data.avatar || "null"]],
        };
      } else if (data[0] instanceof sequelize.models.role) {
        options = {
          title: "Rôle compte utilisateur",
          headers: [{ label: "role", property: "role" }],
          datas: data,
        };
      } else if (data[0] instanceof sequelize.models.plant) {
        options = {
          title: "Plantes enregistrées par l'utilisateur",
          headers: [
            { label: "name", property: "name" },
            { label: "type", property: "type" },
          ],
          datas: data,
        };
      } else {
        console.log("empty datas or unknow model");
        console.log(data);
      }

      if (options) {
        await doc.table(options);
      }
    }

    datas.forEach((data) => createTable(data));

    doc.end();

    // res.send("hello");
  } catch (error) {
    console.error("<dataController: dataUserSend>", error);
    message = "Erreur lors de la récupération des données de l'utilisateur.";
    res.status(500).json({ message });
  }
};
