Neutralino.init();

// get dom
const titleBar = document.getElementById('titleBar');
const close = document.getElementById('close');
const mark = document.getElementById('mark');
const star = document.getElementById('star');
const add = document.getElementById('add');
const plus = document.getElementById('plus');
const more = document.getElementById('more');
const look1 = document.getElementById('look1');
const look2 = document.getElementById('look2');
const text2 = document.getElementById('text2');

// define function
function delayPrint(dom, str) {
    let count = 1;
    (function f() {
        dom.innerHTML = str.substr(0, count);
        count++;
        if (count > str.length) return;
        setTimeout(f, 100);
    })();
}
function setTray() {
    let tray = {
        icon: '/resources/icons/appIcon.png',
        menuItems: [
            { id: 'HOME', text: 'Home' },
            { id: 'SEP', text: '-' },
            { id: 'QUIT', text: 'Quit' },
        ]
    };
    Neutralino.os.setTray(tray).then();
}
function setDraggable() {
    let ifClick = false;
    let x, y;
    titleBar.onmousedown = (e) => {
        ifClick = true;
        x = e.clientX;
        y = e.clientY;
    }
    document.onmousemove = (e) => {
        if (ifClick) {
            Neutralino.window.move((e.screenX - x) * 1.25, (e.screenY - y) * 1.25).then();
        }
    }
    document.onmouseup = () => ifClick = false;
    more.onclick = () => {

    }
}
function setClose() {
    let degree = 0;
    let time;
    close.onmouseenter = () => {
        if (time) clearInterval(time);
        time = setInterval(() => {
            degree += 10;
            close.style.transform = `rotate(${degree}deg)`;
            if (degree >= 180) {
                degree = 180;
                close.style.transform = `rotate(180deg)`;
                clearInterval(time);
            }
        }, 10);
    }
    close.onmouseleave = () => {
        if (time) clearInterval(time);
        time = setInterval(() => {
            degree -= 10;
            close.style.transform = `rotate(${degree}deg)`;
            if (degree <= 0) {
                degree = 0;
                close.style.transform = `rotate(0deg)`;
                clearInterval(time);
            }
        }, 10);
    }
    close.onclick = () => Neutralino.window.hide();
}
function setCircle(circle, icon) {
    let scale = 100;
    let degree = 0;
    let time;
    circle.onmouseenter = () => {
        if (time) clearInterval(time);
        time = setInterval(() => {
            scale += 1;
            degree += 9;
            circle.style.transform = `scale(${scale / 100}, ${scale / 100})`;
            icon.style.transform = `rotate(${degree}deg) scale(0.7, 0.7)`;
            if (scale >= 120) {
                scale = 120;
                degree = 180;
                circle.style.transform = `scale(1.2, 1.2)`;
                icon.style.transform = `rotate(${degree}deg) scale(0.7, 0.7)`;
                clearInterval(time);
            }
        }, 10);
    }
    circle.onmouseleave = () => {
        if (time) clearInterval(time);
        time = setInterval(() => {
            scale -= 1;
            degree -= 9;
            circle.style.transform = `scale(${scale / 100}, ${scale / 100})`;
            icon.style.transform = `rotate(${degree}deg) scale(0.7, 0.7)`;
            if (scale <= 100) {
                scale = 100;
                degree = 0;
                circle.style.transform = `scale(1, 1)`;
                icon.style.transform = `rotate(${degree}deg) scale(0.7, 0.7)`;
                clearInterval(time);
            }
        }, 10);
    }
}
function setLook() {
    look1.onclick = () => {
        look1.style.display = 'none';
        look2.style.display = 'block';
        text2.style.display = 'block';
        delayPrint(text2, '你好');
    }
    look2.onclick = () => {
        look1.style.display = 'block';
        look2.style.display = 'none';
        text2.style.display = 'none';
    }
}

// handle function
function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case 'HOME':
            Neutralino.window.show().then();
            break;
        case 'QUIT':
            Neutralino.app.exit().then();
            break;
    }
}

// event listener
Neutralino.events.on('trayMenuItemClicked', onTrayMenuItemClicked).then();

document.oncontextmenu = (e) => e.preventDefault();

// use function
setTray();
setDraggable();
setClose();
setCircle(mark, star);
setCircle(add, plus);
setLook();