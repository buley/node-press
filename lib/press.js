/* press.js */

var OAuth = require("oauth").OAuth
, OAuth2 = require("oauth").OAuth2
, OAuthUtils = require('oauth/lib/_utils.js')
, querystring = require("querystring");


var Private = function() {

};

Private.prefix = 'press';

Private.service = function( service ) {
	if( 'undefined' !== typeof Private.service[ service ] ) {
		return Private.service[ service ];
	}
	return null;
};

Private.models = function( type ) {
	if( 'undefined' !== typeof Private.models[ type ] ) {
		return Private.models[ type ];
	}
	return null;
};

/* */
/* Object Mapping */
/* */

/* Facebook */

/* 
 * Facebook note model:
 * { subject: string
 *   , message: string (HTML ok)
 * }
 *
 * http://developers.facebook.com/docs/reference/api/note/
 * */
Private.models.facebook.note = function( note ) {

};

/* Facebook comment model:
 * { message: required string
 *   type: 'comment'
 * }
 *
 * http://developers.facebook.com/docs/reference/api/Comment/
 * */
Private.models.facebook.comment = function( comment ) {

};

/* Facebook link model: 
 * { link: string
 * , name: string
 * , description: string
 * , picture: string (valid URI)
 * , message: string
 * , type: 'link'
 * }
 *
 * http://developers.facebook.com/docs/reference/api/link/
 * */
Private.models.facebook.link = function( link ) {

};

/* Facebook audio model:
 * {
 *	N/A
 * }
 *
 * */
Private.models.facebook.audio = function( audio ) {
	return false;
};

/* Facebook video model:
 * { name: string
 * , description: string
 * , picture: string (valid URI)
 * , source: string (valid URI)
 * }
 *
 * http://developers.facebook.com/docs/reference/api/video/
 * */
Private.models.facebook.video = function( video ) {

};

/* Facebook image (photo) model:
 * { name: string
 * , description: string
 * , picture: string (valid URI)
 * , source: string (valid URI)
 * , height: number
 * , width: number
 * , link: string (valid URI)
 * , images: [ { height: number, width: number, source: string (valid URI) }, {...} ]
 * , position: number
 * , created_time: string (ISO-8601 date)
 * , updated_time: string (ISO-8601 date)
 * }
 *
 * http://developers.facebook.com/docs/reference/api/photo/
 * */
Private.models.facebook.image = function( image ) {

};

/* Facebook person (user) model:
 * { id: string
 * , name: string
 * , first_name: string
 * , middle_name: string
 * , last_name: string
 * , gender: string
 * , locale: string
 * , languages: array [ { 'id': string, 'name': string }, ... ]
 * , link: string (valid URI)
 * , username: string
 * , third_party_id: string
 * , installed: { type: string, id: string, installed: bool (present only when true) }
 * , timezone: number
 * , updated_time: string (ISO-8601 date)
 * , verified: boolean
 * , bio: string
 * , birthday: string (format MM/DD/YY)
 * , education: [ { 'year': string, type: string, school: { name: string, id: string, type: string, year*: string, degree*: string, concentration*: string, classes: [ { ??? } ] }, ... ]
 * , email: string (RFC822 email address)
 * , hometown: { name: string, id: string }
 * , interested_in: [ 'foo', 'bar', ... ]
 * , location: { name: string, id: string }
 * , political: string
 * , quotes: string
 * , relationship_status: string
 * , religion: string
 * , significant_other: { name: string, id: string }
 * , video_upload_limits: { length: string?, size: string? }
 * , website: string (valid URI)
 * , work: [ { employer: string?, location: { name?: string?, id: string? }?, position: string?, start_date: string?, end_date: string? }, ... ]
 * }
 *
 * http://developers.facebook.com/docs/reference/api/user/
 * */
Private.models.facebook.person = function( person ) {
	
};


/* Facebook organization (group) model:
 * { id: string
 * , version: number (0=old type, 1=current)
 * , icon: string (valid URI)
 * , owner: { name: string, id: string }
 * , name: string
 * , description: string
 * , category: string
 * , link: string (valid URI)
 * , privacy: string ('OPEN', 'CLOSED' or 'SECRET')
 * , updated_time: string (ISO-8601 date)
 * }
 * 
 * http://developers.facebook.com/docs/reference/api/group/
 * */

Private.models.facebook.organization = function( organization ) {

};

/* Facebook entity (page) model:
 * { id: string
 * , name: string
 * , link: string (valid URI)
 * , category: string
 * , is_published: boolean
 * , username: string
 * , likes: number
 * , location:
 * 	{ street: string
 * 	, city: string
 * 	, state: string
 * 	, country: string
 * 	, zip: string
 * 	, latitude: number
 * 	, longitude: number
 * 	}
 * , phone: string
 * , checkins: number
 * , picture: string (valid URI?)
 * , website: string (valid URI?)
 * , talking_about_count: number
 * , company_overview: string
 * , mission: string
 * , about: string
 * , access_token: string* (only provided if administator)
 * }
 * 
 * http://developers.facebook.com/docs/reference/api/checkin/
 * */

Private.models.facebook.entity = function( place ) {

};


/* Twitter */

/* 
 * Twitter note model:
 * { 
 * 	N/A
 * }
 *
 * */

Private.models.twitter.note = function( note ) {
	return false;
};


/* Twitter comment model:
 * { coordinates: ?
 * , created_at: string (ISO/RFC?)
 * , truncated: boolean
 * , favorited: boolean
 * , id_str: string
 * , entities: {
 * 	urls: [
 * 		{ expanded_url: string
 * 		, url: string
 * 		, indices: [ number, number ]
 * 		, display_url: string }, ... ]
 * 		} 
 * 	], hashtags: [
 * 		{ text: string
 * 		, indices: [ number, number ]
 * 		}, ...
 * 	], user_mentions: [
 *		{ name: string
 *		, id_str: string
 *		, id: number
 *		, indices: [ number, number ]
 *		, screen_name: string
 *		}, ...
 * 	] }
 * , in_reply_to_user_id_str: string
 * , text: string
 * , contributors: ?
 * , id: string
 * , retweet_count: number
 * , in_reply_to_status_id_str: string
 * , geo: { type: string ("Point"), coordinates: [ number, number ] }
 * , retweeted: boolean
 * , possibly_sensitive: boolean
 * , in_reply_to_user_id: number
 * , place: ?
 * , source: string (HTML)
 * , user: { profile_sidebar_border_color: string
 * 	   , profile_background_tile: boolean
 * 	   , profile_sidebar_fill_color: string
 * 	   , name: string
 * 	   , profile_image_url: string (valid URI)
 * 	   , created_at: string (RFC/ISO?)
 * 	   , location: string
 * 	   , profile_link_color: string
 * 	   , follow_request_sent: ?
 * 	   , is_translator: boolean
 * 	   , id_str: string
 * 	   , favourites_count: number
 * 	   , default_profile: false
 * 	   , url: string
 * 	   , contributors_enabled: boolean
 * 	   , id: number
 * 	   , utc_offset: ?
 * 	   , profile_image_url_https: string (valid URI)
 * 	   , profile_user_background_image: boolean
 * 	   , listed_count: number
 * 	   , followers_count: number
 * 	   , lang: string
 * 	   , profile_text_color: string
 * 	   , protected: boolean
 * 	   , profile_background_image_url_https: string (valid URI)
 * 	   , description: string
 * 	   , geo_enabled: boolean
 * 	   , verified: boolean
 * 	   , profile_background_color: string
 * 	   , time_zone: ?
 * 	   , notifications: ?
 * 	   , statuses_count: number
 * 	   , friends_count: number
 * 	   , default_profile_image: boolean
 * 	   , profile_background_image_url: string
 * 	   , screen_name: string
 * 	   , following: ?
 * 	   , show_all_inline_media: boolean
 * 	   }
 * , in_reply_to_screen_name: string
 * , in_reply_to_status_id: number
 * 
 * }
 *
 * http://developers.twitter.com/docs/reference/api/Comment/
 * */
