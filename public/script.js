const baseURL = "http://localhost:5100";

function loadData() {
    axios.get(`${baseURL}/dashboard`)
        .then(res => {
            const data = res.data;

            // MEMBERS
            let mList = document.getElementById("membersList");
            mList.innerHTML = "";
            data.members.forEach(m => {
                mList.innerHTML += `<li>${m}</li>`;
            });

            // BOOKS
            let bList = document.getElementById("booksList");
            bList.innerHTML = "";
            for (let b in data.books) {
                bList.innerHTML += `<li>${b} (${data.books[b]})</li>`;
            }


            // BORROWED
            let table = document.getElementById("borrowedTable");
            table.innerHTML = "";
            data.borrowedlist.forEach(i => {
                table.innerHTML += `
                <tr>
                    <td>${i.name}</td>
                    <td>${i.book}</td>
                    <td>${i.qty}</td>
                    <td>${i.date}</td>
                    <td>
                        <button onclick="returnBook(${i.id})">Return</button>
                    </td>
                </tr>`;
            });
        });
}

// ===== ACTIVITY LOGGER =====
function logActivity(message) {
    let log = document.getElementById("activityLog");

    let time = new Date().toLocaleTimeString();

    let li = document.createElement("li");
    li.innerText = `[${time}] ${message}`;

    log.prepend(li); // newest on top
}

// ===== ACTIONS =====

// ADD MEMBER
function addMember() {
    let name = document.getElementById("memberName").value;

    axios.post(`${baseURL}/addMember`, { name })
        .then(() => {
            logActivity(`👤 Member added: ${name}`);
            loadData();
        });
}

// DELETE MEMBER
function deleteMember() {
    let name = document.getElementById("deleteName").value;

    axios.post(`${baseURL}/deleteMembers`, { name })
        .then(() => {
            logActivity(`🗑 Member deleted: ${name}`);
            loadData();
        });
}

// ADD BOOK
function addBook() {
    let book = document.getElementById("bookName").value;
    let qty = document.getElementById("bookQty").value;

    axios.post(`${baseURL}/addBook`, { book, qty })
        .then(() => {
            logActivity(`📘 Added ${qty} copies of "${book}"`);
            loadData();
        });
}


function deleteBook() {
    let book = document.getElementById("deleteBookName").value;

    axios.post(`${baseURL}/deleteBook`, { book })
        .then(() => {
            logActivity(`🗑 Book deleted: "${book}"`);
            loadData();
        });
}

// BORROW BOOK
function borrowBook() {
    let name = document.getElementById("borrowName").value;
    let book = document.getElementById("borrowBook").value;
    let qty = document.getElementById("borrowQty").value;

    axios.post(`${baseURL}/borrowBook`, { name, book, qty })
        .then(() => {
            logActivity(`📦 ${name} borrowed ${qty} of "${book}"`);
            loadData();
        });
}

// RETURN BOOK
function returnBook(id) {
    axios.post(`${baseURL}/returnBook`, { id })
        .then(() => {
            logActivity(`🔄 Book returned (ID: ${id})`);
            loadData();
        });
}
loadData();
