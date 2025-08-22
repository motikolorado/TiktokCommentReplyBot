function registerPlugins() {
    window.notify = new Notyf({
        duration: 10000,
        position: {
            x: 'right',
            y: 'top',
        },
        types: [
            {
                type: 'info',
                background: '#2196F3',
                icon: false
            }
        ]
    });
}
function updateUI(){
    updateAccountPage();
    updateCommentsPage();
    updatePendingVideosPage();
    updateMetrics();
    updateActivitiesPage();
    updateSettingUI();
}
function app()
{
    registerPlugins();
    updateUI();
    registerFormHandlers();
    registerModalHandlers();
    registerEventListeners();
    const editor = new HashtagEditor("#hashtag", {
        onFetch: async () => {
            const hashtags = await api.listHashtags();
            console.log(hashtags);
            return hashtags;
        },
        onAdd: async (tag) => {
            return await api.addHashtag(tag);
        },
        onDelete: async (tagId) => {
            await api.deleteHashtag(tagId);
            return true;
        },
        onClear: async () => {
            await api.clearHashtags();
            return true;
        }
    });
    window.hashtagEditor = editor;
    // Load initial tags if needed
    api.listHashtags().then(tags => {
        hashtagEditor.loadTags(tags);
        const fetchVideoHashtags = document.getElementById('fetch-video-hashtags');
        let options = '';
        tags.forEach(tag => {
            options += `<option value="${tag.id}">${tag.text}</option>`;
        });
        fetchVideoHashtags.innerHTML = options;
    });
}
