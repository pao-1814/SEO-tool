import shell from "shelljs";
import fs from 'fs';
import { JSDOM } from 'jsdom';

class DataProcessor {
    constructor(){
        this.link = shell.exec('cat ./input/linkCheck/link.txt');
        this.datestamp = new Date().toLocaleTimeString('uk-UA');
        this.resultArray = [];
    }

    writeObjectsToCSV(objects, filename, append = false) {
        const writeStream = fs.createWriteStream(filename, { flags: append ? 'a' : 'w' });
        const columnNames = Object.keys(objects[0]);
    
        if (!append) { // Write headers only if it's not appending
            writeStream.write(columnNames.join(',') + '\n');
        }
    
        objects.forEach(object => {
            const row = columnNames.map(columnName => object[columnName]);
            writeStream.write(row.join(',') + '\n');
        });
    
        writeStream.end();
    
        writeStream.on('finish', () => {
            console.log(`Successfully wrote to ${filename}`);
        }).on('error', (err) => {
            console.error('Error writing file', err);
        });
    }
    



    async processData() {
        let files = shell.ls('HTMLs');
        fs.mkdir(`output/linkCheck`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        fs.mkdir(`output/linkCheck/${this.datestamp}`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        for(let i = 0; i < files.length; i++) {
            this.resultArray[i] = {};
            const htmlString = fs.readFileSync(`HTMLs/${files[i]}`, 'utf8');
    
            const dom = new JSDOM(htmlString);
            const linkElement = dom.window.document.querySelector(`a[href*="${this.link}"]`);
    
            this.resultArray[i].website = dom.window.document.getElementById('hostname').textContent;
            this.resultArray[i].statuscode = dom.window.document.getElementById('statuscode').textContent;
            this.resultArray[i].error = dom.window.document.getElementById('error').textContent;
    
            if (linkElement) {
                this.resultArray[i].link = linkElement.getAttribute('href');
                this.resultArray[i].absolute = linkElement.getAttribute('position') || 'none';
                this.resultArray[i].rel = linkElement.getAttribute('rel') || 'none';
                this.resultArray[i].display = linkElement.getAttribute('display') || 'none';
                this.resultArray[i].anchor = linkElement.textContent.length ? linkElement.textContent : 'none';
            } else {
                this.resultArray[i].link = 'none';
                this.resultArray[i].absolute = 'not mentioned';
                this.resultArray[i].rel = 'none';
                this.resultArray[i].display = 'not mentioned';
                this.resultArray[i].anchor = 'none';
            }
            await browser.pause(200);
        }
        this.writeObjectsToCSV(this.resultArray, `output/linkCheck/${this.datestamp}/output.csv`, false);
        shell.exec('killall Google\ Chrome')
    }
    
}

export default new DataProcessor();
