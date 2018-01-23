
class Resource
  def initialize(env, res_path = nil, init = true)
    @env = env
    if res_path == nil
      res_path = File.join(@env.project_path, 'resource', 'resource.json')
      @file_name = 'resource.json'
      if not File.exists?(res_path)
        res_path = File.join(@env.project_path, 'resource', 'default.res.json')
        @file_name = 'default.res.json'
      end
    end

    resObj = JSON.parse(File.read(res_path))

    @file_obj = {}
    @group_obj = {}

    @file_list = resObj['resources']
    @group_list = resObj['groups']

    @group_list.each do |item|
      @group_obj[item['name']] = item
    end

    @file_list.each do |item|
      @file_obj[item['name']] = item
      if init
        file_path = File.join(@env.project_path, 'resource', item['url'])
        if File.exists?(file_path)
          item['crc32'] = Zlib::crc32(File.read(file_path)).to_s(32)
        end
        if item['url'].index('animation')
          item['subkeys'] = ''
        end
      end
    end

    if init
      clear_output()
    end

  end

  def clear_output()
    if Dir.exists?(@env.output_path)
      FileUtils.remove_dir(@env.output_path, true)
    end
  end

  def get_item(key)
    @file_obj[key]
  end

  def get_group(key)
    @group_obj[key]
  end

  def get_item_crc32(key)
    if key.index('/') != nil or key.index('\\') != nil
      key = Resource.get_key(key)
    end
    @file_obj[key]['crc32']
  end

  def remove_item(key)
    @file_list.delete_if do |item|
      item['name'] == key
    end
  end

  def add_item(item)
    @file_list.push(item)
  end

  def copy_font_to_output(item)
    font_path = File.join(@env.project_path, 'resource', item['url'])
    if font_path.index('png') != nil
      return
    end

    font_content = File.read(font_path)

    dir_path = File.dirname(font_path)
    type = nil
    if font_content =~ /file=\"([^\"]+)\"/
      png_path = File.join(dir_path, $1)
      type = 'ini'
    else
      if font_content =~ /file\"\s*:\s*\"([^\"]+)\"/
        png_path = File.join(dir_path, $1)
        type = 'json'
      end
    end

    if type == nil
      return
    end

    png_crc_path = get_crc32_file($1, png_path)

    if type == 'ini'
      font_content = font_content.gsub(/file=\"([^\"]+)\"/, 'file="' + png_crc_path + '"')
    elsif type == 'json'
      font_content = font_content.gsub(/file\"\s*:\s*\"([^\"]+)\"/, 'file":"' + png_crc_path + '"')
    end

    new_file = get_crc32_content(item['url'], font_content)
    font_to_path = File.join(@env.output_path, new_file)

    FileUtils.mkdir_p(File.dirname(font_to_path))
    File.write(font_to_path, font_content)

    FileUtils.copy_entry(png_path, File.join(File.dirname(font_to_path), png_crc_path))

    new_file
  end

  def group_list()
    @group_list
  end

  def copy_sheet_to_output(item, key)
    json_path = File.join(@env.project_path, 'resource', item['url'])
    json_obj = JSON.parse(File.read(json_path))

    if not json_obj.has_key?(key)
      nil
      return
    end

    dir_path = File.dirname(json_path)
    png_path = File.join(dir_path, json_obj[key])

    png_crc_path = get_crc32_file(json_obj[key], png_path)

    json_obj[key] = png_crc_path

    json_content = JSON.generate(json_obj)
    new_file = get_crc32_content(item['url'], json_content)
    json_to_path = File.join(@env.output_path, new_file)

    FileUtils.mkdir_p(File.dirname(json_to_path))
    File.write(json_to_path, json_content)

    FileUtils.copy_entry(png_path, File.join(File.dirname(json_to_path), png_crc_path))

    new_file
  end

  def self.get_key(file_path)
    if /([^\\\/]+)\.([^\.]+)$/ =~ file_path
      $1 + '_' + $2
    end
  end

  def get_crc32_content(check_url, content)
    code = Zlib::crc32(content).to_s(32)
    if /(.*?)(\.[^\.]+)$/ =~ check_url
      $1+'_'+code+$2
    end
  end

  def get_crc32_file(check_url, file_path)
    get_crc32_content(check_url, File.read(file_path))
  end

  def copy_entry(file_path, target_path = nil)
    if target_path == nil
      res_path = File.join(@env.project_path, 'resource/')
      target_path = File.join(@env.output_path, file_path.gsub(res_path, ''))
    end
    FileUtils.mkdir_p(File.dirname(target_path))
    FileUtils.copy_entry(file_path, target_path)
  end

  def copy_asset_images()
    asset_path = File.join(@env.project_path, 'resource', 'assets')
    images = Dir.glob(File.join(asset_path, '*.jpg')) + Dir.glob(File.join(asset_path, '*.png'))
    images.each do |img|
      copy_entry(img)
    end
  end

  def checksum()
    if not Dir.exists?(@env.output_path)
      FileUtils.mkdir_p(@env.output_path)
    end

    @file_list.each do |item|
      file_path = File.join(@env.project_path, 'resource', item['url'])
      if File.exists?(file_path)
        if item['type'] == 'sheet'
          new_file = copy_sheet_to_output(item, 'file')
        elsif item['name'].index('_texture_json')
          new_file = copy_sheet_to_output(item, 'imagePath')
        elsif item['type'] == 'font'
          new_file = copy_font_to_output(item)
        else
          new_file = get_crc32_file(item['url'], file_path)
          target_path = File.join(@env.output_path, new_file)
          copy_entry(file_path, target_path)
        end
        item['url'] = new_file
      end
    end
  end

  def zip_movie()
    anim_conf_path = File.join(@env.project_path, 'movie.conf')
    if File.exists?(anim_conf_path)
      contents = File.read(anim_conf_path).split('\n')
      anim_path = File.join(@env.output_path, 'animation')
      contents.each do |line|
        if line != nil and line.strip != ''
          output_path = File.join(anim_path, line)
          MovieGroup.new(line, self, @env).zip(output_path)
        end
      end
    end
  end

  def copy_to(from, to)
    from_file = File.join(@env.project_path, 'resource', from)
    crc32 = ''
    if to.index('{crc32}')
      crc32 = Zlib::crc32(File.read(from_file)).to_s(32)
      to = to.gsub('{crc32}', crc32)
    end
    to_file = File.join(@env.output_path, to)
    FileUtils.copy_entry(from_file, to_file)
    crc32
  end

  def save()
    copy_asset_images()

    if @env.compress_config
      group = PreloadGroup.new(self, @env)
      group.zip(File.join(@env.output_path, 'preload'))
    end

    zip_movie

    @file_list.each do |file_item|
      file_item.delete('crc32')
    end

    dict = {'groups' => @group_list.select {|item| item['name'].index('sheet') == nil}, 'resources' => @file_list}
    content = JSON.generate(dict)
    @resource_crc32 = Zlib::crc32(content).to_s(32)
    full_path = File.join(@env.output_path, 'resource_' + @resource_crc32 + '.json')
    if @env.is_runtime
      full_path = File.join(@env.output_path, @file_name)
    end
    File.write(full_path, content)
  end

  def get_res_crc32()
    @resource_crc32
  end
end
