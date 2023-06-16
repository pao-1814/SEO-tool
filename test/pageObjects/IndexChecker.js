import shell from "shelljs";
import fs from 'fs';
import VPN from '../pageObjects/Helpers.js'
import { JSDOM } from 'jsdom';
import DataProcessor from "./DataProcessor.js";

class IndexChecker {
    constructor(){
        this.resultArray = [];
        this.datestamp = new Date().toLocaleTimeString('uk-UA');
        this.websiteArr = shell.exec('cat input/indexCheck/links.txt').stdout.split(/\r?\n/);
    }

    createOutputFolders(textName){
        fs.mkdir(`./output/indexCheck`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        fs.mkdir(`./output/indexCheck/${this.datestamp}`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        fs.mkdir(`indexHTML`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        fs.mkdir(`./output/indexCheck/${this.datestamp}/screenshots`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        fs.writeFile(`./output/indexCheck/${this.datestamp}/results.csv`, '', err => {
            if (err) {
              console.error(err);
              return;
            }
        });
    }

    async fetchHTML() {
        for(let i = 0; i < this.websiteArr.length; i++){
            try{
                await browser.url(`https://www.google.com/search?q=site:${this.websiteArr[i]}`);
                const captcha = await $('#captcha-form');
                this.resultArray[i] = {};
                if(await captcha.isExisting()){
                    await VPN.trigerVPN();
                    i--;
                    continue;
                }
                await $('#search').waitForExist();
                await browser.saveScreenshot(`./output/indexCheck/${this.datestamp}/screenshots/${i+1}.png`);
                const googleBody = await $('#search').getHTML(false);
                this.resultArray[i].link = this.websiteArr[i];
                if(i < 9){
                    await fs.promises.writeFile(`indexHTML/00${i + 1}.html`, googleBody);
                }
                else if(i >= 9 && i < 99){
                    await fs.promises.writeFile(`indexHTML/0${i + 1}.html`, googleBody);
                }
                else{
                    await fs.promises.writeFile(`indexHTML/${i + 1}.html`, googleBody);
                }
                await browser.pause(Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000);
            }
            catch(err){
                console.log(err);
                i--;
                await browser.reloadSession();
            }
        }
    }

    async processFiles(){
        let files = shell.ls('indexHTML');
        for (let i = 0; i < files.length; i++){
            const htmlString = fs.readFileSync(`indexHTML/${files[i]}`, 'utf8');
            const dom = new JSDOM(htmlString);
            let foundLinks = dom.window.document.querySelectorAll(`cite`);
            let linksArray = Array.from(foundLinks);
            if(linksArray.length){
                this.resultArray[i].indexed = true;
            }
            else{
                this.resultArray[i].indexed = false;
            }
        }
        DataProcessor.writeObjectsToCSV(this.resultArray, `./output/indexCheck/${this.datestamp}/results.csv`, false);
    }

    
}

export default new IndexChecker();