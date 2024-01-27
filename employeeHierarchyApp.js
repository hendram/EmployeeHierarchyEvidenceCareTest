const fs = require('fs');

// Concept from this whole program is to create tree structure from employee object. Program will ask input from user consist of JSON object. JSON object will convert become employee object.  And those employee object will 
// be assigned to nodes of m-way binary tree to make  employee tree. Tree can be more than one tree structure and still be able to search any leaf on every tree structure. DFS(Deep First Search) algorith will be use to
// search on each tree and print result to user. Function logic will begin from below to top following how function called within class. 


// Employee object will take data from files and make every object as Employee object
class Employee {
  constructor(id, name, managerId) {
    this.id = id;
    this.name = name;   
    this.managerId = [managerId]; //managerId as an array to anticipate faulty data which have double id but  different managerId
    this.subordinate = []; // this array for keep data of employee object subordinate
  }
}

// fillEmployeeFromFiles class is first class need to call after receiving data from user


class fillEmployeeFromFiles {
  constructor(employees) {
    this.employees = [];
     }

// This function called by fillEmployeeObject to fill in employees array with employee objects. 
  addEmployee(employee) {
    this.employees.push(employee);
  }

// This function will create a new employee object based on data parse
 fillEmployeeObject(employeeData) {
    for(const employeeone of employeeData) {
      const employeefault = this.employees.find(employeefind => employeefind.id === employeeone.id)  // Checking if employee object already exist inside employees array with same id with current process data
            if(employeefault) {
           employeefault.managerId.push(employeeone.managerId); // This will make employee object having more than one managerId 
        }
    else {
      const employee = new Employee(employeeone.id, employeeone.name, employeeone.managerId);  
      this.addEmployee(employee);
    }
  }
}

// This function will load data from filesystem, and parse it as JSON, then pass to fillEmployeeObject function
parseEmployeeDataFromFile(filename) {
    try {
      const fileData = fs.readFileSync(filename, 'utf8');
      const employeeData = JSON.parse(fileData);
      this.fillEmployeeObject(employeeData);
    } catch (error) {
      console.error(`Error reading or parsing the file: ${error.message}`);
    }
  }


}

// This buildEmployeeTree class will build employee tree which is type of m-way binary tree 
class buildEmployeeTree {
  constructor() {
    this.trees = []; // this array to keep employee object which have managerId null, so will be able to handle more than one tree at same time
  }


// This recursiveTreeTraversal function called to create node below root node, and every time one level will be created whole first, before moving to another level below it, so if first level having 3 nodes, then 3 nodes will be
// create first before moving into most left leaf node to add another level. This will be proceed recursively, at one level with one top node, add whole node as subordinate.

 recursiveTreeTraversal(node, employeearraydata) {
    const firstNode =  employeearraydata.filter(employees => employees.managerId[0] === node.id);   // Filtering all next level node from current active node
     if(firstNode !== null){         
      node.subordinate.push(...firstNode);                                       // array of node within one level push at same time to current active node subordinate
        for (const employee of node.subordinate) {
          this.recursiveTreeTraversal(employee, employeearraydata);               // call subornidate node recursively to add another level below it
        }
      }
    else {
       return;
      }
    }

// This buildFirstNodeEmployeeTreeFromEachRoot function called from buildRootTreeforTreeStructure function to create another node below root tree 
buildFirstNodeEmployeeTreeFromEachRoot(employeearray) {
    for (const root of this.trees) {                        // Picking each root from trees array to be processed along with employeearray object
      this.recursiveTreeTraversal(root, employeearray);
    }
  }
	
// This function will create root of the tree, every employee object with managerId null can become root of the tree 
buildRootTreeforTreeStructure(employees) {
   for(const employee of employees){
      if (!employee.managerId[0]) {   
        this.trees.push(employee);
      }
     }
   this.buildFirstNodeEmployeeTreeFromEachRoot(employees);
}


}
 
// findEmployee class manage to find employee from user input by traversing through node from root to leaf at one moment 

class findEmployee {
     constructor() {
     this.count = 0;
    }


  printEmployeeHierarchyInfo(employee) {
     this.count++;

   if (employee.managerId[0] == null && employee.subordinate.length !== 0) {
// This is to comply with rules An employee not having manager need to have direct report, then every null manager id means having 1 direct report
    console.log(employee.name);
    console.log(`Total count for direct and indirect reports: ${this.count}`);
    this.count = 0;
    }
// This is to comply with rules An employee not having manager need to have direct report, then every null manager id means having 1 direct report
    else if (employee.managerId[0] == null && employee.subordinate.length === 0) {
       console.log(`Total count for direct and indirect reports: ${this.count}`);
       this.count = 0;
       console.log(`Unable to process employee hierarchy. ${employee.name} not having hierarchy`);
    }
    else
     {
     console.log(employee.name);
  }
  }


  findEmployeeByNameDFS(node, name, names) {
    if (!node) {
      return null;
    }

    if (node.name.toLowerCase() === name.toLowerCase()) {
      this.printEmployeeHierarchyInfo(node);
      return node;
    }

    if(node.subordinate.length > 0){
    for (const child of node.subordinate) {
      const result = this.findEmployeeByNameDFS(child, name, node);
      if (result) {

      this.printEmployeeHierarchyInfo(node);
        
        return result;
      }
    }
}
    return null;
  }


  searchEmployeeByName(employeeName, buildemployeetrees) {
   let result;
    for (const tree of buildemployeetrees) {
     result = this.findEmployeeByNameDFS(tree, employeeName);
     if(result){
       break;
       }
    }
   if(result === null){
     console.log(`Employee with name '${employeeName}' not found.`);
   }
  }


}

// Usage
const fillemployeefromfiles = new fillEmployeeFromFiles();
const buildemployeetree = new buildEmployeeTree();
const findemployee = new findEmployee();

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
   fillemployeefromfiles.parseEmployeeDataFromFile(filename);
   buildemployeetree.buildRootTreeforTreeStructure(fillemployeefromfiles.employees);
   console.log(fillemployeefromfiles.employees);
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
      
      const foundfaultyemployee = fillemployeefromfiles.employees.find(moremanagers => moremanagers.name == employeeName);
       if(foundfaultyemployee && foundfaultyemployee.managerId.length > 1){
// This is to comply with rules An employee having manager may not have any direct report. and An employee not having any direct report, need to have a manager
// Example linton
            console.log(`Error: Unable to process employee tree. ${employeeName} has multiple managers.`);
   }
   else {       

      findemployee.searchEmployeeByName(employeeName, buildemployeetree.trees);
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

module.exports = { Employee, fillEmployeeFromFiles, buildEmployeeTree, findEmployee };
