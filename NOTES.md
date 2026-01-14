## AUTH SETUP

### BACKEND

1. Create a controller in backend for auth (signup, signin, signout, me, refresh)
2. Create a route for controller.
   - signup -> /auth/signup
   - signin -> /auth/signin
   - signout -> /auth/signout
   - me -> /auth/me
   - refresh -> /auth/refresh
3. create a middleware for auth. authMiddleware

### FRONTEND

1. Create a form (sign in, sign up)
2. Create a page that can be access by logged user
3. use useQuery and useContext for managing the data around the frontend
4. create authContext that manage {user data, status, refresh, logout}
5. use userQuery when fetching the api route.
