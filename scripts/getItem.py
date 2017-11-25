from amazon.api import AmazonAPI
import sys, getopt
from ssim import SSIM
import math
from PIL import Image
import Levenshtein
import os
import json
import sys
import urllib
import simplejson as json

class BWImageCompare(object):
    """Compares two images (b/w)."""

    _pixel = 255
    _colour = False

    def __init__(self, imga, imgb, maxsize=64):
        """Save a copy of the image objects."""

        sizea, sizeb = imga.size, imgb.size

        newx = min(sizea[0], sizeb[0], maxsize)
        newy = min(sizea[1], sizeb[1], maxsize)

        # Rescale to a common size:
        imga = imga.resize((newx, newy), Image.BICUBIC)
        imgb = imgb.resize((newx, newy), Image.BICUBIC)

        if not self._colour:
            # Store the images in B/W Int format
            imga = imga.convert('I')
            imgb = imgb.convert('I')

        self._imga = imga
        self._imgb = imgb

        # Store the common image size
        self.x, self.y = newx, newy

    def _img_int(self, img):
        """Convert an image to a list of pixels."""

        x, y = img.size

        for i in xrange(x):
            for j in xrange(y):
                yield img.getpixel((i, j))

    @property
    def imga_int(self):
        """Return a tuple representing the first image."""

        if not hasattr(self, '_imga_int'):
            self._imga_int = tuple(self._img_int(self._imga))

        return self._imga_int

    @property
    def imgb_int(self):
        """Return a tuple representing the second image."""

        if not hasattr(self, '_imgb_int'):
            self._imgb_int = tuple(self._img_int(self._imgb))

        return self._imgb_int

    @property
    def mse(self):
        """Return the mean square error between the two images."""

        if not hasattr(self, '_mse'):
            tmp = sum((a-b)**2 for a, b in zip(self.imga_int, self.imgb_int))
            self._mse = float(tmp) / self.x / self.y

        return self._mse

    @property
    def psnr(self):
        """Calculate the peak signal-to-noise ratio."""

        if not hasattr(self, '_psnr'):
            self._psnr = 20 * math.log(self._pixel / math.sqrt(self.mse), 10)

        return self._psnr

    @property
    def nrmsd(self):
        """Calculate the normalized root mean square deviation."""

        if not hasattr(self, '_nrmsd'):
            self._nrmsd = math.sqrt(self.mse) / self._pixel

        return self._nrmsd

    @property
    def levenshtein(self):
        """Calculate the Levenshtein distance."""

        if not hasattr(self, '_lv'):
            stra = ''.join((chr(x) for x in self.imga_int))
            strb = ''.join((chr(x) for x in self.imgb_int))

            lv = Levenshtein.distance(stra, strb)

            self._lv = float(lv) / self.x / self.y

        return self._lv


class ImageCompare(BWImageCompare):
    """Compares two images (colour)."""

    _pixel = 255 ** 3
    _colour = True

    def _img_int(self, img):
        """Convert an image to a list of pixels."""

        x, y = img.size

        for i in xrange(x):
            for j in xrange(y):
                pixel = img.getpixel((i, j))
                yield pixel[0] | (pixel[1]<<8) | (pixel[2]<<16)

    @property
    def levenshtein(self):
        """Calculate the Levenshtein distance."""

        if not hasattr(self, '_lv'):
            stra_r = ''.join((chr(x>>16) for x in self.imga_int))
            strb_r = ''.join((chr(x>>16) for x in self.imgb_int))
            lv_r = Levenshtein.distance(stra_r, strb_r)

            stra_g = ''.join((chr((x>>8)&0xff) for x in self.imga_int))
            strb_g = ''.join((chr((x>>8)&0xff) for x in self.imgb_int))
            lv_g = Levenshtein.distance(stra_g, strb_g)

            stra_b = ''.join((chr(x&0xff) for x in self.imga_int))
            strb_b = ''.join((chr(x&0xff) for x in self.imgb_int))
            lv_b = Levenshtein.distance(stra_b, strb_b)

            self._lv = (lv_r + lv_g + lv_b) / 3. / self.x / self.y

        return self._lv


