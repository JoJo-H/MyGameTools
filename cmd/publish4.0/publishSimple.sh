versionName=$(date +%Y%m%d%H%M%S)
publishType='web'
outPath=""

scriptPath=$(cd `dirname $0`;pwd)
cd $scriptPath

function resetResStatus() {
	git checkout -- resource/
	rm -rf resource/assets/sheet/
}

resetResStatus

egret build -e
egret publish --version $versionName

releasePath=bin-release/web/$versionName

ruby publishSimple.rb .

indexPath=$releasePath/index.html

releaseResourcePath=$releasePath/resource

res publish . $releasePath
euibooster . $releasePath


libs=$(sed -n 's/.*\"lib\"\ *src=\"\([^\"]*\)\".*/\1/p' $indexPath)
tmpPath=/tmp/$(uuidgen)
for libFile in $libs
do
	cat $libFile >> $tmpPath
done


function moveTo() {
	local sourcePath=$1
	local distPath=$2
	mv $sourcePath $distPath
}

function moveConf(){
	local confPath=$(ls $releaseResourcePath/config_*)
	local distPath=$releaseResourcePath/config.json
	mv $confPath $distPath
}


libCrc=$(moveTo $tmpPath $releasePath/lib.min.js)
mainCrc=$(moveTo $releasePath/main.min.js $releasePath/game.min.js)
themeCrc=$(moveTo $releaseResourcePath/default.thm.json $releaseResourcePath/default.thm.json)
confCrc=$(moveConf)


testIndexPath=publishSimpleIndex.html
if [ -f $testIndexPath ];then
	cp $testIndexPath $releasePath/index.html
fi

# 删除多余的文件及目录
rm $releaseResourcePath/default.res.json
rm -rf $releaseResourcePath/assets
rm -rf $releaseResourcePath/config
rm -rf $releaseResourcePath/eui_skins
rm -rf $releaseResourcePath/ui
rm -rf $releasePath/resourcemanager
rm -rf $releasePath/polyfill
rm -rf $releasePath/libs
rm -rf $releasePath/backup
rm -rf $releasePath/js

echo "local debug url:bin-release/web/${versionName}/?isSimple=1"

resetResStatus