class PreloadGroup < BaseGroup
  def initialize(res, env)
    files = ['togather_jsonsheet', 'config_jsonsheet']

    files.map! do |file|
      item = res.get_item(file)
      if item
        full_path = File.join(env.output_path, item['url'])
        if File.exists?(full_path)
          res.remove_item(file)
          full_path
        end
      end
    end

    files.compact!

    super(res, env, files, 'preload')
  end
end