Vagrant.configure("2") do |config|
    config.vm.box = "bento/ubuntu-20.04"
    config.vm.network "public_network"
    # config.vm.synced_folder "../projects", "/vagrant_data"
    config.vm.provider "virtualbox" do |vb|
      vb.memory = "4096"
    end
end
