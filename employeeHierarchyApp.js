const fs = require('fs');

class Employee {
  constructor(id, name, managerId) {
    this.id = id;
    this.name = name;
    this.managerId = managerId;
    this.subordinate = [];
    this.mymanagers = [];
  }
}

class EmployeeHierarchy {
  constructor() {
    this.trees = [];
    this.employees = [];
    this.correctPath = [];
  }

  addEmployee(employee) {
    this.employees.push(employee);
  }


  findEmployeeById(id) {
    return this.employees.find(employee => employee.id === id);
  }

  findEmployeeByNameDFS(node, name) {
    if (!node) {
      return null;
    }

    this.correctPath.push(node);

    if (node.name.toLowerCase() === name.toLowerCase()) {
      return node;
    }

    for (const child of node.subordinate) {
      const result = this.findEmployeeByNameDFS(child, name);
      if (result) {
      
        return result;
      }
    }

    this.correctPath.pop(); // Backtrack if the correct path is not found
    return null;
  }

  searchEmployeeByName(employeeName) {
    for (const tree of this.trees) {
      this.correctPath = []; // Reset correctPath for each tree
      const result = this.findEmployeeByNameDFS(tree, employeeName);
      if (result) {
        return result;
      }
    }
     console.log(`Employee with name '${employeeName}' not found.`);
  }

// This function will load data from filesystem, and parse it as JSON, then pass to buildEmployeeHierarchy function
buildEmployeeHierarchyFromFile(filename) {
    try {
      const fileData = fs.readFileSync(filename, 'utf8');
      const employeeData = JSON.parse(fileData);
      this.buildEmployeeHierarchy(employeeData);
    } catch (error) {
      console.error(`Error reading or parsing the file: ${error.message}`);
    }
  }


// This function will create a new employee object based on data parse and put object with managerId = null into separate tree
 buildEmployeeHierarchy(employeeData) {
    employeeData.forEach(data => {
      const employee = new Employee(data.id, data.name, data.managerId);
      this.addEmployee(employee);

      if (!employee.managerId) {
        this.trees.push(employee);
      } else {
        this.processSubordinate(employee);
      }
    });
  }

// This function will find managerId from employee, and create double link list by adding subordinate to manager, and checking for duplicate employee id
// in existing employee array, and add manager object into array
  processSubordinate(employee) {
    const manager = this.findEmployeeById(employee.managerId);
    if (manager) {
      manager.subordinate.push(employee);

      const previousProcessedEmployee = this.employees.find(e => e.id === employee.id);
      if (previousProcessedEmployee) {
        previousProcessedEmployee.mymanagers.push(manager);
      } else {
        employee.mymanagers.push(manager);
    
      }
    } else {
      console.log(`Unable to process employee hierarchy. ${employee.name} has an invalid manager.`);
    }
  }

 printCorrectPath() {
    if (this.correctPath.length === 0) {
      throw new Error('No correct path available.');
    }

// This function will print managerPath from top to bottom of tree and print total count for direct/indirect reports
const managerPath = this.correctPath.map(node => node.name);
    return ["Manager Path:", ...managerPath];

  }

  printEmployeeHierarchyInfo(employee) {
   if (!employee) {
      return['Employee not found.'];
     }

   if (employee.managerId == null && employee.subordinate.length !== 0) {
// This is to comply with rules An employee not having manager need to have direct report, then every null manager id means having 1 direct report
    return[`Total count for direct and indirect reports: 1`];
    }
// This is to comply with rules An employee not having manager need to have direct report, then every null manager id means having 1 direct report
    else if (employee.managerId == null && employee.subordinate.length === 0) {
       console.log(`Total count for direct and indirect reports: 1`);
       return[`Unable to process employee hierarchy. ${employee.name} not having hierarchy`];
    }
    else
     {
// This is to comply with rules An employee not having manager need to have direct report, then every null manager id means having 1 direct report
    return[`Total count for direct and indirect reports: ${this.correctPath.length}`];
    }
  }
}



// Usage
const employeeHierarchy = new EmployeeHierarchy();

// External function to get I/O for user input and print output
function getUserInput() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

return rl
}

// Function to ask filename and continue to process into tree structure
const askfilename = (rl) => {
   return new Promise((resolve, reject) => {
    rl.question('Enter the filename: ', async (filename) => {
  employeeHierarchy.buildEmployeeHierarchyFromFile(filename);
   resolve();
    });
 })
}

// Function to ask user about employee or exit to quit, and displaying them to user
const askemployee = (rl) => {
  return new Promise((resolve) => {
    rl.question('Enter the name of the employee to search (or type "exit" to quit): ', async (employeeName) => {
      if (employeeName.toLowerCase() === 'exit') {
        process.exit(0);
      } else {
        displayHierarchy(employeeName);
      }
      resolve();
    });
  });
};


function displayHierarchy(employeeName) {
     try{
      const foundEmployee = employeeHierarchy.searchEmployeeByName(employeeName);
    
      if (foundEmployee) {
       
          if (foundEmployee.mymanagers.length > 1) {
// This is to comply with rules An employee having manager may not have any direct report. and An employee not having any direct report, need to have a manager
// Example linton
            console.log(`Error: Unable to process employee tree. ${employeeName} has multiple managers.`);
          } else {
            const path = employeeHierarchy.printCorrectPath();
            const hierarchyInfo = employeeHierarchy.printEmployeeHierarchyInfo(foundEmployee);
            console.log(...path);
            console.log(...hierarchyInfo);
          }
        }
          }
           catch (error) {
          console.error(`Error: ${error.message}`);
        } 
       
    }
 
// Main function first run this program and keep continue to ask user if not type exit 
const main = async () => {
  const rl = getUserInput();
   await askfilename(rl);

  let continueSearch = true;
  while (continueSearch) {
    await askemployee(rl);
}

rl.close();
};

main();

module.exports = { Employee, EmployeeHierarchy };
