class MovieGroup < BaseGroup
  def initialize(prefix, res, env)
    files = [
        prefix + '_json',
        prefix + '_swf_json'
    ]

    full_files = []
    files.each_index do |idx|
      full_path = File.join(env.output_path, res.get_item(files[idx])['url'])
      res.remove_item(files[idx])
      full_files.push(full_path)
      if idx == 0
        png_dir = File.dirname(full_path)
        json_obj = JSON.parse(File.read(full_path))
        full_files.push(File.join(png_dir, json_obj['file']))
      end
    end

    super(res, env, full_files, prefix, 'movie')
  end
end