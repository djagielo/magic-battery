const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { from, throwError, timer } = require('rxjs');
const { map, switchMap } = require('rxjs/operators');

class BatteryPercentage {
    constructor(deviceName, batteryPercent) {
        this.deviceName = deviceName;
        this.batteryPercent = batteryPercent;
    }
};

module.exports.getBatteryPercentageInfo = function (interval) {
    if (process.platform === 'darwin') {
        return timer(0, interval).pipe(
            switchMap(() => {
                return readBatteryPercentage();
            })
        );
    }
    else {
        return throwError('Only Mac is supported');
    }
}

function readBatteryPercentage() {
    return from(exec('ioreg -r -l -k "BatteryPercent"')).
        pipe(
            map(mapStdOut)
        );
}

function mapStdOut(result) {
    const res = result.stdout.split('+-o').slice(1).
        map(el => {
            return el.replace(new RegExp('"', 'g'), '').replace(new RegExp(' ', 'g'), '').split('\n').filter(line => {
                return line.startsWith('Product=') || line.startsWith('BatteryPercent=')
            });
        }).map(device => {
            let deviceName = '';
            let batteryPercent = 0;
            device.forEach(property => {
                if (property.startsWith('Product=')) {
                    deviceName = property.replace(new RegExp('Product=', 'g'), '');
                } else if (property.startsWith('BatteryPercent=')) {
                    batteryPercent = property.replace(new RegExp('BatteryPercent=', 'g'), '');
                }
            });
            return new BatteryPercentage(deviceName, batteryPercent);
        });
    return res;
}