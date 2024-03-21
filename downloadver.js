const child_process = require('child_process');
const vdf_parser = require('vdf-parser');
const fs = require("fs");
const { createHash } = require('crypto');
const manifestsToDownload = [{
  name: "steam_client_ubuntu12.vdf", savename: "steam_client_ubuntu12", rootkey: "ubuntu12"}, { name: "steam_client_win32.vdf", savename: "steam_client_win32", rootkey: "win32" }];

function wait(ms) {
  var start = Date.now(),
  now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

function testHash(file, expectedHash) {
  const sha256 = createHash('sha256');
  if (!fs.existsSync(file)) {
    return false;
  }

  var actual = sha256.update(fs.readFileSync(file)).digest('hex');
  console.log("Expected: " + expectedHash + ", actual: " + actual);
  if (actual == expectedHash) {
    console.log("Hash match");
    return true;
  }

  return false;
}


function downloadFileSync(url, options) {
  var result;
  try {
    result = child_process.execFileSync('curl', ['--silent', '-L', url], { maxBuffer: Infinity, ...options });
  } catch (error) {
    console.log("Got error while loading, retrying in 1s");
    console.log(error); 
    wait(1000);
    console.log("Retrying now!");
    result = downloadFileSync(url, encoding);
  }

  return result;
}

manifestsToDownload.forEach(mfdata => {
  const baseurl = `http://media.steampowered.com/client/`;
  console.log("Base URL for " + mfdata.name + ": " + baseurl);
  var manifest = fs.readFileSync("./ver/"+mfdata.name, { encoding: "utf-8" });
  console.log(manifest);
  fs.writeFileSync("./data/client/"+mfdata.savename, manifest);
  var parsedmanifest = vdf_parser.parse(manifest)[mfdata.rootkey];
  console.log(parsedmanifest);

  for (const [key, value] of Object.entries(parsedmanifest)) {
    if (typeof value === 'object') {
        for (const [nkey, nvalue] of Object.entries(value)) {
          if (typeof nvalue === 'object') {
            if ('file' in nvalue) {
              if (testHash("./data/client/"+nvalue.file, nvalue.sha2)) {
                console.log("Skipping " + nvalue.file + ", hash matches");
                continue;
              }
    
              console.log("Downloading package " + baseurl + nvalue.file);
              fs.writeFileSync("./data/client/"+nvalue.file, downloadFileSync(baseurl + nvalue.file, {}));
            }
    
            if ('zipvz' in nvalue) {
              if (testHash("./data/client/"+nvalue.zipvz, nvalue.sha2vz)) {
                console.log("Skipping " + nvalue.zipvz + ", hash matches");
                continue;
              }
    
              console.log("Downloading package " + baseurl + nvalue.zipvz);
              fs.writeFileSync("./data/client/"+nvalue.zipvz, downloadFileSync(baseurl + nvalue.zipvz, {}));
            }
          }
        }

        if ('file' in value) {
          if (testHash("./data/client/"+value.file, value.sha2)) {
            console.log("Skipping " + value.file + ", hash matches");
            continue;
          }

          console.log("Downloading package " + baseurl + value.file);
          fs.writeFileSync("./data/client/"+value.file, downloadFileSync(baseurl + value.file, {}));
        }

        if ('zipvz' in value) {
          if (testHash("./data/client/"+value.zipvz, value.sha2vz)) {
            console.log("Skipping " + value.zipvz + ", hash matches");
            continue;
          }

          console.log("Downloading package " + baseurl + value.zipvz);
          fs.writeFileSync("./data/client/"+value.zipvz, downloadFileSync(baseurl + value.zipvz, {}));
        }
    }
  }
});