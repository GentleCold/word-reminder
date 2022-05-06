let words = [], word = [], ifAnimate = false, wordIndex; // word[english, chinese, time(minute), level(0-3)]
const level = [5, 30, 720, 1440];
// get dom
const titleBar = document.getElementById('titleBar');
const title = document.getElementById('title');
const close = document.getElementById('close');
const mark = document.getElementById('mark');
const star = document.getElementById('star');
const more = document.getElementById('more');
const look1 = document.getElementById('look1');
const look2 = document.getElementById('look2');
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const edit = document.getElementById('edit');
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const check = document.getElementById('check');
const trash = document.getElementById('trash');
const board = document.getElementById('board');

// define function
function delayPrint(dom, str) {
    dom.innerHTML = '';
    if (!str) return;
    let count = 0, hide = 0;
    (function f() {
        ifAnimate = true;
        if (!hide) {
            if (str[count] === '<') {
                while(count < str.length && str[count] !== '>') count++;
                count++;
                if (count >= str.length) {
                    ifAnimate = false;
                    return;
                }
                dom.innerHTML += '<br>';
            } else {
                dom.innerHTML += str[count];
                count++;
            }
        } else {
            count = 7;
        }
        if (dom !== title) {
            if (count === 7 && str.length > 7) {
                dom.innerHTML += '.';
                hide++;
            }
            if (hide === 3) {
                ifAnimate = false;
                return;
            }
        }
        if (count >= str.length) {
            ifAnimate = false;
            return;
        }
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
    close.onmouseenter = () => close.style.transform = `rotate(180deg)`;

    close.onmouseleave = () => close.style.transform = `rotate(0deg)`;

    close.onclick = () => {
        Neutralino.window.hide().then();
        word = [];
    }
}
function setCircle(circle, icon) {
    circle.onmouseenter = () => {
        circle.style.transform = `scale(1.2, 1.2)`;
        if (icon === star) {
            icon.style.transform = `rotate(180deg) scale(0.84, 0.84)`;
        } else {
            icon.style.transform = `rotate(180deg)`;
        }
    }
    circle.onmouseleave = () => {
        circle.style.transform = `scale(1, 1)`;
        if (icon === star) {
            icon.style.transform = `rotate(0deg) scale(0.7, 0.7)`;
        } else {
            icon.style.transform = `rotate(0deg)`;
        }
    }
}
function setLook() {
    look1.onclick = () => {
        if (word.length) {
            look1.style.display = 'none';
            look2.style.display = 'block';
            text2.style.display = 'block';
            if (!ifAnimate) {
                delayPrint(text2, word[1]);
            }
        }
    }
    look2.onclick = () => {
        look1.style.display = 'block';
        look2.style.display = 'none';
        text2.style.display = 'none';
        text2.innerHTML = '';
    }
}
function setEditor() {
    edit.onclick = () => {
        look1.style.display = look2.style.display = text2.style.display = text1.style.display = trash.style.display = 'none';
        input1.style.display = input2.style.display = check.style.display = 'block';
        input1.focus();
    }
    check.onclick = () => {
        look1.style.display = text1.style.display = trash.style.display = 'block';
        input1.style.display = input2.style.display = check.style.display = 'none';
        word = [input1.value, input2.value, 5, 0];
        words.push(word);
        wordIndex = words.length - 1;
        setInterval(loopTime, 1000, wordIndex);
        delayPrint(text1, word[0]);
    }
}
function setText() {
    let tmp1, tmp2, zoomIn = false;
    text1.onclick = text2.onclick = () => {
        if (!ifAnimate) {
            if (!zoomIn) {
                zoomIn = true;
                tmp1 = text1.innerHTML;
                tmp2 = text2.innerHTML;
                text1.innerHTML = word[0];
                text2.innerHTML = word[1];
                text1.style.cursor = text2.style.cursor = 'zoom-out';
                text1.style.width = text2.style.width = '100%';

                board.style.height = '140px';
                edit.style.display = look1.style.display = look2.style.display = trash.style.display = 'none';
                mark.style.zIndex = '0';
            } else {
                zoomIn = false;
                text1.innerHTML = tmp1;
                text2.innerHTML = tmp2;
                text1.style.cursor = text2.style.cursor = 'zoom-in';
                text1.style.width = text2.style.width = '60%';

                board.style.height = '90px';
                edit.style.display = trash.style.display = 'block';
                mark.style.zIndex = '1';
                if (!text2.innerHTML) look1.style.display = 'block';
                else look2.style.display = 'block';
            }
        }
    }
}
async function setWord() {
    words = await Neutralino.storage.getData('words');
    try {
        words = JSON.parse(words);
    } catch (e) {
        words = [];
    }

    for (let i in words) {
        setInterval(loopTime, 1000, i);

        if (word.length && words[i][2] === 0) {
            word = words[i];
            words[i][3]++;
            words[i][2] = level[words[i][3]];
        }
    }
    if (words.length) {
        if (!word.length) {
            let index = Math.floor(Math.random() * words.length);
            word = words[index];
            wordIndex = index
            words[index][2] = level[words[index][3]];
        }
        delayPrint(text1, word[0]);
    }
}

// handle function
function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case 'HOME':
            Neutralino.window.show().then();
            break;
        case 'QUIT':
            Neutralino.storage.setData('words', JSON.stringify(words)).then();
            Neutralino.app.exit().then();
            break;
    }
}
async function loopTime(i) {
    let visible = await Neutralino.window.isVisible();
    if (visible) return;
    if (words[i][2] === 0 && word.length === 0) {
        Neutralino.window.show().then();
        Neutralino.window.focus().then();
        word = words[i];
        wordIndex = i;
        words[i][3]++;
        if (words[i][3] > 3) words[i][3] = 0;
        words[i][2] = level[words[i][3]];
        delayPrint(text1, word[0]);
    }
    words[i][2]--;
    if (words[i][2] < 0) words[i][2] = 0;
}

Neutralino.init();

// use function
setWord().then();
setDraggable();
setClose();
setCircle(mark, star);
setLook();
setEditor();
setText();
setTray();

delayPrint(title, 'Word<br>Reminder');

// event listener
Neutralino.events.on('trayMenuItemClicked', onTrayMenuItemClicked).then();

trash.onclick = () => {
    if (word.length) {
        words.splice(wordIndex, 1);
        if (words.length) {
            let index = Math.floor(Math.random() * words.length);
            word = words[index];
            wordIndex = index
            words[index][2] = level[words[index][3]];
            delayPrint(text1, word[0]);
        } else {
            text1.innerHTML = text2.innerHTML = '';
            word = [];
        }
    }
}

document.oncontextmenu = (e) => e.preventDefault();
