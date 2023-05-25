import DataFetcher from "../pageObjects/DataFetcher.js";
import DataProcessor from "../pageObjects/DataProcessor.js";
import shell from "shelljs";
import fs from 'fs/promises';

describe('DataFetching', () => {
    after(() => {
        shell.exec('rm HTMLs/*');
    })

    for (const [index, website] of DataFetcher.websiteArr.entries()) {
        it(`Fetching the website ${website}`, async () => {
            try {
                await DataFetcher.fetchHtml(website, index);
            } catch(err) {
                await browser.reloadSession();
            }
        });
    }
    it('Processes the data', async () => {
        await DataProcessor.processData();
    })
});
