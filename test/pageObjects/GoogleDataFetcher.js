// import shell from "shelljs";
// import fs from 'fs/promises';

class GoogleDataFetcher {
    constructor(){
        this.textStr = [];
    }

    async splitIntoSentences() {
        // Split text by punctuation marks followed by whitespace, line breaks or the end of the text
        let text = await shell.exec('cat text.txt');
        let sentences = text.split(/(?<=[.!?;:])\s*(?=\S|$)/g);
      
        // Remove any empty strings that may have resulted from the split operation
        this.textStr = sentences.filter(sentence => sentence.trim() !== '');
    }

    async fetchGoogleHTMLs(sentence) {
        const timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
            clearTimeout(id);
            reject(`Timed out while fetching`);
            }, 10000) 
        })
        const fetch = new Promise(async (resolve, reject) => {
            await browser.url(`https://www.google.com/search?q="${sentence}"`);
            try{
                // await $('#search').waitForDisplayed();
                // const googleBody = await $$('cite').getHTML(false);
                // await fs.writeFile(`UnicHTML/${index + 1}.html`, googleBody);
            }
            catch(err){
                console.log(err);
        }
        })
        return await Promise.race([fetch, timeout]);
    }
}

export default new GoogleDataFetcher();