/*********************************************************************************
Copyright(C) 2019  Thommy Cambier <tmc@thommysweb.com>

    This program is free software: you can redistribute it and / or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 or any later version.

    This program is distributed "as is" in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
    GNU General Public License for more details: <https://www.gnu.org/licenses/>.
*********************************************************************************/

const etn = require('electron');

let mainWindow;

// True if YouTube-Music, not "just" YouTube. Will later be set by the user.
let ytmusic = true;

let finishedLoading = false;

buttons = {
    "musicbtns": {
        "play": "#play-pause-button",
        "next": ".next-button",
        "prev": ".previous-button",
        "togglePlayer": ".toggle-player-page-button",
        "search": "ytmusic-search-box"
    },
    "ytbtns": {
        "play": ".ytp-play-button",
        "next": ".ytp-next-button",
        "prev": ".ytp-prev-button"
    }
}

etn.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        etn.app.quit();
    }
});

etn.app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

// Creating the BrowserWindow
etn.app.on('ready', createWindow);

function createWindow() {
    mainWindow = new etn.BrowserWindow({
        width: 900,
        height: 600,
        title: "YouTube Music",
        show: false,
        darkTheme: true,
    });
    mainWindow.setMenu(null);
    let URL = ytmusic ? 'https://music.youtube.com/library' : 'https://youtube.com'
    mainWindow.loadURL(URL);
    mainWindow.webContents.on('did-finish-load', () => finishedLoading = true);
    mainWindow.on('closed', () => win = null);
    
    let btns = ytmusic ? buttons.musicbtns : buttons.ytbtns;
    
    /* PLAY/PAUSE */
    isKeyBound(registerKey('MediaPlayPause', btns.play));

    /* NEXT TRACK */
    registerKey('MediaNextTrack', btns.next);
    
    /* PREVIOUS TRACK */
    registerKey('MediaPreviousTrack', btns.prev);
    
    /* YT-Music only */
    if (ytmusic) {
        /* Toggle Player Page */
        registerKey('Ctrl+y', btns.togglePlayer);
    }
}

/**
 * Register a Keyboard Shortcut to simulate a click on an HTML-Element.
 * The Binding is global, it'll work when the App is minimized.
 * @param {string} key The Keyboard Shortcut to use. 
 * @param {string} buttonid Reference to an HTML-Element. 
 * @example 
 * registerKey('ctrl+e', '#idOfButtonToClick');
 * registerKey('ctrl+i', '.classOfButtonToClick');
 */
function registerKey(key, buttonid) {
    return etn.globalShortcut.register(key, () => {
        mainWindow.webContents.executeJavaScript('document.querySelector(\'' + buttonid + '\').click()');
    });
}

/**
 * Sets the did-finish-load handler to maximize (and show) 
 * the window if the given key is bound.
 * If the binding failed, it shows an error-message,
 * asking the user if they want to continue without media keys.
 * @param {boolean} keybind The return value of electron.globalShortcut.register
 * @example
 * isKeyBound(registerKey('MediaPlayPause', btns.play));
 * @todo Save users decision whether they want to quit or not if the media keys don't work.
 */
function isKeyBound(keybind) {
    if (!keybind) {
        console.log('[ERROR]: Registration of Media Keys failed!');
        etn.dialog.showMessageBox(mainWindow, {
                type: 'warning',
                buttons: ['Go ahead', 'Quit'],
                defaultId: 0,
                title: 'Key Registration Failed',
                message: 'Can\'t Bind Media Keys',
                detail: 'This is because another program has already reserved them. \nA Media Player or Chrome for example. \nYou can still use the App, other Keybindings will work.'
            }, (res, checked) => {
                if (res === 1) {
                    etn.app.quit();
                } else {
                    if (finishedLoading) {
                        mainWindow.maximize();
                    } else {
                        mainWindow.webContents.on('did-finish-load', () => {
                            mainWindow.maximize();
                        });
                    }
                }
            }
        );
    } else {
        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.maximize();
        });
    }
}
