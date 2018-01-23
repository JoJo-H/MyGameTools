class PackData
  def initialize(resource, env)
    @env = env
    @resource = resource

    @group_obj = {}

    if File.exists?(File.join(@env.project_path, 'resource', 'publish.json'))
      preparePublishGroups()
    end

    prepareSheetGroups()
  end

  def preparePublishGroups()
    pub_path = File.join(@env.project_path, 'resource', 'publish.json')
    publish_obj = JSON.parse(File.read(pub_path))
    publish_obj['packGroups'].each do |item|
      @group_obj[item['name']] = []
      item['res'].each do |file|
        find_item = @resource.get_item(file['key'])
        if find_item
          file_path = File.join(@env.project_path, 'resource', find_item['url'])
          if File.exists?(file_path)
            @group_obj[item['name']].push(file_path)
            @resource.remove_item(file['key'])
          else
            puts "preparePublishGroup:不存在的文件:" + file_path
          end
        else
          puts "preparePublishGroup:resource.json中不存在:" + file['key']
        end
      end
    end
  end

  def prepareSheetGroups()
    @resource.group_list.each do |item|
      if item['name'].index('sheet')
        keys = item['keys'].split(',')
        @group_obj[item['name']] = []

        keys.each do |file|
          find_item = @resource.get_item(file)
          if find_item
            file_path = File.join(@env.project_path, 'resource', find_item['url'])
            if File.exists?(file_path)
              @group_obj[item['name']].push(file_path)
              @resource.remove_item(file)
            else
              puts "prepareSheetGroup:不存在的文件:" + file_path
            end
          else
            puts "prepareSheetGroup:resource.json中不存在:" + file
          end
        end
      end
    end
  end

  def groups
    @group_obj
  end
end
