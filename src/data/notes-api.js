function main() {
    const baseUrl = "https://notes-api.dicoding.dev/v2";

    const getNote = async () => {
        try {
            const response = await fetch(`${baseUrl}/notes`);
            const responseJson = await response.json();

            if (responseJson.error) {
                showResponseMessage(responseJson.message);
            } else {
                renderAllNotes(responseJson.data);
            }
        } catch (error) {
            showResponseMessage(error);
        }
    };

    const createNote = async (data) => {
        try {
            const response = await fetch(`${baseUrl}/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const responseJson = await response.json();
            iziToast.success({
                title: "CREATE SUCCESS!",
                message: "Successfully create note!",
                position: "topCenter",
                timeout: 5000,
                transitionIn: "bounceInUp",
                transitionOut: "fadeOutUp",
            });
            getNote();
            hideLoader();
        } catch (error) {
            showResponseMessage(error);
        }
    };

    const deleteNote = async (noteId) => {
        try {
            const response = await fetch(`${baseUrl}/notes/${noteId}`, {
                method: "DELETE",
            });
            const responseJson = await response.json();
            // showResponseMessage(responseJson.message);
            getNote();
            hideLoader();
            iziToast.warning({
                title: "DELETE SUCCESS!",
                message: "Successfully delete note!",
                position: "topCenter",
                timeout: 5000,
                transitionIn: "bounceInUp",
                transitionOut: "fadeOutUp",
            });
        } catch (error) {
            showResponseMessage(error);
        }
    };

    const renderAllNotes = (data) => {
        const noteListElement = document.querySelector("#noteList");
        noteListElement.innerHTML = "";

        if (data) {
            data.forEach((data) => {
                noteListElement.innerHTML += `
          <article tabindex="0" class="note-item">
            <h4 class="note">
              <span class="note-title">${data.title}</span>
            </h4>
            <div class="">
              <p class="note_body">${data.body}</p>
            </div>
            <button type="button" class="btn button-delete" id="${data.id}">Hapus</button>
          </article>
        `;
            });
        }

        const buttons = document.querySelectorAll(".button-delete");
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const noteId = event.target.id;
                displayLoader();
                deleteNote(noteId);
            });
        });
    };

    const showResponseMessage = (message = "Check your internet connection") => {
        // alert(message);
        iziToast.info({
            title: "INFO!",
            message: message,
            position: "topCenter",
            timeout: 5000,
            transitionIn: "bounceInUp",
            transitionOut: "fadeOutUp",
        });
    };

    const displayLoader = () => {
        const loader = document.querySelector("#loader");
        loader.style.display = "block";
    };

    const hideLoader = () => {
        const loader = document.querySelector("#loader");
        loader.style.display = "none";
    };

    document.addEventListener("DOMContentLoaded", () => {
        const shadowHost = document.querySelector("#shadow");
        const shadowRoot = shadowHost.shadowRoot;

        const inputTitle = shadowRoot.querySelector("#inputTitle");
        const inputBody = shadowRoot.querySelector("#inputBody");
        const buttonCreate = shadowRoot.querySelector("#btnCreate");

        buttonCreate.addEventListener("click", async (event) => {
            event.preventDefault();

            if (inputTitle.value && inputBody.value) {
                const data = {
                    title: inputTitle.value,
                    body: inputBody.value,
                };

                displayLoader();

                try {
                    await createNote(data);
                } catch (error) {
                    showResponseMessage(error.message);
                } finally {
                    hideLoader();
                }
            } else {
                showResponseMessage("Title dan Body tidak boleh kosong!");
            }
        });

        getNote();
    });
}

export default main;