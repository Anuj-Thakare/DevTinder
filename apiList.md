# DEVTinder API

## authRouter
- POST /signUp
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/:status/:toUserId
- POST /request/review/:status/:requestId

## userRouter
- GET /user/connections
- GET /user/request/received
- GET /user/feed - Get us the profile of others users on platform