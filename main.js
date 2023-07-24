
// // another approach //
// const axios = require("axios");
// const fs = require("fs");

// const res = "outputfolder";
// const st = [];
// let session_id;
// const urlarr = new Set();
// let working = false;
// const maxdep = process.argv[2];
// const time = process.argv[3];
// const already = process.argv[4];

// if (!fs.existsSync(res)) {
//   fs.mkdirSync(res);
// }

// if (already == "Y" || already == "y") {
//   session_id = process.argv[5];
//   process.chdir(res);
//   process.chdir(session_id);
//   fs.readFile("./position.txt", (err, data) => {
//     if (err) throw err;
//     if (data.length != 0) {
//       data = JSON.parse(data.toString());
//       for (const item of data.setArray) {
//         urlarr.add(item);
//       }
//       data.st.forEach((element) => {
//         st.push(element);
//       });
//       session_id = data.session_id;
//       save();
//     }
//   });
// } else {
//   fetch();
// }


// //****  crawl function for crawling the links ****//

// async function crawl(url, depth = 0) {
//   if (depth > maxdep) {
//     console.log("already visited", url);
//     return;
//   }

//   urlarr.add(url);

//   try {
//     const response = await axios.get(url);
//     const data = response.data;
//     const fileName = Date.now() + "_" + depth + ".html";
//     const path = fileName;
//     await useregex(path, data, depth);
//     console.log(`Crawler is at (Depth ${depth}): ${url}`);
//   } catch (err) {
//     console.error(`Error: ${url}`, err);
//   }
// }


// /***** function for usergex *****/
// async function useregex(path, data, depth) {
//   data = data.toString();
//   fs.writeFile(path, data, (err) => {
//     if (err) {
//       console.error(`Error writing file: ${path}`, err);
//     }
//   });

//   const urlRegex = /(\bhref=('|")[-A-Z0-9+&@\/%?=_|!:,.;]+[-A-Z0-9+&@\/%=_|])/gi;
//   data.replace(urlRegex, function (url) {
//     url = url.slice(6, url.length);
//     url = "http://127.0.0.1:8000" + url;
//     url = url + "?sid=" + session_id;
//     url = url + "&depth=" + (Number(depth) + 1);
//     if (depth < maxdep) st.push({ url, depth: depth + 1 });
//   });

//   save();
// }


// // save function

// async function save() {
//   if (working === false) {
//     working = true;
//     while (st.length > 0) {
//       const stateData = {
//         setArray: Array.from(urlarr),
//         st: st,
//         session_id: session_id,
//       };

//       fs.writeFile("./position.txt", JSON.stringify(stateData), (err) => {
//         if (err) {
//           console.error("Error occurred while saving position:", err);
//         }
//       });

//       const urls = st.pop();
//       await pause(time);
//       await crawl(urls.url, urls.depth);
//     }

//     await pause(time);

//     const url = `http://localhost:8000/stop_session?sid=${session_id}`;
//     try {
//       const response = await axios.get(url);
//       const data = response.data;
//       console.log(data);
//     } catch (err) {
//       console.error(`Error stopping session: ${url}`, err);
//     }

//     working = false;
//   }
// }

// // functin for pausing the calls for given time period //

// function pause(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }


// // fetch function for fetching or calling to the given link by sir//

// async function fetch() {
//   const url = "http://localhost:8000/start_session";

//   try {
//     const response = await axios.get(url);
//     const data = response.data;
//     session_id = data.data;
//     const res1 = `${res}/session_id: ${session_id}`;

//     if (!fs.existsSync(res1)) {
//       process.chdir(res);
//       fs.mkdirSync(session_id);
//       process.chdir(session_id);
//     }

//     const seedUrl = `http://127.0.0.1:8000/seed_session?sid=${session_id}&depth=0`;
//     await crawl(seedUrl, 0);
//   } catch (err) {
//     console.error(`Error starting session: ${url}`, err);
//   }
// }









































//  //******BELOW IS THE CODE FOR THE PROGRAM TO RESUME ITSELF FROM WHERE IT STOPPED *****// 

//  const express = require('express');
// const app = express();
// const port = 8000;
// const axios = require('axios');
// const fs = require('fs');

// app.use(express.static('public'));
// app.use(express.json());

