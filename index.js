const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
const serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Your routes go here...
app.post("/api/create", (req, res) => {
  try {
    db.collection("userdetails")
      .doc(`/${Date.now()}/`)
      .create({
        id: Date.now(),
        name: req.body.name,
        mobile: req.body.mobile,
        address: req.body.address,
      });
    return res.status(200).send({ status: "Success", msg: "Data Saved" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Failed", msg: error });
  }
});

app.get("/api/userDetail/:id", (req, res) => {
  try {
    const reqDoc = db.collection("userdetails").doc(req.params.id);
    reqDoc.get().then((userDetail) => {
      const response = userDetail.data();
      return res.status(200).send({ status: "Success", data: response });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Failed", msg: error });
  }
});

app.get("/api/userDetails", (req, res) => {
  try {
    const query = db.collection("userdetails");
    const response = [];

    query.get().then((data) => {
      const docs = data.docs;

      docs.map((doc) => {
        const selectedData = {
          name: doc.data().name,
          mobile: doc.data().mobile,
          address: doc.data().address,
        };

        response.push(selectedData);
      });

      return res.status(200).send({ status: "Success", data: response });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Failed", msg: error });
  }
});

// Update
app.put("/api/update/:id", (req, res) => {
  try {
    const reqDoc = db.collection("userdetails").doc(req.params.id);
    reqDoc.update({
      name: req.body.name,
      mobile: req.body.mobile,
      address: req.body.address,
    });
    return res.status(200).send({ status: "Success", msg: "Data Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Failed", msg: error });
  }
});

// Delete
app.delete("/api/delete/:id", (req, res) => {
  try {
    const reqDoc = db.collection("userdetails").doc(req.params.id);
    reqDoc.delete();
    return res.status(200).send({ status: "Success", msg: "Data Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Failed", msg: error });
  }
});

const port = process.env.PORT || 9001;

// Start the server
app.listen(port, () => console.log(`Listening to port ${port}`));
