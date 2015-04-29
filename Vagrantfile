Vagrant.configure("2") do |config|
   config.vm.box = "ubuntu/trusty64"
   config.vm.hostname = "autovirology"
   config.vm.network "private_network", ip: "192.168.50.4"
   config.vm.synced_folder ".", "/vagrant", type: "nfs"
   config.vm.network "forwarded_port", guest: 80, host: 8080
end
