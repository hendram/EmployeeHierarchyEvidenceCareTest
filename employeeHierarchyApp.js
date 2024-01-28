
// Concept from this whole program is to create tree structure from employee object. Program will ask input from user consist of JSON object. JSON object will be parse to javascript object and convert become employee object. 
// And those employee object will be assigned to nodes of m-way tree structure to make  employee tree. Tree can be more than one tree structure and still be able to search any leaf on every tree structure. 
// DFS(Deep First Search) algorith will be use to search on each tree and print result to user. Function logic inside class will begin from below to top following how function called within class. Bussiness logic on class
// will be called from top to down following how bussiness logic works. Independent function can begin from top to down too as quite safe to called without dependencies.  


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
    this.employees = []; // employees array to keep employee object 
     }

// This function called by fillEmployeeObject to fill in employees array with employee objects. 
  addEmployee(employee) {
    this.employees.push(employee);
  }

// This function will create a new employee object based on data parse
 fillEmployeeObject(employeedata) {
    for(const oneofemployee of employeedata) {
      const employeeobjectexist = this.employees.find(employeearray => employeearray.id === oneofemployee.id)  // Checking if employee object already exist inside employees array with same id with current process data
            if(employeeobjectexist) {
           employeeobjectexist.managerId.push(oneofemployee.managerId); // This will make employee object having more than one managerId 
        }
    else {
      const employee = new Employee(oneofemployee.id, oneofemployee.name, oneofemployee.managerId);  
      this.addEmployee(employee);
    }
  }
}

