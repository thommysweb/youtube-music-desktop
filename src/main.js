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
    // mainWindow.webContents.openDevTools();
    mainWindow.setMenu(null);
    mainWindow.loadURL('https://music.youtube.com/library');
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.maximize();
    });
    mainWindow.on('closed', () => { win = null });
}