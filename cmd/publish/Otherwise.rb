class Otherwise
  def initialize(env, res, res_path = nil)
    @env = env
    @res = res
    if res_path == nil
      res_path = File.join(@env.project_path, 'resource', 'assets', 'config', 'otherwise.json')
    end

    @exists = File.exists?(res_path)

    if not @exists
      return
    end

    @lists = JSON.parse(File.read(res_path))

  end

  def copy_file(file)
    full_file = File.join(@env.project_path, file)
    content = File.read(full_file)

    r = /source=\"([\s\S\/\\\.]*?)([^\/]+?)\.([^\"\.]+)\"/

    replace_dict = {}

    content.scan(r) do |m|
      key = m[1] + '_' + m[2]
      item = @res.get_item(key)
      crc32 = item['crc32']
      replace_dict[m[0] + m[1] + '.' + m[2]] = m[0] + m[1] + '_' + crc32 + '.' + m[2]
    end

    replace_dict.each do |k,v|
      content.gsub!(k, v)
    end

    crc32 = Zlib::crc32(content).to_s(32)

    new_file = ''
    to_file = ''
    if file =~ /(resource\/)(.*?)\.([a-zA-Z]+)$/
      new_file = $1 + $2 + '_' + crc32 + '.' + $3
      to_file = $2 + '_' + crc32 + '.' + $3
    end

    dir = File.dirname(to_file)

    FileUtils.mkdir_p(File.join(@env.output_path, dir))

    File.write(File.join(@env.output_path, to_file), content)

    new_file
  end

  def save
    if not @exists
      return
    end

    @lists.map do |k,v|
      @lists[k] = copy_file(v)
    end

    content = JSON.generate(@lists)
    @resource_crc32 = Zlib::crc32(content).to_s(32)
    url = File.join('assets', 'config', 'otherwise_' + @resource_crc32 + '.json')
    File.write(File.join(@env.output_path, url), content)

    item = @res.get_item('otherwise_json')

    FileUtils.remove(File.join(@env.output_path, item['url']))

    @res.get_item('otherwise_json')['url']  = url
  end

  def get_res_crc32()
    @resource_crc32
  end

end