// // for increasing the file system
// console.log('Server tops');
// let count = 0;
// let pageLinks = new Set(); // Change to Set

// // delay the function by any time interval
// async function delay() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(1);
//     }, 10000);
//   });
// }

// function saveState() {
//   const state = {
//     count,
//     pageLinks: Array.from(pageLinks),
//   };
//   fs.writeFileSync('state.json', JSON.stringify(state));
// }

// function loadState() {
//   if (fs.existsSync('state.json')) {
//     const data = fs.readFileSync('state.json', 'utf-8');
//     const state = JSON.parse(data);
//     count = state.count;
//     pageLinks = new Set(state.pageLinks);
//   }
// }

// app.post('/datarequired', async function (req, res) {
//   const url = req.body.URL;

//   pageLinks.add(url); // Add initial URL to the set

//   for (let i = 0; i < 2; i++) {
//     if (i <= pageLinks.size - 1) {
//       let pageLinkspage = [];
//       let j = 0; // Initialize the j variable
//       for (let link of pageLinks) {
//         console.log('Current URL:', link);

//         try {
//           const response = await axios.get(link, { responseType: 'stream' });

//           // Create the folder if it doesn't exist
//           if (!fs.existsSync(`./files${count}`)) {
//             fs.mkdirSync(`./files${count}`);
//           }

//           const writeStream = fs.createWriteStream(`./files${count}/html_file${i}${j}.html`);

//           response.data.pipe(writeStream);

//           writeStream.on('finish', () => {
//             console.log(`HTML file ${i}${j} saved.`);
//           });

//           j++; // Increment the j variable for the next file

//           const dataChunks = [];
//           response.data.on('data', (chunk) => {
//             dataChunks.push(chunk);
//           });

//           response.data.on('end', () => {
//             const html = Buffer.concat(dataChunks).toString();

//             // Extract anchor tags with href attribute
//             const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>/g;
//             let match;
//             while ((match = regex.exec(html)) !== null) {
//               const href = match[1];
//               if (href && href.startsWith('http') && !/\.(png|jpe?g|gif|svg|ico)$/i.test(href)) {
//                 pageLinkspage.push(href);
//               }
//             }
//           });

//           await delay(); // Add a delay to prevent making too many requests in a short time
//         } catch (error) {
//           if (error.code === 'ETIMEDOUT') {
//             console.log('Connection timed out. Retrying...');
//             continue; // Retry the same URL in the next iteration
//           } else {
//             console.log('Error in finding web page of given URL:', error);
//           }
//         }
//       }

//       // Adding new links to the set if they are not already added
//       if (pageLinkspage.length > 0) {
//         pageLinkspage.forEach((link) => pageLinks.add(link));
//       }

//       saveState(); // Save the current state after each iteration
//     }
//   }

//   if (Array.from(pageLinks).length > 1) {
//     count++; // So that every next time a new folder for the files is created
//   }

//   res.send(Array.from(pageLinks)); // Convert set back to array and send it to the client
// });

// app.listen(port, function (err) {
//   if (err) {
//     console.log('Error in running the server on the port', err);
//   } else {
//     console.log(`Server is running fine on the port: ${port}`);
//     loadState(); // Load the previous state when the server starts
//   }
// });














// **** BELOW IS THE CODE FOR THE PROGRAM USING READABLE STREAM ****//


// const express = require('express');
// const app = express();
// const port = 8000;
// const axios = require('axios');
// const fs = require('fs');

// app.use(express.static('public'));
// app.use(express.json());

// // for increasing the file system
// let count = 0;

// // delay the function by any time interval
// async function delay() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(1);
//     }, 10000);
//   });
// }

// app.post('/datarequired', async function (req, res) {
//   let pageLinks = new Set(); // Change to Set
//   const url = req.body.URL;

//   pageLinks.add(url); // Add initial URL to the set

//   for (let i = 0; i < 2; i++) {
//     if (i <= pageLinks.size - 1) {
//       let pageLinkspage = [];
//       let j = 0; // Initialize the j variable
//       for (let link of pageLinks) {
//         console.log('Current URL:', link);

//         try {
//           const response = await axios.get(link, { responseType: 'stream' });

