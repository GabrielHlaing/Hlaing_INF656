const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

const filePath = path.join(__dirname, "tasks.json"); // Full path to tasks.json

// Read tasks from file asynchronously
async function getAllTasks() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const tasks = JSON.parse(data); // Parse JSON string to array
    return tasks;
  } catch (err) {
    console.error("Error reading file: ", err.message);
  }
}

// Display all tasks in a readable format
async function listTasks() {
  try {
    const tasks = await getAllTasks();

    console.log("\n------Your Tasks------");

    tasks.forEach((task, index) => {
      const taskStatus = task.status ? "Completed" : "Not Completed";
      console.log(`${index + 1}. ${task.title} - ${taskStatus}`);
    });

    console.log("---------------------");
  } catch (err) {
    console.error("Error listing tasks: ", err.message);
  }
}

// Add a new task to tasks.json
async function addTask(newTitle, newDescription) {
  try {
    const tasks = await getAllTasks();

    const newTask = {
      title: newTitle,
      description: newDescription,
      status: false, // New tasks default to 'not completed'
    };

    tasks.push(newTask);

    // Save the updated tasks array back to file with indentation for readability
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf8");
    console.log(`Task ${newTask.title} added successfully!`);
  } catch (err) {
    console.error("Error adding a new task: ", err.message);
  }
}

// Mark task as completed (case-insensitive match)
async function completeTask(title) {
  try {
    const tasks = await getAllTasks();

    // Find the task by title (case-insensitive)
    const task = tasks.find(
      (t) => t.title.toLowerCase() === title.toLowerCase()
    );

    if (task) {
      task.status = true; // Mark as completed
      await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf8");
      console.log(`Task "${task.title}" is updated as 'Completed'!`);
    } else {
      console.log(`Task "${title}" not found. Please check your input.`);
    }
  } catch (err) {
    console.error("Error updating the status: ", err.message);
  }
}

// Display CLI menu
function interface() {
  console.log("\n*****Menu*****");
  console.log("1. List all tasks");
  console.log("2. Add a new task");
  console.log("3. Mark a task as completed");
  console.log("4. Exit");
  console.log("******************\n");
}

async function main() {
  console.log("Welcome to Task Manager.");

  // Wrap rl.question in a Promise to use async/await
  const askUser = () => {
    return new Promise((resolve) => {
      rl.question("Enter your choice (1, 2, 3, or 4): ", (answer) => {
        resolve(answer);
      });
    });
  };

  let userInput = "";
  while (userInput != "4") {
    interface();
    userInput = await askUser();

    switch (userInput) {
      case "1":
        await listTasks();
        break;
      case "2":
        // Prompt user for task details
        const title = await new Promise((res) =>
          rl.question("Enter task title: ", res)
        );
        const description = await new Promise((res) =>
          rl.question("Enter task description: ", res)
        );
        await addTask(title, description);
        break;
      case "3":
        // Prompt user for task title to mark as completed
        const completeTitle = await new Promise((res) =>
          rl.question(
            "Enter task title to mark as completed (case-insensitive): ",
            res
          )
        );
        await completeTask(completeTitle);
        break;
      case "4":
        console.log("Exiting Task Manager...");
        rl.close();
        break;
      default:
        console.log("Invalid choice. Try again.");
    }
  }
}

main();
