# Medical-Services
## Installation

Install my-project with npm

```bash
npm i 
# note for migration file and connection to Postgree  use 
DATABASE_URL in .env file with your url
npx prisma migrate dev --name init 
```
    
## ENDS POIONTS 
```python 
post /admin/signin for sign in 
post /admin/signup for sign up 
get /user?size=&page= for get all user note:use size and page for pagination
```
## Tech Stack

**Server:** 
```bash
    "prisma": "^4.9.0"
"@prisma/client": "^4.9.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^6.14.3",
    "jsonwebtoken": "^9.0.0",
    "nodemon": "^2.0.20"
```

##.env
```
DATABASE_URL="?"
HOST=?
PORT=?
APP_PORT=?
JWT_SECRET_KEY=?
REFREASHJWT_SECRET_KEY=?
ENVIRONMENT=?
```
## Feedback

If you have any feedback, please reach out to us at discord @yf14#8212

