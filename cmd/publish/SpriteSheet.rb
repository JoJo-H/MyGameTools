class SpriteSheet
  def initialize(res, env)
    @res = res
    @env = env
  end

  def copy_to_picks_path(json_files)
    ret = []
    json_files.each do |file|
      if /(.*?)([^\\\/]*?)\.([^.]+)$/ =~ file
        FileUtils.copy_entry($1 + $2 + '.json', File.join(@env.pack_path, $2 + '.json'))
        FileUtils.copy_entry($1 + $2 + '.png', File.join(@env.pack_path, $2 + '.png'))

        ret.push(File.join(@env.pack_path, $2))
      end
    end
    ret
  end

  def get_images_crc32(images)
    contents = []
    images.each do |img|
      contents.push(img + @res.get_item_crc32(img))
    end
    Zlib::crc32(contents.join(' ')).to_s(32)
  end

  def generate(name, images)
    code = get_images_crc32(images)
    tmp_path = '/tmp/bearjoy/' + code
    if not Dir.exists?(tmp_path)
      `TexturePacker --trim-mode Trim --sheet #{tmp_path}/#{name}{n}.png --data #{tmp_path}/#{name}{n}.json --max-size 1024 --multipack --format egret-spritesheet --size-constraints POT #{images.join(' ')}`
      if $?.to_i > 0
        exit $?.to_i
      end
    end
    jsons = Dir.glob(File.join(tmp_path, '*.json'))
    copy_to_picks_path(jsons)
  end
end
