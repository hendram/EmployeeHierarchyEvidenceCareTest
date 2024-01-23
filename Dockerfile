
FROM node:21.6-bullseye-slim

RUN mkdir -p /home/node/EmployeeHierarchy/node_modules && chown -R node:node /home/node/EmployeeHierarchy

WORKDIR /home/node/EmployeeHierarchy

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

CMD [ "node", "employeeHierarchyApp.js" ]