Private.models.twitter.comment = function( comment ) {

};


/* Twitter link model: 
 * {
 *	N/A
 * }
 *
 * */

Private.models.twitter.link = function( link ) {

};


/* Twitter audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.models.twitter.audio = function( audio ) {
	return false;
};

/* Twitter video model:
 * {
 *	N/A
 * }
 *
 * */

Private.models.twitter.video = function( video ) {
	return false;
};


/* Twitter image (photo) model:
 * { sizes:
 * 	{ large:
 * 		{ w: number
 * 		, h: number
 * 		, resize: string ("fit", "crop") 
 * 		}
 * 	, medium:  
 * 		{ w: number
 * 		, h: number
 * 		, resize: string ("fit", "crop") 
 * 		}
 * 	, small:  
 * 		{ w: number
 * 		, h: number
 * 		, resize: string ("fit", "crop") 
 * 		}
 * 	, thumb:  
 * 		{ w: number
 * 		, h: number
 * 		, resize: string ("fit", "crop") 
 * 		}
 *	}
 * , media_url_https: string (valid URI)
 * , expanded_url: string (valid URI)
 * , id_str: string
 * , url: string
 * , id: number
 * , type: "photo"
 * , indices: [ number, number ]
 * , display_url: string
 * , media_url: string
 * }
 *
 * https://dev.twitter.com/docs/api/1/post/statuses/update_with_media
 * */
Private.models.twitter.image = function( image ) {

};

/* Twitter person (user) model:
 * { profile_sidebar_border_color: string
 * , profile_background_tile: boolean
 * , profile_sidebar_fill_color: string
 * , name: string
 * , profile_image_url: string (valid URI)
 * , created_at: string (RFC/ISO?)
 * , location: string
 * , profile_link_color: string
 * , follow_request_sent: ?
 * , is_translator: boolean
 * , id_str: string
 * , favourites_count: number
 * , default_profile: false
 * , url: string
 * , contributors_enabled: boolean
 * , id: number
 * , utc_offset: ?
 * , profile_image_url_https: string (valid URI)
 * , profile_user_background_image: boolean
 * , listed_count: number
 * , followers_count: number
 * , lang: string
 * , profile_text_color: string
 * , protected: boolean
 * , profile_background_image_url_https: string (valid URI)
 * , description: string
 * , geo_enabled: boolean
 * , verified: boolean
 * , profile_background_color: string
 * , time_zone: ?
 * , notifications: ?
 * , statuses_count: number
 * , friends_count: number
 * , default_profile_image: boolean
 * , profile_background_image_url: string
 * , status:
 * 	{ coordinates: ?
 * 	, created_at: string (ISO/RFC?)
 * 	, truncated: boolean
 * 	, favorited: boolean
 * 	, id_str: string
 * 	, entities: {
 * 		urls: [
 * 			{ expanded_url: string
 * 			, url: string
 * 			, indices: [ number, number ]
 * 			, display_url: string }, ... ]
 * 			} 
 * 		], hashtags: [
 * 			{ text: string
 * 			, indices: [ number, number ]
 * 			}, ...
 * 		], user_mentions: [
 *			{ name: string
 *			, id_str: string
 *			, id: number
 *			, indices: [ number, number ]
 *			, screen_name: string
 *			}, ...
 * 		] }
 * 	, in_reply_to_user_id_str: string
 * 	, text: string
 * 	, contributors: ?
 * 	, id: string
 * 	, retweet_count: number
 * 	, in_reply_to_status_id_str: string
 * 	, geo: { type: string ("Point"), coordinates: [ number, number ] }
 * 	, retweeted: boolean
 * 	, possibly_sensitive: boolean
 * 	, in_reply_to_user_id: number
 * 	, place: ?
 * 	}
 * , screen_name: string
 * , following: ?
 * , show_all_inline_media: boolean
 * }
 *
 * https://dev.twitter.com/docs/api/1/get/users/show
 * */

Private.models.twitter.person = function( person ) {
	
};


/* Twitter organization (list) model:
 * { slug: string
 * , created_at: string (ISO-8601 date)
 * , name: string
 * , full_name: string
 * , description: string
 * , mode: string ("public", ?)
 * , following: boolean
 * , user: { profile_sidebar_border_color: string
 * 	   , profile_background_tile: boolean
 * 	   , profile_sidebar_fill_color: string
 * 	   , name: string
 * 	   , profile_image_url: string (valid URI)
 * 	   , created_at: string (RFC/ISO?)
 * 	   , location: string
 * 	   , profile_link_color: string
 * 	   , follow_request_sent: ?
 * 	   , is_translator: boolean
 * 	   , id_str: string
 * 	   , favourites_count: number
 * 	   , default_profile: false
 * 	   , url: string
 * 	   , contributors_enabled: boolean
 * 	   , id: number
 * 	   , entities: {
 * 		urls: [
 * 			{ expanded_url: string
 * 			, url: string
 * 			, indices: [ number, number ]
 * 			, display_url: string }, ... ]
 * 			} 
 * 		], hashtags: [
 * 			{ text: string
 * 			, indices: [ number, number ]
 * 			}, ...
 * 		], user_mentions: [
 *			{ name: string
 *			, id_str: string
 *			, id: number
 *			, indices: [ number, number ]
 *			, screen_name: string
 *			}, ...
 * 		] }
 * 	   , utc_offset: ?
 * 	   , profile_image_url_https: string (valid URI)
 * 	   , profile_user_background_image: boolean
 * 	   , listed_count: number
 * 	   , followers_count: number
 * 	   , lang: string
 * 	   , profile_text_color: string
 * 	   , protected: boolean
 * 	   , profile_background_image_url_https: string (valid URI)
 * 	   , description: string
 * 	   , geo_enabled: boolean
 * 	   , verified: boolean
 * 	   , profile_background_color: string
 * 	   , time_zone: ?
 * 	   , notifications: ?
 * 	   , statuses_count: number
 * 	   , friends_count: number
 * 	   , default_profile_image: boolean
 * 	   , profile_background_image_url: string
 * 	   , screen_name: string
 * 	   , following: ?
 * 	   , show_all_inline_media: boolean
 * 	   }
 * , member_count: number
 * , id_str: string
 * , subscriber_count: number
 * , id: number
 * , uri: string
 * }
 * 
 * http://developers.twitter.com/docs/reference/api/group/
 * */

Private.models.twitter.organization = function( organization ) {

};


/* Twitter entity (page) model:
 * { 
 * 	N/A
 * }
 * 
 * */

