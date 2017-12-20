api:	http://mikemcl.github.io/big.js/#
源码：	https://github.com/MikeMcl/big.js/
例子：
格式化：
private static _units:any[]=null;
static getUnits():any[] {
    if (this._units == null) {
        this._units = ['k','m','b'];
        for (var i = 65; i <= 90; i++) {
            this._units.push(String.fromCharCode(i));
        }
        for (var i = 2; i <= 4; i ++) {
            for (var j = 97; j <= 122; j ++) {
                this._units.push(new Array(i + 1).join(String.fromCharCode(j)));
            }
        }
    }
    return this._units;
}

static moneyFormat(num:Big):string {
    if (num.e < 3) {
        var arr = num.c.slice(0, num.e + 1);
        for (var i = 0; i < num.e + 1; i ++) {
            if (!arr[i]) {
                arr[i] = 0;
            }
        }
        return arr.join('');
    } 
    var idx = Math.floor(num.e/3);
    var pos = num.e % 3 + 1;
    var unit = this.getUnits()[idx-1];


    var arr = num.c.slice(0, 6);
    for (var i = 0; i < 6; i ++) {
        if (!arr[i]) {
            arr[i] = 0;
        }
    }

    var numStr = arr.slice(0, pos).join('');
    var dotStr = arr.slice(pos, pos + 2).join('');
    return numStr + '.' + dotStr + unit;
}

static moneyFormat2(num:Big):string {
        var arr = num.c.slice(0, num.e + 1);
        for (var i = 0; i < num.e + 1; i ++) {
            if (!arr[i]) {
                arr[i] = 0;
            }
        }
        return arr.join('');
}

使用例子：
Utility.moneyFormat(new Big(this.p.sc));
加法：
var sc = new Big(rd.sc);
var userSc = new Big(userCache.sc);
userCache.sc = Utility.moneyFormat2(userSc.plus(sc));

