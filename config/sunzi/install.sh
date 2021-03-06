#!/bin/bash

# Load base utility functions like sunzi.mute() and sunzi.install()
source recipes/sunzi.sh

# This line is necessary for automated provisioning for Debian/Ubuntu.
# Remove if you're not on Debian/Ubuntu.
export DEBIAN_FRONTEND=noninteractive

# Add Dotdeb repository. Recommended if you're using Debian. See http://www.dotdeb.org/about/
# source recipes/dotdeb.sh

# Update installed packages
sunzi.mute "aptitude update"
sunzi.mute "aptitude -y safe-upgrade"

# Install packages
sunzi.install "git-core ntp curl"

# Set RAILS_ENV
environment=$(cat attributes/environment)

if ! grep -Fq "RAILS_ENV" ~/.bash_profile; then
  echo 'Setting up RAILS_ENV...'
  echo "export RAILS_ENV=$environment" >> ~/.bash_profile
  source ~/.bash_profile
fi

# Install Ruby using RVM
source recipes/rvm.sh
ruby_version=$(cat attributes/ruby_version)

if [[ "$(which ruby)" != /usr/local/rvm/rubies/ruby-$ruby_version* ]]; then
  echo "Installing ruby-$ruby_version"
  sunzi.install build-essential libssl-dev libreadline6-dev
  rvm install $ruby_version
  rvm $ruby_version --default
  echo 'gem: --no-ri --no-rdoc' > ~/.gemrc

  # Install Bundler
  gem update --system
  gem install bundler
fi

# Install sysstat, then configure if this is a new install.
if sunzi.install "sysstat"; then
  sed -i 's/ENABLED="false"/ENABLED="true"/' /etc/default/sysstat
  /etc/init.d/sysstat restart
fi

# Set NODE_ENV
environment=$(cat attributes/environment)

if ! grep -Fq "NODE_ENV" ~/.bash_profile; then
  echo 'Setting up NODE_ENV...'
  echo "export NODE_ENV=$environment" >> ~/.bash_profile
  source ~/.bash_profile
fi

flickrex_master_dir="master"
flickrex_stable_dir="stable"
if [ ! -e ~/git ]; then
  echo 'Create git dir'
  mkdir ~/git
  cd ~/git
  git clone https://github.com/drikin/labs.git
  cd labs/www
  echo 'Mkdir for flickrex'
  mkdir flickrex
  cd flickrex
  echo 'Clone Flickrex from master branch'
  git clone https://github.com/drikin/FlickrEx.git ${flickrex_master_dir}
  echo 'Clone Flickrex from stable branch'
  git clone https://github.com/drikin/FlickrEx.git ${flickrex_stable_dir}
  cd ${flickrex_stable_dir}
  git checkout -b stable origin/stable
  chmod 711 /root
fi

if [ -e ~/git/labs ]; then
  echo 'git pull from labs repo'
  cd ~/git/labs
  git pull origin master
  echo 'git pull from flickrex repos'
  cd www/flickrex
  pushd ${flickrex_master_dir}
  git pull
  popd
  pushd ${flickrex_stable_dir}
  git pull
  popd
fi

# Install nave
if [ ! -e ~/git/nave ]; then
  echo 'git clone nave'
  cd ~/git
  git clone https://github.com/isaacs/nave.git
else
  echo 'git pull nave'
  cd ~/git/nave
  git pull
fi

# Install node.js
cd ~/git/nave
echo 'install node stable'
bash nave.sh usemain stable
cd ~/git/labs/node/gachaflickr
killall node
make clean
make
exec node app.js >> /var/log/node.log 2>&1 &