Private.models.twitter.entity = function( place ) {
	return false;
};



/* Tumblr */

//TODO: function that takes type and obj
Private.models.tumblr = Private.models.tumblr || {};

/* 
 * Tumblr note model:
 * { title: string
 *   , body: string (HTML ok)
 *   , note_count: number
 *   , tags: [ 'foo', ... ] 
 *   , reblog_key: string
 *   , format: string
 *   , timestamp: number
 *   , date: string (GMT time RFC/ISO ?)
 *   , type: string
 *   , post_url: string
 *   , bookmarklet*: boolean (*exists only if true)
 *   , mobile*: boolean (*exists only if true)
 *   , source_url*: boolean (*exists only if there's a content source)
 *   , source_title*: boolean (*exists only if there's a content source)
 *   , total_posts: number
 * }
 *
 * http://www.tumblr.com/docs/en/api/v2#text-posts
 * */
Private.models.tumblr.note = function( note ) {

};

/* Tumblr comment model:
 * { message: required string
 *   type: 'comment'
 * }
 *
 * */
Private.models.tumblr.comment = function( comment ) {

};

/* Tumblr link model: 
 * { title: string
 * , url: string
 * , description: string
 * , note_count: number
 * , tags: [ 'foo', ... ] 
 * , reblog_key: string
 * , format: string
 * , timestamp: number
 * , date: string (GMT time RFC/ISO ?)
 * , type: string
 * , post_url: string
 * , bookmarklet*: boolean (*exists only if true)
 * , mobile*: boolean (*exists only if true)
 * , source_url*: boolean (*exists only if there's a content source)
 * , source_title*: boolean (*exists only if there's a content source)
 * , total_posts: number
 * }
 *
 * http://www.tumblr.com/docs/en/api/v2#link-posts
 * */
Private.models.tumblr.link = function( link ) {

};

/* Tumblr audio model:
 * { caption: string
 * , player: string
 * , plays: string
 * , album_art: string
 * , artist: string
 * , album: string
 * , track_name: string
 * , track_number: number
 * , year: number
 * , note_count: number
 * , tags: [ 'foo', ... ] 
 * , reblog_key: string
 * , format: string
 * , timestamp: number
 * , date: string (GMT time RFC/ISO ?)
 * , type: string
 * , post_url: string
 * , bookmarklet*: boolean (*exists only if true)
 * , mobile*: boolean (*exists only if true)
 * , source_url*: boolean (*exists only if there's a content source)
 * , source_title*: boolean (*exists only if there's a content source)
 * , total_posts: number
 * }
 *
 * http://www.tumblr.com/docs/en/api/v2#audio-posts
 * */
Private.models.tumblr.audio = function( audio ) {
	return false;
};

/* Tumblr video model:
 * { caption: string
 * , player: [ { width: number, embed_code: string }, ... ]
 * , note_count: number
 * , tags: [ 'foo', ... ] 
 * , reblog_key: string
 * , format: string
 * , timestamp: number
 * , date: string (GMT time RFC/ISO ?)
 * , type: string
 * , post_url: string
 * , bookmarklet*: boolean (*exists only if true)
 * , mobile*: boolean (*exists only if true)
 * , source_url*: boolean (*exists only if there's a content source)
 * , source_title*: boolean (*exists only if there's a content source)
 * , total_posts: number
 * }
 * 
 * http://www.tumblr.com/docs/en/api/v2#video-posts
 * */
Private.models.tumblr.video = function( video ) {

};

/* Tumblr image (photo) model:
 * { caption: string
 * , photos: [ { caption: strinbg, alt_sizes: [ { width: number, height: number, url: string (valid URI) }, ... ]
 * , height: number
 * , width: number
 * }
 *
 * http://www.tumblr.com/docs/en/api/v2#photo-posts
 * */
Private.models.tumblr.image = function( image ) {

};

/* Tumblr person (user) model:
 * { following: numner
 * , default_post_format: string ('html', 'markdown' or 'raw')
 * , name: string
 * , likes: number
 * , blogs: [
 * 	{ name: string
 * 	, url: string
 * 	, title: string
 * 	, primary: boolean
 * 	, followers: number
 * 	, tweet: number(auto, Y or N?)
 * 	}, ...
 * ] }
 *
 * http://www.tumblr.com/docs/en/api/v2#user-methods
 * */
Private.models.tumblr.person = function( person ) {
	
};


/* Tumblr organization (group) model:
 * { 
 * 	N/A
 * }
 * 
 * */

Private.models.tumblr.organization = function( organization ) {
	return false;
};

/* Tumblr entity (blog) model:
 * { title: string
 * , posts: string
 * , name: string
 * , updated: number
 * , description: string
 * , ask: boolean
 * , ask_anon: boolean
 * , likes: number
 * }
 *
 * http://www.tumblr.com/docs/en/api/v2#blog-info
 * */

Private.models.tumblr.entity = function( place ) {

};


/* Linkedin */

/* 
 * Linkedin note model:
 * { 
 * 	N/A
 * }
 *
 * */

Private.models.linkedin.note = function( note ) {
	return false;
};


/* Linkedin comment model:
 * { comment: string
 * , visibility: {
 *	code: string ("anyone", "connections-only")
 * } }
 *
 * http://developer.linkedin.com/documents/share-api
 *
 * */
Private.models.linkedin.comment = function( comment ) {

};


/* Linkedin link model: 
 * { comment: string
 * , content: {
 * 	title: string (max 200 char)
 * 	, submitted-url: string (valid URI)
 * 	, sumitted-image-url: string (valid URI)
 * 	, description: string (max 256 char)
 * }, visibility: {
 *	code: string ("anyone", "connections-only")
 * } }
 *
 * http://developer.linkedin.com/documents/share-api
 *
 * */

Private.models.linkedin.link = function( link ) {

};


/* Linkedin audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.models.linkedin.audio = function( audio ) {
	return false;
};

/* Linkedin video model:
 * {
 *	N/A
 * }
 *
 * */

Private.models.linkedin.video = function( video ) {
	return false;
};


/* Linkedin image (photo) model:
 * { 
 * 	N/A
 * }
 *
 * */

Private.models.linkedin.image = function( image ) {

};

/* Linkedin person (user) model:
 *
 * { id: string
 * , firstName: string
 * , lastName: string
 * , headline: string
 * , industry: string
 * , pictureUrl: string (valid URI)
 * , location:i
 * 	{ country: { code: string }
 * 	, name: string
 * 	}
 * , siteStandardProfileRequest:
 * 	{ url: string (valid URI) }
 * , apiStandardProfileRequest:
 * 	{ headers: 
 * 		{ "_total": number
 * 		, values: [ { name: string, value: string } ]
 * 	, url: string
 * 	}
 * , memberUrlResources:
 * 	{ "_total": number*
 * 	, values: [ { name: string, url: string } ]
 * 	}
 * , distance: number
 * , relationToViewer:
 * 	{ distance: number }
 * , numReccomenders: number
 * , currentStatus: string?
 * , currentStatusTimestamp: ?
 * , connections:
 * 	{ "_total": number }
 * , summary: string
 * , positions: {
 *      "_total": number
 *      , values: [ {
 *          company: {
 *              industry: string
 *              , name: string
 *          }
 *          , id: number
 *          , isCurrent: boolean
 *          , startDate: {
 *              month: number
 *              , year: number
 *          }
 *          , summary: string
 *          , title: string
 *      }, ... ]
 * }, educations: {
 *      "_total": number
 *      , values: [{
 *          degree: string
 *          , endDate: {
 *              year: number
 *          }
 *          , fieldOfStudy: string
 *          , id: number
 *          , schoolName: string
 *          , startDate: {
 *              year: number
 *          }
 *      }
 * }
 *
 * http://developer.linkedin.com/documents/profile-api
 *
 * */

