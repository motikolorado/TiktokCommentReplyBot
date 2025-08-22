class HashtagEditor {
    constructor(root = null, options) {
        this.opts = Object.assign({
            root: root ?? "#hashtag",
            tagContainer: "#tags",
            tagCount: "#tags-count",
            emptyState: "#empty",
            statusEl: "#hashtag-editor-status",
            template: "#chipTpl",
            onAdd: null,
            onEdit: null,
            onDelete: null,
            onClear: null
        }, options);

        this.tags = [];
        this.rootEl = document.querySelector(this.opts.root);
        this.tagContainer = this.rootEl.querySelector(this.opts.tagContainer);
        this.tagCountEl = this.rootEl.querySelector(this.opts.tagCount);
        this.emptyStateEl = this.rootEl.querySelector(this.opts.emptyState);
        this.statusEl = this.rootEl.querySelector(this.opts.statusEl);
        this.template = document.querySelector(this.opts.template);

        this._bindUI();
        this._updateEmptyState();
    }

    _bindUI() {
        const tagInput = this.rootEl.querySelector("#tagInput");
        const form = this.rootEl.querySelector("#tagForm");
        const addBtn = this.rootEl.querySelector("#addBtn");
        const importBtn = this.rootEl.querySelector("#importBtn");
        const exportBtn = this.rootEl.querySelector("#exportBtn");
        const clearBtn = this.rootEl.querySelector("#clearBtn");

        form.addEventListener("submit", e => {
            e.preventDefault();
            const value = tagInput.value.trim();
            if (value) {
                this.addTag(value);
                tagInput.value = "";
            }
        });

        addBtn.addEventListener("click", () => {
            const value = tagInput.value.trim();
            if (value) {
                this.addTag(value);
                tagInput.value = "";
            }
        });

        importBtn.addEventListener("click", async () => {
            const text = prompt("Paste your hashtags (comma or space separated):", "");
            if (text) {
                const tags = text.split(/[\s,]+/).filter(Boolean);
                for (const t of tags) {
                    await this.addTag(t);
                }
            }
        });

        exportBtn.addEventListener("click", () => {
            const all = this.tags.map(t => t.text).join(" ");
            navigator.clipboard.writeText(all).then(() => {
                this._setStatus("Tags copied to clipboard");
            });
        });

        clearBtn.addEventListener("click", async () => {
            let proceed = true;
            if (this.opts.onClear) {
                proceed = await this.opts.onClear();
            }
            if (proceed !== false) {
                this.tags = [];
                this._render();
                this._setStatus("All tags cleared");
            }
        });

        this.tagContainer.addEventListener("click", async e => {
            const btn = e.target.closest("button[data-action]");
            if (!btn) return;
            const chip = btn.closest(".chip");
            const id = Number(chip.dataset.id);

            if (btn.dataset.action === "delete") {
                let proceed = true;
                if (this.opts.onDelete) {
                    proceed = await this.opts.onDelete(id);
                }
                if (proceed !== false) {
                    this.tags = this.tags.filter(t => t.id !== id);
                    this._render();
                    this._setStatus("Tag deleted");
                }
            }
        });
    }

    async addTag(text) {
        text = text.trim();
        if (!text.startsWith("#")) text = "#" + text;
        if (this.tags.some(t => t.text.toLowerCase() === text.toLowerCase())) {
            this._setStatus("Duplicate tag ignored");
            return;
        }

        let tagObj = { id: Date.now(), text };
        if (this.opts.onAdd) {
            const backendObj = await this.opts.onAdd(text);
            console.log("Backend tag response:", backendObj);
            if (backendObj && backendObj.id && backendObj.text) {
                tagObj = backendObj;
            }
        }

        this.tags.push(tagObj);
        this._render();
        this._setStatus("Tag added");
    }

    loadTags(tagsArray) {
        this.tags = tagsArray;
        this._render();
    }

    _render() {
        this.tagContainer.innerHTML = "";
        for (const tag of this.tags) {
            const chip = this.template.content.cloneNode(true);
            const chipEl = chip.querySelector(".chip");
            chipEl.dataset.id = tag.id;
            chipEl.querySelector(".tag").textContent = tag.text;
            this.tagContainer.appendChild(chip);
        }
        this._updateCount();
        this._updateEmptyState();
    }

    _updateCount() {
        this.tagCountEl.textContent = this.tags.length;
    }

    _updateEmptyState() {
        if (this.tags.length === 0) {
            this.emptyStateEl.classList.remove("hidden");
        } else {
            this.emptyStateEl.classList.add("hidden");
        }
    }

    _setStatus(msg) {
        if (this.statusEl) {
            this.statusEl.textContent = msg;
            clearTimeout(this._statusTimer);
            this._statusTimer = setTimeout(() => {
                this.statusEl.textContent = "";
            }, 2000);
        }
    }
}

// Example usage:
// const editor = new HashtagEditor({
//     onAdd: async (text) => {
//         const res = await fetch('/api/tags', { method: 'POST', body: JSON.stringify({ text }) });
//         return await res.json();
//     },
//     onEdit: async (id, text) => {
//         const res = await fetch(`/api/tags/${id}`, { method: 'PUT', body: JSON.stringify({ text }) });
//         return await res.json();
//     },
//     onDelete: async (id) => {
//         await fetch(`/api/tags/${id}`, { method: 'DELETE' });
//         return true;
//     },
//     onClear: async () => {
//         await fetch('/api/tags', { method: 'DELETE' });
//         return true;
//     }
// });