//           // Create the folder if it doesn't exist
//           if (!fs.existsSync(`./files${count}`)) {
//             fs.mkdirSync(`./files${count}`);
//           }

//           const writeStream = fs.createWriteStream(`./files${count}/html_file${i}${j}.html`);

//           response.data.pipe(writeStream);

//           writeStream.on('finish', () => {
//             console.log(`HTML file ${i}${j} saved.`);
//           });

//           j++; // Increment the j variable for the next file

//           const dataChunks = [];
//           response.data.on('data', (chunk) => {
//             dataChunks.push(chunk);
//           });

//           response.data.on('end', () => {
//             const html = Buffer.concat(dataChunks).toString();

//             // Extract anchor tags with href attribute
//             const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>/g;
//             let match;
//             while ((match = regex.exec(html)) !== null) {
//               const href = match[1];
//               if (href && href.startsWith('http') && !/\.(png|jpe?g|gif|svg|ico)$/i.test(href)) {
//                 pageLinkspage.push(href);
//               }
//             }
//           });

//           await delay(); // Add a delay to prevent making too many requests in a short time
//         } catch (error) {
//           if (error.code === 'ETIMEDOUT') {
//             console.log('Connection timed out. Retrying...');
//             continue; // Retry the same url in the next iteration
//           } else {
//             console.log('Error in finding web page of given URL:', error);
//           }
//         }
//       }

//       // Adding new links to the set if they are not already added
//       if (pageLinkspage.length > 0) {
//         pageLinkspage.forEach((link) => pageLinks.add(link));
//       }
//     }
//   }

//   if (Array.from(pageLinks).length > 1) {
//     count++; // So that every next time a new folder for the files is created
//   }

//   res.send(Array.from(pageLinks)); // Convert set back to array and send it to the client
// });

// app.listen(port, function (err) {
//   if (err) {
//     console.log('Error in running the server on the port', err);
//   } else {
//     console.log(`Server is running fine on the port: ${port}`);
//   }
// });






















// const express = require('express');
// const app = express();
// const port = 8000;
// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// app.use(express.static('public'));
// app.use(express.json());


// // for increasing the file system
// let count=0;

// // delay the function by any time interval
// async function delay() {
//   let pr = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(1);
//     }, 10000);
//   });
//   return pr;
// }

// app.post('/datarequired', async function (req, res) {
//   let pageLinks = new Set(); // Change to Set
//   const url = req.body.URL;

//   pageLinks.add(url); // Add initial URL to the set

//   for (let i = 0; i < 2; i++) {
//     if (i <= pageLinks.size - 1) {
//       let pageLinkspage = [];
//       let j = 0; // Initialize the j variable
//       for (let link of pageLinks) {
//         console.log('Current URL:', link);

//         try {
//           const response = await axios.get(link);
//           const html = response.data;

          
//           // Create the folder if it doesn't exist
//           if (!fs.existsSync(`./files${count}`)) {
//             fs.mkdirSync(`./files${count}`);
//           }
          
//           fs.writeFile(`./files${count}/html_file${i}${j}.html`, html, (err) => {
//             if (err) {
//               console.log('Error writing HTML file:', err);
//             }
//           });
//           j++; // Increment the j variable for the next file

//           // using cherio to load the html file got from the axios
//           const $ = cheerio.load(html);
//           const anchorTags = $('a');

//           anchorTags.each((index, element) => {
//             const href = $(element).attr('href');

//             if (href && href.startsWith('http') && !/\.(png|jpe?g|gif|svg|ico)$/i.test(href)) {
//               pageLinkspage.push(href);
//             }
//           });
//         } catch (error) {
//           if (error.code === 'ETIMEDOUT') {
//             console.log('Connection timed out. Retrying...');
//             continue; // Retry the same URL in the next iteration
//           } else {
//             console.log('Error in finding web page of given URL:', error);
//           }
//         }
//       }
//       // Adding new links to the set if it is not already added
//       if (pageLinkspage.length > 0) {
//         pageLinkspage.forEach((link) => pageLinks.add(link)); 
//       }
//     }
//   }
//   if(Array.from(pageLinks).length>1)
//   {
//   count++  //So that every next time new folder for the files is created
//   }
//   res.send(Array.from(pageLinks)); // Convert set back to array and send it to the client
// });

