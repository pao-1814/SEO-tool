import shell from "shelljs";
import DataFetcher from "../DataFetcher";
import { csvmaker } from "../Helpers";

// Сюда вставить домен, который нужно искать в ссылках
const findLink = 'onlinecasino-nl.com';
//====================================================

describe('DataFetching', async () => {
    await DataFetcher.fetchHtml();
    
    
    
    // let result = [];
    // let i = 0;
    // // const data = await shell.exec('cat data.txt').split(/\r?\n/);
    
    // // const sesstionId = new Date().toLocaleTimeString('it-IT');
    
    // shell.exec(`echo "website; loaded; hasLink; link; anchor; display; rel; position;" >> test-report_${sesstionId}.csv`);
    // const csvmaker = function (data) {
    //     const csvRows = [];
    //     const values = Object.values(data).join('; ');
    //     csvRows.push(values)
    //     return csvRows.join('\n')
    // }       
    // data.forEach(website => {
    //     it(`Checked the website ${website}` , async () => {
    //         i++;
    //         const resultObj = {
    //             website: website,
    //             loaded: true,
    //             hasLink: true,
    //             link: '',
    //             anchor: '',
    //             display: false,
    //             rel: false,
    //             position: false,
    //         }
    //         try{
    //             await browser.url(website);
    //             resultObj.loaded = true;
    //             const links = await $$('a');
    //             let resultedLink;
    //             let insertedLink = '';
    //             for(let i = 0; i < links.length; i++){
    //                 let linkUrl = await links[i].getAttribute('href');
    //                 if(linkUrl){
    //                     if(linkUrl.includes(findLink)){
    //                         resultedLink = links[i];
    //                         insertedLink = linkUrl
    //                     }
    //                 } 
    //             }
    //             if(insertedLink.length){
    //                 const position = await resultedLink.getCSSProperty('position');
    //                 const display = await resultedLink.getCSSProperty('display');
    //                 // const parent = await resultedLink.parentElement();
    //                 const rel = await resultedLink.getAttribute('rel');
    //                 // const parentText = await parent.getHTML();
    //                 // const indexOfLink = parentText.indexOf(findLink);
    //                 // const savedParent = parentText.length > 500 ? parentText.substring(indexOfLink - 200, indexOfLink + 200) : parentText;
    //                 const anchor = await resultedLink.getText();
    //                 resultObj.hasLink = true;
    //                 resultObj.link = insertedLink;
    //                 resultObj.display = display.value.includes('none');
    //                 resultObj.rel = rel.includes('nofollow');
    //                 resultObj.anchor = anchor;
    //                 resultObj.position = position.value.includes('absolute');
    //                 // resultObj.parentText = savedParent;
    //             }
    //             else{
    //                 resultObj.hasLink = false
    //             }
    //             // await browser.saveScreenshot(`screenshots/${new URL(website).hostname}.png`);
    //             shell.exec(`echo ${JSON.stringify(csvmaker(resultObj))} >> test-report_${sesstionId}.csv`)          
    //         }
    //         catch(err){
    //             shell.exec(`echo "Failed to load ${website}" >> logs_${sesstionId}.txt`)
    //             shell.exec(`echo "1st error block: ${err}" >> logs_${sesstionId}.txt`)
    //             await browser.pause(2000);
    //             await shell.exec(`osascript -e 'tell application "System Events" to key code 53'`);
    //             await browser.pause(2000);
    //             try{
    //                 const links = await $$('a');
    //                 let resultedLink;
    //                 let insertedLink = '';
    //                 for(let i = 0; i < links.length; i++){
    //                     let linkUrl = await links[i].getAttribute('href');
    //                     if(linkUrl){
    //                         if(linkUrl.includes(findLink)){
    //                             resultedLink = links[i];
    //                             insertedLink = linkUrl
    //                         }
    //                     } 
    //                 }
    //                 if(insertedLink.length){
    //                     const position = await resultedLink.getCSSProperty('position');
    //                     const display = await resultedLink.getCSSProperty('display');
    //                     // const parent = await resultedLink.parentElement();
    //                     const rel = await resultedLink.getAttribute('rel');
    //                     // const parentText = await parent.getHTML();
    //                     // const indexOfLink = parentText.indexOf(findLink);
    //                     // const savedParent = parentText.length > 500 ? parentText.substring(indexOfLink - 200, indexOfLink + 200) : parentText;
    //                     const anchor = await resultedLink.getText();
    //                     resultObj.hasLink = true;
    //                     resultObj.link = insertedLink;
    //                     resultObj.display = display.value.includes('none');
    //                     resultObj.rel = rel === 'nofollow';
    //                     resultObj.anchor = anchor;
    //                     resultObj.position = position.value.includes('absolute');
    //                     // resultObj.parentText = savedParent;
    //                 }
    //                 else{
    //                     resultObj.hasLink = false
    //                 }
    //                 resultObj.loaded = false;
    //                 result.push(resultObj);
    //                 // await browser.saveScreenshot(`screenshots/${new URL(website).hostname}.png`);
    //                 shell.exec(`echo ${JSON.stringify(csvmaker(resultObj))} >> test-report_${sesstionId}.csv`)          
    //                 await browser.reloadSession();
    //                 await browser.pause(2000);
    //                 await browser.reloadSession();
    //             }
    //             catch(err)
    //             {
    //                 resultObj.hasLink = false;
    //                 resultObj.loaded = false;
    //                 shell.exec(`echo "Failed to load ${website}" >> logs_${sesstionId}.txt`)
    //                 shell.exec(`echo "2d error block: ${err}" >> logs_${sesstionId}.txt`)
    //                 shell.exec(`echo ${JSON.stringify(csvmaker(resultObj))} >> test-report_${sesstionId}.csv`)
    //                 await browser.reloadSession();
    //                 await browser.pause(2000);
    //                 await browser.reloadSession();
    //             }
    //         }
    //     })
    // })

})
