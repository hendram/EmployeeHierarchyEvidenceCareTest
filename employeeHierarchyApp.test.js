const {
  Employee,
  fillEmployeeFromFiles,
  buildEmployeeTree,
  findEmployee,
} = require('./employeeHierarchyApp.js'); // Replace 'yourFileName' with the actual file name

describe('Employee', () => {
  let fillEmployee;
  let buildEmployee;
  let findEmployeeInstance;

  beforeEach(() => {
    fillEmployee = new fillEmployeeFromFiles();
    buildEmployee = new buildEmployeeTree();
    findEmployeeInstance = new findEmployee();
  });

  // Test cases for Employee class
  describe('Employee class', () => {
    test('Employee object creation', () => {
      const employee = new Employee(1, 'John Doe', null);
      expect(employee).toEqual({
        id: 1,
        name: 'John Doe',
        managerId: [null],
        subordinate: [],
      });
    });
  });

  // Test cases for fillEmployeeFromFiles class
  describe('fillEmployeeFromFiles class', () => {
    test('Add employee to employees array', () => {
      const employee = new Employee(1, 'John Doe', null);
      fillEmployee.addEmployee(employee);
      expect(fillEmployee.employees).toContainEqual(employee);
    });

    test('Fill employee object from data', () => {
      const employeedata = [
        { id: 1, name: 'John Doe', managerId: null },
        { id: 2, name: 'Jane Doe', managerId: 1 },
      ];
      fillEmployee.fillEmployeeObject(employeedata);
      expect(fillEmployee.employees).toHaveLength(2);
    });
  });

  // Test cases for buildEmployeeTree class
  describe('buildEmployeeTree class', () => {
    test('Build employee tree', () => {
      const employee1 = new Employee(1, 'John Doe', null);
      const employee2 = new Employee(2, 'Jane Doe', 1);
      fillEmployee.addEmployee(employee1);
      fillEmployee.addEmployee(employee2);
      buildEmployee.buildRootTreeforTreeStructure(fillEmployee.employees);
      expect(buildEmployee.trees).toContainEqual(employee1);
    });
  });

  // Test cases for findEmployee class
  describe('findEmployee class', () => {
    test('Search employee by name', () => {
      const employee1 = new Employee(1, 'John Doe', null);
      const employee2 = new Employee(2, 'Jane Doe', 1);
      fillEmployee.addEmployee(employee1);
      fillEmployee.addEmployee(employee2);
      buildEmployee.buildRootTreeforTreeStructure(fillEmployee.employees);
      const spy = jest.spyOn(console, 'log');
      findEmployeeInstance.searchEmployeeByName('Jane Doe', buildEmployee.trees);
      expect(spy).toHaveBeenCalledWith('Total count for direct and indirect reports: 2');
      spy.mockRestore();
    });
  });
});