Private.models.linkedin.person = function( person ) {
	
};


/* Linkedin organization (group) model:
 * 
 * http://developer.linkedin.com/documents/groups-fields
 * */

Private.models.linkedin.organization = function( organization ) {

};


/* Linkedin entity (company) model:
 * { 
 * }
 * 
 * http://developer.linkedin.com/documents/company-lookup-api-and-fields
 * */

Private.models.linkedin.entity = function( place ) {
	return false;
};



/* */
/* End Object Mapping */
/* */

/* */

Private.is_method = function( method ) {
	if( 'undefined' === typeof method || null === method ) {
		return false;
	}
	method = method.toUpperCase();
	if( 'PUT' === method || 'GET' === method || 'DELETE' === method ) {
		return true;
	}
	return false;
};

Private.is_action = function( action ) {
	if( 'favorite' === action || 'archive' === action ||  'watch' === action ||  'read' === action || 'view' === action || 'listen' === action ||  'post' === action ||  'checkin' === action ||  '' === action ) {
		return true;
	}
	return false; 
};

Private.is_service = function( service ) {
	if( 'undefined' === typeof service || null === service ) {
		return false;
	}
	service = service.toLowerCase();
	if(  'facebook' === service || 'google' === service || 'linkedin' === service || 'twitter' === service || 'windows' === service || 'foursquare' === service || 'yahoo' === service ||  'github' === service || 'tumblr' === service ) {
		return true;
	}
	return false;
};

/* Reply */

Private.is_reply = function( obj ) {
	return false;
};

/* Utilities */

/* */
/* Begin Utilities */
/* */

//TODO: Real implementation w/checks for object and if so make sure it has 1+ iterable own properties.
Private.is_empty = function( obj ) {
	if( null === obj || 'undefined' === typeof obj || ( 'string' === typeof obj && '' === obj ) || ( 'undefined' !== typeof obj.length && 0 === obj.length ) ) {
		return true;
	}
	return false;
};

Private.is_date = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : obj instanceof Date;
};

Private.is_number = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : 'number' === typeof obj;
};

Private.is_boolean = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : 'boolean' === typeof obj;
};

//note that is_empty filters out empty strings, i.e. ''
Private.is_string = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : 'string' === typeof obj;
};

Private.is_object = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : ( 'object' === typeof obj && !this.is_array( obj ) );
};

Private.has_attributes = function( obj ) {
	if( !this.is_object( obj ) ) {
		return false;
	}
	var attr;
	for( attr in obj ) {
		if( obj.hasOwnProperty( attr ) ) {
			return true;
		}
	}
	return false;
};

Private.is_array = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : obj instanceof Array;
};

Private.get_model = function( type ) {
	var model = null;
	switch( type ) {
		case 'link':
			model = {
				url: true
				, image: false
				, title: false
				, description: false
				, author: false
				, publisher: false
				, clicks: false
				, views: false
			};
			break;
		case 'status':
			model = {
				link: false
				, text: false
				, location: false
				, image: false
				, author: false
				, publisher: false
				, image: false
				, video: false
				, audio: false
				, views: false
				, comments_count: false
				, comments: false
			};
			break;
		case 'note': 
			model = {
				link: false
				, text: false
				, location: false
				, image: false
				, vidio: false
				, audio: false
				, author: false
				, publisher: false
				, image: false
				, title: { string: false }
				, description: { string: false }
				, views: false
				, comments_count: false
				, comments: false
			};
			break;
		case 'audio': 
			model = {
				link: true
				, source: false
				, location: false
				, image: false
				, author: false
				, publisher: false
				, length: { 'number': false }
				, begin: { 'number': false }
				, end: { 'number': false }
				, image: false
				, title: { string: false }
				, description: { string: false }
				, views: false
				, comments_count: false
				, comments: false
			};
			break;
		case 'video':
			model = {
				link: true
				, format: { 'string': false }
				, source: false
				, location: false
				, image: false
				, author: false
				, publisher: false
				, length: { 'number': false }
				, begin: { 'number': false }
				, end: { 'number': false }
				, image: false
				, title: { string: false }
				, description: { string: false }
				, views: false
				, comments_count: false
				, comments: false
			};
			break;
		case 'image':
			model = {
				link: true
				, source: false
				, location: false
				, author: false
				, publisher: false
				, image: false
				, title: { string: false }
				, description: { string: false }
				, views: false
				, comments_count: false
				, comments: false
			};
			break;
		case 'place':
			model = {
				link: false
				, location: true
				, image: false
				, title: { string: false }
				, description: { string: false }
				, views: false
				, comments_count: false
				, comments: false
				, contents_count: false
				, contents: false
			};
			break;
		case 'stats':
			model = {
				link: false
				, location: false
				, source: false
				, title: { string: false }
				, description: { string: false }
				, data: true
			};
			break;
		case 'location':
			model = {
				link: false
				, longitude: { number: true }
				, latitude: { number: true }
				, image: false
				, name: { string: false }
				, description: { string: false }
				, views: false
				, contents_count: false
				, contents: { array: false }
			};
			break;
		case 'author':
			model = {
				link: false
				, location: false
				, image: false
				, name: { string: true }
				, description: { string: true }
				, views: false
				, contents_count: false
				, contents: { array: false }
			};
			break;
		case 'publisher':
			model = {
				link: false
				, location: false
				, image: false
				, name: { string: true }
				, description: { string: true }
				, views: false
				, contents_count: false
				, contents: { array: false }
			};
			break;
		case 'source':
			model = {
				link: false
				, format: false
				, location: false
				, image: false
				, name: { string: false }
				, description: { string: false }
				, views: false
				, contents_count: false
				, contents: { array: false }
			};
			break;
		default:
			break;

	};
	return model;
};

Private.has_model = function( attr ) {
	if( 'undefined' !== attr && null !== attr && null !== this.get_model( attr ) ) {
		return true;
	} 
	return false;
};

