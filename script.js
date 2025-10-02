let editingBook = null;
let currentUser = null;
let bookToDelete = null; // livro a ser excluído

// Função de toasts
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Alternar entre login e cadastro
document.getElementById("showRegister").addEventListener("click", () => {
  document.getElementById("login-section").classList.remove("active");
  document.getElementById("register-section").classList.add("active");
});
document.getElementById("showLogin").addEventListener("click", () => {
  document.getElementById("register-section").classList.remove("active");
  document.getElementById("login-section").classList.add("active");
});

// Cadastro
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  localStorage.setItem("user", JSON.stringify({ name, email, password }));
  showToast("Cadastro realizado com sucesso! Faça login.", "success");
  document.getElementById("register-section").classList.remove("active");
  document.getElementById("login-section").classList.add("active");
});

// Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.email === email && user.password === password) {
    currentUser = user;
    showToast("Login realizado com sucesso!", "success");
    document.getElementById("userName").textContent = "👤 " + user.name;
    document.getElementById("login-section").classList.remove("active");
    document.getElementById("list-section").classList.add("active");
    document.getElementById("logoutBtn").style.display = "inline-block";
    document.getElementById("menu").style.display = "flex";
  } else {
    showToast("Email ou senha incorretos.", "error");
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById("login-section").classList.add("active");
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("menu").style.display = "none";
  document.getElementById("userName").textContent = "";
  currentUser = null;
  showToast("Você saiu da conta.", "info");
});

// Navegação
document.getElementById("goList").addEventListener("click", () => {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById("list-section").classList.add("active");
});
document.getElementById("goRegister").addEventListener("click", () => {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById("system-section").classList.add("active");
});

// CRUD de Livros
const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const preview = document.getElementById("preview");

document.getElementById("image").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const year = document.getElementById("year").value;
  const description = document.getElementById("description").value;
  const image = preview.src || "";

  const li = document.createElement("li");
  li.innerHTML = `
    <div class="book-info">
      ${image ? `<img src="${image}" alt="Capa" class="book-cover">` : ""}
      <span><strong>${title}</strong> - ${author} (${year}) <br><em>${genre}</em></span>
    </div>
    <div>
      <button onclick="viewBook(this)">👁 Visualizar</button>
      <button onclick="editBook(this)">✏️ Atualizar</button>
      <button onclick="removeBook(this)">🗑 Excluir</button>
    </div>
  `;
  li.dataset.title = title;
  li.dataset.author = author;
  li.dataset.genre = genre;
  li.dataset.year = year;
  li.dataset.description = description;
  li.dataset.image = image;
  bookList.appendChild(li);

  bookForm.reset();
  preview.src = "";
  preview.style.display = "none";
  showToast("Livro adicionado com sucesso!", "success");
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById("list-section").classList.add("active");
});

// Modal de confirmação ao excluir
function removeBook(btn) {
  bookToDelete = btn.parentElement.parentElement;
  const title = bookToDelete.dataset.title;
  document.getElementById("confirmMessage").textContent = `Você deseja realmente remover o livro "${title}"?`;
  document.getElementById("confirmModal").style.display = "flex";
}

document.getElementById("cancelDelete").addEventListener("click", () => {
  bookToDelete = null;
  document.getElementById("confirmModal").style.display = "none";
});

document.getElementById("confirmDelete").addEventListener("click", () => {
  if (bookToDelete) {
    bookToDelete.remove();
    showToast("Livro removido!", "error");
    bookToDelete = null;
  }
  document.getElementById("confirmModal").style.display = "none";
});

// Modal de Visualizar/Editar
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const editForm = document.getElementById("editForm");

function viewBook(btn) {
  const li = btn.parentElement.parentElement;
  document.getElementById("modalTitle").textContent = "Detalhes do Livro";
  document.getElementById("viewTitle").textContent = li.dataset.title;
  document.getElementById("viewAuthor").textContent = li.dataset.author;
  document.getElementById("viewGenre").textContent = li.dataset.genre;
  document.getElementById("viewYear").textContent = li.dataset.year;
  document.getElementById("viewDescription").textContent = li.dataset.description;
  document.getElementById("viewImage").src = li.dataset.image;
  document.getElementById("viewContent").style.display = "block";
  editForm.style.display = "none";
  modal.style.display = "flex";
}

function editBook(btn) {
  editingBook = btn.parentElement.parentElement;
  document.getElementById("modalTitle").textContent = "Editar Livro";
  document.getElementById("editTitle").value = editingBook.dataset.title;
  document.getElementById("editAuthor").value = editingBook.dataset.author;
  document.getElementById("editGenre").value = editingBook.dataset.genre;
  document.getElementById("editYear").value = editingBook.dataset.year;
  document.getElementById("editDescription").value = editingBook.dataset.description;
  document.getElementById("editPreview").src = editingBook.dataset.image;
  document.getElementById("viewContent").style.display = "none";
  editForm.style.display = "block";
  modal.style.display = "flex";
}

// Trocar imagem no modo edição
document.getElementById("editImage").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("editPreview").src = reader.result;
      editingBook.dataset.image = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

closeModalBtn.addEventListener("click", () => { modal.style.display = "none"; });
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// Salvar edição
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (editingBook) {
    editingBook.dataset.title = document.getElementById("editTitle").value;
    editingBook.dataset.author = document.getElementById("editAuthor").value;
    editingBook.dataset.genre = document.getElementById("editGenre").value;
    editingBook.dataset.year = document.getElementById("editYear").value;
    editingBook.dataset.description = document.getElementById("editDescription").value;

    editingBook.querySelector(".book-info").innerHTML = `
      ${editingBook.dataset.image ? `<img src="${editingBook.dataset.image}" alt="Capa" class="book-cover">` : ""}
      <span><strong>${editingBook.dataset.title}</strong> - ${editingBook.dataset.author} (${editingBook.dataset.year}) 
      <br><em>${editingBook.dataset.genre}</em></span>
    `;
    showToast("Livro atualizado com sucesso!", "success");
    modal.style.display = "none";
  }
});
