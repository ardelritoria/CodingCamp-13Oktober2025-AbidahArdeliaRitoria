// Menunggu hingga seluruh konten halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    
    // --- PEMILIHAN ELEMEN DOM ---
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const filterBtn = document.getElementById('filter-btn');

    // --- STATE APLIKASI ---
    // Mengambil data dari localStorage atau menggunakan array kosong jika tidak ada
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let isFiltering = false; // Status untuk melacak mode filter

    // --- FUNGSI ---

    // Fungsi untuk menyimpan data ke localStorage
    const saveToStorage = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Fungsi utama untuk me-render (menampilkan) daftar tugas ke layar
    const renderTodos = () => {
        todoList.innerHTML = ''; // Kosongkan daftar sebelum render ulang

        const todosToRender = isFiltering ? todos.filter(todo => !todo.completed) : todos;

        if (todosToRender.length === 0) {
            todoList.innerHTML = '<p class="no-task-message">No task found</p>';
            return;
        }

        todosToRender.forEach(todo => {
            // Buat elemen div utama untuk setiap item
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');
            if (todo.completed) {
                todoItem.classList.add('completed');
            }
            todoItem.setAttribute('data-id', todo.id); // Set ID untuk identifikasi

            // Format tanggal agar lebih mudah dibaca
            const formattedDate = todo.dueDate ? new Date(todo.dueDate + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No due date';

            // Isi HTML untuk setiap item tugas
            todoItem.innerHTML = `
                <span class="task-col">${todo.text}</span>
                <span class="date-col">${formattedDate}</span>
                <span class="status-col">${todo.completed ? 'Completed' : 'Pending'}</span>
                <div class="actions-col todo-actions">
                    <button class="complete-btn">${todo.completed ? 'Undo' : 'Done'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            todoList.appendChild(todoItem);
        });
    };

    // Fungsi untuk menambahkan tugas baru
    const addTodo = (text, dueDate) => {
        // Validasi input
        if (text.trim() === '' || dueDate === '') {
            alert('Please fill in both the task and the due date.');
            return;
        }

        const newTodo = {
            id: Date.now(), // ID unik berdasarkan timestamp
            text: text,
            dueDate: dueDate,
            completed: false
        };

        todos.push(newTodo); // Tambahkan ke array
        saveToStorage(); // Simpan
        renderTodos(); // Tampilkan ulang
    };

    // Fungsi untuk menghapus semua tugas
    const deleteAllTodos = () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            saveToStorage();
            renderTodos();
        }
    };
    
    // Fungsi untuk toggle status selesai/belum
    const toggleComplete = (id) => {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveToStorage();
        renderTodos();
    };
    
    // Fungsi untuk menghapus satu tugas
    const deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        saveToStorage();
        renderTodos();
    };


    // --- EVENT LISTENERS ---

    // Event listener untuk form submit
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah halaman reload
        addTodo(todoInput.value, dateInput.value);
        todoInput.value = ''; // Kosongkan input setelah submit
        dateInput.value = '';
    });

    // Event listener untuk tombol 'Delete All'
    deleteAllBtn.addEventListener('click', deleteAllTodos);

    // Event listener untuk tombol 'Filter'
    filterBtn.addEventListener('click', () => {
        isFiltering = !isFiltering;
        filterBtn.textContent = isFiltering ? 'Show All' : 'Filter Incomplete';
        filterBtn.style.backgroundColor = isFiltering ? '#27ae60' : '#4a4a6a'; // Ganti warna sebagai indikator
        renderTodos();
    });

    // Event Delegation: Menangani klik pada tombol 'Done' dan 'Delete'
    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const parent = target.closest('.todo-item');
        if (!parent) return;

        const todoId = Number(parent.getAttribute('data-id'));

        if (target.classList.contains('complete-btn')) {
            toggleComplete(todoId);
        }

        if (target.classList.contains('delete-btn')) {
            deleteTodo(todoId);
        }
    });

    // --- INISIALISASI ---
    // Render tugas yang ada saat halaman pertama kali dimuat
    renderTodos();
});