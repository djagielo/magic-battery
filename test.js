const magic_battery = require('./index.js');

magic_battery.getBatteryPercentageInfo(10000).subscribe(
    info => {
        console.log(info);
    }
)