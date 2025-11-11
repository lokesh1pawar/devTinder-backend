# DevTinder APIs

## authRouter
- POST /signUp
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/:status/:userId

- POST /request/review/:status/:requestId

## userRouter
- GET /connections
- GET /requests/received
- GET /feed - Gets you the profiles of the other users on platform