Private.is_model = function( obj, model ) {
	//object can't be model if there is no object or is no model
	if( !this.is_object( obj ) || !this.is_object( model ) ) {
		return false;
	} else {	
		var attr, item;
		for( attr in obj ) {

			item = obj[ attr ];

			if( this.is_object( item ) ) {
				
				if( this.has_model( attr ) ) {
					if( !this.is_model( obj, this.get_model( attr ) ) ) {
						return false;
					}
				}

				//not a model attribute, so enforce item level specs
				var attr2;
				for( attr2 in model[ attr ] ) {	
					if( 'undefined' !== typeof model[ attr] && true === model[ attr ] ) {
						if( this.is_empty( obj[ attr ] ) ) {
							return false;
						}
					}
					if( 'function' === typeof this[ 'is_' + attr2 ] ) {
						if( false === this[ 'is_' + attr2 ]( obj[ attr ] ) ) {
							return false;
						}
					}
				}

			} else if( this.is_boolean( item ) ) {	
				if( true === item ) {
					if( this.has_model( attr ) ) {
						if( !this.is_model( obj, this.get_model( attr ) ) ) {
							return false;
						}
					} else {
						if( 'undefined' === typeof item || null === item ) {
							return false;
						}	
					}
				} else if( false === item ) {
					if( 'undefined' !== typeof item && null !== item ) {
						if( true === item && this.has_model( attr ) && !this.is_model( obj, this.get_model( attr ) ) ) {
							return false;
						}
					}
				}
			}	
		}
	}

	return true;
};

/* */
/* End Utilities 
/* */

/* Objects */

/* */
/* Begin Objects */
/* */

/* Link */

/* Example: 
 * 	{ url: required
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, clicks: { stats object: optional }
 *	, views: { stats object: optional }
 * 	}
 * */

Private.is_link = function( obj ) {
	return this.is_model( obj, this.get_model( 'link' ) );
};

/* Status */

/* Example: 
 * 	{ text: required
 * 	, image: { image object: optional }
 * 	, video: { video object: optional }
 * 	, audio: { audio object: optional }
 *	, location: { location object: optional } 
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 * 	, views: optional
 * 	, comments_count: optional
 * 	, comments: optional
 * 	}
 * */

Private.is_status = function( obj ) {
	return this.is_model( obj, this.get_model( 'status' ) );
};

/* Note */

/* Example: 
 * 	{ link: { link object: optional }
 * 	, text: required
 * 	, image: { image object: optional }
 * 	, video: { video object: optional }
 * 	, audio: { audio object: optional }
 * 	, title: optional
 *	, description: optional
 *	, location: { location object: optional } 
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 * 	, views: optional
 * 	, comments_count: optional
 * 	, comments: optional
 * 	}
 * */

Private.is_note = function( obj ) {
	return this.is_model( obj, this.get_model( 'note' ) );
};

/* Audio */

/* Example: 
 * 	{ link: { link object: required }
 *	, source: { source object: optional }
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, location: { location object: optional } 
 *	, length: optional
 *	, begin: optional
 *	, end: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 * 	}
 * */

Private.is_audio = function( obj ) {
	return this.is_model( obj, this.get_model( 'audio' ) );
};

/* Video */

/* Example: 
 * 	{ link: { link object: required }
 *	, source: { source object: optional }
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, location: { location object: optional } 
 *	, length: optional
 *	, begin: optional
 *	, end: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 * 	}
 * */

Private.is_video = function( obj ) {
	return this.is_model( obj, this.get_model( 'video' ) );
};

/* Image */

/* Example: 
 * 	{ link: { link object: required }
 *	, source: { source object: optional }
 *	, location: { location object: optional } 
 * 	, title: optional
 *	, description: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 * 	}
 * */

Private.is_image = function( obj ) {
	return this.is_model( obj, this.get_model( 'image' ) );
};

/* Place */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: required } 
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.is_place = function( obj ) {
	return this.is_model( obj, this.get_model( 'place' ) );
};

/* Stats */

/* Example: 
 *	{ source: { source object: optional }
 * 	, title: optional
 * 	, link: { link object: optional }
 *	, description: optional
 *	, data: required
 *	, location: { location object: optional } 
 * 	}
 * */

Private.is_stats = function( obj ) {
	return this.is_model( obj, this.get_model( 'stats' ) );
};

Private.is_clicks = function( obj ) {
	return this.is_stats( obj );
};

Private.is_views = function( obj ) {
	return this.is_stats( obj );
};

/* Location */

/* Example: 
 * 	{ link: { link object: optional }
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 * 	}
 * */

Private.is_location = function( obj ) {
	return this.is_model( obj, this.get_model( 'location' ) );
};

/* Author */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, name: required
 *	, description: optional
 *	, views: { stats object: optional }
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.is_author = function( obj ) {
	return this.is_model( obj, this.get_model( 'author' ) );
};


/* Publisher */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, name: required
 *	, description: optional
 *	, views: { stats object: optional }
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.is_publisher = function( obj ) {
	return this.is_model( obj, this.get_model( 'publisher' ) );
};


/* Source */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, name: required string
 *	, description: optional string
 *	, views: { stats object: optional }
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.is_source = function( obj ) {
	return this.is_model( obj, this.get_model( 'source' ) );
};


/* */
/* End Objects */
/* */

/* */
/* Begin Actions */
/* */

/* Action Utilities */

// accepts an array of services or a single service passed as string
// throws an error if services aren't valid
Private.apply_actions = function( request, revert ) {
	
	//check for service and access_token
	if( 'undefined' === typeof request[ 'tokens' ] ) {
		throw new Error( 'Accessing a service requires tokens' );
	}
	
	var services = request.services
	  , actions = request.actions || request.action;

	if( this.is_empty( services ) || this.is_empty( actions ) ) {
		throw new Error( 'Must pass non-empty services and action' );
		return false;	
	};

	var revert = ( true === revert ) ? true : false
	  , x = 0
	  , xlen = services.length
	  , y = 0
	  , ylen = ( 'string' === actions ) ? 0 : actions.length
	  , service
	  , action
	  , str = this.is_string( services )
	  , str2 = this.is_string( actions )
	  , result = {};

	if( !this.is_array( services ) && false === str ) {
		throw new Error( 'Cannot apply action to an empty or non-array (note: accepts single string) of services.' );
		return false;
	}
	if( !this.is_array( actions ) && false === str2 ) {
		throw new Error( 'Cannot apply an empty or non array action.' );
		return false;
	}
	if( true === str ) {
		services = [ services ];
	}
	if( true === str2 ) {
		actions = [ actions ];
	}

	for( y = 0; y < ylen; y += 1 ) {
		action = actions[ y ];
		for( x = 0; x < xlen; x += 1 ) {
			service = services[ x ];
			if( 'undefined' === typeof Private[ service ] ) {
				throw new Error( 'Cannot apply action to an invalid service.' );
				return false;
			}
			if( 'function' !== typeof Private[ service ][ action ] ) {
				throw new Error( 'Cannot apply invalid action or non-function.' );
				return false;
			}
			if( 'undefined' === typeof result[ action ] ) {
				result[ action ] = {};
			}
			if( 'undefined' === typeof result[ action ][ service ] ) {
				result[ action ][ service ] = {};
			}
			if( false === revert ) {
				result[ action ][ service ] = Private[ service ][ action ]( request );
			} else {
				result[ action ][ service ] = Private[ service ][ action ].revert( request );
			}
		}
	}
	return result;
};

/* All-purpose */

Private.do = function( req ) {
	return this.apply_actions( req );
};

/* Favorite */

Private.favorite = function( req ) {
	req.actions = [ 'favorite' ];
	return this.apply_actions( req );
};

Private.favorite.revert = function( req ) {
	req.actions = [ 'favorite' ];
	return this.apply_actions( req, true );
};

/* Archive */

Private.archive = function( req ) {
	req.actions = [ 'archive' ];
	return this.apply_actions( req );
};

