const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'data', 'contacts.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readContacts() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeContacts(contacts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2), 'utf8');
}

function nextId(contacts) {
  return contacts.length ? Math.max(...contacts.map(c => Number(c.id) || 0)) + 1 : 1;
}

app.get('/api', (req, res) => {
  res.json({
    project: 'Практическая работа №5 — CRUD телефонных контактов',
    student: 'Леденёв Глеб',
    endpoints: [
      'GET /api/contacts',
      'GET /api/contacts/:id',
      'POST /api/contacts',
      'PUT /api/contacts/:id',
      'DELETE /api/contacts/:id'
    ]
  });
});

app.get('/api/contacts', (req, res) => {
  res.json(readContacts());
});

app.get('/api/contacts/:id', (req, res) => {
  const contacts = readContacts();
  const contact = contacts.find(c => c.id === Number(req.params.id));
  if (!contact) return res.status(404).json({ error: 'Контакт не найден' });
  res.json(contact);
});

app.post('/api/contacts', (req, res) => {
  const { name, phone, email = '', company = '' } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Поля name и phone обязательны' });
  }
  const contacts = readContacts();
  const contact = { id: nextId(contacts), name, phone, email, company };
  contacts.push(contact);
  writeContacts(contacts);
  res.status(201).json(contact);
});

app.put('/api/contacts/:id', (req, res) => {
  const contacts = readContacts();
  const index = contacts.findIndex(c => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Контакт не найден' });

  const { name, phone, email = '', company = '' } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Поля name и phone обязательны' });
  }

  contacts[index] = {
    id: contacts[index].id,
    name,
    phone,
    email,
    company
  };
  writeContacts(contacts);
  res.json(contacts[index]);
});

app.delete('/api/contacts/:id', (req, res) => {
  const contacts = readContacts();
  const index = contacts.findIndex(c => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Контакт не найден' });

  const [deleted] = contacts.splice(index, 1);
  writeContacts(contacts);
  res.json({ message: 'Контакт удалён', deleted });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Практическая №5 — Леденёв Глеб`);
  console.log(`Сервер запущен на порту ${PORT}`);
});