// app.listen(port, function (err) {
//   if (err) {
//     console.log('Error in running the server on the port', err);
//   } else {
//     console.log(`Server is running fine on the port: ${port}`);
//   }
// });

















// const express = require('express');
// const app = express();
// const port = 8000;
// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// app.use(express.static('public'));
// app.use(express.json());


// // delay the function by any time interval
// async function delay(){
//   let pr = new Promise((resolve,reject)=>{
//       setTimeout(()=>{
//           resolve(1);
//       },10000)
//   })
//   // return await pr;

//   return pr;
// }


// app.post('/datarequired', async function (req, res) {
//   let pageLinks = [];
//   let visited=[];
//   let linkvisited=false;
//   const url = req.body.URL;
  
//   pageLinks.push([url]);

//   for (let i = 0; i < 2; i++) {
//     if(i<=pageLinks.length-1)
//     {
//     let pageLinkspage = [];
//     for (let j = 0; j < pageLinks[i].length; j++) {
      
//       let link = pageLinks[i][j];
//       for(let n=0;n<visited.length;n++)
//       {
//         if(link==visited[n])
//         {
//           linkvisited=true;
          
//           break;
//         }

//       }
//       if(linkvisited==true)
//       {
//         linkvisited=false;
//         continue;
//       }
//       else{
//         visited.push(link);
//       }
//       console.log('Current URL:', link);

//       try {
//         // const fun = await delay();
        
//         const response = await axios.get(link);
//         const html = response.data;
//         fs.writeFile(`./files/html_file${i}${j}.html`, html, (err) => {
//           if (err) {
//             console.log('Error writing HTML file:', err);
//           }
//         });

//         const $ = cheerio.load(html);
//         const anchorTags = $('a');

//         anchorTags.each((index, element) => {
//           const href = $(element).attr('href');

//           if (href && href.startsWith('http') && !/\.(png|jpe?g|gif|svg|ico)$/i.test(href)) {
//             pageLinkspage.push(href);
//           }
//         });
//       } catch (error) {
//         if (error.code === 'ETIMEDOUT') {
//           console.log('Connection timed out. Retrying...');
//           j++; // Retry the same URL in the next iteration
//         } else {
//           console.log('Error in finding web page of given URL:', error);
//         }
//       }
     
//     }
//     if(pageLinkspage.length>0)
//     pageLinks.push(pageLinkspage);
//   }
   
//   }

//   res.send(pageLinks);
// });

// app.listen(port, function (err) {
//   if (err) {
//     console.log("Error in running the server on the port", err);
//   } else {
//     console.log(`Server is running fine on the port: ${port}`);
//   }
// });





// to be checked now

// const axios=require('axios');
// const fs=require('fs');

// const resultFolder='resultFolder';
// let session_id;
// let visited=[];
// let unvisited=[];
// let working=false;
// const crawlUrl=process.argv[2];
// const maxdep=process.argv[3];
// const breakTime=process.argv[4];
// const alreadyRunning=process.argv[5];

// if(!fs.existsSync(resultFolder))
// {
//   fs.mkdirSync(resultFolder);
// }


// async function crawl(url,depth=0)
// {
//   if(depth>maxdep)
//   {
//     console.log('Current depth is greater than maxdepth');
//     return;
//   }

//   visited.push(url);

//   try{
//     const response=await axios.get(url);
//     const htmlContent=response.data;
//     const fileName=Date.now()+"_"+depth+".html";
//     const filePath=fileName;
//     //calling a function which takes out the required links
//     await requiredLinks(filePath,htmlContent,depth);
//     console.log(`Crawler is at the (Depth ${depth}): ${url}`);
//   }
//   catch(error)
//   {
//     console.error(`Error: ${url}`, error);
//   }
// }

// // function for taking out the required links from the given htmlContent

// async function requiredLinks(filePath,htmlContent,depth)
// {
//   htmlContent=htmlContent.toString();
//   fs.writeFile(filePath,htmlContent,(err)=>{
//     if(err)
//     {
//       console.log(`Error in writing the file: ${filePath}`, err);

