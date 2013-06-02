flickr.js:
	tsc public/js/flickr.ts

app.js: app.ts
	tsc app.ts

run: app.js flickr.js
	node app.js

clean:
	rm app.js
	rm public/js/flickr.js
	rm routes/index.js
