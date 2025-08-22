function collectFormData(form) {
  const data = {};
  const handled = new Set();

  for (const element of form.elements) {
    if (!element.name || element.disabled || handled.has(element.name)) continue;

    const name = element.name;
    const type = element.type;
    handled.add(name);

    switch (type) {
      case 'checkbox': {
        const checkboxes = form.querySelectorAll(`input[type="checkbox"][name="${CSS.escape(name)}"]`);
        if (checkboxes.length > 1) {
          data[name] = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        } else {
          data[name] = element.checked;
        }
        break;
      }

      case 'radio': {
        const selected = form.querySelector(`input[type="radio"][name="${CSS.escape(name)}"]:checked`);
        if (selected) data[name] = selected.value;
        break;
      }

      case 'select-multiple': {
        data[name] = Array.from(element.selectedOptions).map(opt => opt.value);
        break;
      }

      case 'file': {
        data[name] = element.multiple ? Array.from(element.files) : element.files[0] || null;
        break;
      }

      default: {
        data[name] = element.value;
      }
    }
  }

  return data;
}


function registerFormHandler(formId, handler) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found.`);
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = collectFormData(form);
        handler(data);
    });
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let year = date.getFullYear();

  let hours = date.getHours();
  let minutes = date.getMinutes().toString().padStart(2, '0');

  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  hours = hours.toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
}

function updateAccountPage()
{
    const tableContainer = document.getElementById('bot-account-table');
    const renderTable = (data, container) => {
        let table = '<table><tr><th>#</th><th>Name</th><th>Health</th><th>Created</th><th>Status</th><th></th></tr>';
        let actionBtn = '';
        let statusClass = '';
        let healthStatusClass = '';
        let editBtn = '';
        let deleteBtn = '';
        for (let sn = 0; sn < data.length; sn++) {
            statusClass = (data[sn].status == 'active') ? 'status-active' : 'status-inactive';
            if (data[sn].health === 'good') {
                healthStatusClass = 'text-success';
            } else if (data[sn].health === 'warning') {
                healthStatusClass = 'text-pending';
            } else {
                healthStatusClass = 'text-failure';
            }
            if (data[sn].status == 'active') {
                actionBtn = `<button class="button-deactivate" data-id="${data[sn].id}" onclick="deactivateBot(${data[sn].id})">Deactivate</button>`;
            } else {
                actionBtn = `<button class="button-activate" data-id="${data[sn].id}" onclick="activateBot(${data[sn].id})">Activate</button>`;
            }
            editBtn = `<button class="edit-btn" data-id="${data[sn].id}" onclick="modal.open('edit-bot', ${data[sn].id})">Edit</button>`;
            deleteBtn = `<button class="btn-danger" data-id="${data[sn].id}" onclick="deleteBot(${data[sn].id})">Delete</button>`;
            table += '<tr>';
            table += `<td>${sn + 1}</td>`;
            table += `<td>${data[sn].name}</td>`;
            table += `<td class="${healthStatusClass}">${data[sn].health}</td>`;
            table += `<td>${formatTimestamp(data[sn].created_at)}</td>`;
            table += `<td class="${statusClass}">${data[sn].status}</td>`;
            table += `<td>${actionBtn} ${editBtn} ${deleteBtn}</td>`
            table += '</tr>';
        }
        table += '</table>';
        container.innerHTML = table;
    }
    api.listBot().then((data) => {
        if (data.length > 0) {
            renderTable(data, tableContainer);
        } else {
            tableContainer.innerHTML = '<div class="table-no-data">No bot account</div>';
        }
    }).catch((error) => {
        console.log(error.message);
    })
}

function updatePendingVideosPage()
{
    const tableContainer = document.getElementById('pending-videos-table');
    const renderTable = (data, container) => {
        let table = '<table><tr><th>#</th><th>Hashtag</th><th>Video link</th><th></th></tr>';
        let viewBtn = '';
        let approveBtn = '';
        let removeBtn = '';
        for (let sn = 0; sn < data.length; sn++) {
            viewBtn = `<button class="btn-alt"><a href="${data[sn].link}" target="_blank">View</a></button>`;
            approveBtn = `<button class="button-approve" data-id="${data[sn].id}" onclick="approvePendingVideo(${data[sn].id})">Approve</button>`;
            removeBtn = `<button class="btn-danger" data-id="${data[sn].id}" onclick="removePendingVideo(${data[sn].id})">Remove</button>`;
            table += '<tr>';
            table += `<td>${sn + 1}</td>`;
            table += `<td>${data[sn].tag}</td>`;
            table += `<td>${data[sn].link}</td>`;
            table += `<td>${viewBtn} ${approveBtn} ${removeBtn}</td>`;
            table += '</tr>';
        }
        table += '</table>';
        container.innerHTML = table;
    }
    api.listPendingVideos().then((data) => {
        if (data.length > 0) {
            renderTable(data, tableContainer);
        } else {
            tableContainer.innerHTML = '<div class="table-no-data">No pending videos</div>';
        }
    }).catch((error) => {
        console.log(error.message);
    })
}

function updateCommentsPage()
{
    const tableContainer = document.getElementById('comment-table');
    const renderTable = (data, container) => {
        let table = '<table><tr><th>#</th><th>Comment</th><th>Emojis</th><th></th></tr>';
        let editBtn = '';
        let deleteBtn = '';
        for (let sn = 0; sn < data.length; sn++) {
            editBtn = `<button class="edit-btn" data-id="${data[sn].id}" onclick="modal.open('edit-comment', ${data[sn].id})">Edit</button>`;
            deleteBtn = `<button class="btn-danger" data-id="${data[sn].id}" onclick="deleteComment(${data[sn].id})">Delete</button>`;
            table += '<tr>';
            table += `<td>${sn + 1}</td>`;
            table += `<td>${data[sn].text}</td>`;
            table += `<td>${data[sn].emojis}</td>`;
            table += `<td>${editBtn} ${deleteBtn}</td>`;
            table += '</tr>';
        }
        table += '</table>';
        container.innerHTML = table;
    }
    api.listComments().then((data) => {
        if (data.length > 0) {
            renderTable(data, tableContainer);
        } else {
            tableContainer.innerHTML = '<div class="table-no-data">No comments</div>';
        }
    }).catch((error) => {
        console.log(error.message);
    })
}

function updateMetrics()
{
    const container = document.getElementById('metrics-container');
    let html = '';
    const createCard = (title, value) => {
        return `<div class="card"><div class="card-title">${title}</div><div class="card-text">${value}</div></div>`;
    }
    api.metrics().then((data) => {
        html += createCard('Videos commented on', data.video_commented_on);
        html += createCard('Unapproved videos', data.unapproved_videos);
        html += createCard('Pending videos', data.pending_videos);
        html += createCard('Active bot accounts', data.bot.active);
        container.innerHTML = html;
    }).catch((error) => {
        console.log(error.message);
    })
}

function updateActivitiesPage()
{
    const tableContainer = document.getElementById('activities-table');
    const renderTable = (data, container) => {
        let table = '<table><tr><th>S/N</th><th>Description</th><th>Video link</th><th>Status</th><th>Created at</th></tr>';
        let statusClass = '';
        let status = ''
        for (let sn = 0; sn < data.length; sn++) {
            status = data[sn].status
            if (status === 'success') {
                statusClass = 'text-success';
            } else if (status === 'failed') {
                statusClass = 'text-failure';
            } else if (status === 'queued') {
                statusClass = 'text-pending';
            } else {
                statusClass = '';
            }
            table += '<tr>';
            table += `<td>${sn + 1}</td>`;
            table += `<td>${data[sn].description}</td>`;
            table += `<td><a href="${data[sn].video_link}" target="_blank">${data[sn].video_link}</a></td>`;
            table += `<td class="${statusClass}">${status}</td>`
            table += `<td>${formatTimestamp(data[sn].created_at)}</td>`;
            table += '</tr>';
        }
        table += '</table>';
        container.innerHTML = table;
    }
    api.listActivities().then((data) => {
        if (data.length > 0) {
            renderTable(data, tableContainer);
        } else {
            tableContainer.innerHTML = '<div class="table-no-data">No activity yet</div>';
        }
    }).catch((error) => {
        console.log(error.message);
    })
}

function updateSettingUI()
{
    const delayPerReply = document.getElementById('setting_delay_per_reply');
    const maximum_comments = document.getElementById('maximum_comments');
    const postPerDay = document.getElementById('post_per_day');
    const postInterval = document.getElementById('post_interval');
    const maxVideoAutoFind = document.getElementById('max_video_auto_find');
    api.setting().then((data) => {
        maximum_comments.value = data.maximum_comments;
        postPerDay.value = data.post_per_day;
        postInterval.value = data.post_interval;
        maxVideoAutoFind.value = data.max_auto_find_videos;
        delayPerReply.querySelectorAll('option').forEach((option) => {
            if (Number(option.value) === data.delay_between_reply) {
                option.setAttribute('selected', true);
            }
        });
        postInterval.querySelectorAll('option').forEach((option) => {
            if (Number(option.value) === data.post_interval) {
                option.setAttribute('selected', true);
            }
        });
    }).catch((error) => {
        console.log(error.message);
    });
}

function updateGeneralSetting(data){
    const payload = {
        'post_per_day': data.post_per_day,
        'delay_between_reply': data.setting_delay_per_reply,
        'maximum_comments': data.maximum_comments,
        'post_interval': data.post_interval,
        'maximum_auto_find_videos': data.max_video_auto_find
    }
    api.updateSetting(payload).then(() => {
        notify.success('General setting updated successfully');
        updateSettingUI();
    }).catch((error) => {
        notify.error('an error occured: ' + error);
    });
}


function clearLog()
{
    api.clearActivities().then(() => {
        notify.success('Activity logs has been cleared successfully');
        updateActivitiesPage();
    }).catch((error) => {
        notify.error('Oops! could not clear the activity log, due to error: ' + error.message);
    })
}

function clearPendingVideos()
{
    api.clearPendingVideos().then(() => {
        notify.success('Pending video queue has been cleared');
        updateMetrics();
    }).catch((error) => {
        notify.error('Oops! an error occured while trying to clear pending video queue: ' + error);
    })
}

function addVideo(formData)
{
    const video_link = formData.video_link;
    if (video_link.length === 0) {
        notify.error('Video link can not be empty, kindly type or paste the video link');
        return;
    }
    api.addVideoToQueue(video_link).then((data) => {
        notify.success('videos has been added to queue')
    }).catch((error) => {
        notify.error('Oops! an error occured while trying to add video to queue, error: ' + error);
    });
}

function fetchVideo(formData){
    const maxVideo = formData.video_num;
    const hashtagId = formData.hashtag;
    if (maxVideo == null || maxVideo == '') {
        notify.error('Enter the number of videos to fetch');
        return;
    }
    if (hashtagId == null || hashtag == '') {
        notify.error('Hashtag can not be empty, kindly select an hashtag');
        return;
    }
    api.fetchVideo(hashtagId, maxVideo).then((data) => {
        updatePendingVideosPage();
    }).catch((error) => {
        notify.error('Oops! an error occured while trying to fetch videos: ' + error);
    });
}

function approvePendingVideo(id)
{
    api.approvePendingVideo(id).then(() => {
        notify.success('video added to queue');
        updatePendingVideosPage();
    }).catch((error) => {
        notify.error('an error occured while trying to approve video, error: ' + error);
    });
}

function removePendingVideo(id) {
    api.removePendingVideo(id).then(() => {
        notify.success('video has been remove from pending video');
        updatePendingVideosPage();
    }).catch((error) => {
        notify.error('an error occured while trying to remove video, error: ' + error);
    });
}

function addComment(formData)
{
    const data = {
        text: formData.comment,
        emojis: formData.emojis
    };
    api.addComment(data).then((res) => {
        notify.success('comment added successfully');
        updateCommentsPage();
    }).catch((error) => {
        notify.error('Oops! could not add group, got error: ' , error);
    });
}

function editComment(formData, id)
{
    const data = {
        text: formData.comment,
        emojis: formData.emojis
    };
    api.editComment(id, data).then((res) => {
        notify.success('comment has beend edited successfully');
        updateCommentsPage();
    }).catch((error) => {
        notify.error('Oops! could not add group, got error: ' , error);
    });
}

function deleteComment(id)
{
    api.deleteComment(id).then((res) => {
        notify.success('comment has beend deleted successfully');
        updateCommentsPage();
    }).catch((error) => {
        notify.error('Oops! could not add group, got error: ' , error);
    });
}

function addBot(formData)
{
    const data = {
        name: formData.bot_name,
        email: formData.bot_email,
        password: formData.bot_password
    };
    api.addBot(data).then((res) => {
        notify.success('bot added successfully');
        updateAccountPage();
    }).catch((error) => {
        console.error(error);
        notify.error('Oops! could not add bot account, got error: ' , error);
    })
}

function editBot(formData, id)
{
    const data = {
        name: formData.bot_name,
        email: formData.bot_email,
        password: formData.bot_password,
        comment: formData.bot_comment
    };
    api.editBot(id, data).then((res) => {
        notify.success('Bot has been edit successfully');
        updateAccountPage();
    }).catch((error) => {
        notify.error('Oops! could not edit bot, got error: ' , error.message);
    })
}
function deleteBot(id)
{
    Dialog.confirm({
        title: "Confirmation",
        text: "Are you sure you want to delete this Bot account?",
        defaultButtonText: "Yes",
        cancelButtonText: "No",
        callBackFn: () => {
            api.deleteBot(id).then((res) => {
                notify.success('Bot has been deleted successfully');
                updateAccountPage();
            }).catch((error) => {
                notify.error('Oops! could not delete bot, got error: ' , error.message);
            });
        }
    });
}

function activateBot(id)
{
    api.activateBot(id).then((res) => {
        notify.success('Bot has been activated');
        updateAccountPage();
    }).catch((error) => {
        notify.error('Oops! could not activate bot, got error: ' , error.message);
    })
}
function deactivateBot(id)
{
    api.deactivateBot(id).then((res) => {
        notify.success('Bot has been deactivated');
        updateAccountPage();
    }).catch((error) => {
        notify.error('Oops! could not deactivate bot, got error: ' , error.message);
    })
}

function registerModalHandlers()
{
    modal.registerPrefiller('fetch-video', async () => {
        api.listHashtags().then(tags => {
            const fetchVideoHashtags = document.getElementById('fetch-video-hashtags');
            let options = '';
            tags.forEach(tag => {
                options += `<option value="${tag.id}">${tag.text}</option>`;
            });
            fetchVideoHashtags.innerHTML = options;
        });
        return {};
    });
    modal.registerPrefiller('edit-bot', async (id) => {
        const bot = await api.getBot(id);
        return {
            'bot_name': bot?.name,
            'bot_email': bot?.email,
            'bot_password': bot?.password,
        };
    });
    modal.registerPrefiller('edit-comment', async (id) => {
        const comment = await api.getComment(id);
        return {
            'comment': comment?.text,
            'emojis': comment?.emojis,
        };
    });
    modal.registerHandler('add-bot', addBot);
    modal.registerHandler('edit-bot', editBot);
    modal.registerHandler('add-comment', addComment);
    modal.registerHandler('edit-comment', editComment);
    modal.registerHandler('add-video', addVideo);
    modal.registerHandler('fetch-video', fetchVideo);
}
function registerFormHandlers()
{
    registerFormHandler('general-setting-form', updateGeneralSetting);
}

function registerEventListeners()
{
    document.getElementById('add-comment-btn').addEventListener('click', () => {
        modal.open('add-comment');
    });
    document.getElementById('add-video').addEventListener('click', () => {
        modal.open('add-video');
    });
    document.getElementById('fetch-video').addEventListener('click', () => {
        modal.open('fetch-video');
    });
    document.getElementById('add-bot-btn').addEventListener('click', () => {
        modal.open('add-bot');
    });
    document.getElementById('clear-activity-log-btn').addEventListener('click', () => {
        clearLog();
    });
    document.getElementById('clear-pending-videos').addEventListener('click', () => {
        clearPendingVideos();
    });
}