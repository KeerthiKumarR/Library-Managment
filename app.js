const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let obj = {
  total: 50,
  books: {},
  members: [],
  borrowedlist: [],
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.send(obj);
});

app.post("/addMember", (req, res) => {
  const { name } = req.body;
  if (!name) return res.send("Invalid name");

  obj.members.push(name);
  res.send("Member added");
});

app.post("/deleteMembers", (req, res) => {
  const { name } = req.body;
  obj.members = obj.members.filter((m) => m !== name);
  res.send("Member deleted");
});

app.post("/addBook", (req, res) => {
  const { book, qty } = req.body;

  if (!book || !qty) return res.send("Invalid input");

  obj.books[book] = (obj.books[book] || 0) + Number(qty);
  res.send("Book added");
});

app.post("/borrowBook", (req, res) => {
  const { name, book, qty } = req.body;
  const quantity = Number(qty);

  if (!obj.members.includes(name)) {
    return res.send("Member doesn't exist");
  }

  if (!obj.books[book] || obj.books[book] < quantity) {
    return res.send("Not enough books available");
  }

  obj.books[book] -= quantity;

  obj.borrowedlist.push({
    id: Date.now(),
    name,
    book,
    qty: quantity,
    date: new Date().toLocaleString(),
  });

  res.send("Book borrowed");
});

app.post("/returnBook", (req, res) => {
  const { id } = req.body;

  const index = obj.borrowedlist.findIndex((b) => b.id == id);

  if (index === -1) return res.send("Record not found");

  const record = obj.borrowedlist[index];

  obj.books[record.book] += record.qty;

  obj.borrowedlist.splice(index, 1);

  res.send("Book returned");
});

app.post("/deleteBook", (req, res) => {
  const { book } = req.body;

  if (!obj.books[book]) {
    return res.send("Book not found");
  }

  delete obj.books[book];

  res.send("Book deleted");
});

app.listen(5100, () => {
  console.log("Server running at port 5100");
});
