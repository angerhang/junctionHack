# junctionhack - picture2ad

This repo contains the applicatino files (frontend and backend) file for the Video2Add junctionhack.

### How to call python script for the top 3 picks from amazon
```bash
$ python getItem.py <Product-type> <Uploaded-image>
#product-type: one type returned by Google
#uploaded-image: uploaded from the user
```

### How to call post to facebook
```bash
python postFacebook.python <POST MSG> <Post PHOTO PATH>
```

* FB SDK
```
virtualenv facebookenv
source facebookenv/bin/activate
pip install git+https://github.com/simplejson/simplejson
pip install -e git+https://github.com/mobolic/facebook-sdk.git#egg=facebook-sdk
pip install lxml
pip install python-dateutil
```

```
pip install python-amazon-simple-product-api
pip install python-Levenshtein
pip install pyssim
```

* Installed [Bottlenose](https://github.com/lionheart/bottlenose) (pip install bottlenose)
* Installed lxml (pip install lxml)
* Installed [dateutil](http://labix.org/python-dateutil) (pip install python-dateutil)
If pip install doesn't work, do
```
python setup.py install
```
inside each local python module
