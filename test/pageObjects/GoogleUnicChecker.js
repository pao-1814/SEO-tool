import shell from "shelljs";
import fs from 'fs';
import VPN from '../pageObjects/Helpers.js'
import { JSDOM } from 'jsdom';
import DataProcessor from "./DataProcessor.js";


class GoogleUnicChecker {
    constructor(){
        this.resultArray = [];
        this.link = shell.exec('cat ./input/Unic/link.txt');
        this.datestamp = new Date().toLocaleTimeString('uk-UA');
    }

    createOutputFolders(textName){
        fs.mkdir(`./output/${textName}_${this.datestamp}`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        fs.mkdir(`UnicHTML`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        fs.mkdir(`./output/${textName}_${this.datestamp}/screenshots`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        fs.writeFile(`./output/${textName}_${this.datestamp}/results.csv`, '', err => {
            if (err) {
              console.error(err);
              return;
            }
        });
    }

    async fetchHTML(text) {
        for (let i = 0; i < text.sentences.length; i++) {
            await browser.url(`https://www.google.com/search?q="${text.sentences[i]}"`);
            const captcha = await $('#captcha-form');
            this.resultArray[i] = {};
            if(await captcha.isExisting()){
                await VPN.trigerVPN();
                i--;
                continue;
            }
            await $('#search').waitForDisplayed();
            await browser.saveScreenshot(`./output/${text.name}_${this.datestamp}/screenshots/${i+1}.png`);
            const googleBody = await $('#search').getHTML(false);
            if(i < 9){
                await fs.promises.writeFile(`UnicHTML/00${i + 1}.html`, googleBody);
            }
            else if(i >= 9 && i < 99){
                await fs.promises.writeFile(`UnicHTML/0${i + 1}.html`, googleBody);
            }
            else{
                await fs.promises.writeFile(`UnicHTML/${i + 1}.html`, googleBody);
            }
            this.resultArray[i].location = VPN.getVPNStatus() ? VPN.getServerName() : 'Original IP';
            await browser.pause(Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000);
        }
    }

    async processFiles(text){
        let files = shell.ls('UnicHTML');
        for (let i = 0; i < files.length; i++){
            const htmlString = fs.readFileSync(`UnicHTML/${files[i]}`, 'utf8');
            const dom = new JSDOM(htmlString);
            let foundLinks = dom.window.document.querySelectorAll(`cite`);
            let linksArray = Array.from(foundLinks);
            this.resultArray[i].sentence = JSON.stringify(text.sentences[i]);
            // Finding similar queries (if exist)
            const similarResults = dom.window.document.querySelectorAll('span');
            const similarResultsArr = Array.from(similarResults);
            const similarResultsSpan = similarResultsArr.find(span => (span.textContent.includes('People also ask') || span.textContent.includes('Похожие запросы') || span.textContent.includes('Схожі запити')));
            if(similarResultsSpan){
                const similarDiv = similarResultsSpan.parentElement.parentElement.parentElement.parentElement;
                let similarLinks = Array.from(similarDiv.querySelectorAll(`cite`));
                similarLinks = similarLinks.map(link => link.textContent);
                linksArray = linksArray.filter(link => !similarLinks.includes(link.textContent));
            }
            //
            if(linksArray.length){
                this.resultArray[i].unic = linksArray[0].textContent.includes(this.link) && linksArray.length === 2 ? true : false;
                this.resultArray[i].links = '';
                this.resultArray[i].index = '';
                for(let k = 0; k < linksArray.length; k ++){
                    if(k % 2 === 0){
                        continue;
                    }
                    if(linksArray[k].textContent.includes(this.link)){
                        this.resultArray[i].index = (k + 1)/2;
                    }
                    this.resultArray[i].links += linksArray[k].textContent + '   '
                }
                DataProcessor.writeObjectsToCSV(this.resultArray[i], `./output/${text.name}_${this.datestamp}/results.csv`, this.resultArray[i] !== this.resultArray[0]);
            }
        }
    }

    
}

export default new GoogleUnicChecker();