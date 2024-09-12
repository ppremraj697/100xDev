const { Command } = require("commander");
const fs = require("fs");
const program = new Command();

program.name("count-cli").description("Some count utilities").version("1.0.0");

program
  .command("count-words")
  .description("Count the number of words in the file")
  .argument("<file>", "file to count")
  .action((file) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const words = data.split(" ").length;
        console.log(`There are ${words} words in the file`);
      }
    });
  });

program.parse();
