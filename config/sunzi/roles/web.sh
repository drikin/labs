# Install Web server

# aptitude -y install nginx       # Nginx
# aptitude -y install apache2   # Apache

if sunzi.install "nginx"; then
    echo "Remove nginx default config"
    rm /etc/nginx/sites-enabled/default
    nginx
fi

if [ -e ~/git/labs ]; then
  echo 'git pull'
  pushd ~/git/labs
  git pull origin master
  ln -Fs ~/git/labs/config/nginx/sites-available/static /etc/nginx/sites-enabled/static
  popd
fi

if sunzi.installed "nginx"; then
  /usr/sbin/nginx -s quit
  /usr/sbin/nginx
  echo "nginx reload"
fi

