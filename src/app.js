import "./styles/styles.css";
// Import 
import main from './data/notes-api.js';

main();

// loading
class CustomIndikatorLoading extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const loadingText = document.createElement("div");
    loadingText.textContent = "Loading...";
    loadingText.style.fontSize = "24px";

    const style = document.createElement("style");
    style.textContent = `
      /* CSS untuk tampilan indikator loading */
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
      }
      
      div {
        color: white;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(loadingText);
  }
}
customElements.define("custom-indikator-loading", CustomIndikatorLoading);
setTimeout(() => {
  const indikatorLoading = document.querySelector("custom-indikator-loading");
  if (indikatorLoading) {
    indikatorLoading.remove();
  }
}, 3000); // Menampilkan indikator loading selama 5 detik (5000 milidetik)


//header
class CustomHeader extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const header = document.createElement("header");
    header.innerHTML = `
        <h1>Notes APP</h1>
      `;

    const style = document.createElement("style");
    style.textContent = `
        header {
          background-color: #2C7865;
          color: #fff;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 26, 115, 41); 
        }
   
        h1 {
          margin: 0;
          text-align:left;
        }
      `;

    shadow.appendChild(style);
    shadow.appendChild(header);
  }
}

customElements.define("custom-header", CustomHeader);

// list data
class CustomNotesData extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notesData = [];
  }

  connectedCallback() {
    this.render();
  }

  setNotesData(data) {
    this.notesData = data;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* CSS Grid untuk layout */
        .notes-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .note-card {
          position: relative;
          background-color: #90D26D;
          padding: 10px;
          border-radius: 10px;
          border: 5px solid #2C7865;
          box-shadow: 0 4px 10px rgba(0, 26, 115, 41); 
        }

        .note-card h3{
          text-align: center;
        }
        
        .note-date {
          font-size: 0.8em;
          color: #fcfcfc;
          margin-top: 5px;
          text-align: right;
        }

        .delete-container {
          text-align: center;
          margin-top: 10px;
        }

        .delete-button {
          background-color: red;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 14px;
        }

        .data {
          text-align: center;
        }
      </style>
      <div class="data">
      <h2>List Catatan</h2> 
      <div class="notes-container">
        ${this.notesData.map((note) => `
          <div class="note-card">
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <p class="note-date">${new Date(note.createdAt).toLocaleString()}</p>
            <div class="delete-container">
              <button class="delete-button" data-id="${note.id}">Hapus</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Menambahkan event listener untuk tombol hapus
    const deleteButtons = this.shadowRoot.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        this.deleteNoteById(id);
      });
    });
  }

  // Fungsi untuk menghapus catatan berdasarkan ID
  deleteNoteById(id) {
    this.notesData = this.notesData.filter(note => note.id !== id);
    this.render(); // Render ulang setelah menghapus catatan
  }
}

//inputan
class CustomInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector("form").addEventListener("submit", this.handleSubmit.bind(this));
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("form").removeEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    const title = this.shadowRoot.querySelector("#title").value;
    const body = this.shadowRoot.querySelector("#body").value;
    this.dispatchEvent(new CustomEvent("noteAdded", { detail: { title, body }, bubbles: true }));
    this.shadowRoot.querySelector("form").reset();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          /* CSS untuk form input */
          form {
            display: grid;
            gap: 10px;
          }
  
          label {
            font-weight: bold;
            text-align: left;
          }
  
          input, textarea {
            width: 100%;
            padding: 5px;
            border: 3px solid #90D26D;
            border-radius: 5px;
          }
  
          button {
            width: 50%;
            padding: 10px;
            background-color: #2C7865;
            color: #fff;
            border: 2px;
            border-radius: 5px;
            margin: auto;
            cursor: pointer;
          }

          .form-container{
            width: 50%;
            margin: auto;
            padding: 20px;
            border: 5px solid #2C7865;
            border-radius: 10px;
          }

          .card{
            text-align: center;
          }
        </style>
        <div class="card">
        <h2>List Catatan</h2>
        <div class="form-container">
        <form>
          <label for="title">Judul:</label>
          <input type="text" id="title" name="title" required>
          <label for="body">Isi:</label>
          <textarea id="body" name="body" required></textarea>
          <button type="submit">Tambah Catatan</button>
        </form>
        </div>
      `;
  }
}

// Menetapkan custom element ke dalam dokumen
customElements.define("custom-notes-data", CustomNotesData);
customElements.define("custom-input", CustomInput);

// Mengambil elemen custom-notes-data
const notesDataElement = document.querySelector("custom-notes-data");

// Menetapkan data catatan ke dalam custom-notes-data
notesDataElement.setNotesData(notesData);

// Mengambil elemen custom-input
const customInputElement = document.querySelector("custom-input");

// Menambahkan event listener untuk menangani penambahan catatan
customInputElement.addEventListener("noteAdded", (event) => {
  const { title, body } = event.detail;
  const newNote = {
    id: `notes-${Math.random().toString(36).substr(2, 9)}`,
    title: title,
    body: body,
    createdAt: new Date().toISOString(),
    archived: false,
  };
  notesData.push(newNote);
  notesDataElement.setNotesData(notesData);
});

//footer
class CustomFooter extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const footer = document.createElement("footer");
    footer.innerHTML = "<p>Tugas Notes App</p>";

    const style = document.createElement("style");
    style.textContent = `
        /* Gaya CSS untuk footer */
        footer {
          background-color: #2C7865;
          color: #fff;
          margin-top: 100px;
          padding: 20px;
          text-align: center;
          left: 0;
          bottom: 0;
          width: 100%;
        }
  
        p {
          margin: 0;
        }
      `;

    shadow.appendChild(style);
    shadow.appendChild(footer);
  }
}

// Menetapkan custom element ke dalam dokumen
customElements.define("custom-footer", CustomFooter);

