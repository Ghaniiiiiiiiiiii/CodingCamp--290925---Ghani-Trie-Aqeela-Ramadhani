document.title = 'To-do List(Ghani)';

const form = document.getElementById("form");
const kegiatanInput = document.getElementById("kegiatanInput");
const tanggalInput = document.getElementById("tanggalInput");
const keteranganInput = document.getElementById("keteranganInput");

const totalValue = document.getElementById("totalValue");
const doneValue = document.getElementById("doneValue");
const pendingValue = document.getElementById("pendingValue");
const progressValue = document.getElementById("progressValue");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("selectFilter");

const todoTableBody = document.getElementById("todoValue");
const deleteAllBtn = document.getElementById("delete");

let task = [];

function loadFromStorage() {
  task = JSON.parse(localStorage.getItem('task')) || [];
}
function saveToStorage() {
  localStorage.setItem('task', JSON.stringify(task));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newTask = {
    id: Date.now(),
    kegiatan: kegiatanInput.value.trim(),
    tanggal: tanggalInput.value,
    keterangan: keteranganInput.value.trim() || '-',
    status: 'Pending'
  };
  
  task.push(newTask);
  saveToStorage();
  renderTask();
  updateStats();
  
  form.reset();
});

function renderTask() {
  const searchTerm = searchInput.value.toLowerCase();
  const filterStatus = filterSelect.value;
  
  let filtered = task.filter(t => {
    const matchSearch = t.kegiatan.toLowerCase().includes(searchTerm);
    const matchFilter = filterStatus === 'All' || t.status === filterStatus;
    return matchSearch && matchFilter;
  });
  
  if (filtered.length === 0) {
    todoTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="py-12">No Task Found</td>
      </tr>
    `;
    return;
  }
  
  todoTableBody.innerHTML = filtered.map(t => `
    <tr class="${t.status === 'Done' ? 'opacity-60' : ''}">
      <td class="${t.status === 'Done' ? 'line-through' : ''}">${t.kegiatan}</td>
      <td>${formatDate(t.tanggal)}</td>
      <td>${t.keterangan}</td>
      <td>
        <div class="flex gap-2 justify-center">
          ${t.status === 'Pending' ? `
            <button onclick="toggleStatus(${t.id})" 
              class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">
              ✓ Done
            </button>
          ` : `
            <button onclick="toggleStatus(${t.id})" 
              class="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 text-xs">
              ↻ Pending
            </button>
          `}
          <button onclick="deleteTask(${t.id})" 
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">
            🗑 Hapus
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function formatDate(dateString) {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

function toggleStatus(id) {
  const t = task.find(x => x.id === id);
  if (t) {
    t.status = t.status === 'Pending' ? 'Done' : 'Pending';
    saveToStorage();
    renderTask();
    updateStats();
  }
}

function deleteTask(id) {
  if (confirm('Yakin ingin menghapus kegiatan ini?')) {
    task = task.filter(t => t.id !== id);
    saveToStorage();
    renderTask();
    updateStats();
  }
}

function updateStats() {
  const total = task.length;
  const done = task.filter(t => t.status === 'Done').length;
  const pending = task.filter(t => t.status === 'Pending').length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  
  totalValue.textContent = total;
  doneValue.textContent = done;
  pendingValue.textContent = pending;
  progressValue.textContent = progress + '%';
}

searchInput.addEventListener('input', renderTask);
filterSelect.addEventListener('change', renderTask);

deleteAllBtn.addEventListener('click', () => {
  if (task.length === 0) {
    alert('Tidak ada kegiatan untuk dihapus!');
    return;
  }
  
  if (confirm('Yakin ingin menghapus SEMUA kegiatan?')) {
    task = [];
    saveToStorage();
    renderTask();
    updateStats();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderTask();
  updateStats();
});