//     }
//   });
//   const urlRegex= /(\bhref=('|")[-A-Z0-9+&@\/%?=_|!:,.;]+[-A-Z0-9+&@\/%=_|])/gi;
//   htmlContent.replace(urlRegex,function(url){
//     url=url.slice(6,url.length);
//     if(depth<=maxdep)
//     {
//       unvisited.push({url,depth:depth+1});
//     }
//   });
//   console.log('Below is the visited and unvisited array');
//   console.log(visited);
//   console.log(unvisited);
//   // calling the save() function;
//   save();
// }


// // save function is basically use to save the data to the respective file of the resultFolder

// async function save()
// {
//   // if(working===false)
//   // {
//   //   working=true;
//   // }
//   if(unvisited.length>0)
//   {
//     const stateData={
//       setArray: Array.from(visited),
//       unvisited:unvisited,
//       session_id:session_id
//     };

//    fs.writeFile("./position.txt",JSON.stringify(stateData),function(err){
//     if(err)
//     {
//       console.log("Error in writing the position.txt file of the resultFolder: ",err);
//     }
//    });

//   //  here i am currently poping out the 1 link from the unvisited array
//   // but here we need to popout the 15 links from one or more domains
//   const urls=unvisited.pop();
//   await pause(breakTime);
//   await crawl(urls.url,urls.depth);
//   }
// }

// // function for pausing the execution for the given time period
// function pause(timeinsec)
// {
//   return new Promise((resolve)=>{
//     setTimeout(resolve,timeinsec)
//   });
// }


// async function fetch(){
//   const url=crawlUrl;
//   session_id=Date.now().toString();

//   try{
    
//     const res=`${resultFolder}/session_id: ${session_id}`;

//    if(!fs.existsSync(res))
//    {
//     process.chdir(resultFolder);
//     fs.mkdirSync(session_id);
//     process.chdir(session_id);
//    }
//   //  here i need to write the number of call i have to do
//   // means 15 calls 1 calls or whatever
//     await crawl(crawlUrl,0);
//   }
//   catch(error)
//   {
//     console.log("Error in fetching the data from the URL: ",error);
//   }
// }

// fetch();













// REQUIRED //






// const axios = require('axios');
// const fs = require('fs');
// const path = require('path');

// const resultFolder = 'resultFolder';
// let session_id;
// let visited = new Set();
// let unvisited = [];
// let working = false;
// const crawlUrl = process.argv[2];
// const maxdep = Number(process.argv[3]);
// const breakTime = Number(process.argv[4]);
// const alreadyRunning = process.argv[5];

// if (!fs.existsSync(resultFolder)) {
//   fs.mkdirSync(resultFolder);
// }

// // function for extracting the domain
// function extractDomainName(url) {
//   try {
//     const parsedUrl = new URL(url);
//     return parsedUrl.hostname;
//   } catch (error) {
//     console.error(`Error parsing URL: ${url}`, error);
//     return null; // Return null or any default value indicating an error
//   }
// }




// // function for resuming the crwaling after server got stopped

// if (alreadyRunning === 'Y' || alreadyRunning === 'y') {
//   session_id = process.argv[6];
//   fs.readFile(__dirname + `/resultFolder/session_id_${session_id}/position.txt`, (err, data) => {
//     if (err) {
//       console.log("Error in reading the file for the resuming of crawling: ", err);
//     } else if (data.length !== 0) {
//       // console.log("Data read from the file:", data.toString());
//       // data = JSON.parse(data.toString());
//       data=JSON.parse(data);
//       console.log("Data read from the file:", data);
//       console.log("Parsed data visitedArray:", data.visited);
//       console.log("Parsed data of unvisited Array: ",data.unvisited);
//       console.log("Parsed data of session id: ",data.session_id);

//       for (const item of data.visited) {
//         visited.add(item);
//       }

//       data.unvisited.forEach((element) => {
//         unvisited.push(element);
//       });

//       session_id = data.session_id;
//       regularCrawling();
//     }
//   });
// } else {
//   fetch();
// }



// // regular crawling is the function which has setInterval in it

// function regularCrawling(){
//   let currentdepth=0;
//   let readyTocrawl=setInterval(function(){
   
  
//   let readyqueue = [];
//   let countmap = {};
//   let reqcount = 0;

//   if(unvisited.length<=5)
//   {
//     while(unvisited.length)
//     {
//       readyqueue.push(unvisited.shift())
//     }
//     while(readyqueue.length)
//     {
//       crawl(readyqueue[0].url,readyqueue[0].depth);
//       readyqueue.shift();
//     }
//   }

