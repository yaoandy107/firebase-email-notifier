# Firebase Email Notifier
A tool for regular checking Firebase Crashlytics's alert email and sending notifications to DingTalk. It uses IMAP to read emails and notify the DingTalk's bot when it finds the alert email of Firebase Crashlytics

> There are also many other better ways to solve this problem, but the environment that I deploy does not allow any incoming traffics, so this is the way that I could think of.

## Setup
- Install all dependencies
```sh
npm i
```
- Create .env file, and set all the variables
```sh
DING_TALK_ACCESS_TOKEN=""
EMAIL_ACCOUNT=""
EMAIL_PASSWORD=""
```
- Run the application
```sh
npm start
```

> Gmail has a strict security policy, so it could not use the direct password to log in. I will prefer to create an application password and use it as a login password.
