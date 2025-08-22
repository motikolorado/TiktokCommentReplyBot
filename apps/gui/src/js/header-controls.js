// Bot control logic for header UI

document.addEventListener('DOMContentLoaded', function () {
    const statusDot = document.querySelector('.status-indicator .dot');
    const statusText = document.getElementById('bot-status-text');
    const pauseBtn = document.getElementById('pause-btn');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    let botState = null;
    updateStatus();
    function updateStatus() {
        api.getBotStatus().then((state) => {
            if (state === 'running') {
                statusDot.classList.add('running');
                statusText.textContent = 'Running';
            } else if (state === 'paused') {
                statusDot.classList.remove('running');
                statusDot.style.background = '#f1c40f';
                statusText.textContent = 'Paused';
            } else {
                statusDot.classList.remove('running');
                statusDot.style.background = '#e74c3c';
                statusText.textContent = 'Stopped';
            }
            if (state !== 'paused') {
                statusDot.style.background = '';
            }
            botState = state;
        }).catch((error) => {
            console.log(error.message);
        });
    }

    pauseBtn.addEventListener('click', function () {
        if (botState !== 'running') {
            notify.open({
                type: 'info',
                message: 'Bot not running'
            });
            return;
        }
        Dialog.confirm({
            title: "Confirmation",
            text: "Are you sure you want to pause the Bot?",
            defaultButtonText: "Yes",
            cancelButtonText: "No",
            callBackFn: () => {
                api.pauseBot().then(() => {
                    updateStatus();
                    notify.open({
                        type: 'info',
                        message: 'Bot has been paused'
                    });
                }).catch((error) => {
                    notify.error(`could not pause bot, error: ${error.message}`);
                });
            }
        });
        
    });
    startBtn.addEventListener('click', function () {
        if (botState === 'running') {
            notify.open({
                type: 'info',
                message: 'Bot already running'
            });
            return;
        }
        api.startBot().then(() => {
            updateStatus();
            notify.success('Bot has been started');
        }).catch((error) => {
            notify.error(`could not start bot, error: ${error.message}`);
        });
    });
    stopBtn.addEventListener('click', function () {
        if (botState !== 'running') {
            notify.open({
                type: 'info',
                message: 'Bot not running'
            });
            return;
        }
        Dialog.confirm({
            title: "Confirmation",
            text: "Are you sure you want to stop the Bot?",
            defaultButtonText: "Yes",
            cancelButtonText: "No",
            callBackFn: () => {
                api.stopBot().then(() => {
                    updateStatus();
                    notify.open({
                        type: 'info',
                        message: 'Bot has been stopped'
                    });
                }).catch((error) => {
                    notify.error(`could not pause bot, error: ${error.message}`);
                });
            }
        });
    });
    // ...existing code...
    function updateBackgroundStatus() {
        const backgroundToggle = document.getElementById('background-toggle');
        if (backgroundToggle.checked) {
            api.runInBackgroundMode(true).then(() => {
                notify.open({
                    type: 'info',
                    message: 'Background mode enabled'
                });
            }).catch((error) => {
                notify.error(`Could not enable background mode: ${error.message}`);
                backgroundToggle.checked = false;
            });
        } else {
            api.runInBackgroundMode(false).then(() => {
                notify.open({
                    type: 'info',
                    message: 'Background mode disabled'
                });
            }).catch((error) => {
                notify.error(`Could not disable background mode: ${error.message}`);
                backgroundToggle.checked = true;
            });
        }
    }

    function updateTestModeStatus() {
        const testModeToggle = document.getElementById('testmode-toggle');
        if (testModeToggle.checked) {
            api.runInTestMode(true).then(() => {
                notify.open({
                    type: 'info',
                    message: 'Test mode enabled'
                });
            }).catch((error) => {
                notify.error(`Could not enable test mode: ${error.message}`);
                testModeToggle.checked = false;
            });
        } else {
            api.runInTestMode(false).then(() => {
                notify.open({
                    type: 'info',
                    message: 'Test mode disabled'
                });
            }).catch((error) => {
                notify.error(`Could not disable test mode: ${error.message}`);
                testModeToggle.checked = true;
            });
        }
    }
    // ...existing code...

    // Fetch and update the toggle UI based on current background mode
    function updateToggles() {
        api.setting().then((data) => {
            const backgroundToggle = document.getElementById('background-toggle');
            const testModeToggle = document.getElementById('testmode-toggle');
            backgroundToggle.checked = !!data.run_in_background;
            testModeToggle.checked = !!data.test_mode;
        }).catch((error) => {
            console.log('Could not fetch setting:', error.message);
        });
    }
    updateToggles();
    document.getElementById('background-toggle').addEventListener('change', updateBackgroundStatus);
    document.getElementById('testmode-toggle').addEventListener('change', updateTestModeStatus);
//
});
