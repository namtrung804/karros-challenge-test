# Requirements

* Windows 7 or higher (Suggest Windows 10)
* Node js (https://nodejs.org/en/)
* Yarn (https://yarnpkg.com/en/docs/install)
* Angularjs 2+

## Setup and run with local
    - Clone source from gitlab
    - Open Command line change directory (`cd`) to project's root directory
    - Run "yarn && yarn start"
    - Edit host with "127.0.0.1 m090.dev"
    - Open brower and run "http://m090.dev:4200" 
    
## Edit config ( file "src\app\modules\app.config.ts")
    Edit username and password API : 
        - parameter "username","password" 
    Edit appName call API : 
        - parameter "appName" 
    Edit key Captcha : 
        - parameter "siteKeyCaptcha" 
    Edit API Url : 
        - parameter "apiUrl" 
        
## Edit Google Analytics key
    - Open file "src\index.html"
    - Edit "ga('create','UA-88802472-3', 'auto');"
    
## UI Test
    - Cd to source and run "yarn start"
    - Open new tab command line "cd" to source and run "yarn e2e"

