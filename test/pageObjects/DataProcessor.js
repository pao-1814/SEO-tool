import shell from "shelljs";
import fs from 'fs';
import { JSDOM } from 'jsdom';

class DataProcessor {
    constructor(){
        this.link = shell.exec('cat input/link.txt');
        this.datestamp = new Date().toLocaleTimeString('uk-UA');
    }

writeObjectsToCSV(object, filename, append = false) {
    const writeStream = fs.createWriteStream(filename, { flags: append ? 'a' : 'w' });
    const columnNames = Object.keys(object);
    if (!append) { // Write headers only if it's not appending
        writeStream.write(columnNames.join(',') + '\n');
    }

    const row = columnNames.map(columnName => object[columnName]);
    writeStream.write(row.join(',') + '\n');

    writeStream.end();

    writeStream.on('finish', () => {
        console.log(`Successfully wrote to ${filename}`);
    }).on('error', (err) => {
        console.error('Error writing file', err);
    });
}



    async processData() {
        let files = shell.ls('HTMLs');
        fs.mkdir(`output/LinkCheck_${this.datestamp}`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        for (let file of files) {
            const resultObj = {};
            const htmlString = fs.readFileSync(`HTMLs/${file}`, 'utf8');
    
            const dom = new JSDOM(htmlString);
            const linkElement = dom.window.document.querySelector(`a[href*="${this.link}"]`);
    
            resultObj.website = dom.window.document.getElementById('hostname').textContent;
            resultObj.statuscode = dom.window.document.getElementById('statuscode').textContent;
    
            if (linkElement) {
                resultObj.link = linkElement.getAttribute('href');
                resultObj.absolute = linkElement.getAttribute('position') || 'none';
                resultObj.rel = linkElement.getAttribute('rel') || 'none';
                resultObj.display = linkElement.getAttribute('display') || 'none';
                resultObj.anchor = linkElement.textContent.length ? linkElement.textContent : 'none';
            } else {
                resultObj.link = 'none';
                resultObj.absolute = 'not mentioned';
                resultObj.rel = 'none';
                resultObj.display = 'not mentioned';
                resultObj.anchor = 'none';
            }
            await browser.pause(200);
            this.writeObjectsToCSV(resultObj, `output/LinkCheck_${this.datestamp}/output.csv`, file !== files[0]);
        }
        shell.exec('killall Google\ Chrome')
    }
    
}

export default new DataProcessor();