// This function will load data from filesystem, and parse it as JSON, then pass to fillEmployeeObject function
parseEmployeeDataFromFile(filename) {
    try {
      const filesystem = require('fs');   // import fs module to read file input by user
      const filecontent = filesystem.readFileSync(filename, 'utf8'); // read file and return it's content
      const employeedata = JSON.parse(filecontent);     // convert fileData into javascript object
      this.fillEmployeeObject(employeedata);        // calling fillEmployeeObject function to process employeeData after converted into JSON format
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


// This recursiveTreeTraversal function called to create node below root node, and every time one level will be created whole first, before moving to another level below it,
//  so if first level having 3 nodes, then 3 nodes will be create first before moving into most left leaf node to add another level. 
// This will be proceed recursively, at one level with one top node, add whole node as subordinate.

 recursiveBuildTreeNode(node, employeearraydata) {
    const onelevelnode =  employeearraydata.filter(employees => employees.managerId[0] === node.id);   // Filtering all next level node from current active node
     if(onelevelnode !== null){         
      node.subordinate.push(...onelevelnode);                                       // array of node within one level push at same time to current active node subordinate
        for (const employee of node.subordinate) {
          this.recursiveBuildTreeNode(employee, employeearraydata);               // call subornidate node recursively to add another level below it
        }
      }
    else {
       return;
      }
    }

// This pickEachTreeAsRootFromTrees function called from buildRootTreeforTreeStructure function to create another node below root tree. 
// Each tree is pick once at one iteration from trees array to be process by recursiveBuildTreeNode to create next level node.   
pickEachTreeAsRootFromTrees(employeearray) {
    for (const root of this.trees) {                        // Picking each root from trees array to be processed along with employeearray object
      this.recursiveBuildTreeNode(root, employeearray);
    }
  }
	
// This function will create root of the tree, every employee object with managerId null can become root of the tree 
buildRootTreeforTreeStructure(employees) {
   for(const employee of employees){
      if (!employee.managerId[0]) {   
        this.trees.push(employee);   // add employee object with managerId null to trees array
      }
     }
   this.pickEachTreeAsRootFromTrees(employees);
}


}
 
// findEmployee class manage to find employee from user input by traversing through node from root to leaf at one moment.  

class findEmployee {
     constructor() {
     this.countdirectandindirect = 0; // initialize variable to count direct & indirect report
    }


// printEmployeeHierarchyInfo function to print name of the employee name once every time called, so it will print chain of managers and will add countdirectandindirect variable too to count number of direct and indirect report

  printEmployeeHierarchyInfo(employee) {
     this.countdirectandindirect++;  // add countdirectandindirect 1 every time printEmployeeHIerarchyInfo function called 

   if (employee.managerId[0] == null && employee.subordinate.length !== 0) { 
// This is to comply with rules An employee not having manager need to have direct report, then every null manager id means having 1 direct report
    console.log(employee.name);
    console.log(`Total count for direct and indirect reports: ${this.countdirectandindirect}`);
    this.countdirectandindirect = 0;   // countdirectandindirect need to reset to 0 every time after it prints out it's value 
    }
// This is to comply with rules An employee not having manager need to have direct report, then every null manager id means having 1 direct report
    else if (employee.managerId[0] == null && employee.subordinate.length === 0) {
       console.log(`Total count for direct and indirect reports: ${this.countdirectandindirect}`);
       this.countdirectandindirect = 0; // countdirectandindirect need to reset to 0 every time after it prints out it's value 
       console.log(`Unable to process employee hierarchy. ${employee.name} not having hierarchy`);
    }
    else
     {
     console.log(employee.name);
  }
  }


// findEmployeeByNameDFS function works using DFS algorithm to find employee name from node. This function will try to draw correct path from level 0/root of the tree to desired employee node which ask by user. Algorithm 
// will going to left leaf first till most bottom leaf, before move to another right leaf. Once employee name found, it will call printEmnployeeHierarchyInfo function to print it, and call again on every reverse recursive process
// to print managers of employee found.
  findEmployeeByNameDFS(node, name) { 
    if (!node) {               // in case node is null or undefined cause by data input 
      return null;
    }

    if (node.name.toLowerCase() === name.toLowerCase()) {   // node will make lowercase first before comparing between name inside node with  name ask by user
        this.printEmployeeHierarchyInfo(node); // calling printEmployeeHierarchyInfo function to print name
      return node;
    }

    if(node.subordinate.length > 0){  // this if will makesure subordinate from node still exist

    for (const nextlevelchild of node.subordinate) {  // take one of node subordinate and process, before move to another node subordinate
     const employeeobject = this.findEmployeeByNameDFS(nextlevelchild, name); // recursively find next level of node from left. Change current node with nextlevelchild
       if (employeeobject) {
         this.printEmployeeHierarchyInfo(node);  // calling printEmployeeHierarchyInfo function to print name on reverse recursive when result already found
        return employeeobject;    
      }
    }
}
    return null;
  }

// searchEmployeeByName is first function called from this class when user input their username to search. This function will taking each tree object from tress to be input into findEmployeeByNameDFS together with employee name
// which user input. This function will check if there are return for employee object, then stop, if return value null then print error.
  searchEmployeeByName(employeeName, buildEmployeeTrees) {   
   let employeeobject;                    
    for (const tree of buildEmployeeTrees) {
     employeeobject = this.findEmployeeByNameDFS(tree, employeeName); // called findEmployeeByNameDFS function to pass tree object and employee name search by user. 
     if(employeeobject){
       break;         // stop if employeeobject return an object of employee
       }
    }
   if(employeeobject === null){
     console.log(`Employee with name '${employeeName}' not found.`);  // print error, if employeeobject return null
   }
  }


}

// Instantiate all class need it first 
const fillemployeefromfiles = new fillEmployeeFromFiles();
const buildemployeetree = new buildEmployeeTree();
const findemployee = new findEmployee();

// External function to get I/O for user input and print output
function preparingCliForUser() {
  const readline = require('readline');   // import readline module 
  const commandlineinterface = readline.createInterface({  // createInterface from readline to get user input and print result to cli
    input: process.stdin,
    output: process.stdout
  });

return commandlineinterface
}

// askfilename function to ask filename and continue to process into tree structure
const askFileName = (cliInstanceForUser) => {
   return new Promise((resolve, reject) => {       
   cliInstanceForUser.question('Enter the filename: ', async (filename) => {      
   fillemployeefromfiles.parseEmployeeDataFromFile(filename);   // accept input file from user 
   buildemployeetree.buildRootTreeforTreeStructure(fillemployeefromfiles.employees);   // calling buildRootTreeforTreeStructure to build root tree and all the rest node by inputting result from  employees array
   resolve();
    });
 })
}

// displayHierarchy function to display hierarchy of managers to user if foundfaultyemployee return object just having one element on managerId array or null, but  if foundfaultyemployee managerId having more than one element, 
// it will return error
function displayHierarchy(employeeName) {
      
      const foundfaultyemployee = fillemployeefromfiles.employees.find(moremanagers => moremanagers.name == employeeName);
       if(foundfaultyemployee && foundfaultyemployee.managerId.length > 1){    // checking if founfaultyemployee not empty and having managerId more than one
// This is to comply with rules An employee having manager may not have any direct report. and An employee not having any direct report, need to have a manager
// Example linton
            console.log(`Error: Unable to process employee tree. ${employeeName} has multiple managers.`);
   }
   else {       

      findemployee.searchEmployeeByName(employeeName, buildemployeetree.trees);   // calling searchEmployeeByName by inputting employee that user ask and trees array from buildemployeetree instance
   }     
}
 

// Function to ask user about employee or exit to quit, and displaying them to user
const askUserToSearch = (cliInstanceForUser) => {
  return new Promise((resolve) => {    // using promise to wait result from user input
    cliInstanceForUser.question('Enter the name of the employee to search (or type "exit" to quit): ', async (employeeName) => {
      if (employeeName.toLowerCase() === 'exit') { // checking if user type exit
        process.exit(0);  // quit program if user type exit
      } else {
        displayHierarchy(employeeName);    // calling displayHierarchy function to begin process if user input another word other than exit
      }
      resolve();
    });
  });
};

// runProgram function first run this program and keep continue to ask user if not type exit 
const runProgram = async () => {
  const cliforuser = preparingCliForUser(); //calling preparingCliForUser function to preparing user typing and displaying result to user on cli monitor    
   await askFileName(cliforuser);  // await this async function return value from user input filename

  let continuesearch = true; 
  while (continuesearch) {  // while will keep askusertosearch function running again after displaying all manager path to user, and ask user again for input
    await askUserToSearch(cliforuser); // await this async function return value from user input employee name want to search
}

cliforuser.close(); // closing cli instance if program exit
};



runProgram(); // this will call runProgram function to initiating first run of this program 

module.exports = { Employee, fillEmployeeFromFiles, buildEmployeeTree, findEmployee }; // class exported to be use by jest quality assurance 
