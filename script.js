document.addEventListener('DOMContentLoaded', () => {
    const clickSound = document.getElementById('clickSound');
    const desktop = document.querySelector('.desktop');
    const appIcons = document.querySelectorAll('.app-icon');
    let windowCounter = 0;

    // Video playlist data
    const videoPlaylist = [
        {
            title: "living that von dutch life...",
            description: "by charli xcx",
            source: "videos/charli.mp4", // Local video
            thumbnail: "videos/thumbnails/charli.jpg",
            duration: "3:45"
        },
        {
            title: "op-xy",
            description: "by teenage engineering",
            source: "videos/te.mp4", // Online video
            thumbnail: "videos/thumbnails/video2.jpg",
            duration: "4:20"
        },
        {
            title: "untergang",
            description: "by klangkuenstler",
            source: "videos/untergang.mp4", // Another local video
            thumbnail: "videos/thumbnails/video3.jpg",
            duration: "2:55"
        }
    ];

    // Photo gallery data
    const photoGallery = [
        'photos/photo1.jpeg',
        'photos/photo2.jpeg',
        'photos/photo3.jpeg',
        'photos/photo4.jpeg',
        'photos/photo5.jpeg',
        'photos/photo6.jpeg',
        'photos/photo7.jpeg',
        'photos/photo8.jpeg',
        'photos/photo9.jpeg',
        'photos/photo10.jpeg'
    ];

    // Window content templates
    const windowContents = {
        video: `
            <div class="video-player">
                <div class="video-container">
                    <video id="main-video" autoplay muted>
                        <source src="${videoPlaylist[0].source}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="video-controls">
                    <div class="video-info">
                        <h3 class="video-title">${videoPlaylist[0].title}</h3>
                        <p class="video-description">${videoPlaylist[0].description}</p>
                    </div>
                    <div class="video-actions">
                        <button class="video-action-btn" title="Next Video">
                            <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                        </button>
                        <button class="video-action-btn" title="Fullscreen">
                            <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `,
        arc: `
            <div class="browser-window">
                <div class="browser-toolbar">
                    <div class="browser-controls">
                        <div class="browser-control close"></div>
                        <div class="browser-control minimize"></div>
                        <div class="browser-control maximize"></div>
                    </div>
                    <div class="browser-address-bar">
                        <div class="browser-actions">
                            <button class="browser-action back">←</button>
                            <button class="browser-action forward">→</button>
                            <button class="browser-action refresh">↻</button>
                        </div>
                        <input type="text" class="browser-url" placeholder="Search or enter website name" value="https://arc.net">
                    </div>
                </div>
                <div class="browser-content">
                    <div class="browser-sidebar">
                        <div class="sidebar-item active">Home</div>
                        <div class="sidebar-item">Favorites</div>
                        <div class="sidebar-item">Today</div>
                        <div class="sidebar-item">Pinned</div>
                    </div>
                    <div class="browser-main">
                        <h2>Welcome to Arc Browser</h2>
                        <p>A better way to browse the web.</p>
                    </div>
                </div>
            </div>
        `,
        notes: `
            <div class="notes-app">
                <div class="notes-toolbar">
                    <button class="format-btn" data-command="bold"><b>B</b></button>
                    <button class="format-btn" data-command="italic"><i>I</i></button>
                    <button class="format-btn" data-command="underline"><u>U</u></button>
                </div>
                <div class="notes-content" contenteditable="true">
                    Start writing your notes here...
                </div>
            </div>
        `,
        photos: `
            <div class="photo-single-view">
                <img class="photo-large-img" src="${photoGallery[0]}" alt="Photo 1">
                <div class="photo-controls">
                    <button class="photo-next-btn">Next</button>
                </div>
            </div>
        `,
        music: `
            <div class="music-player">
                <div class="album-art">
                    <img src="icons/music-album.jpg" alt="Album Art">
                </div>
                <div class="song-info">
                    <h3 class="song-title">Sample Song</h3>
                    <p class="artist">Sample Artist</p>
                </div>
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
                <div class="time-info">
                    <span class="current-time">0:00</span>
                    <span class="total-time">3:45</span>
                </div>
                <div class="controls">
                    <button class="control-btn prev">
                        <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                    </button>
                    <button class="control-btn play-pause">
                        <svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <svg class="pause-icon" viewBox="0 0 24 24" style="display: none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>
                    <button class="control-btn next">
                        <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                    </button>
                </div>
                <audio id="music-player" src="sounds/sample-song.mp3"></audio>
            </div>
        `,
        spotify: `
            <div class="spotify-app">
                <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2Q8C5oCQuf3eW59TZMOxFP?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        `,
        doodle: `
            <div class="doodle-app">
                <canvas id="doodle-canvas" width="500" height="500"></canvas>
            </div>
        `
    };

    // Track open window bounding boxes
    let openWindows = [];
    // Track open app windows by app name
    let openAppWindows = {};
    // Track z-index for stacking
    let topZIndex = 100;

    // Helper to check overlap
    function isOverlapping(x, y, width, height, windows) {
        for (const win of windows) {
            if (
                x < win.x + win.width &&
                x + width > win.x &&
                y < win.y + win.height &&
                y + height > win.y
            ) {
                return true;
            }
        }
        return false;
    }

    // Create window function
    function createWindow(appName) {
        // Prevent multiple windows for the same app or restore minimized
        if (openAppWindows[appName]) {
            const existingWindow = document.getElementById(openAppWindows[appName]);
            if (existingWindow && document.body.contains(existingWindow)) {
                // Window exists, restore it
                existingWindow.style.display = 'block';
                topZIndex++;
                existingWindow.style.zIndex = topZIndex;
                // Bring window to front by focusing it (optional but good UX)
                // existingWindow.focus();

                // Play sound if it's the Doodle app
                if (appName === 'doodle') {
                    const appOpenSound = document.getElementById('appOpenSound');
                    if (appOpenSound) {
                        appOpenSound.currentTime = 0;
                        appOpenSound.play().catch(error => console.error('Error playing sound:', error));
                    }
                }

                return;
            } else {
                // Window was removed from DOM, allow opening a new one
                delete openAppWindows[appName];
            }
        }

        const window = document.createElement('div');
        window.className = 'window';
        window.id = `window-${windowCounter++}`;
        openAppWindows[appName] = window.id;
        window.style.zIndex = ++topZIndex;
        
        // Set position based on app type
        let posX = 50, posY = 50;
        const windowWidth = 400;
        const windowHeight = 300;
        let initialVideoIndex = 0;
        if (appName === 'video') {
            // Video window always appears at top left
            posX = 50;
            posY = 50;
            // Pick a random video index
            initialVideoIndex = Math.floor(Math.random() * videoPlaylist.length);
        } else {
            // Other windows appear at non-overlapping random positions
            const margin = 50;
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            const maxX = viewportWidth - windowWidth - margin;
            const maxY = viewportHeight - windowHeight - margin;
            let found = false;
            let attempts = 0;
            while (!found && attempts < 50) {
                const randomX = Math.floor(Math.random() * maxX) + margin;
                const randomY = Math.floor(Math.random() * maxY) + margin;
                if (!isOverlapping(randomX, randomY, windowWidth, windowHeight, openWindows)) {
                    posX = randomX;
                    posY = randomY;
                    found = true;
                }
                attempts++;
            }
            if (!found) {
                posX = Math.floor(Math.random() * maxX) + margin;
                posY = Math.floor(Math.random() * maxY) + margin;
            }
        }
        window.style.left = `${posX}px`;
        window.style.top = `${posY}px`;
        window.style.position = 'absolute';

        // Add this window's bounding box to openWindows
        openWindows.push({
            id: window.id,
            x: posX,
            y: posY,
            width: windowWidth,
            height: windowHeight
        });

        // For video, use the random index for the initial video
        let videoHTML = windowContents[appName];
        if (appName === 'video') {
            const v = videoPlaylist[initialVideoIndex];
            videoHTML = `
                <div class="video-player">
                    <div class="video-container">
                        <video id="main-video" autoplay muted>
                            <source src="${v.source}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="video-controls">
                        <div class="video-info">
                            <h3 class="video-title">${v.title}</h3>
                            <p class="video-description">${v.description}</p>
                        </div>
                        <div class="video-actions">
                            <button class="video-action-btn" title="Next Video">
                                <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                            </button>
                            <button class="video-action-btn" title="Fullscreen">
                                <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        window.innerHTML = `
            <div class="window-header">
                <div class="window-controls">
                    <div class="window-control close"></div>
                    <div class="window-control minimize"></div>
                    <div class="window-control maximize"></div>
                </div>
                <div style="flex-grow: 1;"></div>
            </div>
            <div class="window-content">
                ${videoHTML}
            </div>
        `;

        // Remove from openWindows and openAppWindows when closed
        window.querySelector('.close').addEventListener('click', () => {
            openWindows = openWindows.filter(w => w.id !== window.id);
            delete openAppWindows[appName];
        });

        // Add video player functionality if it's the video window
        if (appName === 'video') {
            const video = window.querySelector('#main-video');
            const nextBtn = window.querySelector('.video-action-btn[title="Next Video"]');
            const fullscreenBtn = window.querySelector('.video-action-btn[title="Fullscreen"]');
            let currentVideoIndex = initialVideoIndex;

            // Function to play next video
            function playNextVideo() {
                currentVideoIndex = (currentVideoIndex + 1) % videoPlaylist.length;
                const nextVideo = videoPlaylist[currentVideoIndex];
                video.src = nextVideo.source;
                video.muted = true; // Ensure autoplay works
                video.play().catch(error => {
                    console.log('Autoplay failed:', error);
                });
                // Update video info
                const title = window.querySelector('.video-title');
                const description = window.querySelector('.video-description');
                title.textContent = nextVideo.title;
                description.textContent = nextVideo.description;
            }

            // Ensure video autoplays when loaded
            video.addEventListener('loadeddata', () => {
                video.play().catch(error => {
                    console.log('Autoplay failed:', error);
                });
            });

            // Play next video when current video ends
            video.addEventListener('ended', playNextVideo);

            // Next button handler
            nextBtn.addEventListener('click', playNextVideo);

            // Fullscreen button handler
            fullscreenBtn.addEventListener('click', () => {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                }
            });

            // Add unmute button functionality
            video.addEventListener('play', () => {
                if (video.muted) {
                    video.muted = false;
                }
            });
        }

        // Make window draggable
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const header = window.querySelector('.window-header');
        
        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || e.target.parentNode === header) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                window.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        // Add window controls functionality
        const closeBtn = window.querySelector('.close');
        const minimizeBtn = window.querySelector('.minimize');
        const maximizeBtn = window.querySelector('.maximize');

        closeBtn.addEventListener('click', () => {
            window.remove();
        });

        minimizeBtn.addEventListener('click', () => {
            window.style.display = 'none';
        });

        maximizeBtn.addEventListener('click', () => {
            if (window.style.width === '100%') {
                window.style.width = 'auto';
                window.style.height = 'auto';
            } else {
                window.style.width = '100%';
                window.style.height = '100%';
            }
        });

        // Add Notes app logic if it's the notes window
        if (appName === 'notes') {
            const notesContent = window.querySelector('.notes-content');
            const formatButtons = window.querySelectorAll('.notes-toolbar .format-btn');

            formatButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const command = button.dataset.command;
                    const value = button.dataset.value;
                    
                    if (command === 'formatBlock') {
                        document.execCommand('formatBlock', false, value);
                    } else {
                        document.execCommand(command, false, null);
                    }
                    
                    notesContent.focus(); // Keep focus on the content area after formatting
                });
            });
        }

        // Add photo single view logic if it's the photos window
        if (appName === 'photos') {
            let currentPhotoIndex = 0;
            const largeImg = window.querySelector('.photo-large-img');
            const nextBtn = window.querySelector('.photo-next-btn');
            if (largeImg && nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentPhotoIndex = (currentPhotoIndex + 1) % photoGallery.length;
                    largeImg.src = photoGallery[currentPhotoIndex];
                    largeImg.alt = `Photo ${currentPhotoIndex + 1}`;
                });
            }
        }

        // Add Doodle app logic if it's the doodle window
        if (appName === 'doodle') {
            const canvas = window.querySelector('#doodle-canvas');
            const ctx = canvas.getContext('2d');
            const pencilSound = document.getElementById('pencilSound');

            let drawing = false;

            function startDrawing(e) {
                drawing = true;
                draw(e);
                if (pencilSound) {
                    pencilSound.currentTime = 0; // Reset to start
                    pencilSound.loop = true; // Loop the sound while drawing
                    pencilSound.play().catch(error => console.error('Error playing pencil sound:', error));
                }
            }

            function stopDrawing() {
                drawing = false;
                ctx.beginPath();
                if (pencilSound) {
                    pencilSound.pause();
                    pencilSound.currentTime = 0; // Reset for the next stroke
                }
            }

            function draw(e) {
                if (!drawing) return;

                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ctx.lineWidth = 2; // Set drawing line width
                ctx.lineCap = 'round'; // Set line cap style
                ctx.strokeStyle = 'black'; // Set drawing color

                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
            }

            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mousemove', draw);
        }

        desktop.appendChild(window);
        setTimeout(() => {
            window.classList.add('active');
            // Play sound if it's the Doodle app when a new window is created
            if (appName === 'doodle') {
                const appOpenSound = document.getElementById('appOpenSound');
                if (appOpenSound) {
                    appOpenSound.currentTime = 0;
                    appOpenSound.play().catch(error => console.error('Error playing sound:', error));
                }
            }
        }, 10);
    }

    // Add click event to app icons
    appIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play();
            const appName = icon.dataset.app;
            createWindow(appName);
        });
    });

    // Update fake Mac status bar time with full date and time
    function updateStatusBarTime() {
        const el = document.getElementById('statusTime');
        if (!el) return;
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        el.textContent = now.toLocaleTimeString('en-US', options);
    }
    setInterval(updateStatusBarTime, 1000);
    updateStatusBarTime(); // Initial call

    // Add placeholder actions for status bar menu items
    const menuItems = document.querySelectorAll('.status-menu');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            console.log(`Menu item clicked: ${item.textContent}`);
            // Add specific functionality here based on item.textContent
            if (item.textContent === 'About') {
                window.open('https://amansrivastava.co/', '_blank');
            } else if (item.textContent === 'Contact') {
                window.open('https://cal.com/amansrivastava/30min', '_blank');
            }
        });
    });
}); 