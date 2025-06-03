document.addEventListener('DOMContentLoaded', () => {
    const clickSound = document.getElementById('clickSound');
    const desktop = document.querySelector('.desktop');
    const appIcons = document.querySelectorAll('.app-icon');
    let windowCounter = 0;

    // Video playlist data
    const videoPlaylist = [
        {
            title: "op-xy",
            description: "by teenage engineering",
            source: "videos/te.mp4", // Local video
        },
        {
            title: "speed drive",
            description: "by charli xcx",
            source: "videos/charli.mp4", // Online video
        },
        {
            title: "refreshed",
            description: "by open ai",
            source: "videos/openai.mp4", // Another local video
        }
    ];

    // Photo gallery data
    const photoGallery = Array.from({ length: 10 }, (_, i) => `photos/photo${i + 1}.jpeg`);

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
        notes: `
            <div class="notes-app">
                <div class="notes-toolbar">
                    <button class="format-btn" data-command="bold"><b>B</b></button>
                    <button class="format-btn" data-command="italic"><i>I</i></button>
                    <button class="format-btn" data-command="underline"><u>U</u></button>
                </div>
                <div class="notes-content" contenteditable="true">
                    This<br>
                    is<br>
                    the<br>
                    <i>area</i><br>
                    where<br>
                    you<br>
                    write<br>
                    your<br>
                    <b>dreams</b>
                </div>
            </div>
        `,
        photos: `
            <div class="photo-gallery">
                ${photoGallery.map((photo, index) => `
                    <div class="photo-thumb" data-index="${index}">
                        <img src="${photo}" alt="Photo ${index + 1}">
                    </div>
                `).join('')}
            </div>
            <div class="photo-modal" style="display: none;">
                <div class="photo-modal-content">
                    <img class="photo-modal-img" src="" alt="">
                    <button class="photo-modal-close-btn"></button>
                </div>
            </div>
        `,
        spotify: `
            <div class="spotify-app">
                <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2Q8C5oCQuf3eW59TZMOxFP?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        `,
        doodle: `
            <div class="doodle-app">
                <div class="doodle-note">Drag to draw</div>
                <canvas id="doodle-canvas" width="500" height="500"></canvas>
            </div>
        `,
        fortune: `
            <div class="fortune-app">
                <audio id="fortune-sound" src="sounds/fortune.mp3" loop></audio>
                <video class="fortune-video" src="https://cdn.dribbble.com/userupload/40438643/file/original-42f5f3280d7d5b1c0cb9f50b7ef08d4d.mp4" autoplay loop muted playsinline preload="auto"></video>
                <div class="fortune-output">😌 trust me & press</div>
                <button class="fortune-cta">reveal my future</button>
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
                 // Play sound if it's the Fortune app
                if (appName === 'fortune') {
                    const fortuneSound = existingWindow.querySelector('#fortune-sound');
                    if (fortuneSound) {
                        fortuneSound.currentTime = 0;
                        fortuneSound.play().catch(error => console.error('Error playing fortune sound:', error));
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
        window.setAttribute('data-app', appName);
        openAppWindows[appName] = window.id;
        window.style.zIndex = ++topZIndex;
        
        // Set position based on app type
        let posX = 50, posY = 50;
        const windowWidth = appName === 'notes' ? 700 : 400;
        const windowHeight = appName === 'notes' ? 400 : 300; // Notes height 400, others 300
        let initialVideoIndex = 0;

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
            // Stop sound if it's the Fortune app
            if (appName === 'fortune') {
                const fortuneSound = window.querySelector('#fortune-sound');
                if (fortuneSound) {
                    fortuneSound.pause();
                    fortuneSound.currentTime = 0;
                }
            }
            openWindows = openWindows.filter(w => w.id !== window.id);
            delete openAppWindows[appName];
             window.remove(); // Remove window from DOM
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
            const gallery = window.querySelector('.photo-gallery');
            const modal = window.querySelector('.photo-modal');
            const modalImg = window.querySelector('.photo-modal-img');
            const closeBtn = window.querySelector('.photo-modal-close-btn');
            let currentPhotoIndex = 0;

            // Handle thumbnail clicks
            gallery.addEventListener('click', (e) => {
                const thumb = e.target.closest('.photo-thumb');
                if (thumb) {
                    currentPhotoIndex = parseInt(thumb.dataset.index);
                    modalImg.src = photoGallery[currentPhotoIndex];
                    modal.style.display = 'flex';
                }
            });

            // Handle modal close
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // Close modal when clicking outside the image
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });

            // Handle keyboard navigation
            window.addEventListener('keydown', (e) => {
                if (modal.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') {
                        currentPhotoIndex = (currentPhotoIndex - 1 + photoGallery.length) % photoGallery.length;
                        modalImg.src = photoGallery[currentPhotoIndex];
                    } else if (e.key === 'ArrowRight') {
                        currentPhotoIndex = (currentPhotoIndex + 1) % photoGallery.length;
                        modalImg.src = photoGallery[currentPhotoIndex];
                    } else if (e.key === 'Escape') {
                        modal.style.display = 'none';
                    }
                }
            });
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

        // Add Fortune Teller app logic if it's the fortune window
        if (appName === 'fortune') {
            const fortuneOutput = window.querySelector('.fortune-output');
            const fortuneCta = window.querySelector('.fortune-cta');
            const fortuneSound = window.querySelector('#fortune-sound');
            const fortunes = [
                '💌 An ex is thinking about you',
                '👠 You\’re about to outshine everyone',
                '💼 A career move is coming',
                '🕷️ Someone\’s throwing shade',
                '📱 A risky text will lead to either glory or chaos',
                '🔥 You\’re entering your villain era',
                '💎 Money\’s coming',
                '🌪️ Drama alert',
                '🖤 Someone mysterious is watching you',
                '🪩 Main character energy inbound'
            ];

            // Play fortune sound in loop when window is created
            if (fortuneSound) {
                fortuneSound.currentTime = 0;
                fortuneSound.play().catch(error => console.error('Error playing fortune sound:', error));
            }

            fortuneCta.addEventListener('click', () => {
                const randomIndex = Math.floor(Math.random() * fortunes.length);
                fortuneOutput.textContent = fortunes[randomIndex];
            });

            // Stop sound when window is closed
            window.querySelector('.close').addEventListener('click', () => {
                if (fortuneSound) {
                    fortuneSound.pause();
                    fortuneSound.currentTime = 0;
                }
            });
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
             // Play sound if it's the Fortune app when a new window is created
            if (appName === 'fortune') {
                const fortuneSound = window.querySelector('#fortune-sound');
                if (fortuneSound) {
                    fortuneSound.currentTime = 0;
                    fortuneSound.play().catch(error => console.error('Error playing fortune sound:', error));
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

    // Apple loading overlay logic
    const appleOverlay = document.getElementById('apple-loading-overlay');
    const appleBar = document.getElementById('apple-loading-bar');
    const appleBootSound = document.getElementById('appleBootSound');
    const appleStartBtn = document.getElementById('apple-start-btn');
    if (appleOverlay && appleBar && appleStartBtn) {
        appleBar.style.width = '0%';
        appleStartBtn.addEventListener('click', () => {
            appleStartBtn.classList.add('fade-out');
            setTimeout(() => {
                appleStartBtn.style.visibility = 'hidden';
                appleStartBtn.style.pointerEvents = 'none';
            }, 600);
            appleBootSound.currentTime = 0;
            appleBootSound.play().catch(() => {});
            setTimeout(() => {
                appleBar.style.width = '100%';
            }, 100);
            setTimeout(() => {
                appleOverlay.style.opacity = 0;
                setTimeout(() => {
                    appleOverlay.style.display = 'none';
                    // Mac desktop animation
                    const desktop = document.querySelector('.desktop');
                    if (desktop) desktop.classList.add('desktop-loaded');
                }, 600);
            }, 2200);
        });
    }
}); 