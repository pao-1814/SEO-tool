import shell from "shelljs";
import fs from 'fs';
import DataProcessor from "../pageObjects/DataProcessor.js";
import { JSDOM } from 'jsdom';


describe('Checking unicum', function() {
    let texts = [];

    before(async function() {
        let inputTexts = shell.ls('input/Unic');
        inputTexts.forEach((text, index) => {
            texts[index] = {
                text: fs.readFileSync(`input/Unic/${text}`, 'utf8'),
            }
            texts[index].sentences = texts[index].text.split(/(?<=[.!?])\s*(?=\S|$)/g),
            texts[index].name = text;
        })
    });

    after(function() {
        shell.exec(`osascript -e "tell application \\"Tunnelblick\\" to disconnect all"`);
    })

    it('should fetch data', async function() {
        const servers = [
            'Bulgaria1',
            'Bulgaria2',
            'Czech',
            'Finland',
            'Hungary',
            'Ireland',
            'Italy1',
            'Italy2',
            'Luxemburg',
            'Moldova',
            'Netherlands1',
            'Netherlands2',
            'Poland1',
            'Poland2',
            'Portugal',
            'Romania',
            'Spain',
            'Sweden',
            'Ukraine1',
            'Ukraine2',
        ]
        let server = 0;
        let VPNOn = false;
        const resultArray = [];
        const link = shell.exec('cat ./input/link.txt');
        for(let n = 0; n < texts.length; n++) {
            let datestamp = new Date().toLocaleTimeString('uk-UA');
            fs.mkdir(`./output/${texts[n].name}_${datestamp}`, {recursive: true}, err => {
                if (err) {
                    console.error(err);
                    return;
                  }
            })
            fs.mkdir(`./output/${texts[n].name}_${datestamp}/screenshots`, {recursive: true}, err => {
                if (err) {
                    console.error(err);
                    return;
                  }
            })
            fs.writeFile(`./output/${texts[n].name}_${datestamp}/results.csv`, '', err => {
                if (err) {
                  console.error(err);
                  return;
                }
            });
            console.log(texts[n].sentences.length)
            for (let i = 0; i < texts[n].sentences.length; i++) {
                await browser.url(`https://www.google.com/search?q="${texts[n].sentences[i]}"`);
                const captcha = await $('#captcha-form');
                console.log(await captcha.isExisting())
                resultArray[i] = {};
                if(await captcha.isExisting()){
                    server = Math.floor(Math.random() * 20);
                    if(!VPNOn) {
                        console.log(servers[server])
                        shell.exec(`osascript -e "tell application \\"Tunnelblick\\" to connect \\"${servers[server]}\\""`);
                        VPNOn = true;
                    }
                    else{
                        console.log(servers[server])
                        shell.exec(`osascript -e "tell application \\"Tunnelblick\\" to disconnect all"`);
                        await browser.pause(2000);
                        shell.exec(`osascript -e "tell application \\"Tunnelblick\\" to connect \\"${servers[server]}\\""`);
                    }
                    await browser.pause(10000);
                    await browser.reloadSession();
                    i--;
                    continue;
                }
                console.log('foooooo')
                await $('#search').waitForDisplayed();
                await browser.saveScreenshot(`./output/${texts[n].name}_${datestamp}/screenshots/${i+1}.png`);
                const googleBody = await $('#search').getHTML(false);
                await fs.promises.writeFile(`UnicHTML/${i + 1}.html`, googleBody);
                resultArray[i].location = VPNOn ? servers[server] : 'Original IP';
                await browser.pause(Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000);
                // await browser.reloadSession();
            }
            let files = shell.ls('UnicHTML');
            for (let i = 0; i < files.length; i++){
                const htmlString = fs.readFileSync(`UnicHTML/${files[i]}`, 'utf8');
                const dom = new JSDOM(htmlString);
                const linksArray = dom.window.document.querySelectorAll(`cite`);
                resultArray[i].sentence = JSON.stringify(texts[n].sentences[i]);
                if(linksArray.length){
                    resultArray[i].unic = linksArray[0].textContent.includes(link) && linksArray.length === 2 ? true : false;
                    resultArray[i].links = '';
                    resultArray[i].index = '';
                    for(let k = 0; k < linksArray.length; k ++){
                        if(k % 2 === 0){
                            continue;
                        }
                        if(linksArray[k].textContent.includes(link)){
                            resultArray[i].index = (k + 1)/2;
                        }
                        resultArray[i].links += linksArray[k].textContent + '   '
                    }
                    DataProcessor.writeObjectsToCSV(resultArray[i], `./output/${texts[n].name}_${datestamp}/results.csv`, resultArray[i] !== resultArray[0]);
                }
            }
            shell.exec('rm UnicHTML/*')
        }
    });
});