Private.archive.revert = function( req ) {
	req.actions = [ 'archive' ];
	return this.apply_actions( req, true );
};

/* Watch */

Private.watch = function( req ) {
	req.actions = [ 'watch' ];
	return this.apply_actions( req );
};

Private.watch.revert = function( req ) {
	req.actions = [ 'watch' ];
	return this.apply_actions( req, true );
};

/* Read */

Private.read = function( req ) {
	req.actions = [ 'read' ];
	return this.apply_actions( req );
};

Private.read.revert = function( req ) {
	req.actions = [ 'read' ];
	return this.apply_actions( req, true );
};

/* See */

Private.view = function( req ) {
	req.actions = [ 'view' ];
	return this.apply_actions( req );
};

Private.view.revert = function( req ) {
	req.actions = [ 'view' ];
	return this.apply_actions( req, true );
};

/* Listen */

Private.listen = function( req ) {
	req.actions = [ 'listen' ];
	return this.apply_actions( req );
};

Private.listen.revert = function( req ) {
	req.actions = [ 'listen' ];
	return this.apply_actions( req, true );
};

/* Checkin */

Private.checkin = function( req ) {
	req.actions = [ 'checkin' ];
	return this.apply_actions( req );
};

Private.checkin.revert = function( req ) {
	req.actions = [ 'checkin' ];
	return this.apply_actions( req, true );
};

/* Say */

Private.post = function( req ) {
	req.actions = [ 'post' ];
	return this.apply_actions( req );
};

Private.post.revert = function( req ) {
	req.actions = [ 'post' ];
	return this.apply_actions( req, true );
};

/* Trash */

Private.trash = function( req ) {
	req.actions = [ 'trash' ];
	return this.apply_actions( req );
};

Private.trash.revert = function( req ) {
	req.actions = [ 'trash' ];
	return this.apply_actions( req, true );
};

/* */
/* End Actions */
/* */

/* */
/* Request Utilities  */
/* */

Private.request = function() {
	
};

Private.request.post = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback ) {
	return oauth.post( url, oauth_token, oauth_token_secret, post_body, post_content_type, callback );
};

Private.request.get = function( oauth, url, oauth_token, oauth_token_secret, callback, extra_headers ) {
	return oauth.get( url, oauth_token, oauth_token_secret, callback, extra_headers );
};

Private.request.put = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback ) {
	return oauth.put( url, oauth_token, oauth_token_secret, post_body, post_content_type, callback );
};

Private.request.delete = function( oauth, url, oauth_token, oauth_token_secret, callback ) {
	return oauth.delete( url, oauth_token, oauth_token_secret, callback );
};

Private.request.querystring = function( obj ) {
	return querystring.stringify( obj );
	/*
	var str, attr, inc = 0;
	for( attr in obj ) {
		if( obj.hasOwnProperty( attr ) ) {
			if( 0 === inc ) {
				str = attr + '=' + obj[ attr ];
			} else {
				str = str + '&' + attr + '=' + obj[ attr ];
			}
			inc += 1;
		}
	};
	return str;*/
};

/* */
/* Begin Services */
/* */

/* Tumblr */

Private.tumblr = function( req ) { return false; };

Private.tumblr.favorite = function( req ) {
	// /user/like
	//http://www.tumblr.com/docs/en/api/v2#posts
	return false; };

Private.tumblr.favorite.revert = function( req ) {
	// /user/unlike
	//http://www.tumblr.com/docs/en/api/v2#posts
	return false; };

Private.tumblr.archive = function( req ) { return false; };

Private.tumblr.archive.revert = function( req ) { return false; };

Private.tumblr.watch = function( req ) { return false; };

Private.tumblr.watch.revert = function( req ) { return false; };

Private.tumblr.read = function( req ) { return false; };

Private.tumblr.read.revert = function( req ) { return false; };

Private.tumblr.view = function( req ) { return false; };

Private.tumblr.view.revert = function( req ) { return false; };

Private.tumblr.listen = function( req ) { return false; };

Private.tumblr.listen.revert = function( req ) { return false; };

Private.tumblr.checkin = function( req ) { return false; };

Private.tumblr.checkin.revert = function( req ) { return false; };

Private.tumblr.post = function( req ) { 
	//http://www.tumblr.com/docs/en/api/v2#posts
	//post
	return false;
};

Private.tumblr.post.revert = function( req ) {
	//delete
	//http://www.tumblr.com/docs/en/api/v2#posts
	return false; };


Private.tumblr.trash = function( req ) { return false; };

Private.tumblr.trash.revert = function( req ) { return false; };

/* Facebook */

Private.facebook = function( req ) { return false; };
Private.facebook.favorite = function( req ) {
	//https://developers.facebook.com/docs/opengraph/actions/
	return false;
};
Private.facebook.favorite.revert = function( req ) { return false; };
Private.facebook.archive = function( req ) { return false; };
Private.facebook.archive.revert = function( req ) { return false; };
Private.facebook.watch = function( req ) { return false; };
Private.facebook.watch.revert = function( req ) { return false; };
Private.facebook.read = function( req ) {
	var access_token = req.tokens.facebook;	
	console.log('ACCESS TOKEN',access_token);
	return false;
};
Private.facebook.read.revert = function( req ) { return false; };
Private.facebook.view = function( req ) { return false; };
Private.facebook.view.revert = function( req ) { return false; };
Private.facebook.listen = function( req ) { return false; };
Private.facebook.listen.revert = function( req ) { return false; };
Private.facebook.checkin = function( req ) { return false; };
Private.facebook.checkin.revert = function( req ) { return false; };
Private.facebook.post = function( req ) {

	console.log('facebook',req.tokens.twitter);
	console.log('action object',req.data);

	//https://dev.twitter.com/docs/api/1/post/statuses/update
	var url = 'https://graph.facebook.com/me/notes';
	var token = req.tokens.facebook;
	var secret = req.secrets.facebook;

	var query = req.data;

	var postbody = Private.request.querystring( query );
	var callback = function( status_code, data ) {
		console.log( 'Facebook post posted' );
       		console.log( 'STATUS CODE: ' + JSON.stringify( status_code ) );
		console.log( 'STRING: ' + JSON.stringify( data ) );
	};
	console.log("DOING POST",typeof Private.service.facebook, url, token, secret, postbody, '', callback);
	//var res = Private.service.facebook._request( "POST", url, {}, postbody, token, callback);

	var res = Private.request.post( Private.service.facebook, url, token, postbody, null, callback );
	//var res = Private.request.get( Private.service.twitter, url, token, secret, callback );
	console.log("RESSSSULT");
	console.log(res);

};
Private.facebook.post.revert = function( req ) { return false; };
Private.facebook.trash = function( req ) { return false; };
Private.facebook.trash.revert = function( req ) { return false; };

/* Twitter */

/* Implemented: 
 *	- favorite (favorite)
 *	- favorite.revert (unfavorite)
 *	- post (tweet) 
 *	- post.revert (untweet)
 * */


Private.twitter = function( req ) { return false; };

