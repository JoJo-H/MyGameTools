require "json"
require "optparse"


options = {}

OptionParser.new do |opts|
	opts.on("-t", "--test") do |v|
		options[:test] = true
	end
	opts.on("-p PATH", "--path PATH") do |v|
		options[:path] = v
	end

end.parse!

project_path = options[:path]

conf_path = File.join(project_path, 'resource', 'default.res.json')
$res_obj = JSON.parse(File.read(conf_path))

if options[:test]
	map = {}
	existsArr = []
	$res_obj['resources'].each do |item|
		url = item['url']
		map[url] = (map[url] || 0) + 1
		if map[url] > 1
			existsArr.push(url)
		end
	end

	map = {}
	existsGroup = []
	$res_obj['groups'].each do |item|
		if (item['name'].index('sheet_'))
			keys = item['keys'].split(',')
			keys.each do |k|
				map[k] = (map[k] || []).push(item['name'])
				if map[k].length > 1
					existsGroup.push(k)
				end
			end
		end
	end


	found = false
	if existsArr.length > 0
		puts "以下资源存在重复定义:"
		puts existsArr
		found = true
	end

	if existsGroup.length > 0
		puts "以下资源在多个sheet中重复定义:"
		existsGroup.each do |key|
			puts key + ':' + map[key].join(' ')
		end
		found = true
	end

	if found
		exit 100
	end

	exit 0

end

$groups = $res_obj['groups']

def remove(path)
	resource = $res_obj['resources']

	key = path.split('/')[-1].gsub('.', '_')

	resource.delete_if do |item|
		item["name"] == key
	end
end

def do_pack(group, files)
	group_name = group.gsub('sheet_', '')
	pack_path = File.join('resource', 'sheet', group_name)

	output_path = File.join('resource', 'assets', 'sheet', group_name)
	`TexturePacker --max-size 1024 --data #{output_path}.json --sheet #{output_path}.png --format egret-spritesheet #{files.join(' ')}`

	`pngquant --speed 1 --force --output #{output_path}.png #{output_path}.png`

	subkeys = files.map do |file|
			file.split('/')[-1].gsub('.', '_')
		end

	$res_obj['resources'].push({
		"url" => File.join("assets", "sheet", group_name + ".json"),
		"type" => "sheet",
		"subkeys" => subkeys.join(','),
		"name" => "#{group_name}_json"
	})

	files.each do |file|
		File.delete(file)
	end
end

def get_res_item(name)
	resources = $res_obj['resources']

	item = resources.select do |item|
		item["name"] == name
	end

	item[0]
end

def pack(group)
	puts "合并图集:" + group['name']
	items = group["keys"].split(',')
	if (items.length == 1 and items[0] == "") or items == nil
		$groups.delete(group_name)
	else
		files = items.map do |key|
			# puts key
			item = get_res_item(key);
			path = item["url"]
			remove(path)
			File.join('resource', path)
		end

		# puts files
		do_pack(group["name"], files)
	end
end

$groups.each do |item|
	if item["name"].index('sheet_')
		pack(item)
	end
end

$groups.delete_if do |item|
	item['name'].index('sheet_') != nil
end
File.write(conf_path, JSON.generate($res_obj))