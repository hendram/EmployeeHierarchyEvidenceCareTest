const fs = require('fs');
const { Employee, EmployeeHierarchy } = require('./employeeHierarchyApp.js');

// Import this at the beginning of your test file
jest.mock('fs');
jest.mock('fs').mock('fs/promises', () => ({
  ...jest.requireActual('fs/promises'), // use actual implementation for other fs.promises methods
  readFile: jest.fn(),
}));


// Mock the fs.promises.readFile function


describe('Employee', () => {
  test('Constructor should initialize properties correctly', () => {
    const employee = new Employee(1, 'John', null);
    expect(employee.id).toBe(1);
    expect(employee.name).toBe('John');
    expect(employee.managerId).toBeNull();
    expect(employee.subordinate).toEqual([]);
    expect(employee.mymanagers).toEqual([]);
  });
});

describe('EmployeeHierarchy', () => {
  let employeeHierarchy;

  beforeEach(() => {
    employeeHierarchy = new EmployeeHierarchy();
  });

  test('addEmployee should add an employee to the employees array', () => {
    const employee = new Employee(1, 'John', null);
    employeeHierarchy.addEmployee(employee);
    expect(employeeHierarchy.employees).toContain(employee);
  });

  test('findEmployeeById should find an employee by ID', () => {
    const employee = new Employee(1, 'John', null);
    employeeHierarchy.addEmployee(employee);
    const foundEmployee = employeeHierarchy.findEmployeeById(1);
    expect(foundEmployee).toBe(employee);
  });

  // Continue with tests for other functions in EmployeeHierarchy class

  test('buildEmployeeHierarchyFromFile should build hierarchy from file', () => {
    const filename = 'testFile.json';
    const sampleEmployeeData = [
      { id: 1, name: 'John', managerId: null },
      { id: 2, name: 'Jane', managerId: 1 },
    ];

    fs.readFileSync.mockReturnValue(JSON.stringify(sampleEmployeeData));

    employeeHierarchy.buildEmployeeHierarchyFromFile(filename);

    expect(employeeHierarchy.employees.length).toBe(2);
    expect(employeeHierarchy.trees.length).toBe(1);
  });

  test('searchEmployeeByName should find an employee by name', () => {
    const sampleEmployeeData = [
      { id: 1, name: 'John', managerId: null },
      { id: 2, name: 'Jane', managerId: 1 },
    ];

    employeeHierarchy.buildEmployeeHierarchy(sampleEmployeeData);

    const result = employeeHierarchy.searchEmployeeByName('Jane');
    expect(result.name).toBe('Jane');
  });

test('processSubordinate should add subordinate and manager relationships', () => {
    const manager = new Employee(1, 'John', null);
    const subordinate = new Employee(2, 'Jane', 1);

    employeeHierarchy.addEmployee(manager);
    employeeHierarchy.processSubordinate(subordinate);

    expect(manager.subordinate.length).toBe(1);
    expect(manager.subordinate[0]).toBe(subordinate);
    expect(subordinate.mymanagers.length).toBe(1);
    expect(subordinate.mymanagers[0]).toBe(manager);
  });

test('printCorrectPath should print the correct path', () => {
  const employeeData = [
    { id: 1, name: 'John', managerId: null },
    { id: 2, name: 'Jane', managerId: 1 },
  ];

  employeeHierarchy.buildEmployeeHierarchy(employeeData);
  const result = employeeHierarchy.searchEmployeeByName('Jane');

  const consoleSpy = jest.spyOn(console, 'log');
   const path = employeeHierarchy.printCorrectPath();


  expect(consoleSpy).not.toHaveBeenCalled();
  expect(path).toEqual(["Manager Path:", 'John', 'Jane']);
});


  test('printEmployeeHierarchyInfo should print the correct info', () => {
    const employeeData = [
      { id: 1, name: 'John', managerId: null },
      { id: 2, name: 'Jane', managerId: 1 },
    ];

    employeeHierarchy.buildEmployeeHierarchy(employeeData);
    const result = employeeHierarchy.searchEmployeeByName('Jane');

    const consoleSpy = jest.spyOn(console, 'log');
    const info = employeeHierarchy.printEmployeeHierarchyInfo(result);

    expect(consoleSpy).not.toHaveBeenCalled();
  expect(info).toEqual(['Total count for direct and indirect reports: 2']);
 });


});


