const fs = require('fs')
const moment = require('moment')
const readline = require('readline')
const { google } = require('googleapis')
const MAX_FOLDER_BACKUP = 15

const FORMAT_TYPE_FUNCTIONS = {
    VUE: require('./xls2json'),
    REACT: require('./xls2jsonV2'),
}

function main(config) {
    // const config = require('../../../i18n.config.js')
    let drive = null,
        sheets = null,
        STAGING_FOLDER = config.STAGING_FOLDER, // i18n folder for staging
        BK_FOLDER_ID = config.BK_FOLDER_ID, // backup folder id
        LAST_ID_SHEET = config.LAST_ID_SHEET,
        buildExcel = FORMAT_TYPE_FUNCTIONS[config.FORMAT_TYPE] || FORMAT_TYPE_FUNCTIONS.VUE // generate folder structure following config.FORMAT_TYPE
    if (!STAGING_FOLDER) {
        throw 'NO ENV ENOUGH !!!!!!!!!!!!!'
    }

    // If modifying these scopes, delete token.json.
    const SCOPES = [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.photos.readonly',
    ]
    const TOKEN_PATH = config.TOKEN_PATH
    const CREDENTIAL_PATH = config.CREDENTIAL_PATH
    console.log('============ I18n begin')
    fs.readFile(CREDENTIAL_PATH, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err)
        // Authorize a client with credentials, then call the Google Drive API.
        authorize(JSON.parse(content), authCallback)
    })

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0],
        )

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback)
            oAuth2Client.setCredentials(JSON.parse(token))
            callback(oAuth2Client)
        })
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        })
        console.log('Authorize this app by visiting this url:', authUrl)
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
        rl.question('Enter the code from that page here: ', code => {
            rl.close()
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err)
                oAuth2Client.setCredentials(token)
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                    if (err) console.error(err)
                    console.log('Token stored to', TOKEN_PATH)
                })
                callback(oAuth2Client)
            })
        })
    }

    function getLastId() {
        return new Promise(function(resolve) {
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: LAST_ID_SHEET,
                    range: 'Sheet1!A1:A1',
                },
                function(err, res) {
                    if (err) {
                        console.log('The API returned an error: ' + err)
                        process.exit(1)
                    }
                    if (res.data.values) {
                        resolve(res.data.values[0][0].trim())
                    } else {
                        resolve(undefined)
                    }
                },
            )
        })
    }

    function getListFileByFolderId(folderId) {
        return new Promise(function(resolve) {
            drive.files.list(
                {
                    fields: 'nextPageToken, files(id, name)',
                    q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet'`,
                    orderBy: 'createdTime desc',
                },
                (err, res) => {
                    if (err) {
                        console.log('The API returned an error: ' + err)
                        process.exit(1)
                    }
                    const files = res.data.files
                    resolve(files)
                },
            )
        })
    }

    function getListBK() {
        return new Promise(function(resolve) {
            drive.files.list(
                {
                    fields: 'nextPageToken, files(id, name)',
                    q: `'${BK_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
                    orderBy: 'createdTime desc',
                },
                (err, res) => {
                    if (err) {
                        console.log('The API returned an error: ' + err)
                        process.exit(1)
                    }
                    const files = res.data.files
                    resolve(files)
                },
            )
        })
    }

    async function downloadSheets(folderId, cb) {
        let fileList = [], dl = []
        try {
            console.log('Start get list file from drive')
            const files = await getListFileByFolderId(folderId)
            if (files.length == 0) {
                console.log('No files found.')
                return
            }

            fileList = files.map(file => {
                return {
                    id: file.id,
                    name: file.name,
                }
            })
            console.log('list files download: ',files)
            for (let index = 0; index < fileList.length; index++) {
                const file = fileList[index]
                dl.push(downloadFile(file.id, file.name))
            }

            try {
                console.log('Start download files')
                await Promise.all(dl)
                console.log('End download files')
                console.log('Start excute callback')
                cb()
            } catch (err) {
                console.log(err)
                process.exit(1)
            }


        } catch (error) {
            console.log('download error:', error)
            process.exit(1)
        }
    }

    async function stagingProcess() {
        downloadSheets(STAGING_FOLDER, function() {
            buildExcel(config)
        })
    }

    async function productionProcess() {
        let [last_id, bkList] = await Promise.all([getLastId(), getListBK()])
        console.log(bkList)
        if (last_id) {
            let firstId = (bkList[0] || {}).id
            console.log('First ID', firstId)
            if (firstId != last_id) {
                sheets.spreadsheets.values.update(
                    {
                        spreadsheetId: LAST_ID_SHEET,
                        range: 'Sheet1!A1:A1',
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            values: [['']],
                        },
                    },
                    function(err) {
                        if (err) {
                            console.log('The API returned an error: ' + err)
                            process.exit(1)
                        }
                        console.log('CLEARED LAST ID')
                        console.log('download and build for revert case')
                        downloadSheets(firstId, function() {
                            buildExcel(config)
                        })
                    },
                )
            } else {
                dlBkBuild(STAGING_FOLDER, bkList)
            }
        } else {
            dlBkBuild(STAGING_FOLDER, bkList)
        }
    }

    function dlBkBuild(folderId, bkList) {
        downloadSheets(folderId, async function() {
            if (bkList.length >= MAX_FOLDER_BACKUP) {
                console.log(
                    `Quantity of backup file is greater than '${MAX_FOLDER_BACKUP}': deleting file...`,
                )

                for (let i = bkList.length - 1; i >= MAX_FOLDER_BACKUP - 1; i--) {
                    console.log('deleting folder ' + bkList[i].name)
                    await deleteFolder(bkList[i].id)
                }
            }

            try {
                const id = await createFolder(moment().format('YYYY/MM/DD h:mm:ss a'))
                console.log('new folder Id:', id)
                const files = await getListFileByFolderId(folderId)
                const lstFiles = files.map(p => `${p.name}.xlsx`)
                console.log('list file backup: ', lstFiles)
                const bkReq = lstFiles.map(function(name) {
                    return uploadFile(id, name)
                })

                await Promise.all(bkReq)
                sheets.spreadsheets.values.update(
                    {
                        spreadsheetId: LAST_ID_SHEET,
                        range: 'Sheet1!A1:A1',
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            values: [[id]],
                        },
                    },
                    function(err) {
                        if (err) {
                            console.log('The API returned an error: ' + err)
                            process.exit(1)
                        }
                        console.log('UPDATED LAST ID', id)
                        console.log('Start build file JSON for production mode')
                        buildExcel(config)
                    },
                )
            } catch (err) {
                console.log(err)
                process.exit(1)
            }

        })
    }

    function deleteFolderRecursive(p) {
        if (fs.existsSync(p)) {
            fs.readdirSync(p).forEach(function(file) {
                let curPath = p + '/' + file
                if (fs.lstatSync(curPath).isDirectory()) {
                    // recurse
                    deleteFolderRecursive(curPath)
                } else {
                    // delete file
                    fs.unlinkSync(curPath)
                }
            })
            fs.rmdirSync(p)
        }
    }

    async function authCallback(auth) {
        drive = google.drive({ version: 'v3', auth })
        sheets = google.sheets({ version: 'v4', auth })
        let p = config.EXCEL_PATH,
            p1 = config.I18N_PATH
        deleteFolderRecursive(p)
        deleteFolderRecursive(p1)
        fs.mkdirSync(p)
        fs.mkdirSync(p1)
        console.log('Cleaned folder', p, p1)
        if (process.env.ENV === 'production') {
            console.log('productionProcess')
            productionProcess()
        } else {
            console.log('stagingProcess')
            stagingProcess()
        }
    }

    function createFolder(name) {
        let fileMetadata = {
            name: name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [BK_FOLDER_ID],
        }
        return new Promise(function(resolve) {
            drive.files.create(
                {
                    resource: fileMetadata,
                    fields: 'id',
                },
                function(err, file) {
                    if (err) {
                        console.error(err)
                    } else {
                        resolve(file.data.id)
                    }
                },
            )
        })
    }

    function uploadFile(folderId, filename) {
        let fileMetadata = {
                name: filename,
                parents: [folderId],
                mimeType: 'application/vnd.google-apps.spreadsheet',
            },
            media = {
                mimeType:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                body: fs.createReadStream(
                    `${config.EXCEL_PATH}/${filename}`,
                ),
            }
        return new Promise(function(resolve) {
            drive.files.create(
                {
                    resource: fileMetadata,
                    media: media,
                    fields: 'id',
                },
                function(err, file) {

                    if (err) {
                        // Handle error
                        console.error(err)
                        process.exit(1)
                    } else {
                        console.log('upload file success: ', filename)
                        resolve()
                    }
                },
            )
        })
    }

    function downloadFile(fileId, fileName) {
        let dest = fs.createWriteStream(
            `${config.EXCEL_PATH}/${fileName}.xlsx`,
        )
        return new Promise(function(resolve, reject) {
            drive.files.export(
                {
                    fileId: fileId,
                    mimeType:
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
                {
                    responseType: 'stream',
                },
                function(err, response) {
                    if (err) {
                        console.log(err)
                        reject('error')
                        return
                    }
                    response.data
                        .on('error', () => {
                            console.log('error')
                            reject('error')
                        })
                        .on('end', () => {
                            console.log('end downloading ', fileName)
                            resolve('end downloading')
                        })
                        .pipe(dest)
                },
            )
        })
    }

    function deleteFolder(id) {
        return new Promise(resolve => {
            drive.files.delete(
                {
                    fileId: id,
                },
                function(err, file) {
                    if (err) {
                        console.error(err)
                        process.exit(1)
                        return
                    }
                    console.log('Folder ' + id + ' has been deleted')
                    resolve(file.data.id)
                },
            )
        })
    }
}

module.exports = main
