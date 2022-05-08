// word[english, chinese, meet, gap, mark, abandon]
let words = [], word = [], listIndex, wordIndex, id, zoomIn = false;
let ifAnimate = false, loop = false, menu = false;
const gap1 = 4, gap2 = 2;
const duration = 300000; // 5 minute
const description = [
    'Word<br>Reminder',
    'Minimize<br>to Tray',
    'Add New<br>Word',
    'Mark the<br>Word',
    'See the<br>Translation',
    'Hide the<br>Translation',
    'Clear or<br>Delete the Word',
    'Save the<br>Word',
    'Cancel',
    'Menu',
    'Next Word'
];
const wordList = [
    'user',
    'core-700',
    'cet-4',
    'cet-6',
    'post-cet-6',
]
// get dom
// draggable
const titleBar = document.getElementById('titleBar');
// text
const title = document.getElementById('title');
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const lists = document.getElementsByClassName('list');
// icon
const close = document.getElementById('close');
const mark = document.getElementById('mark');
const more = document.getElementById('more');
const look1 = document.getElementById('look1');
const look2 = document.getElementById('look2');
const edit = document.getElementById('edit');
const check = document.getElementById('check');
const cancel = document.getElementById('cancel');
const trash = document.getElementById('trash');
const next = document.getElementById('nextBoard');
// board
const listBoard = document.getElementById('listBoard');
const board = document.getElementById('board');

// define function
function delayPrint(dom, str) {
    dom.innerHTML = '';
    if (!str) return;
    let count = 0;
    (function f() {
        if (dom !== title) ifAnimate = true;

        // skip blank
        if (str[count] === ' ') {
            dom.innerHTML += ' ';
            count++;
        }
        // skip '<...>'
        if (str[count] === '<') {
            while(count < str.length && str[count] !== '>') count++;
            count++;
            if (count >= str.length) {
                if (dom !== title) ifAnimate = false;
                return;
            }
            dom.innerHTML += '<br>';
        } else {
            dom.innerHTML += str[count];
            count++;
        }

        if (dom !== title) {
            if (count >= 13 && str.length >= 13) {
                ifAnimate = false;
                return;
            }
        }
        if (count >= str.length) {
            if (dom !== title) ifAnimate = false;
            return;
        }
        if (dom === title) {
            loop = setTimeout(f, 50);
        } else {
            setTimeout(f, 50);
        }
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
}
function setClick() {
    more.onclick = () => {
        if (!menu) {
            menu = true;
            listBoard.style.height = '140px';
        } else {
            menu = false;
            listBoard.style.height = '0';
        }

    }
    close.onclick = () => {
        Neutralino.window.hide().then();
        id = setTimeout(countTime, duration);
    }
    look1.onclick = () => {
        if (word.length && !ifAnimate) {
            look1.style.display = 'none';
            look2.style.display = 'block';
            text2.style.display = 'block';
            delayPrint(text2, word[1]);
        }
    }
    look2.onclick = () => {
        look1.style.display = 'block';
        look2.style.display = 'none';
        text2.style.display = 'none';
        text2.innerHTML = '';
    }
    edit.onclick = () => {
        next.style.display = look1.style.display = look2.style.display = text2.style.display = text1.style.display = trash.style.display = mark.style.display = 'none';
        input1.style.display = input2.style.display = check.style.display = cancel.style.display = 'block';
        input1.focus();
    }
    trash.ondblclick = () => {
        if (word.length) {
            word = [];
            text1.innerHTML = text2.innerHTML = '';
            words.splice(wordIndex, 1);
            countTime().then();
        }
    }
    trash.onclick = () => {
        if (word.length) {
            words[wordIndex][5] = word[5] = !word[5];
            if (word[5]) {
                text1.style.color = text2.style.color = '#A49C90';
            } else {
                setColor();
            }
            word[4] = words[wordIndex][4] = false;
        }
    }
    check.onclick = () => {
        turnOrigin();
        word = [input1.value, input2.value, 0, 0, false, false];
        words.push(word);
        wordIndex = words.length - 1;
        printWord();
    }
    cancel.onclick = () => {
        turnOrigin()
        printWord();
    }
    mark.onclick = () => {
        if (word.length) {
            words[wordIndex][4] = word[4] = !word[4];
            if (word[4]) {
                text1.style.color = text2.style.color = 'rgb(187,54,13)';
            } else {
                setColor();
            }
            word[5] = words[wordIndex][5] = false;
        }
    }
    next.onclick = () => {
        if (!ifAnimate) countTime().then();
    }
    for (let i in lists) {
        lists[i].onclick = async () => {
            if (i !== listIndex) {
                lists[listIndex].style.backgroundColor = 'transparent';
                lists[listIndex].style.color = '#E8E6E3';
                lists[listIndex].style.pointerEvents = 'initial';
                lists[i].style.backgroundColor = 'rgba(65, 69, 71, 0.5)';
                lists[i].style.color = '#BB360D';
                lists[i].style.pointerEvents = 'none';

                menu = false;
                listBoard.style.height = '0';

                if (zoomIn) text1.click();

                Neutralino.storage.setData(wordList[listIndex], JSON.stringify(words)).then();
                listIndex = i;
                words = await Neutralino.storage.getData(wordList[listIndex]);
                words = JSON.parse(words);
                word = [];
                text1.innerHTML = text2.innerHTML = '';
                countTime().then();
            }
        }
    }
}
function setIcon(icon, n) {
    icon.onmouseenter = () => {
        icon.style.transform = `rotate(360deg)`;
        if (loop) clearTimeout(loop);
        delayPrint(title, description[n]);
    }
    icon.onmouseleave = () => {
        icon.style.transform = `rotate(0deg)`;
        if (loop) clearTimeout(loop);
        delayPrint(title, description[0]);
    }
}
function setText() {
    let tmp1, tmp2;
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
                text1.style.whiteSpace = text2.style.whiteSpace = 'normal';

                board.style.height = '140px';
                next.style.display = edit.style.display = look1.style.display = look2.style.display = trash.style.display = mark.style.display = 'none';
                mark.style.zIndex = '0';
            } else {
                zoomIn = false;
                text1.innerHTML = tmp1;
                text2.innerHTML = tmp2;
                text1.style.cursor = text2.style.cursor = 'zoom-in';
                text1.style.width = text2.style.width = '60%';
                text1.style.whiteSpace = text2.style.whiteSpace = 'nowrap';

                board.style.height = '90px';
                edit.style.display = trash.style.display = mark.style.display = 'block';
                next.style.display = 'flex';
                mark.style.zIndex = '1';
                if (!text2.innerHTML) look1.style.display = 'block';
                else look2.style.display = 'block';
            }
        }
    }
}
async function setWord() {
    listIndex = await Neutralino.storage.getData('list');
    listIndex = JSON.parse(listIndex);

    lists[listIndex].style.pointerEvents = 'none';
    lists[listIndex].style.color = '#BB360D';
    lists[listIndex].style.backgroundColor = 'rgba(65, 69, 71, 0.5)';

    words = await Neutralino.storage.getData(wordList[listIndex]);
    words = JSON.parse(words);
    countTime().then();
}

