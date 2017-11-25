from ssim import SSIM
from PIL import Image, ImageOps

im = Image.open('1.jpg')
im2 = Image.open('2.jpg')

cw_ssim_rot = SSIM(im).cw_ssim_value(im2)
print cw_ssim_rot