//   else
//   {
//     reqcount=0;
//     for(let i=0;i<unvisited.length;i++)
//     {
//       if(reqcount===15)
//       {
//         break;
//       }

//       let domain=extractDomainName(unvisited[i].url);
//       if(countmap[domain]===5)
//       {
//         continue;
//       }

//       if(countmap[domain])
//       {
//         countmap[domain]++;
//       }
//       else{
//         countmap[domain]=1;
//       }
//       reqcount++;
//       readyqueue.push(unvisited.splice(i,1)[0]);
//       i--;
//     }
//     console.log(readyqueue);
//     console.log(countmap);
//     for(let i=0;i<readyqueue.length;i++)
//     {
//       crawl(readyqueue[i].url,readyqueue[i].depth);
//       currentdepth=Math.max(readyqueue[i].depth,currentdepth);
//     }
//     if(currentdepth>maxdep)
//     {
//       clearInterval(readyTocrawl);
//     }
//   }
//   },breakTime*1000)
// }


// // Crawl function is use to crawl the link if the depth of the link is less than then maxdep
// // in this function basically we are coming up with the html file that using the axios.

// async function crawl(url, depth = 0) {
//   if (depth > maxdep) {
//     console.log('Current depth is greater than maxdepth');
//     return;
//   }

//   visited.add(url);
//     if (visited) {
    
//     console.log('Consoling the value of unvisitedArray: ');
//     console.log(unvisited);
//     const stateData = {
//       visited: Array.from(visited),
//       unvisited: unvisited,
//       session_id: session_id,
//     };

//     fs.writeFile(__dirname + `/resultFolder/session_id_${session_id}/position.txt`, JSON.stringify(stateData), function (err) {
//       if (err) {
//         console.log('Error in writing the position.txt file in the resultFolder:', err);
//       }
//     });

    
//   }

//   try {
//     const response = await axios.get(url);
//     const htmlContent = response.data;
//     const fileName = `${Date.now()}_${depth}.html`;
//     const sessionFolder = path.join(resultFolder, `session_id_${session_id}`);
//     const filePath = path.join(sessionFolder, fileName);

//     requiredLinks(filePath, htmlContent, depth);
//     console.log(`Crawler is at (Depth ${depth}): ${url}`);
//   } catch (error) {
//     console.error(`Error: ${url}`, error);
//   }
// }



// // this function is basically use to extract the all the anchor tags an 
// // push them to the unvisited array of object

// function requiredLinks(filePath, htmlContent, depth) {
//   htmlContent = htmlContent.toString();
//    filePath=__dirname+`/resultFolder/session_id_${session_id}/${Date.now().toString()}_${depth}.html`;
//   fs.writeFile(`${filePath}`, htmlContent, (err) => {
//     if (err) {
//       console.log(`Error in writing the file: ${filePath}`, err);
//     }
//   });

//   const urlRegex = /(\bhref=('|")[-A-Z0-9+&@\/%?=_|!:,.;]+[-A-Z0-9+&@\/%=_|])/gi;
//   htmlContent.replace(urlRegex, function (url) {
//     url = url.slice(6, url.length);
//     if (depth < maxdep) {
//       unvisited.push({ url, depth: depth + 1 });
//     }
//   });
//   if (visited) {
    
//     console.log('Consoling the value of unvisitedArray: ');
//     console.log(unvisited);
//     const stateData = {
//       visited: Array.from(visited),
//       unvisited: unvisited,
//       session_id: session_id,
//     };

//     fs.writeFile(__dirname + `/resultFolder/session_id_${session_id}/position.txt`, JSON.stringify(stateData), function (err) {
//       if (err) {
//         console.log('Error in writing the position.txt file in the resultFolder:', err);
//       }
//     });

    
//   }

  
// }




// async function fetch() {
//   const url = crawlUrl;
//   session_id = Date.now().toString();

//   try {
//     const sessionFolder = path.join(resultFolder, `session_id_${session_id}`);

//     if (!fs.existsSync(sessionFolder)) {
//       fs.mkdirSync(sessionFolder, { recursive: true });
//     }

