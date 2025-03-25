# Setup

Make a python virtual environemt with: 
```
  python3 -m venv .venv
```

Activate the environment: 
```
  source .venv/bin/activate
```

Install the dependencies needed for the project
```
  pip install -U pip
  pip install -r requirements.txt
```

Create a .env file in the root of the project and add the following variables:
```
  NETFLEX_AUTH_USERNAME_PASSWORD=YOUR_AUTH_CODES
  VISMA_AUTH_API_KEY=YOUR_API_KEY
  COMPANY_NO=YOUR_COMPANY_NUMBER
```

  N.B. For Netflex, you can find this auth token by checking a sent postman's request header. 

