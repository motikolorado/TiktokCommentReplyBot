
class modal
{
    static handlers = [];
    static prefillers = [];
    modal = null;
    params = null;
    contents = null;
    currentModal = null;
    static init() {
        this.modal = document.querySelector('.modal');
        this.getModalContents();
        this.setupModalSubmissionListiners();
        this.addModalCloseListener();
    }

    static registerHandler(name, handler) {
        this.handlers.push({'name': name, 'handler': handler });
    }
    static registerPrefiller(name, prefiller) {
        this.prefillers.push({'name': name, 'prefiller': prefiller });
    }
    static closeModal() {
        if (this.modal) {
            this.modal.classList.remove('open');
        }
        this.contents[this.currentModal].classList.remove('active');
        this.currentModal = null;
    }
    static getModalContents() {
        let contents = {};
        Array.from(document.querySelectorAll('.modal-content')).forEach((item) => {
            contents[item.id] = item;
        });
        this.contents = contents;
        for (const name in this.contents) {
            this.contents[name].classList.remove('active');
        }
    }
    static prefill(...params) {
        const fillForm = (data, form) => {
            if (!form || !data) return;
            Object.entries(data).forEach(([key, value]) => {
                const input = form.elements.namedItem(key);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = !!value;
                    } else if (input.type === 'radio') {
                        const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
                        if (radio) radio.checked = true;
                    } else {
                        input.value = value;
                    }
                }
            });
        };
        let content = this.contents[this.currentModal];
        this.prefillers.forEach((prefiller) => {
            if (prefiller.name === content.id) {
                const form = content.querySelector('form');
                const result = prefiller.prefiller(...params);
                // Support async and sync prefiller callbacks
                if (result instanceof Promise) {
                    result.then((data) => fillForm(data, form)).catch((error) => {
                        console.log(error.message);
                    });
                } else {
                    fillForm(result, form);
                }
            }
        });
    }
    static setupModalSubmissionListiners() {
        Object.values(this.contents).forEach((content) => {
            const form = content.querySelector('form');
            if (form) {
                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const formData = collectFormData(form);
                    this.handlers.forEach((handler) => {
                        if (handler.name === content.id) {
                            handler.handler(formData, ...this.params);
                        }
                    });
                    this.closeModal();
                });
            }
        });
    }
    static addModalCloseListener() {
        Object.values(this.contents).forEach((content) => {
            content.querySelector('.close-modal')?.addEventListener('click', () => {
                this.closeModal();
            });
        });
        
        // Close modal when clicking outside of it
        if (this.modal) {
            this.modal.addEventListener('click', (event) => {
                if (event.target === this.modal) {
                    this.closeModal();
                }
            });
        }
    }
    static open(name, ...params) {
        this.currentModal = name;
        this.params = params;
        const content = this.contents[name];
        if (this.modal && content !== undefined) {
            this.prefill(...params);
            this.modal.classList.add('open');
            content.classList.add('active');
        }
    }
}
modal.init();