//     process.chdir(sessionFolder);
//     regularCrawling();
//     crawl(crawlUrl, 0);
//   } catch (error) {
//     console.log('Error in fetching the data from the URL:', error);
//   }
// }



























const axios = require('axios');
const fs = require('fs');
const path = require('path');

const resultFolder = 'resultFolder';
let session_id;
let visited = new Set();
let unvisited = [];
let working = false;
const crawlUrl = process.argv[2];
const maxdep = Number(process.argv[3]);
const breakTime = Number(process.argv[4]);
const alreadyRunning = process.argv[5];

if (!fs.existsSync(resultFolder)) {
  fs.mkdirSync(resultFolder);
}


// function for extracting the domain
function extractDomainName(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol + "//" + parsedUrl.hostname;
  } catch (error) {
    console.error(`Error parsing URL: ${url}`, error);
    return null; // Return null or any default value indicating an error
  }
}

function extractParentDomain(url) {
  try {
    const parsedUrl = new URL(url);
    const parts = parsedUrl.hostname.split('.');
    if (parts.length >= 3) {
      return parts.slice(1).join('.');
    }
    return null;
  } catch (error) {
    console.error(`Error parsing URL: ${url}`, error);
    return null; // Return null or any default value indicating an error
  }
}


// Function for resuming the crawling after the server got stopped

if (alreadyRunning === 'Y' || alreadyRunning === 'y') {
  session_id = process.argv[6];
  fs.readFile(__dirname + `/resultFolder/session_id_${session_id}/position.txt`, (err, data) => {
    if (err) {
      console.log("Error in reading the file for the resuming of crawling: ", err);
    } else if (data.length !== 0) {
      data = JSON.parse(data);
      console.log("Data read from the file:", data);
      console.log("Parsed data visitedArray:", data.visited);
      console.log("Parsed data of unvisited Array: ", data.unvisited);
      console.log("Parsed data of session id: ", data.session_id);

      for (const item of data.visited) {
        visited.add(item);
      }

      data.unvisited.forEach((element) => {
        unvisited.push(element);
      });

      session_id = data.session_id;
      regularCrawling();
    }
  });
} else {
  fetch();
}

// Regular crawling is the function which has setInterval in it

function regularCrawling() {
  let currentdepth = 0;
  let readyTocrawl = setInterval(function () {
    let readyqueue = [];
    let countmap = {};
    let reqcount = 0;

    if (unvisited.length <= 5) {
      while (unvisited.length) {
        readyqueue.push(unvisited.shift());
      }
      while (readyqueue.length) {
        crawl(readyqueue[0].url, readyqueue[0].depth);
        readyqueue.shift();
      }
    } else {
      reqcount = 0;
      for (let i = 0; i < unvisited.length; i++) {
        if (reqcount === 15) {
          break;
        }

        let domain = extractDomainName(unvisited[i].url);
        if (countmap[domain] === 5) {
          continue;
        }

        if (countmap[domain]) {
          countmap[domain]++;
        } else {
          countmap[domain] = 1;
        }
        reqcount++;
        readyqueue.push(unvisited.splice(i, 1)[0]);
        i--;
      }
      console.log(readyqueue);
      console.log(countmap);
      for (let i = 0; i < readyqueue.length; i++) {
        crawl(readyqueue[i].url, readyqueue[i].depth);
        currentdepth = Math.max(readyqueue[i].depth, currentdepth);
      }
      if (currentdepth > maxdep) {
        clearInterval(readyTocrawl);
      }
    }
  }, breakTime * 1000);
}

// Crawl function is used to crawl the link if the depth of the link is less than the maxdep.
// In this function, we are fetching the HTML file using axios.

async function crawl(url, depth = 0) {
  if (depth > maxdep) {
    console.log('Current depth is greater than maxdepth');
    return;
  }

  visited.add(url);
  if (visited) {
    console.log('Consoling the value of unvisitedArray: ');
    console.log(unvisited);
    const stateData = {
      visited: Array.from(visited),
      unvisited: unvisited,
      session_id: session_id,
    };

    fs.writeFile(__dirname + `/resultFolder/session_id_${session_id}/position.txt`, JSON.stringify(stateData), function (err) {
      if (err) {
        console.log('Error in writing the position.txt file in the resultFolder:', err);
      }
    });
  }

  try {
    const response = await axios.get(url);
    const htmlContent = response.data;
    const fileName = `${Date.now()}_${depth}.html`;
    const sessionFolder = path.join(resultFolder, `session_id_${session_id}`);
    const filePath = path.join(sessionFolder, fileName);

    requiredLinks(filePath, htmlContent, depth, url);
    console.log(`Crawler is at (Depth ${depth}): ${url}`);
  } catch (error) {
    console.error(`Error: ${url}`, error);
  }
}

