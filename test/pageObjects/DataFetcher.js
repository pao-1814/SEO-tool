import shell from "shelljs";
import fs from 'fs/promises';
import axios from 'axios';
import { error } from "console";


class DataFetcher {
  constructor() {
    this.websiteArr = shell.exec('cat input/linkCheck/links_to_check.txt').stdout.split(/\r?\n/);
    this.sesstionId = new Date().toLocaleTimeString('it-IT');
  }

    getDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (err) {
            console.error('Invalid URL', err);
            return null;
        }
    }

    async getStatusCode(url) {
        try {
            const response = await axios.get(url);
            return response.status;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                return error.response.status;
            } else if (error.request) {
                // The request was made but no response was received
                console.log('No response received');
                return null;
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                return null;
            }
        }
    }
    
    async fetchHtml(website, index) {
        const domain = this.getDomain(website);
        fs.mkdir(`HTMLs`, {recursive: true}, err => {
            if (err) {
                console.error(err);
                return;
              }
        })
        try {
            const timeout = new Promise((resolve, reject) => {
                let id = setTimeout(() => {
                clearTimeout(id);
                reject(`Timed out while fetching ${website}`);
                }, 15000) 
            })
        
            const fetch = new Promise(async (resolve, reject) => {
                try {
                    browser.url(website);
                    await browser.pause(10000);
                    shell.exec(`osascript -e 'tell application "System Events" to key code 53'`);
                    const websiteBody = await $('body').getHTML(false);
                    let statusCode = 'xxx';
                    let resultHTML = `<p id="hostname">${website}</p>` + `<p id="statuscode">${statusCode}</p>` + websiteBody + `<p id="error">No error</p>`
                    await fs.writeFile(`HTMLs/${index + 1}_html_${domain}.html`, resultHTML);
                    statusCode = await this.getStatusCode(website);
                    resultHTML = `<p id="hostname">${website}</p>` + `<p id="statuscode">${statusCode}</p>` + websiteBody + `<p id="error">No error</p>`
                    await fs.writeFile(`HTMLs/${index + 1}_html_${domain}.html`, resultHTML);
                    resolve();
                    } 
                catch (err) {
                    const websiteBody = $('body').getHTML(false);
                    let resultHTML = `<p id="hostname">${website}</p>` + `<p id="statuscode">${statusCode}</p>` + websiteBody + `<p id="error">${err}</p>`
                    await fs.writeFile(`HTMLs/${index + 1}_html_${domain}.html`, resultHTML);
                    reject(err);
                }
            })
            
            return await Promise.race([fetch, timeout])
            } catch(err){
                console.log('===============================================')
                console.log(`The website ${domain} has not been loaded`)
                // shell.exec(`osascript -e 'tell application "System Events" to key code 53'`);
                let websiteBody;
                try{
                    websiteBody = await $('body').getHTML(false); 
                }
                catch(err){
                    websiteBody = '<p>The website has not been loaded</p>'; 
                    await fs.writeFile(`HTMLs1/${index + 1}_html_${domain}.html`, resultHTML);
                    await browser.reloadSession();
                }
                let statusCode = 'none';
                let resultHTML = websiteBody + statusCode;
                // try{
                //     statusCode = await this.getStatusCode(website);
                //     resultHTML = `<p id="hostname">${website}</p>` + `<p id="statuscode">${statusCode}</p>` + websiteBody;
                // }
                // catch(err){
                //     resultHTML = `<p id="hostname">${website}</p>` + websiteBody;
                // }
                await fs.writeFile(`HTMLs1/${index + 1}_html_${domain}.html`, resultHTML);
                await browser.reloadSession();
            }         
    }
}

export default new DataFetcher();
