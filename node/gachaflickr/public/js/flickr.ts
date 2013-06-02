/// <reference path="../../../typings/jquery.d.ts" />

interface FlickrUserObj {
  id: string;
  displayName: string;
  fullName: string;
  token: string;
  tokenSecret: string;
}

module com.drikin.FlickrAPI {
  declare var window: any;
  declare var CryptoJS: any;


  interface FlickrURLObj {
    node: any;
    url_string: string;
    farm_id: string;
    server_id: string;
    id: string;
    secret: string;
    size: string;
    file_ext: string;
  }

  export class Base {
    api_key:  string    = "9be4080c588662045e33efd094a63b0c"; // default key
    api_secret: string  = 'add12790d2e3136e';
    base_url: string    = "http://api.flickr.com/services/rest/";
    base_params: any    = { format: 'json',
                            nojsoncallback: '1'};

    constructor(public flickr_user: FlickrUserObj) {
    }

    private getJsonResult(request_url: string, callback) {
      jQuery.ajax(request_url, {
        success: (data)=> {
          //console.log(data);
          callback&&callback(data);
        },
        dataType: 'json',
      });
    }

    private encodeRFC3986(str: string) {
      return encodeURIComponent(str)
        .replace(/!/g,'%21')
        .replace(/\*/g,'%2A')
        .replace(/\(/g,'%28')
        .replace(/\)/g,'%29')
        .replace(/'/g,'%27');
    };

    private generateAuthorizationUrl(method: string, url: string, additional_params: any, api_key: string, api_secret: string, token: string, tokenSecret: string): string {
      var params = {
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_nonce: Math.floor(Math.random() * 1e15),
        oauth_version: '1.0',
      };

      if (api_key) {
        params['oauth_consumer_key'] = api_key;
      }

      if (token) {
        params['oauth_token'] = token;
      }

      for (var key in additional_params) {
        params[key] = additional_params[key];
      }

      var self = this;
      var encoded_params = Object.keys(params).sort().map(function(i) {
        return self.encodeRFC3986(i) + '=' + self.encodeRFC3986(params[i]);
      }).join('&');

      var signature_base_string = [
        method,
        this.encodeRFC3986(url),
        this.encodeRFC3986(encoded_params)
      ].join('&');

      var signing_key = [api_secret, tokenSecret].join('&');

      params['oauth_signature'] = this.encodeRFC3986(CryptoJS.HmacSHA1(signature_base_string, signing_key).toString(CryptoJS.enc.Base64));


      var url_params = Object.keys(params).sort().map(function(i) {
        return i + '=' + params[i];
      }).join('&');
      return url + '?' + url_params;
    }

    private generateFlickrRequestUrl(api_params: any): string {
      var params = this.base_params;
      for (var key in api_params) {
        params[key] = api_params[key];
      }
      var url = this.generateAuthorizationUrl(
          'GET',
          this.base_url,
          params,
          this.api_key,
          this.api_secret,
          this.flickr_user.token,
          this.flickr_user.tokenSecret);
      return url;
    }

    public getExif(photo_id: string, callback: any): void {
      var params = {
        method: "flickr.photos.getExif",
        photo_id: photo_id
      };
      this.getJsonResult(this.generateFlickrRequestUrl(params), callback);
    }

    public getRecentURL(callback: any, opts?: any): void {
      var params = {
        method: 'flickr.people.getPhotos',
        user_id: this.flickr_user.id
      }
      if (opts) {
        for (var key in opts) {
          params[key] = opts[key];
        }
      }
      this.getJsonResult(this.generateFlickrRequestUrl(params), callback);
    }
  }
}


