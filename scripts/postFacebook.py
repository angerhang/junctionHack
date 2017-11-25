import facebook
import sys

def main():
  # Fill in the values noted in previous steps here
  cfg = {
    "page_id"      : "1956961034578187",  # Step 1
    "access_token" : "EAASXm01iyRMBACeZCc3TnDki3Dr3yLozJQcDBpuX4oAUxq4J0OM3KsKKjr8vyHPJuuVTVyLCOQzWRmvCvpOnh79aPmed" +\
                     "wDOphvkKyvKtcviOvLEiOb6C8j5G51zD8aZBee5v67YUHz4cb4rX1uK4L5XOwMCbOuWpZCq1spVKlbZApslKIpJebUuNMNu8JucZD"
  }

  api = get_api(cfg)

  msg = sys.argv[1]
  photo_path = sys.argv[2]
  api.put_photo(image=open(photo_path, 'rb'),
                  message=msg)

def get_api(cfg):
  graph = facebook.GraphAPI(cfg['access_token'])
  # Get page token to post as the page. You can skip
  # the following if you want to post as yourself.
  page_access_token = "EAASXm01iyRMBAHaHVq4Eq9Xp3vFWFA0ZB2ZBCMfdW0K41bOOTBUhUCG9FFztoOBux5bOhiwSqtPZCvLjtEMhmBUaCUwb6CDDVG" + \
  "ahZAtFkdgKb71u3vsXXwnLkzVyZCsSj1b3RAhPf0gq6lbKGYm4SM8MQSannvQRwLfYL4UIKSmp0mROMwpxZCMAZCMcxRJkmRl7EHyRHLKKAZDZD"
  graph = facebook.GraphAPI(page_access_token)
  return graph
  # You can also skip the above if you get a page token:
  # http://stackoverflow.com/questions/8231877/facebook-access-token-for-pages
  # and make that long-lived token as in Step 3

if __name__ == "__main__":
  # first arugment post message
  # second argument image path
  main()
