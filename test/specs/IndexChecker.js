import shell from "shelljs";
import IndexChecker from "../pageObjects/IndexChecker.js";

describe('Checking index', () =>{
    before(async function() {
        shell.exec('rm indexHTML/*');
        await browser.pause(2000);
    });
    
    after(function() {
        shell.exec(`osascript -e "tell application \\"Tunnelblick\\" to disconnect all"`);
    })

    it('Checking indexing', async function() {
        IndexChecker.createOutputFolders();
        await IndexChecker.fetchHTML();
        await IndexChecker.processFiles();
    })
})