flickr.js:
	node_modules/typescript/bin/tsc public/js/flickr.ts

app.js: app.ts
	node_modules/typescript/bin/tsc app.ts

run: app.js flickr.js
	node app.js

clean:
	rm app.js
	rm public/js/flickr.js
	rm routes/index.js