class FuzzyImageCompare(object):
    """Compares two images based on the previous comparison values."""

    def __init__(self, imga, imgb, lb=1, tol=15):
        """Store the images in the instance."""

        self._imga, self._imgb, self._lb, self._tol = imga, imgb, lb, tol

    def compare(self):
        """Run all the comparisons."""

        if hasattr(self, '_compare'):
            return self._compare

        lb, i = self._lb, 2

        diffs = {
            'levenshtein': [],
            'nrmsd': [],
            'psnr': [],
        }

        stop = {
            'levenshtein': False,
            'nrmsd': False,
            'psnr': False,
        }

        while not all(stop.values()):
            cmp = ImageCompare(self._imga, self._imgb, i)

            diff = diffs['levenshtein']
            if len(diff) >= lb+2 and \
                abs(diff[-1] - diff[-lb-1]) <= abs(diff[-lb-1] - diff[-lb-2]):
                stop['levenshtein'] = True
            else:
                diff.append(cmp.levenshtein)

            diff = diffs['nrmsd']
            if len(diff) >= lb+2 and \
                abs(diff[-1] - diff[-lb-1]) <= abs(diff[-lb-1] - diff[-lb-2]):
                stop['nrmsd'] = True
            else:
                diff.append(cmp.nrmsd)

            diff = diffs['psnr']
            if len(diff) >= lb+2 and \
                abs(diff[-1] - diff[-lb-1]) <= abs(diff[-lb-1] - diff[-lb-2]):
                stop['psnr'] = True
            else:
                try:
                    diff.append(cmp.psnr)
                except ZeroDivisionError:
                    diff.append(-1)  # to indicate that the images are identical

            i *= 2

        self._compare = {
            'levenshtein': 100 - diffs['levenshtein'][-1] * 100,
            'nrmsd': 100 - diffs['nrmsd'][-1] * 100,
            'psnr': diffs['psnr'][-1] == -1 and 100.0 or diffs['psnr'][-1],
        }

        return self._compare

    def similarity(self):
        """Try to calculate the image similarity."""

        cmp = self.compare()

        lnrmsd = (cmp['levenshtein'] + cmp['nrmsd']) / 2
        return lnrmsd
        return min(lnrmsd * cmp['psnr'] / self._tol, 100.0)  # TODO: fix psnr!


def getMaxIdx(imga, images):
    maxId = -1
    maxSim = -1

    for i in range(0, len(images)):
        try:
            imgb = Image.open(images[i])

        except:
            print 'image %d is missing, ignoring\n' % i
            continue

        cmp = FuzzyImageCompare(imga, imgb)
        sim = cmp.similarity()

        if maxSim < sim:
            maxSim = sim
            maxId = i

        print '%.2f %%' % sim

    print 'Most similar images: %d (%.2f %%)' % (maxId, maxSim)
    return  maxId

def getMaxImgIdx(images_names):
    # the first one will always be the refernece img
    # and the following images to be compared with

    tot = len(images_names) - 1
    print 'Comparing %d images:' % tot

    imga = Image.open(images_names[0])
    return getMaxIdx(imga, images_names[1:])

def obtain_products(name, num):
    AMAZON_ACCESS_KEY = 'AKIAIGKWJJGRKVVHTNFA'
    AMAZON_SECRET_KEY = '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'
    AMAZON_ASSOC_TAG = '5566399-20'

    amazon = AmazonAPI(AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_ASSOC_TAG)

    # get the images from top 10 from this categor
    products = amazon.search_n(num, Keywords=name, SearchIndex='All')

    return products

    # return the top 1 item desp

def storeImg(products):
    # curl the product images and
    # give them names
    try:
        image_names = []
        for i in range(0, len(products) - 1):
            print i
            localName = str(i) + '.jpg'
            image_names.append(localName)
            urllib.urlretrieve(products[i].medium_image_url, localName)
    except:
        print "Images cannot be found from a product\n! Continuing\n"
    return image_names

def generateDesp(product):
    data = {}
    data['price'] = product.price_and_currency
    data['keywords'] = product.get_attributes(['Brand', 'ProductGroup'])
    data['brand'] = product.brand
    data['title'] = product.title
    json_data = json.dumps(data, use_decimal=True)
    print ('"' + json_data + '"')

def main(argv):
    # argv is the product name
    # obtain product desps
    name = argv[1]
    oriImg = argv[2]
    numProducts = 10

    products = obtain_products(name, numProducts)
    image_names = storeImg(products)
    maxIdx = getMaxImgIdx(image_names)

    generateDesp(products[maxIdx])

    # get rid of extra images
    for i in range(0, len(image_names)):
        if i == maxIdx:
            continue
        my_file = str(i) + '.jpg'
        if os.path.isfile(my_file):
            os.remove(my_file)

    return image_names
    # control product number
    # os.system('python imgTest.py')
    # bestIdx = findSimilar(products, oriImg)

    # return generateDesp(bestIdx, products)

if __name__ == "__main__":
    main(sys.argv)