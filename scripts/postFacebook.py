import facebook
import sys

def main():
  # Fill in the values noted in previous steps here
  cfg = {
    "page_id"      : "1268414569930194",  # Step 1
    "access_token" : "EAASBncfeXdIBAIq52gqZB2TLNtaP6xoOmDfPrEbTLMp1kI9qqQhJS5xpYnZALqudHacn6hFQ0BjyZBGOJsBX9gC7kMockGV0" +
                     "oATeywvBLADRAvXD99UB3xfrUaGhZCCL7p4i2HLz9dHR2ZCZCTadPXCanTrHLjNPZBNwNZB8vAcmGIm5JvmSfiZCvBtCwelI0GscZD"
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
  page_access_token = 'EAASBncfeXdIBABrFZCeAoIVq0IhG0hXCoqlVsZCttI8KhhLmDIrh0XGg7RlzM0lceasZBZChQnw3ObOT7o0tLsBuDGyYbCWrSu3' + \
                      'QSMZBinjx9Q5YOxRAGRiBDuY9Wkp7pTS3vCLSbrXk4X6tgxq14qRgXT5YEwtEUgZAvKkqw3ZCjiOD5rjuHmhCfutKgZB4PUPlRjorrmiplgZDZD'
  graph = facebook.GraphAPI(page_access_token)
  return graph
  # You can also skip the above if you get a page token:
  # http://stackoverflow.com/questions/8231877/facebook-access-token-for-pages
  # and make that long-lived token as in Step 3

if __name__ == "__main__":
  # first arugment post message
  # second argument image path
  main()
