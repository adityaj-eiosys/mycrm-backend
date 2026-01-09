import * as jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    sub: '5031c468-038d-4711-9048-4768a06a9475',
    email: 'admin@test.com',
    role: 'ADMIN',
  },
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDMxYzQ2OC0wMzhkLTQ3MTEtOTA0OC00NzY4YTA2YTk0NzUiLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY3ODgzMzQzLCJleHAiOjE3Njc5Njk3NDN9.nWJlviwODDT6ocwbVYrJNyVqPlDNothtM4gQG7ZVPd8', // <- this must be the secret from your NestJS config
  { expiresIn: '1d' }
);

console.log(token);
