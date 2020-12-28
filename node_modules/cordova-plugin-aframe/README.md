# cordova-plugin-aframe

This plugin adds [A-Frame](https://aframe.io/) support for your Cordova application!

## Installation

```bash
cordova plugin add cordova-plugin-aframe
cordova prepare
```

## Discussion

Although A-Frame is a pure JS library, there are some additional steps needed to ensure compatibility with a Cordova app. Notably:

- Support for XHR requests to `file://` endpoints
- CSS overrides

## Thanks

Special thanks to A-Frame author and maintainer [Diego Marcos](https://github.com/dmarcos) for helping to work through all the changes needed and allowing a few modifications into the A-Frame core
