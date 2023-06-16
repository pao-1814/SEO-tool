import shell from "shelljs";
import fs from 'fs';
import GoogleUnicChecker from "../pageObjects/GoogleUnicChecker.js";


describe('Checking unicum', function() {
    let texts = [];

    before(async function() {
        let inputTexts = shell.ls('input/Unic/texts');
        inputTexts.forEach((text, index) => {
            texts[index] = {
                text: fs.readFileSync(`input/Unic/texts/${text}`, 'utf8'),
            }
            texts[index].sentences = texts[index].text.split(/(?<=[.!?;])\s*(?=\S|$)/g)
            texts[index].name = text;
            console.log(texts[index].sentences);
        })
        shell.exec('rm UnicHTML/*')
    });

    after(function() {
        shell.exec(`osascript -e "tell application \\"Tunnelblick\\" to disconnect all"`);
    })

    it('Completing Unic check', async function() {
        for(let n = 0; n < texts.length; n++) {
            GoogleUnicChecker.createOutputFolders(texts[n].name);
            await GoogleUnicChecker.fetchHTML(texts[n]);
            await GoogleUnicChecker.processFiles(texts[n]);
            shell.exec('rm UnicHTML/*')
        }
    });
});
