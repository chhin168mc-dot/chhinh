function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    } catch (e) {}
}

const menuOpen = document.getElementById('menuOpen');
const sidebarClose = document.getElementById('sidebarClose');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

if (menuOpen) {
    menuOpen.onclick = () => { 
        playClickSound();
        sidebar.classList.add('active'); 
        overlay.classList.add('active'); 
        document.body.style.overflow = 'hidden';
    };
}

if (sidebarClose) {
    sidebarClose.onclick = () => { 
        playClickSound();
        sidebar.classList.remove('active'); 
        overlay.classList.remove('active'); 
        document.body.style.overflow = '';
    };
}

if (overlay) {
    overlay.onclick = () => { 
        playClickSound();
        sidebar.classList.remove('active'); 
        overlay.classList.remove('active'); 
        document.body.style.overflow = '';
    };
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        var x = document.getElementById("toast");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    });
}

document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
        playClickSound();
        if (!link.classList.contains('rank-btn')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !menuOpen.contains(e.target)) {
            playClickSound();
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});