// This function is used to extract all the anchor tags and push them to the unvisited array of objects.

// function requiredLinks(filePath, htmlContent, depth, currentUrl) {
//   htmlContent = htmlContent.toString();
//   filePath = __dirname + `/resultFolder/session_id_${session_id}/${Date.now().toString()}_${depth}.html`;
//   fs.writeFile(`${filePath}`, htmlContent, (err) => {
//     if (err) {
//       console.log(`Error in writing the file: ${filePath}`, err);
//     }
//   });

//   const urlRegex = /(\bhref=('|")[-A-Z0-9+&@\/%?=_|!:,.;]+[-A-Z0-9+&@\/%=_|])/gi;
//   htmlContent.replace(urlRegex, function (url) {
//     url = url.slice(6, url.length);
//     if (!url.startsWith('http://') && !url.startsWith('https://')) {
//       // Add the domain from the current URL if the URL is relative
//       const domain = extractDomainName(currentUrl);
//       if (domain) {
//         url = domain + url;
//       }
//     }
//     if (depth < maxdep) {
//       unvisited.push({ url, depth: depth + 1 });
//     }
//   });

//   if (visited) {
//     console.log('Consoling the value of unvisitedArray: ');
//     console.log(unvisited);
//     const stateData = {
//       visited: Array.from(visited),
//       unvisited: unvisited,
//       session_id: session_id,
//     };

//     fs.writeFile(
//       __dirname + `/resultFolder/session_id_${session_id}/position.txt`,
//       JSON.stringify(stateData),
//       function (err) {
//         if (err) {
//           console.log('Error in writing the position.txt file in the resultFolder:', err);
//         }
//       }
//     );
//   }
// }


function requiredLinks(filePath, htmlContent, depth, currentUrl) {
  htmlContent = htmlContent.toString();
  filePath = __dirname + `/resultFolder/session_id_${session_id}/${Date.now().toString()}_${depth}.html`;
  fs.writeFile(`${filePath}`, htmlContent, (err) => {
    if (err) {
      console.log(`Error in writing the file: ${filePath}`, err);
    }
  });

  const urlRegex = /(\bhref=('|")[-A-Z0-9+&@\/%?=_|!:,.;]+[-A-Z0-9+&@\/%=_|])/gi;
  htmlContent.replace(urlRegex, function (url) {
    url = url.slice(6, url.length);
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Add the domain from the current URL if the URL is relative
      const domain = extractDomainName(currentUrl);
      if (domain) {
        url = domain.toString() + url;
      } else {
        const parentDomain = extractDomainName(currentUrl);
        if (parentDomain) {
          url = parentDomain + url;
        }
      }
    }
    if (depth < maxdep) {
      unvisited.push({ url, depth: depth + 1 });
    }
  });

  if (visited) {
    console.log('Consoling the value of unvisitedArray: ');
    console.log(unvisited);
    const stateData = {
      visited: Array.from(visited),
      unvisited: unvisited,
      session_id: session_id,
    };

    fs.writeFile(
      __dirname + `/resultFolder/session_id_${session_id}/position.txt`,
      JSON.stringify(stateData),
      function (err) {
        if (err) {
          console.log('Error in writing the position.txt file in the resultFolder:', err);
        }
      }
    );
  }
}

async function fetch() {
  const url = crawlUrl;
  session_id = Date.now().toString();

  try {
    const sessionFolder = path.join(resultFolder, `session_id_${session_id}`);

    if (!fs.existsSync(sessionFolder)) {
      fs.mkdirSync(sessionFolder, { recursive: true });
    }

    process.chdir(sessionFolder);
    regularCrawling();
    crawl(crawlUrl, 0);
  } catch (error) {
    console.log('Error in fetching the data from the URL:', error);
  }
}







































