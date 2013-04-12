# Install Web server

# aptitude -y install nginx       # Nginx
# aptitude -y install apache2   # Apache

if sunzi.install "nginx"; then
    echo "Remove nginx default config"
    rm /etc/nginx/sites-enabled/default
    nginx
fi

if [ -e ~/git/labs ]; then
  echo 'Enable sites'
  ln -Fs ~/git/labs/config/nginx/sites-available/static   /etc/nginx/sites-enabled/static
  ln -Fs ~/git/labs/config/nginx/sites-available/flickrex /etc/nginx/sites-enabled/flickrex
  ln -Fs ~/git/labs/config/nginx/sites-available/drikin /etc/nginx/sites-enabled/drikin
fi

if sunzi.installed "nginx"; then
  /usr/sbin/nginx -s quit
  /usr/sbin/nginx
  echo "nginx reload"
fi

