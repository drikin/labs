# Install Web server

aptitude -y install nginx       # Nginx
# aptitude -y install apache2   # Apache

if sunzi.install "nginx"; then
    echo "Remove nginx default config"
    pushd /etc/nginx/sites-enabled
    rm *
    pupd
fi

if sunzi.installed "nginx"; then
  /usr/sbin/nginx -s quit
  /usr/sbin/nginx
  echo "nginx reload"
fi

