# Installation
```shell
npm i --save magic-battery
```

# Usage

Script below will return list of BatteryPercentage class objects, with fields: deviceName, batteryPercent

```js
let magic_battery = require('magic-battery');

magic_battery.getBatteryPercentageInfo(10000).subscribe(
    info => {
        console.log(info);
    }
)
```