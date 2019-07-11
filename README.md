# AdvancementMerge
A script to merge JSON files from extracted Minecraft advancement folders.

Features:

- Supports most modern versions of Minecraft (1.12+)
- Requires minimal setup

# Installation
Clone this repository, or re-create the environment on your machine manually.  Set it up like you would any other NodeJS project, and install the following packages
```
cd [project directory]
npm install fs
npm install path
npm install util
```

Be sure the assets, versions, and now node_modules folders exist within your project directory before usage.  The assets folder contains the "en_us.json" language file for 1.14.3.  It is only used as a backup if no other language file is present upon execution.

# Preparation
This script takes 1 or more advancement folders, and combines them into a single JSON file for easy of access. You're going to want to have these advancement folders on hand before you attempt to run the script.  Some setup is required here to make sure the output file is in the correct format.  

First and foremost, you're going to want to extract the advancement folder from any given version.  To do this, I use [WinRAR](https://www.rarlab.com/).  In modern versions of Minecraft, the advancements folder is located at "version.jar/data/minecraft/advancements"

Once you have extracted the advancement folder, move it into the "versions" folder in your project directory.  Whatever this folder is named will be the version name in the output file, so I advise renaming the advancements folder to the Minecraft version it was extracted from.  From here, you'll want to delete the "recipies" folder inside the advancements folder you just extracted.

Finally, go back into your version.jar of choice, and extract the language file.  In modern versions of Minecraft, this is located in the "version.jar/assets/minecraft/lang" folder.  Place this inside the associated version folder inside your project directory.  

In the end, you should have a layout like this inside the "versions" folder in your project directory.  Here I use the version 1.14.3 as an example.

1. versions
   - 1.14.3
     - adventure
     - end
     - husbandry
     - nether
     - story
     - en_us.json (Or other specified language file)
   - (Other version files like the one above may be included as well)
    
You may repeat these steps for as many versions as you want, so long as they all follow this format.

1.14.3 is included by default as a visual representation of the format you need to follow.  You may delete this version if you're not interested in using it.

# Usage
After setup is complete, the file can be run like any other NodeJS script.
```
cd [project directory]
node index.js
```

By default, this script translates the title and description for a given advancement.  This is why the language file is required.  If you wish to disable this, open the script in a text editor of your choice, and change the "translateStrings" bool to false.

The output file should be named "output.json", and should be in your project directory.

Example output files can be found [here](examples)

# Planned Changes

- [ ] Add support for the pre-1.12 "achievement" system
- [ ] Automatic version detection, and language file application
- [ ] Improve stability and make the script more novice friendly

# Notes
Yeah ik its clunky, I threw it together in an hour or so and it helped make my life easier lol.  take it or leave it