Private.twitter.favorite = function( req ) {
	//https://dev.twitter.com/docs/api/1/post/favorites/create/%3Aid
	var url = 'https://api.twitter.com/1/favorites/create/';
	var token = req.tokens.twitter;
	var secret = req.secrets.twitter;

	var id = req.data.id;
	var query = {};
	
	url += id + '.json';

	var callback = function( status_code, data ) {
		console.log( 'Twitter post favorite' );
       		console.log( 'STATUS CODE: ' + JSON.stringify( status_code ) );
		console.log( 'STRING: ' + JSON.stringify( data ) );
	};

	return Private.request.post( Private.service.twitter, url, token, secret, query );
};

Private.twitter.favorite.revert = function( req ) {
	//https://dev.twitter.com/docs/api/1/post/favorites/destroy/%3Aid
	var url = 'https://api.twitter.com/1/favorites/destroy/';
	var token = req.tokens.twitter;
	var secret = req.secrets.twitter;

	var id = req.data.id;
	var query = {};
	
	url += id + '.json';

	var callback = function( status_code, data ) {
		console.log( 'Twitter post favorite' );
       		console.log( 'STATUS CODE: ' + JSON.stringify( status_code ) );
		console.log( 'STRING: ' + JSON.stringify( data ) );
	};

	return Private.request.post( Private.service.twitter, url, token, secret, query );
};

Private.twitter.archive = function( req ) { return false; };

Private.twitter.archive.revert = function( req ) { return false; };

Private.twitter.watch = function( req ) { return false; };

Private.twitter.watch.revert = function( req ) { return false; };

Private.twitter.read = function( req ) { return false; };

Private.twitter.read.revert = function( req ) { return false; };

Private.twitter.view = function( req ) { return false; };

Private.twitter.view.revert = function( req ) { return false; };

Private.twitter.listen = function( req ) { return false; };

Private.twitter.listen.revert = function( req ) { return false; };

Private.twitter.checkin = function( req ) { return false; };

Private.twitter.checkin.revert = function( req ) { return false; };

Private.twitter.post = function( req ) {
	console.log('twitter',req.tokens.twitter);
	console.log('action object',req.data);

	//https://dev.twitter.com/docs/api/1/post/statuses/update
	var url = 'http://api.twitter.com/1/statuses/update.json';
	//var url = 'http://api.twitter.com/1/statuses/home_timeline.json';
	var token = req.tokens.twitter;
	var secret = req.secrets.twitter;

	var query = req.data;

	var postbody = Private.request.querystring( query );
	var callback = function( status_code, data ) {
		console.log( 'Twitter post posted' );
       		console.log( 'STATUS CODE: ' + JSON.stringify( status_code ) );
		console.log( 'STRING: ' + JSON.stringify( data ) );
	};
	console.log("DOING POST",url, token);
	var res = Private.request.post( Private.service.twitter, url, token, secret, query );
	//var res = Private.service.twitter.post( url, token, secret, {'status':'testing123456789'} );
	//var res = Private.request.get( Private.service.twitter, url, token, secret, callback );
	//var res = Private.service.twitter._performSecureRequest( token, secret, "POST", url, {}, postbody, null, callback, {} );	
	console.log("RESSSSULT");
	console.log(res);
};

Private.twitter.post.revert = function( req ) {
	//https://dev.twitter.com/docs/api/1/post/statuses/destroy/%3Aid
	return false;
};

Private.twitter.trash = function( req ) { return false; };

Private.twitter.trash.revert = function( req ) { return false; };

/* Github */

Private.github = function( req ) { return false; };

Private.github.favorite = function( req ) { return false; };

Private.github.favorite.revert = function( req ) { return false; };

Private.github.archive = function( req ) { return false; };

Private.github.archive.revert = function( req ) { return false; };

Private.github.watch = function( req ) { return false; };

Private.github.watch.revert = function( req ) { return false; };

Private.github.read = function( req ) { return false; };

Private.github.read.revert = function( req ) { return false; };

Private.github.view = function( req ) { return false; };

Private.github.view.revert = function( req ) { return false; };

Private.github.listen = function( req ) { return false; };

Private.github.listen.revert = function( req ) { return false; };

Private.github.checkin = function( req ) { return false; };

Private.github.checkin.revert = function( req ) { return false; };

Private.github.post = function( req ) {
	//http://developer.github.com/v3/gists/
	return false; };

Private.github.post.revert = function( req ) {
	//http://developer.github.com/v3/gists/
	return false; };

Private.github.trash = function( req ) { return false; };

Private.github.trash.revert = function( req ) { return false; };

/* Google */

Private.google = function( req ) { return false; };
Private.google.favorite = function( req ) { return false; };
Private.google.favorite.revert = function( req ) { return false; };
Private.google.archive = function( req ) { return false; };
Private.google.archive.revert = function( req ) { return false; };
Private.google.watch = function( req ) { return false; };
Private.google.watch.revert = function( req ) { return false; };
Private.google.read = function( req ) { return false; };
Private.google.read.revert = function( req ) { return false; };
Private.google.view = function( req ) { return false; };
Private.google.view.revert = function( req ) { return false; };
Private.google.listen = function( req ) { return false; };
Private.google.listen.revert = function( req ) { return false; };
Private.google.checkin = function( req ) { return false; };
Private.google.checkin.revert = function( req ) { return false; };
Private.google.post = function( req ) { return false; };
Private.google.post.revert = function( req ) { return false; };
Private.google.trash = function( req ) { return false; };
Private.google.trash.revert = function( req ) { return false; };

/* Yahoo */

Private.yahoo = function( req ) { return false; };

Private.yahoo.favorite = function( req ) { return false; };

Private.yahoo.favorite.revert = function( req ) { return false; };

Private.yahoo.archive = function( req ) { return false; };

Private.yahoo.archive.revert = function( req ) { return false; };

Private.yahoo.watch = function( req ) { return false; };

Private.yahoo.watch.revert = function( req ) { return false; };

Private.yahoo.read = function( req ) { return false; };

Private.yahoo.read.revert = function( req ) { return false; };

Private.yahoo.view = function( req ) { return false; };

Private.yahoo.view.revert = function( req ) { return false; };

Private.yahoo.listen = function( req ) { return false; };

Private.yahoo.listen.revert = function( req ) { return false; };

Private.yahoo.checkin = function( req ) { return false; };

Private.yahoo.checkin.revert = function( req ) { return false; };

Private.yahoo.post = function( req ) {
	//http://developer.yahoo.com/social/rest_api_guide/status-resource.html#status-json_obj_syntax	
	return false;
};

Private.yahoo.post.revert = function( req ) { return false; };

Private.yahoo.trash = function( req ) { return false; };

Private.yahoo.trash.revert = function( req ) { return false; };

/* Windows */

Private.windows = function( req ) { return false; };
Private.windows.favorite = function( req ) { return false; };
Private.windows.favorite.revert = function( req ) { return false; };
Private.windows.archive = function( req ) { return false; };
Private.windows.archive.revert = function( req ) { return false; };
Private.windows.watch = function( req ) { return false; };
Private.windows.watch.revert = function( req ) { return false; };
Private.windows.read = function( req ) { return false; };
Private.windows.read.revert = function( req ) { return false; };
Private.windows.view = function( req ) { return false; };
Private.windows.view.revert = function( req ) { return false; };
Private.windows.listen = function( req ) { return false; };
Private.windows.listen.revert = function( req ) { return false; };
Private.windows.checkin = function( req ) { return false; };
Private.windows.checkin.revert = function( req ) { return false; };
Private.windows.post = function( req ) { return false; };
Private.windows.post.revert = function( req ) { return false; };
Private.windows.trash = function( req ) { return false; };
Private.windows.trash.revert = function( req ) { return false; };

