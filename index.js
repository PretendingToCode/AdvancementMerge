var translateStrings = true

var fs = require("fs");
var util = require("util");
var path = require("path");

var input;

var versions = []
var files = []


function readFilesSync(dir){
	if(fs.existsSync(dir)){
	  const files = [];

	  fs.readdirSync(dir).forEach(filename => {
	    const name = path.parse(filename).name;
	    const ext = path.parse(filename).ext;
	    const filepath = path.resolve(dir, filename);
	    const stat = fs.statSync(filepath);
	    const isFile = stat.isFile();
      const parent = path.basename(path.resolve(dir, '.'))

	    if(isFile) files.push({filepath, name, ext, parent});
	  });

	  return files;
	} else {
		return undefined;
	}
}

function readDirFolders(dir){
	if(fs.existsSync(dir)){
	  const folders = [];

	  fs.readdirSync(dir).forEach(filename => {
	    const name = path.parse(filename).name + path.parse(filename).ext;
	    const filepath = path.resolve(dir, filename);
      const stat = fs.statSync(filepath);
	    const isFile = stat.isFile();
      var children = []
      const parent = path.basename(path.resolve(dir, '.'))

	    if(!isFile) folders.push({filepath, name, children, parent});
	  });

	  return folders;
	} else {
		return undefined;
	}
}

versions = readDirFolders("./versions")

if(versions[0] == undefined){
	console.log("Error: No input files found.  Please be sure the advancements are in the \"versions\" folder.")
	process.exit(0)
}

versions.forEach(function (ver){ //Object setup for following operations
  ver.children = readDirFolders(ver.filepath)
	var versionFiles = readFilesSync(ver.filepath)

	if(versionFiles[0] == undefined){
		console.log("No language file detected, using 'en_us.json'")

		let readStream = fs.createReadStream("./assets/en_us.json");

		readStream.once('error', (err) => {
			console.log(err);
		});

		readStream.pipe(fs.createWriteStream(ver.filepath + "/en_us.json"));
	}

  ver.children.forEach(function(type){
    type.children = readFilesSync(type.filepath)

    type.children.forEach(function(file){
      obj = {
        path: file.filepath,
        name: file.name,
        parent: file.parent,
        version: path.basename(path.resolve(file.filepath, '../../'))
      }

      files.push(obj)
    })
  })
})

console.log(util.inspect(files, {showHidden: false, depth: null}))

setTimeout(function(){

	versions.forEach(function (ver){
		var versionFiles = readFilesSync(ver.filepath)

		versionFiles.forEach(function (item){
			if(item.ext == ".json"){
				input = item.filepath
			}
		})
	})

	if(translateStrings == true){ //Merge plain-text advancement titles and descriptions from language file
		console.log("\nReading from language file: " + input)
		console.log("Applying language file to existing advancement files...")

		files.forEach(function (file){
			var lang = require(input)
			var advancementLocal = JSON.parse(fs.readFileSync(file.path, "utf8"));

			for (let key of Object.keys(lang)){
				if(key == advancementLocal.display.title.translate){
					advancementLocal.display.title = lang[key]
				}

				if(key == advancementLocal.display.description.translate){
					advancementLocal.display.description = lang[key]
				}
			}

			fs.writeFile(file.path, JSON.stringify(advancementLocal, null, 2), (err) => {
				if(err){
					console.error(err)
				} else {
					console.log("\nChanges successfully written to file '" + file.parent + "/" + file.name + ".json'")
					console.log("+ " + advancementLocal.display.title)
					console.log("+ " + advancementLocal.display.description)
				}
			});
		})
	} else {
		console.log("\n'translateStrings' set to false, skipping string translation.")
	}
}, 3000)


if(!fs.existsSync("./output.json")){ //Check if output file exists, if not generate one
	fs.writeFile('output.json',"{\"data\":[]}", function (err) {
  	if (err) throw err;
  	console.log('Output file successfully generated.\n');
	});
}

setTimeout(function(){

var outputLocal = JSON.parse(fs.readFileSync("./output.json", "utf8"));

versions.forEach(function (ver){

	var obj = {
		version: ver.name,
		advancements: {
			story: {},
			nether: {},
			end: {},
			husbandry: {},
			adventure: {}
		}
	}

	var verExists = false

	outputLocal.data.forEach(function (item){ //Attempt at preventing duplicate entries
		if(item.version == ver.name)
		verExists = true
	})

	if(verExists == false){
		outputLocal.data.push(obj)
	}
})


files.forEach(function(file){ //
	console.log("Pushing " + file.version + "/" + file.parent + "/" + file.name + " to output.json...")
	var fileLocal = JSON.parse(fs.readFileSync(file.path, "utf8"));

	outputLocal.data.forEach(function(item){
		if(file.version == item.version){
			if(item.advancements[file.parent]){
				if(!item.advancements[file.parent][file.name]){
					item.advancements[file.parent][file.name] = fileLocal
				} else {
					console.log("Entry " + file.name + " already exists, skipping...")
				}
			}
		}
	})
})

fs.writeFile("./output.json", JSON.stringify(outputLocal, null, 2), (err) => {
	if(err){
		console.error(err)
	} else {
		console.log("\n\nDone.  See output.json for completed file.")
		process.exit(0)
	}
});

}, 5000)
