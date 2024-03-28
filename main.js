const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 920,
        height: 545,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: __dirname + '/preloader.js',
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

ipcMain.on('save-file', (event, { data, filePath , type , fileName}) => {
    if (!filePath) {
        dialog.showSaveDialog(mainWindow, {
            title: 'Save File' ,
            defaultPath: fileName
        }).then(result => {
            if (!result.canceled) {
                saveFile(result.filePath, data, type , fileName );
            }
        });
    } else {
        saveFile(filePath, data, type ,fileName);
    }
});

async function saveFile(filePath, data, type, fileName) {
    try {
        // ถ้ามีไฟล์อยู่แล้ว, ให้ทับไฟล์ที่มีอยู่

        console.log('dtt = ' + data.type);
        if (type === 'save-img') {
            console.log('if');
            // ในกรณีที่ data เป็นรูปภาพ
            // แปลง Base64 string กลับเป็น Buffer

            const imageBuffer = fs.readFileSync(data);
            console.log('const imageBuffer = fs.readFileSync(data);');

            // เขียน Buffer ลงในไฟล์
            fs.promises.writeFile(filePath, imageBuffer)
            console.log('fs.promises.writeFile(filePath, imageBuffer)');

        }
         else {
            console.log('else');
            // ในกรณีที่ data เป็นข้อมูลอื่น ๆ
            await fs.promises.writeFile(filePath, data);
        }
        console.log('File saved successfully!');
    } catch (error) {
        console.error('Error saving the file:', error.message);
    }

    if (type === 'save as') {
        dialog.showMessageBox(mainWindow, {
            message: 'New .fx saved successfully! (Note that you are working on the original file.)',
            buttons: ['OK']
        });
    }
}