/* Foursquare */

Private.foursquare = function( req ) { return false; };
Private.foursquare.favorite = function( req ) { return false; };
Private.foursquare.favorite.revert = function( req ) { return false; };
Private.foursquare.archive = function( req ) { return false; };
Private.foursquare.archive.revert = function( req ) { return false; };
Private.foursquare.watch = function( req ) { return false; };
Private.foursquare.watch.revert = function( req ) { return false; };
Private.foursquare.read = function( req ) { return false; };
Private.foursquare.read.revert = function( req ) { return false; };
Private.foursquare.view = function( req ) { return false; };
Private.foursquare.view.revert = function( req ) { return false; };
Private.foursquare.listen = function( req ) { return false; };
Private.foursquare.listen.revert = function( req ) { return false; };

Private.foursquare.checkin = function( req ) {
	//https://developer.foursquare.com/docs/checkins/add
	return false;
};

Private.foursquare.checkin.revert = function( req ) { return false; };

Private.foursquare.post = function( req ) {
	//https://developer.foursquare.com/docs/checkins/addcomment
	//https://developer.foursquare.com/docs/tips/add
	//https://developer.foursquare.com/docs/photos/add
	return false;
};

Private.foursquare.post.revert = function( req ) {
	//https://developer.foursquare.com/docs/checkins/deletecomment	
	return false;
};

Private.foursquare.trash = function( req ) { return false; };

Private.foursquare.trash.revert = function( req ) { return false; };

/* Linkedin */

Private.linkedin = function( req ) { return false; };

Private.linkedin.favorite = function( req ) { return false; };

Private.linkedin.favorite.revert = function( req ) { return false; };

Private.linkedin.archive = function( req ) { return false; };

Private.linkedin.archive.revert = function( req ) { return false; };

Private.linkedin.watch = function( req ) { return false; };

Private.linkedin.watch.revert = function( req ) { return false; };

Private.linkedin.read = function( req ) { return false; };

Private.linkedin.read.revert = function( req ) { return false; };

Private.linkedin.view = function( req ) { return false; };

Private.linkedin.view.revert = function( req ) { return false; };

Private.linkedin.listen = function( req ) { return false; };

Private.linkedin.listen.revert = function( req ) { return false; };

Private.linkedin.checkin = function( req ) { return false; };

Private.linkedin.checkin.revert = function( req ) { return false; };

Private.linkedin.post = function( req ) {
	//https://developer.linkedin.com/documents/share-api
	return false;
};

Private.linkedin.post.revert = function( req ) { return false; };

Private.linkedin.trash = function( req ) { return false; };

Private.linkedin.trash.revert = function( req ) { return false; };

/* */
/* End Services */
/* */

var Public = function() {

};

Public.prototype.request = function( request, connection, type ) {

	if( 'socket' === type ) {
		var response = Private.do( request );
		connection.emit( Private.prefix, response );
	}

};

Public.prototype.service = function( service ) {
	return Private.service( service );
};

Public.prototype.secrets = function( path ) {

	if( 'undefined' === typeof path || null === path ) {
		throw new Error( 'Keypath cannot be empty' );
	}

	var auth_keys = require( path ); 

	for( var key in auth_keys ) { 
		global[ key ]= auth_keys[ key ]; 
	}

	// Twitter (oAuth 1.0)
	Private.service.twitter = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", twitterId, twitterSecret, "1.0", twitterCallbackAddress || null, "HMAC-SHA1");

	// Facebook (oAuth 2)
	Private.service.facebook = new OAuth2( facebookId, facebookSecret, "https://graph.facebook.com" );

	// Google (oAuth 2)
	Private.service.google = new OAuth2( googleId, googleSecret,  "", "https://accounts.google.com/o/oauth2/auth", "https://accounts.google.com/o/oauth2/token" );

	// Foursquare (oAuth 2)
	Private.service.foursquare = new OAuth2( foursquareId, foursquareSecret, "https://foursquare.com", "/oauth2/authenticate", "/oauth2/access_token", "HMAC-SHA1" );
	Private.service.foursquare.setAccessTokenName("oauth_token");

	// Tumblr (oauth 1.0)
	Private.service.tumblr = new OAuth( "http://www.tumblr.com/oauth/request_token", "http://www.tumblr.com/oauth/access_token", tumblrId, tumblrSecret, "1.0", tumblrCallbackAddress || null, "HMAC-SHA1" );

	// Github (oAuth 2)
	Private.service.github = new OAuth2( githubId, githubSecret, "https://github.com", "/login/oauth/authorize", "/login/oauth/access_token", "HMAC-SHA1" );
	Private.service.github.setAccessTokenName("oauth_token");

	// Yahoo (oauth 1.0)
	Private.service.yahoo = new OAuth( "https://api.login.yahoo.com/oauth/v2/get_request_token", "https://api.login.yahoo.com/oauth/v2/get_token", yahooId, yahooSecret, "1.0", yahooCallbackAddress || null, "HMAC-SHA1" );

	// Linkedin (oauth 1.0)
	Private.service.linkedin = new OAuth( "https://api.linkedin.com/uas/oauth/requestToken", "https://api.linkedin.com/uas/oauth/accessToken", linkedinId, linkedinSecret, "1.0", linkedinCallbackAddress || null, "HMAC-SHA1" );

	// Windows Live (oAuth 2)
	Private.service.windows = new OAuth2( windowsId, windowsSecret, "https://oauth.live.com", "/authorize", "/token", "HMAC-SHA1" );
	Private.service.windows.setAccessTokenName("oauth_token");


};

Public.prototype.favorite = function( req ) {
	return Private.favorite( req );
};

Public.prototype.unfavorite = function( req ) {
	return Private.favorite( req, true );
};

Public.prototype.archive = function( req ) {
	return Private.archive( req );
};

Public.prototype.unarchive = function( req ) {
	return Private.archive( req, true );
};

Public.prototype.watch = function( req ) {
	return Private.watch( req, true );
};

Public.prototype.unwatch = function( req ) {
	return Private.watch( req, true );
};

Public.prototype.read = function( req ) {
	return Private.read( req, true );
};

Public.prototype.unread = function( req ) {
	return Private.read( req, true );
};

Public.prototype.view = function( req ) {
	return Private.view( req );
};

Public.prototype.unview = function( req ) {
	return Private.view( req, true );
};

Public.prototype.listen = function( req ) {
	return Private.listen( req );
};

Public.prototype.unlisten = function( req ) {
	return Private.listen( req, true );
};

Public.prototype.checkin = function( req ) {
	return Private.checkin( req );
};

Public.prototype.uncheckin = function( req ) {
	return Private.checkin( req, true );
};

Public.prototype.post = function( req ) {
	return Private.post( req );
};

Public.prototype.unpost = function( req ) {
	return Private.post( req, true );
};

Public.prototype.trash = function( req ) {
	return Private.trash( req );
};

Public.prototype.untrash = function( req ) {
	return Private.trash( req, true );
};

// Public API

module.exports = new Public();