// handle function
function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case 'HOME':
            Neutralino.window.show().then(() => {
                clearTimeout(id);
                countTime().then();
            });
            break;
        case 'QUIT':
            Neutralino.storage.setData(wordList[listIndex], JSON.stringify(words)).then();
            Neutralino.storage.setData('list', JSON.stringify(listIndex)).then();
            Neutralino.app.exit().then();
            break;
    }
}
function printWord() {
    if (word.length) {
        look1.style.display = 'block';
        look2.style.display = 'none';
        text2.innerHTML = '';
        text2.style.display = 'none';
        if (word[4]) {
            text1.style.color = text2.style.color = 'rgb(187,54,13)';
        } else if (word[5]) {
            text1.style.color = text2.style.color = '#A49C90';
        } else {
            setColor();
        }
        delayPrint(text1, word[0]);
    } else {
        text1.innerHTML = text2.innerHTML = '';
    }
}
function setColor() {
    if (word[2] < 10) {
        text1.style.color = text2.style.color = `#E8E6E3`;
    } else if (word[2] < 20) {
        text1.style.color = text2.style.color = `#78983B`;
    } else if (word[2] < 30) {
        text1.style.color = text2.style.color = `#0F8CC5`;
    } else {
        text1.style.color = text2.style.color = `#CE800D`;
    }
}
function turnOrigin() {
    look1.style.display = text1.style.display = trash.style.display = mark.style.display = 'block';
    next.style.display = 'flex';
    input1.style.display = input2.style.display = check.style.display = cancel.style.display = 'none';
}
async function countTime() {
    if (!words.length) return;

    let tmpWord = null, min = 1 / 0;
    for (let i in words) {
        if (words[i][2] < min) min = words[i][2];

        if (!words[i][5] && ((!words[i][4] && words[i][3] && words[i][3] % gap1 === 0) ||
            (words[i][4] && words[i][3] && words[i][3] % gap2 === 0))) {
            if (tmpWord && words[i][2] < tmpWord[0][2]) {
                tmpWord = [words[i], i];
            } else if (!tmpWord) {
                tmpWord = [words[i], i];
            }
        }
    }

    if (tmpWord) {
        word = tmpWord[0];
        wordIndex = tmpWord[1];
    } else {
        let index;
        do {
            index = Math.floor(Math.random() * words.length);
        } while (words[index][2] !== min);
        word = words[index];
        wordIndex = index;
    }

    if (!tmpWord) {
        for (let i in words) {
            if (words[i][2] > 0 && i !== wordIndex) {
                if ((!words[i][4] && words[i][3] === gap1) || (words[i][4] && words[i][3] === gap2)) continue;
                words[i][3]++;
            }
        }
    } else {
        words[wordIndex][3] = 0;
    }

    words[wordIndex][2]++;
    printWord();

    Neutralino.window.show().then();
    Neutralino.window.focus().then();
}

Neutralino.init();

delayPrint(title, description[0]);
// use function
setWord().then();
setDraggable();
setClick();
setIcon(close, 1);
setIcon(edit, 2);
setIcon(mark, 3);
setIcon(look1, 4);
setIcon(look2, 5);
setIcon(trash, 6);
setIcon(check, 7);
setIcon(cancel, 8);
setIcon(more, 9);
setIcon(next, 10);
setText();
setTray();

// event listener
Neutralino.events.on('trayMenuItemClicked', onTrayMenuItemClicked).then();

document.oncontextmenu = (e) => e.preventDefault();

// for (let i = 1; i <= 4; i++) {
//     (async () => {
//         let data = await Neutralino.filesystem.readFile('./resources/word/' + wordList[i] + '.txt');
//         data = JSON.parse(data);
//         Neutralino.storage.setData(wordList[i], JSON.stringify(data)).then();
//     })()
// }