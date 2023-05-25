const shell = require("shelljs");

class DataFetcher{
    constructor() {
        this.websiteArr = shell.exec('cat data.txt').split(/\r?\n/);
        this.sesstionId = new Date().toLocaleTimeString('it-IT');
    }

    async fetchHtml() {
        this.websiteArr.forEach(async website => {
            try{
                await browser.url(website);
                await $('body').waitForDisplayed();
                const websiteBody = await $('body');
                shell.exec(`echo ${websiteBody} >> HTMLs/html_${website}.txt`)
            }
            catch(err){
                console.log('===============================================')
                console.log('The website has not been loaded')
                console.log(err);
            } 
        });
    }
}

export default new DataFetcher();