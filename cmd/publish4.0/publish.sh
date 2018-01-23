# 版本名称 时间串
versionName=$(date +%Y%m%d%H%M%S)
# 发布类型
publishType='web'
outPath=""

# cd 到目录 pwd
scriptPath=$(cd `dirname $0`;pwd)
# echo $scriptPath
cd $scriptPath

# 重置,因为执行完ruby脚本后，本地会删除图集里的小图片，然后新增sheet文件夹，存放的就是所有的图集
# 然后再进行res publish，完后就需要调用该方法进行重置资源
function resetResStatus() {
	git checkout -- resource/
	rm -rf resource/assets/sheet/
}

function usage() {
	echo "usage: publish [-v releaseName] [-t publishType] [-o versionOutFile]
       releaseName=now(default)
       publishType=web(default)|native|runtime"
}


ruby publish.rb -p . -t

if [ "$?" == "100" ]; then
	exit 100
fi

resetResStatus

egret build -e
egret publish --version $versionName

releasePath=bin-release/web/$versionName

# 参数 当前目录.
ruby publish.rb -p .

indexPath=$releasePath/index.html

releaseResourcePath=$releasePath/resource

# 资源发布会自动res build
res publish . $releasePath
euibooster . $releasePath


# Sed主要用来自动编辑一个或多个文件；-n仅显示script处理后的结果；参数：指定待处理的文本文件列表。
libs=$(sed -n 's/.*\"lib\"\ *src=\"\([^\"]*\)\".*/\1/p' $indexPath)
# 会输出index.html中所有的lib的文件名称列表,输出libs/modules/egret/egret.min.js libs/modules/egret/egret.web.min.js等
# echo $libs

# uuidgen - 可生成一个UUID到标准输出
tmpPath=/tmp/$(uuidgen)
# /tmp/A6A72B6D-44D2-4650-B68D-0C0148D286FB
# echo tmpPath,$tmpPath

# cat 创建一个文件或将几个文件合并为一个文件$cat file1 file2 > file
# 执行下面语句后，libs文件列表的文件已被压缩进/tmp/A6A72B6D-44D2-4650-B68D-0C0148D286FB文件中
for libFile in $libs
do
	cat $libFile >> $tmpPath
done

# cksum命令是检查文件的CRC是否正确
function cal_crc32() {
	local filename=$1
    # cksum $filename 会输出:  校验码 字节数 文件名
    # 然后将输出串经管道(管道符|)发给awk处理，输出格式化的串，%x:十六进制值。
	# $1会将校验码进行16进制输出返回
	echo $(cksum $filename | awk '{printf "%x",$1}')
}

# 移动文件
function moveTo() {
	local sourcePath=$1
	local distPath=$2

	# 获取源文件的crc32的十六进制
	local c32=$(cal_crc32 ${sourcePath})
	# 处理后bin-release/web/171204121601/lib.min.CRC.js
	# 处理后bin-release/web/171204121601/lib.min.f83279b9.js
	# 将distPath中的CRC变为$c32
	distPath=${distPath/CRC/$c32}
	# mv命令可以用来将源文件移至一个目标文件中，mv源文件会消失
	mv $sourcePath $distPath
	echo $c32
}

function moveConf(){
	local confPath=$(ls $releaseResourcePath/config_*)
	local c32=$(cal_crc32 $confPath)

	local distPath=$releaseResourcePath/config_$c32.json
	mv $confPath $distPath
	echo $c32
}


libCrc=$(moveTo $tmpPath $releasePath/lib.min.CRC.js)
mainCrc=$(moveTo $releasePath/main.min.js $releasePath/game.min.CRC.js)
themeCrc=$(moveTo $releaseResourcePath/default.thm.json $releaseResourcePath/theme_CRC.json)
confCrc=$(moveConf)


testIndexPath=publishIndex.html
if [ -f $testIndexPath ];then
	cp $testIndexPath $releasePath/index.html
fi

# 删除多余的文件及目录
# rm $releaseResourcePath/default.res.json
rm -rf $releaseResourcePath/assets
rm -rf $releaseResourcePath/config
rm -rf $releaseResourcePath/eui_skins
rm -rf $releaseResourcePath/ui
rm -rf $releasePath/resourcemanager
rm -rf $releasePath/polyfill
rm -rf $releasePath/libs
rm -rf $releasePath/backup
rm -rf $releasePath/js


echo "local debug url:bin-release/web/${versionName}/?codeVer=${mainCrc}.${libCrc}&resVer=${confCrc}.${themeCrc}"

function printVersion() {
	echo "codeVer=${mainCrc}.${libCrc}"
	echo "resVer=${confCrc}.${themeCrc}"
}

printVersion

resetResStatus