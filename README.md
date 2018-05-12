# Features

- Aurelia SPA hosted in ASP.NET Core
- bundled with WebPack
- jQuery
- Bootstrap
- Kendo UI Core

- WebApi project authenticated against Azure AD / AD-B2C using MSAL
- Intercepted calls against that WebApi

# Azure config 

See `AureliaBase.Azure.Api` and `AureliaBase.Web`

## Azure AD

### appsettings.json

```
    "AzureAd": {
        "Instance": "https://login.microsoftonline.com/",
        "Domain": "xyz.onmicrosoft.com",
        "TenantId": "guid",
        "ClientId": "guid"
    },
```

### settings.ts

```
export let azureAdConfig = {
    clientId: 'guid',
    authority: 'https://login.microsoftonline.com/xyz.onmicrosoft.com',
}
```

## Azure AD B2C

### appsetings.json

```
  "AzureAdB2C": {
    "Instance": "https://login.microsoftonline.com/tfp/",
    "ClientId": "guid",
    "Domain": "xyz.onmicrosoft.com",
    "SignUpSignInPolicyId": "B2C_1_signupinXYZ"
  },
```

### settings.ts

```
export let azureAdConfig = {
    clientId: 'guid',
    authority: 'https://login.microsoftonline.com/tfp/xyz.onmicrosoft.com/B2C_1_signupinXYZ',
}
```

# Credits

* https://chrisdennig.me/2017/09/06/secure-an-aurelia-single-page-app-with-azure-active-directory-b2c-msal/
* https://github.com/cdennig/azure-b2c-aurelia-example
* https://github.com/AzureAD/microsoft-authentication-library-for-js

