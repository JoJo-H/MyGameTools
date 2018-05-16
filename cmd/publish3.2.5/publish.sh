versionName=$(date +%Y%m%d%H%M%S)
publishType='web'
outPath=""

scriptPath=$(cd `dirname $0`;pwd)

cd $scriptPath

function resetResStatus() {
	git checkout -- resource/
	rm -rf resource/assets/sheet/
}

function usage() {
	echo "usage: publish [-v releaseName] [-t publishType] [-o versionOutFile]
       releaseName=now(default)
       publishType=web(default)|native|runtime"
}

function cal_crc32() {
	local filename=$1
	echo $(cksum $filename | awk '{printf "%x",$1}')
}

function copyResJson() {
	touch $releaseResourcePath/resource.json
	cp -f resource/default.res.json $releaseResourcePath/resource.json
}

while true ; do
        case "$1" in
                -v|--version) versionName=$2 ; shift 2 ;;
				-t|--type) publishType=$2 ; shift 2 ;;
				-h|--help) usage; exit 1 ;;
				-o|--output) outPath=$2; shift 2 ;;
                *) break ;;
        esac
done

ruby publish.rb -p . -t

if [ "$?" == "100" ]; then
	exit 100
fi

releasePath=bin-release/web/$versionName
indexPath=$releasePath/index.html
releaseResourcePath=$releasePath/resource

function cpResJson(){
	touch resource/resource.json
	cp resource/default.res.json resource/resource.json
}
cpResJson
resetResStatus

egret build -e
egret publish --version $versionName
ruby publish.rb -p .
cpResJson

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

	local c32=$(cal_crc32 ${sourcePath})
	distPath=${distPath/CRC/$c32}
	mv $sourcePath $distPath
	echo $c32
}

function moveConf(){
	local confPath=resource/resource.json
	local c32=$(cal_crc32 $confPath)

	local distPath=$releaseResourcePath/resource_$c32.json
	mv $confPath $distPath
	echo $c32
}

libCrc=$(moveTo $tmpPath $releasePath/lib.min.CRC.js)
mainCrc=$(moveTo $releasePath/main.min.js $releasePath/game.min.CRC.js)
themeCrc=$(moveTo $releaseResourcePath/default.thm.json $releaseResourcePath/theme_CRC.json)
confCrc=$(moveConf)

testIndexPath=platfiles/bearjoy/index.html
if [ -f $testIndexPath ];then
	cp $testIndexPath $releasePath/index.html
fi

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
rm -rf resource/resource.json

echo "local debug url:bin-release/web/${versionName}/?codeVer=${mainCrc}.${libCrc}&resVer=${confCrc}.${themeCrc}"

function printVersion() {
	echo "codeVer=${mainCrc}.${libCrc}"
	echo "resVer=${confCrc}.${themeCrc}"
}

printVersion

if [ "$outPath" != "" ];then
	printVersion >$outPath
fi

resetResStatus
