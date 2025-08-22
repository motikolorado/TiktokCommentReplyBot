function pageRender() {
    // Initialize the page rendering logic
    document.addEventListener('DOMContentLoaded', function() {
        // Set up event listeners for navigation
        const links = document.querySelectorAll('.sidenav-wrapper li > a');
        links.forEach(link => {
            link.addEventListener('click', function(event) {
                const targetPage = this.getAttribute('href').substring(1); // Get the target page ID
                renderPage(targetPage); // Render the target page
            });
        });
        // Render the page based on the initial hash or default to home
        const initialPage = window.location.hash.substring(1) || 'home';
        renderPage(initialPage);
    });
    //track hash changes to render the correct page
    window.addEventListener('hashchange', function() {
        const pageId = window.location.hash.substring(1);
        renderPage(pageId);
    });
}
renderPage = (pageId) => {
    const pageUpdaters = {
        home: () => {
            updateMetrics();
            updateActivitiesPage();
        },
        accounts: () => {
            updateAccountPage();
        },
        hashtag: () => {
            api.listHashtags().then(tags => {
                hashtagEditor.loadTags(tags);
            }).catch(err => {
                console.error("Failed to load hashtags:", err);
            });
        },
        setting: () => {
            updateSettingUI();
        },
        comments: () => {
            //updateCommentsPage();
        },
        videos: () => {
            //updateVideosPage();
        }
    }
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    //nav links
    const navList = document.querySelectorAll('.sidenav-wrapper li');
    navList.forEach(list => {
        list.classList.remove('active');
        const link = list.querySelector('a');
        if (link && link.getAttribute('href') === `#${pageId}`) {
            list.classList.add('active');
        } else {
            list.classList.remove('active');
        }
    });

    // Show the selected page
    const activePage = document.getElementById(pageId);
    if (activePage) {
        if (pageUpdaters[pageId] !== undefined) {
            pageUpdaters[pageId]();
        }
        activePage.classList.add('active');
    }
}
pageRender();

//setting page handling
(function handleSettingPage() {
    const settingPageNavs = document.querySelectorAll('.setting-nav button');
    const settingPages = Array.from(document.querySelectorAll('.setting-page'));
    settingPageNavs.forEach(nav => {
        nav.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-setting-page');
            settingPages.forEach(page => {
                if (page.id === targetPage) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
            //find the active nav
            settingPageNavs.forEach(n => {
                n.classList.remove('active');
            });
            // Update active nav
            this.classList.add('active');
        });
    });
}());