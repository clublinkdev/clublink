import fs from "fs";
import fetch, { Response } from "node-fetch";
import fse from "fs-extra";
import shell from "shelljs";
import path from "path";

const directory = "src";
var srcExists;
var needsUpdate;
const fileName = "updating/version.txt";


fs.access(directory, function(error) {
    if (error) {
        console.log("cant find src");
        srcExists = false;
        downloadFiles();
        moveFolder();
        checkVersion();
    } else {
        console.log("Directory exists.");
        srcExists = true;
        checkVersion();
    }
})

function updateSequence() {
    console.log(needsUpdate);
    if (needsUpdate == true) {
        srcCheck();
        fs.access("/updating/clublink", function(error) {
            if (error) {
                console.log("no clublink folder");
                downloadFiles();
                moveFolder();
            } else {
                console.log("exists");
                fse.removeSync('/updating/clublink');
                downloadFiles();
                moveFolder();
            }
        })


    } else if (needsUpdate == false) { console.log('Up to Date!'); }


}

function moveFolder() {
    fse.rename("updating/clublink/src", directory, function(err) {
        console.log('Successfully moved!')
    })
    fse.removeSync("updating/clublink");
}

function downloadFiles() {
    shell.cd("updating")
    shell.exec("git clone https://github.com/clublinkdev/clublink --recursive");
    shell.cd("../")
}

function srcCheck() {
    if (srcExists) {
        fse.removeSync('src');
    }
}

async function checkVersion() {
    var clientVersion = fs.readFileSync(fileName, 'utf8');
    var currentVersion;
    const response = await fetch("https://raw.githubusercontent.com/xploree/clublink/main/updating/version.txt");
    const data = await response.text();
    console.log(data);
    console.log(clientVersion);
    if (clientVersion != data) {
        needsUpdate = true;
        fs.writeFile('updating/version.txt', data, err => {
            if (err) {
                console.error(err)
                return
            }
            console.log("success");
        })
    } else {
        needsUpdate = false;
    }
    // console.log("yo")
    updateSequence();

}