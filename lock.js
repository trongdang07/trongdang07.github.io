// --- Tác giả: Lê Trọng Hải Đăng. Ăn cắp code hay giao diện mà không xin phép là hành vi thiếu ý thức, không được giáo dục, mất não, mồ côi, cả họ là súc vật ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Inject CSS Styles ---
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --transition-speed: 0.6s;
            --bg-start: #a8edea; /* Xanh mint */
            --bg-end: #fed6e3;   /* Hồng phấn */
            --text-primary: #4a4e69; /* Tím than đậm */
            --accent-1: #ffffff; /* Màu trắng cho văn bản chính */
            --accent-2: #ff8fab; /* Hồng đậm cho trái tim */
            --glass-bg: rgba(255, 255, 255, 0.55);
            --shadow-color: rgba(111, 82, 117, 0.15);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            /* Hide the default cursor for all elements */
            cursor: none;
        }

        html {
            scroll-behavior: smooth;
        }

        body, html.locked {
            height: 100%;
            font-family: 'Patrick Hand', cursive;
            overflow: hidden;
            background: linear-gradient(to top, var(--bg-start) 0%, var(--bg-end) 100%);
            background-size: 100% 100%;
        }
        
        body {
            font-family: 'Inter', sans-serif; 
            background-color: #f8fafc; /* Màu nền dự phòng nếu màn hình khóa bị ẩn */
        }

        /* --- CUSTOM CURSOR --- */
        .cursor-dot,
        .cursor-outline {
            position: fixed;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
        }

        .cursor-dot {
            width: 8px;
            height: 8px;
            background-color: var(--accent-2);
            transition: transform 0.1s ease-out;
        }

        .cursor-outline {
            width: 40px;
            height: 40px;
            border: 2px solid hsla(330, 100%, 87%, 0.5);
            transition: all 0.2s ease-out;
        }
        
        /* Cursor hover state */
        .cursor-hover .cursor-dot {
            transform: translate(-50%, -50%) scale(1.5);
        }
        
        .cursor-hover .cursor-outline {
            transform: translate(-50%, -50%) scale(1.2);
            border-color: hsla(330, 100%, 80%, 0.8);
            background-color: hsla(330, 100%, 80%, 0.2);
        }

        /* --- LOCK SCREEN INTERFACE --- */
        .lockscreen {
            position: fixed; inset: 0;
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            color: var(--text-primary);
            display: flex; flex-direction: column;
            align-items: center; justify-content: space-around;
            padding: 5vh 20px; z-index: 9999;
            transition: opacity var(--transition-speed) ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lockscreen.unlocking {
            transform: scale(1.1); opacity: 0; pointer-events: none;
        }
        
        @keyframes pop-in {
            from { opacity: 0; transform: scale(0.8) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
        }

        .lockscreen > * {
            opacity: 0;
            animation: pop-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .lockscreen .time {
            text-align: center; animation-delay: 0.1s;
        }

        .lockscreen .time h1 {
            font-size: clamp(4rem, 20vw, 7rem); font-weight: 400;
            letter-spacing: 2px; color: var(--accent-1);
            text-shadow: 2px 2px 8px var(--shadow-color);
        }

        .lockscreen .time p {
            font-size: clamp(1.1rem, 5vw, 1.4rem); color: var(--accent-1);
            opacity: 0.8; margin-top: 5px; text-transform: capitalize;
            text-shadow: 1px 1px 4px var(--shadow-color);
        }
        
        .greeting-box {
            background-color: var(--glass-bg); padding: 15px 25px;
            border-radius: 20px; box-shadow: 0 6px 20px var(--shadow-color);
            border: 1px solid rgba(255, 255, 255, 0.7); animation-delay: 0.3s;
        }
        
        .greeting-box p { font-size: 1.25em; text-align: center; }

        .unlock-area {
            position: relative; /* Needed for positioning small hearts */
            display: flex; flex-direction: column;
            align-items: center; gap: 15px; animation-delay: 0.5s;
        }

        #unlockButton {
            width: 80px; height: 80px;
            background-color: #ffffff; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            border: none;
            box-shadow: 0 8px 25px var(--shadow-color);
            transition: all 0.3s ease;
            animation: pulse 2.5s infinite ease-in-out;
            z-index: 10; /* Ensure heart button is always on top */
        }

        #unlockButton:hover {
            transform: scale(1.1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        #unlockButton svg {
            width: 40px; height: 40px;
            color: var(--accent-2);
            transition: transform 0.3s ease;
        }
        
        #unlockButton:hover svg { transform: scale(1.1) rotate(5deg); }

        .unlock-area .unlock-hint {
            font-size: 1.1rem; color: var(--accent-1);
            opacity: 0.7; text-shadow: 1px 1px 3px var(--shadow-color);
        }

        .bottom-icons {
            display: flex; gap: 25px; animation-delay: 0.7s;
        }

        .bottom-icons a {
            display: flex; align-items: center; justify-content: center;
            width: 40px; height: 40px; background-color: var(--glass-bg);
            border-radius: 50%; box-shadow: 0 4px 10px var(--shadow-color);
            transition: all 0.3s ease; color: var(--text-primary);
        }

        .bottom-icons a:hover {
            transform: scale(1.2) rotate(-10deg);
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
        }

        .bottom-icons svg, .bottom-icons img { height: 22px; width: 22px; }

        /* --- HEART EXPLOSION EFFECT --- */
        #particle-container {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
        }

        .heart-particle {
            position: absolute;
            top: 50%; left: 50%;
            width: 20px; height: 20px;
            animation: heart-explode 1s ease-out forwards;
        }

        .heart-particle svg {
            width: 100%; height: 100%;
            color: var(--accent-2);
            filter: brightness(var(--brightness));
        }

        @keyframes heart-explode {
            from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            to { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }

        #unlockButton.exploding {
            animation: main-heart-explode 0.4s ease-in forwards;
        }

        @keyframes main-heart-explode {
            from { transform: scale(1); opacity: 1; }
            to { transform: scale(2.5); opacity: 0; }
        }

        /* --- BACKGROUND VIDEO --- */
        .background-video {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);

    // --- Create Custom Cursor Elements ---
    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorOutline);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    // --- Create Lock Screen Elements ---
    const lockScreen = document.createElement('div');
    lockScreen.classList.add('lockscreen');
    lockScreen.id = 'lockScreen';
    document.body.appendChild(lockScreen);

    // Background Video
    const backgroundVideo = document.createElement('video');
    backgroundVideo.autoplay = true;
    backgroundVideo.muted = true;
    backgroundVideo.loop = true;
    backgroundVideo.classList.add('background-video');
    backgroundVideo.innerHTML = `
        <source src="https://cdn.pixabay.com/video/2025/06/11/285242_tiny.mp4" type="video/mp4">
        Trình duyệt của bạn không hỗ trợ video HTML5.
    `;
    lockScreen.appendChild(backgroundVideo);

    // Time Display
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('time');
    timeDiv.innerHTML = `
        <h1 id="clock" style="color: #ffbdce;">-- : --</h1>
        <p id="date" style="color: #ffbdce;">-- -- ----</p>
    `;
    lockScreen.appendChild(timeDiv);

    // Greeting Box
    const greetingBox = document.createElement('div');
    greetingBox.classList.add('greeting-box');
    greetingBox.innerHTML = `<p>Chúc bạn một ngày tốt lành! 💖</p>`;
    lockScreen.appendChild(greetingBox);

    // Unlock Area
    const unlockArea = document.createElement('div');
    unlockArea.classList.add('unlock-area');
    unlockArea.id = 'unlockArea';
    lockScreen.appendChild(unlockArea);

    const particleContainer = document.createElement('div');
    particleContainer.id = 'particle-container';
    unlockArea.appendChild(particleContainer);

    const unlockButton = document.createElement('button');
    unlockButton.id = 'unlockButton';
    unlockButton.setAttribute('aria-label', 'Mở khóa');
    unlockButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    `;
    unlockArea.appendChild(unlockButton);

    const unlockHint = document.createElement('span');
    unlockHint.classList.add('unlock-hint');
    unlockHint.style.color = '#ffbdce';
    unlockHint.textContent = 'Chạm để mở khóa';
    unlockArea.appendChild(unlockHint);

    // Bottom Icons
    const bottomIcons = document.createElement('div');
    bottomIcons.classList.add('bottom-icons');
    bottomIcons.innerHTML = `
        <a href="https://www.facebook.com/letronghaidang.limited" target="_blank" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"></path></svg>
        </a>
        <a href="https://zalo.me/0325676804" target="_blank" aria-label="Zalo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png" alt="Zalo Logo" onerror="this.style.display='none'">
        </a>
        <a href="https://haidang-coder.neocities.org/" target="_blank" aria-label="Website">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>
        </a>
    `;
    lockScreen.appendChild(bottomIcons);

    // --- CUSTOM CURSOR LOGIC ---
    const bodyEl = document.querySelector('body');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
    });

    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            bodyEl.classList.add('cursor-hover');
        });
        el.addEventListener('mouseout', () => {
            bodyEl.classList.remove('cursor-hover');
        });
    });

    // --- LOCK SCREEN LOGIC ---
    function updateTime() {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, '0');
        const min = now.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hour}:${min}`;
        const dateStr = now.toLocaleDateString('vi-VN', {
            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        });
        if (document.getElementById('clock')) document.getElementById('clock').textContent = timeStr;
        if (document.getElementById('date')) document.getElementById('date').textContent = dateStr;
    }

    let isUnlocked = false;

    function unlock() {
        if (isUnlocked) return;
        isUnlocked = true;
        lockScreen.classList.add('unlocking');
        bodyEl.classList.remove('locked');
        bodyEl.style.overflow = 'auto'; // Allow scrolling after unlock
        lockScreen.addEventListener('transitionend', () => {
            lockScreen.style.display = 'none';
        }, { once: true });
    }
    
    function relock() {
        isUnlocked = false;
        lockScreen.style.display = 'flex';
        lockScreen.style.transform = '';
        lockScreen.style.opacity = '1';
        bodyEl.classList.add('locked');
        bodyEl.style.overflow = 'hidden';
        
        // Reset heart button
        unlockButton.classList.remove('exploding');
        unlockButton.disabled = false;
        const particleContainer = document.getElementById('particle-container');
        if (particleContainer) particleContainer.innerHTML = ''; // Clear old hearts
        
        setTimeout(() => lockScreen.classList.remove('unlocking'), 10);
    }

    function handleUnlockClick(e) {
        if (isUnlocked) return;
        e.preventDefault();
        unlockButton.disabled = true;
        unlockButton.classList.add('exploding');

        const particleCount = 30;
        const particleContainer = document.getElementById('particle-container');

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('heart-particle');

            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * radius;
            const ty = Math.sin(angle) * radius;
            const brightness = Math.random() * 0.4 + 0.8;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.setProperty('--brightness', `${brightness}`);
            
            particle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            
            particleContainer.appendChild(particle);

            setTimeout(() => particle.remove(), 1000);
        }
        
        setTimeout(unlock, 300);
    }

    if (unlockButton) unlockButton.addEventListener('click', handleUnlockClick);
    
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && isUnlocked) {
            sessionStorage.setItem('shouldRelock', 'true');
        }
        if (document.visibilityState === 'visible' && sessionStorage.getItem('shouldRelock') === 'true') {
            relock();
            sessionStorage.removeItem('shouldRelock');
        }
    });

    updateTime();
    setInterval(updateTime, 1000);
});
