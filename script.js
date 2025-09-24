let editingBook = null;

// Função de toasts
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
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
  showToast("Cadastro realizado com sucesso! Faça login.", "success");

  document.getElementById("register-section").classList.remove("active");
  document.getElementById("login-section").classList.add("active");
});

// Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Login realizado com sucesso!", "success");

  document.getElementById("login-section").classList.remove("active");
  document.getElementById("system-section").classList.add("active");
  document.getElementById("logoutBtn").style.display = "inline-block";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  document.getElementById("system-section").classList.remove("active");
  document.getElementById("login-section").classList.add("active");
  document.getElementById("logoutBtn").style.display = "none";
  showToast("Você saiu da conta.", "info");
});

// CRUD de Livros
const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const year = document.getElementById("year").value;
  const description = document.getElementById("description").value;

  const li = document.createElement("li");
  li.innerHTML = `
    <span><strong>${title}</strong> - ${author} (${year}) <br><em>${genre}</em></span>
    <div>
      <button onclick="viewBook(this)">👁 Ver/Editar</button>
      <button onclick="removeBook(this)">🗑 Excluir</button>
    </div>
  `;

  li.dataset.title = title;
  li.dataset.author = author;
  li.dataset.genre = genre;
  li.dataset.year = year;
  li.dataset.description = description;

  bookList.appendChild(li);
  bookForm.reset();

  showToast("Livro adicionado com sucesso!", "success");
});

function removeBook(btn) {
  btn.parentElement.parentElement.remove();
  showToast("Livro removido!", "error");
}

// Modal de Visualizar/Editar
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const editForm = document.getElementById("editForm");

function viewBook(btn) {
  const li = btn.parentElement.parentElement;
  editingBook = li;

  // Preenche modal
  document.getElementById("editTitle").value = li.dataset.title;
  document.getElementById("editAuthor").value = li.dataset.author;
  document.getElementById("editGenre").value = li.dataset.genre;
  document.getElementById("editYear").value = li.dataset.year;
  document.getElementById("editDescription").value = li.dataset.description;

  modal.style.display = "flex";
}

// Fechar modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Salvar edição
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (editingBook) {
    editingBook.dataset.title = document.getElementById("editTitle").value;
    editingBook.dataset.author = document.getElementById("editAuthor").value;
    editingBook.dataset.genre = document.getElementById("editGenre").value;
    editingBook.dataset.year = document.getElementById("editYear").value;
    editingBook.dataset.description = document.getElementById("editDescription").value;

    editingBook.querySelector("span").innerHTML = `
      <strong>${editingBook.dataset.title}</strong> - ${editingBook.dataset.author} (${editingBook.dataset.year}) 
      <br><em>${editingBook.dataset.genre}</em>
    `;

    showToast("Livro atualizado com sucesso!", "success");
    modal.style.display = "none";
  }
});
