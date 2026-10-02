const api = '/api/contacts';
const form = document.getElementById('contact-form');
const tbody = document.getElementById('contacts');
const statusBox = document.getElementById('status');
const cancelBtn = document.getElementById('cancel');
let editingId = null;

async function loadContacts() {
  const response = await fetch(api);
  const contacts = await response.json();
  tbody.innerHTML = '';
  for (const contact of contacts) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${contact.id}</td>
      <td>${escapeHtml(contact.name)}</td>
      <td>${escapeHtml(contact.phone)}</td>
      <td>${escapeHtml(contact.email || '')}</td>
      <td>${escapeHtml(contact.company || '')}</td>
      <td class="actions">
        <button data-edit="${contact.id}">Изменить</button>
        <button data-delete="${contact.id}" class="danger">Удалить</button>
      </td>`;
    tbody.appendChild(tr);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function resetForm() {
  editingId = null;
  form.reset();
  document.getElementById('form-title').textContent = 'Новый контакт';
  cancelBtn.hidden = true;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const body = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    company: document.getElementById('company').value.trim()
  };

  const response = await fetch(editingId ? `${api}/${editingId}` : api, {
    method: editingId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json();
    statusBox.textContent = error.error || 'Ошибка запроса';
    return;
  }

  statusBox.textContent = editingId ? 'Контакт обновлён' : 'Контакт создан';
  resetForm();
  await loadContacts();
});

tbody.addEventListener('click', async event => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;

  if (editId) {
    const response = await fetch(`${api}/${editId}`);
    const contact = await response.json();
    editingId = Number(editId);
    document.getElementById('name').value = contact.name;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('email').value = contact.email || '';
    document.getElementById('company').value = contact.company || '';
    document.getElementById('form-title').textContent = `Редактирование контакта ID ${editId}`;
    cancelBtn.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (deleteId && confirm(`Удалить контакт ID ${deleteId}?`)) {
    await fetch(`${api}/${deleteId}`, { method: 'DELETE' });
    statusBox.textContent = `Контакт ID ${deleteId} удалён`;
    await loadContacts();
  }
});

document.getElementById('reload').addEventListener('click', loadContacts);
cancelBtn.addEventListener('click', resetForm);

loadContacts().catch(err => {
  statusBox.textContent = `Ошибка: ${err.message}`;
});
