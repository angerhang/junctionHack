import facebook
import sys

def publish(msg, photo_path):
  # Fill in the values noted in previous steps here
  cfg = {
    "page_id"      : "1956961034578187",  # Step 1
    "access_token" : "EAACEdEose0cBAFu2MjzoQkQLTg76ZCgzdLyoYd4PRTkC8MYAjEl7YPdT" + \
    "7Thl17snnZAGPniKWgi1ADydFlHZACT5ZCMgOlXoCeb1iksr69jclhUqTFWxTv1Noay0Rh71VxYXNAwcvIRfZCz1a13bCMCWSylQV7jBpZBnWpbPbGfGVF5QFlg8AMOrsPaI27xZC8ZD"
  }

  api = get_api(cfg)

  api.put_photo(image=open(photo_path, 'rb'),
                  message=msg)

def get_api(cfg):
  graph = facebook.GraphAPI(cfg['access_token'])
  # Get page token to post as the page. You can skip
  # the following if you want to post as yourself.
  page_access_token = "EAASXm01iyRMBAHzaLjEZA57BkoTRZA0Rif1XBcG1GKodLP0op1PeODzJqyyZCNM0we6N5tdzkgyYZAMWBUParVE0TnJtqbh3bznuzZA8D" + \
  "5tsFLRTtaeuurZCltWCNyQZCw0mpYRbGVKil5cwqemPm3F1bNXfYRsI9jko0ukgAJHQVLaiQxptXrNyxqjz73KxjEv04PF1L6LpgZDZD"
  graph = facebook.GraphAPI(page_access_token)
  return graph
  # You can also skip the above if you get a page token:
  # http://stackoverflow.com/questions/8231877/facebook-access-token-for-pages
  # and make that long-lived token as in Step 3

