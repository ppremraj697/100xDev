import { Command } from "commander";
import fs from "fs";
import path from "path";

const program = new Command();

// Function to read the JSON file
async function readJsonFile() {
  try {
    const data = await fs.readFileSync("./todo.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    throw err;
  }
}

// Function to write to the JSON file
async function writeJsonFile(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Pretty-print with 2 spaces indentation
    await fs.writeFileSync("./todo.json", jsonData, "utf8");
    console.log("JSON file updated successfully");
  } catch (err) {
    console.error("Error writing JSON file:", err);
    throw err;
  }
}

program
  .name("todo-cli")
  .description("Some todo cli utilities to create, update, delete task")
  .version("1.0.0");

program
  .command("create-todo")
  .description("Create todo.json")
  .argument("<file-name>", "File name of file to store tasks todo")
  .action((fileName) => {
    const filePath = path.resolve(`./${fileName}.json`);
    fs.writeFile(filePath, `{"tasks": []}`, (err) => {
      if (err) throw err;
      console.log("File created and content written!");
    });
  });

program
  .command("add")
  .description("Add task to todo list")
  .argument("<task>", "task to add")
  .argument("[time]", "optional time for the task") // Make time optional
  .action(async (task, time) => {
    try {
      const todo = await readJsonFile();

      let tsk = {
        do: task,
        time: time || "No time specified", // Provide default value if time is not provided
      };

      todo.tasks = todo.tasks || []; // Ensure tasks array exists
      todo.tasks.push(tsk);

      await writeJsonFile(todo);
    } catch (err) {
      console.error("Error processing the task:", err);
    }
  });

program
  .command("delete")
  .description("Delete task from todo list")
  .argument("<task>", "task to delete")
  .action(async (task) => {
    const todo = await readJsonFile();
    todo.tasks.forEach((tsk, index, tasks) => {
      if (tsk.do == task) {
        tasks.splice(index, 1);
      }
    });

    await writeJsonFile(todo);
    console.log("Todo list after deleting task: ", todo.tasks);
  });

program
  .command("update")
  .description("Update the task")
  .argument("<task>", "Existing task")
  .argument("<new-task>", "Updated task")
  .action(async (task, newTask) => {
    const todo = await readJsonFile();
    todo.tasks.forEach((tsk, index, tasks) => {
      if (tsk.do == task) {
        tsk.do = newTask;
      }
    });

    await writeJsonFile(todo);
    console.log("Todo list after deleting task: ", todo.tasks);
  });

program
  .command("list")
  .description("List all tasks")
  .action(async () => {
    try {
      const todo = await readJsonFile();
      console.log("Tasks:", todo.tasks);
    } catch (err) {
      console.error("Error listing tasks:", err);
    }
  });

program.parse();