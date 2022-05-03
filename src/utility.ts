import fs from 'fs';


function writeDataToFile(filename: string, content: any) {
  fs.writeFile(filename, JSON.stringify(content, null, 2), "utf8", (err: any) => {
    if (err) {
      console.log(err);
    }
  });
}


export default writeDataToFile;
