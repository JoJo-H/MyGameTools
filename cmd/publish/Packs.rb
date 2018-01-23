class Packs
  def initialize(resource, env)
    @env = env
    @sprite_sheet = SpriteSheet.new(resource, env)
    @resource = resource
  end

  def generate()
    unless @env.compress_packs
      return
    end

    if not Dir.exists?(@env.pack_path)
      FileUtils.mkdir_p(@env.pack_path)
    end

    data = PackData.new(@resource, @env)


    data.groups.each do |k,v|
      merge_texture(k, v)
    end

    json_files = Dir.glob(File.join(@env.pack_path, '*.json'))

    json_files.each do |file|
      insert_pack(file)
    end
  end

  def get_pack_group(group_name)
    @publish_obj['packGroups'].find { |item| item['name'] == group_name }
  end

  def merge_texture(name, file_list)
    filenames = @sprite_sheet.generate(name, file_list)

    filenames.each do |filename|
      compress_image(filename + '.png')
      change_png_file(filename + '.png', filename + '.json')

      new_png_file = checksum(filename + '.png')
      new_json_file = checksum(filename + '.json')

      obj = JSON.parse(File.read(new_json_file))
      obj['file'] = File.basename(new_png_file)
      File.write(new_json_file, JSON.generate(obj))
    end
  end

  def compress_image(image_path)
    `pngquant --speed 1 --force --output #{image_path} #{image_path}`
    if $?.to_i > 0
      exit $?.to_i
    end
  end

  def insert_pack(json_file)
    png_list = []
    obj = JSON.parse(File.read(json_file))
    obj['frames'].each do |k,v|
      png_list.push(k)
    end

    output_path = File.join(@env.output_path, '/')
    if /([^\\\/]+)(_[^_]+)\.([^\.]+)$/ =~ json_file
      @resource.add_item({
                             'name' => $1,
                             'type' => 'sheet',
                             'url' => json_file.gsub(output_path, ''),
                             'subkeys' => png_list.join(',')
                         })
    end
  end

  def change_png_file(png_file, json_file)
    obj = JSON.parse(File.read(json_file))
    new_obj = {}
    if /([^\\\/]+)$/ =~ png_file
      new_obj['file'] = $1
    end
    new_obj['frames'] = {}
    obj['frames'].each do |key,value|
      if key =~ /([^\.]+)\.(.*)$/
        new_obj['frames'][$1+'_'+$2] = value
      else
        new_obj['frames'][key + '_png'] = value
      end
    end
    File.write(json_file, JSON.generate(new_obj))
  end

  def checksum(filepath)
    code = Zlib::crc32(File.read(filepath)).to_s(32)
    if /(.*?)(\.[^\.]+)$/ =~ filepath
      filename = $1+'_'+code+$2
      File.rename(filepath, filename)
      filename
    end
  end
end
